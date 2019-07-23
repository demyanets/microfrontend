import {
    Destroyable,
    EVENT_HASHCHANGE,
    IConsoleFacade,
    IMap,
    MessageBroadcast,
    MessageBroadcastMetadata,
    MessageGetCustomFrameConfiguration,
    MessageGoto,
    MessageRouted,
    MessageSetFrameStyles,
    MessageMetaRouted,
    MessagingApiBroker,
    SHELL_NAME
} from '@microfrontend/common';
import { UrlHelper } from './url-helper';
import { MetaRouterConfig } from './meta-router-config';
import { AppRoute } from './app-route';
import { MetaRouteHelper } from './meta-route-helper';
import { IHistoryApiFacade } from './history-api-facade-interface';
import { ILocationFacade } from './location-facade-interface';
import { FramesManager } from './frames-manager';
import { IFrameFacade } from './frame-facade-interface';
import { PromiseSingletonDecorator } from './promise-singleton-decorator';
import { IControllerServiceProvider } from './controller-service-provider-interface';
import { ControllerServiceProvider } from './controller-service-provider';

/**
 * MetaRouter for routing between micro frontends
 */
export class MetaRouter {
    /** Map for all meta routes and their corresponding frames */
    private framesManager: FramesManager;

    /** ConsoleAPI facade */
    private consoleFacade: IConsoleFacade;

    /** HistoryAPI facade */
    private historyApiFacade: IHistoryApiFacade;

    /** Location facade */
    private locationFacade: ILocationFacade;

    /** Hashtag listener */
    // tslint:disable no-unused-variable
    private hashtagListener: Destroyable;

    /** Event broker handling Messaging API events */
    // tslint:disable no-unused-variable
    private messageBroker: Destroyable;

    /** Active promise from Go  */
    private goPromiseSingleton = new PromiseSingletonDecorator<IFrameFacade>();

    constructor(
        private readonly config: MetaRouterConfig,
        private readonly serviceProvider: IControllerServiceProvider = new ControllerServiceProvider()
    ) {
        this.historyApiFacade = serviceProvider.getHistoryApiFacade();

        this.locationFacade = serviceProvider.getLocationFacade();

        this.consoleFacade = serviceProvider.getConsoleFacade();

        // tslint:disable no-unsafe-any
        this.hashtagListener = serviceProvider.getEventListenerFacade(EVENT_HASHCHANGE, this.routeByUrl.bind(this), false);

        const origins: string[] = [];
        for (const r of this.config.routes) {
            origins.push(r.baseUrl);
        }

        // tslint:disable no-unsafe-any
        this.messageBroker = new MessagingApiBroker(
            this.serviceProvider,
            origins,
            this.handleRouted.bind(this),
            this.handleSetFrameStyles.bind(this),
            this.handleGoto.bind(this),
            this.handleBroadcast.bind(this),
            undefined,
            this.handleGetFrameConfiguration.bind(this)
        );

        this.framesManager = new FramesManager(this.config, this.serviceProvider);
    }

    /**
     * Initialize meta router
     */
    async initialize(): Promise<void> {
        // Use location hash if available
        if (this.locationFacade.hasHash()) {
            return this.routeByUrl();
        } else {
            // otherwise go to the first route from custom
            return this.go(this.getInitMetaRoute());
        }
    }

    /**
     * Initial meta route
     */
    private getInitMetaRoute(): string {
        return this.config.routes[0].metaRoute;
    }

    /**
     * Preloads all the micro frontends by loading them into the page
     */
    async preload(): Promise<void> {
        this.consoleFacade.debug('Before preload()');
        const hash = this.parseHash(this.config.outlet);
        // Take existing routes into account
        const routes = MetaRouteHelper.join(this.config.routes, hash[this.config.outlet]);
        return this.framesManager.preload(routes);
    }

    /**
     * Unloads all the micro frontends by unloading them from the page
     */
    unloadAll(): void {
        this.framesManager.unloadAll();
    }

    /**
     * Routes by URL
     */
    private async routeByUrl(e?: Event): Promise<void> {
        this.consoleFacade.debug('routeByUrl()');
        const outlets = this.parseHash(this.config.outlet);
        const route = MetaRouteHelper.getOutletRoute(outlets);

        if (route) {
            return this.goInner(route, false);
        } else {
            return Promise.reject(new Error(`Outlet is not configured or unknown: ${this.config.outlet}`));
        }
    }

    /**
     * Navigates to a configured meta route
     */
    async go(metaRoute: string, subRoute?: string): Promise<void> {
        this.consoleFacade.debug('go(%s/%s)', metaRoute, subRoute);
        return this.goInner(new AppRoute(metaRoute, subRoute), true);
    }

    /**
     * Sends a broadcast message to the given recipients
     */
    broadcast(tag: string, data: object, recipients?: string[]): Promise<void> {
        const metadata = new MessageBroadcastMetadata(tag, SHELL_NAME, recipients);
        const message = new MessageBroadcast(metadata, data);
        return this.propagateBroadcast(message);
    }

    /**
     * Navigates to a configured meta route
     */
    private async goInner(route: AppRoute, click?: boolean): Promise<void> {
        const frame = await this.goPromiseSingleton.decorate(this.framesManager.getFrameWithRoute(route));
        return this.activateRoute(route, frame, click);
    }

    /**
     * Handler for new outlet route
     */
    private handleRouted(msgRouted: MessageRouted): Promise<void> {
        const route = this.config.routes.find((r) => r.metaRoute === msgRouted.source);
        if (route) {
            const routedRoute = new AppRoute(route.metaRoute, msgRouted.subRoute);
            this.setRouteInHash(this.config.outlet, routedRoute);
        }
        return Promise.resolve();
    }

    /**
     * Handler for new frame size
     */
    private async handleSetFrameStyles(msgSetFrameStyles: MessageSetFrameStyles): Promise<void> {
        const frame = await this.framesManager.getFrame(msgSetFrameStyles.source);
        frame.setStyles(msgSetFrameStyles.styles);
    }

    /**
     * Handler for get frame configuration
     */
    private async handleGetFrameConfiguration(msgGetFrameConfig: MessageGetCustomFrameConfiguration): Promise<void> {
        this.consoleFacade.debug(`handleGetFrameConfiguration(${msgGetFrameConfig})`);
        const frame = await this.framesManager.getFrame(msgGetFrameConfig.source);
        const config = frame.getCustomConfig();
        this.consoleFacade.debug(`handleGetFrameConfiguration / config = (${config})`);
        const msg = new MessageGetCustomFrameConfiguration(SHELL_NAME, config);
        frame.postMessage(msg);
    }

    /**
     * Handler for goto messages
     */
    private async handleGoto(msgGoto: MessageGoto): Promise<void> {
        return this.go(msgGoto.metaRoute, msgGoto.subRoute);
    }

    /**
     * Handler for broadcast
     */
    private async handleBroadcast(msgBroadcast: MessageBroadcast): Promise<void> {
        await this.propagateBroadcast(msgBroadcast);
        this.config.handleNotification(msgBroadcast.metadata, msgBroadcast.data);
    }

    /**
     * propagates the broadcast message to all recipients
     */
    private propagateBroadcast(msgBroadcast: MessageBroadcast): Promise<void> {
        this.framesManager.forEach((frame) => {
            if (this.isValidRecipient(frame.getRoute().metaRoute, msgBroadcast.metadata.recipients)) {
                msgBroadcast.metadata.isRecipientVisible = frame.isVisible();
                frame.postMessage(msgBroadcast);
            }
        });
        return Promise.resolve();
    }

    /** Checks if a route if valid recipient for broadcast message */
    private isValidRecipient(route: string, recipients?: string[]): boolean {
        if (recipients) {
            const recipient = recipients.find((r) => r === route);
            if (!recipient) {
                return false;
            }
        }
        return true;
    }

    /**
     * Activates route
     */
    private async activateRoute(routeToActivate: AppRoute, frame: IFrameFacade, click?: boolean): Promise<void> {
        this.consoleFacade.debug('activateRoute(%s/%s)', routeToActivate.metaRoute, routeToActivate.subRoute);
        this.makeActiveRouteVisible(routeToActivate);
        await this.notifyAppAboutActivation(routeToActivate, frame);
        this.activateRouteInHash(this.config.outlet, routeToActivate, click);
    }

    /**
     * Make active route visible
     * @param routeToActivate
     */
    private makeActiveRouteVisible(routeToActivate: AppRoute): void {
        this.consoleFacade.debug('makeActiveRouteVisible(%s/%s)', routeToActivate.metaRoute, routeToActivate.subRoute);
        this.framesManager.forEach((frame) => {
            if (frame.getRoute().metaRoute === routeToActivate.metaRoute) {
                frame.show();
            } else {
                frame.hide();
            }
        });
    }

    /**
     * Notify app about activation
     * @param routeToActivate
     */
    private async notifyAppAboutActivation(routeToActivate: AppRoute, frame: IFrameFacade): Promise<void> {
        this.consoleFacade.debug('notifyAppAboutActivation(%s/%s)', routeToActivate.metaRoute, routeToActivate.subRoute);
        const msg = new MessageMetaRouted(SHELL_NAME, true, routeToActivate.subRoute);
        frame.postMessage(msg);
    }

    /**
     * Sets hash path
     */
    private activateRouteInHash(outlet: string, routeToActivate: AppRoute, click?: boolean): void {
        let currentRoutes = this.parseHash(outlet);
        currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
        this.setRouteInHashInner(outlet, currentRoutes, click);
    }

    /**
     * Sets hash path
     */
    private setRouteInHash(outlet: string, newRoute: AppRoute): void {
        let currentRoutes = this.parseHash(outlet);
        currentRoutes = MetaRouteHelper.setRoute(newRoute, currentRoutes, outlet);
        this.setRouteInHashInner(outlet, currentRoutes);
    }

    /**
     * Inner set route in hash method
     * @param outlet
     * @param currentRoutes
     */
    private setRouteInHashInner(outlet: string, currentRoutes: IMap<AppRoute[]>, click?: boolean): void {
        const url = UrlHelper.constructFullUrl(this.locationFacade.getPath(), currentRoutes, outlet);
        this.consoleFacade.debug('setRouteInHashInner(%s, %s)', outlet, url);
        this.historyApiFacade.go(url, undefined, click);
    }

    /**
     * Parses hash
     */
    private parseHash(outlet: string): IMap<AppRoute[]> {
        const hash = this.locationFacade.getTruncatedHash();
        this.consoleFacade.debug('parseHash(%s) -> %s', outlet, hash);
        if (hash) {
            return UrlHelper.parseUrl(hash, outlet);
        } else {
            return this.getInitOutletsMap(outlet);
        }
    }

    /**
     * Initial outlets map
     * @param outlet
     */
    private getInitOutletsMap(outlet: string): IMap<AppRoute[]> {
        const map: IMap<AppRoute[]> = {};
        const route = new AppRoute(this.getInitMetaRoute());
        map[outlet] = [route];
        return map;
    }
}
