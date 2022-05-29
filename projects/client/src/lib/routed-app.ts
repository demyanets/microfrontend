import {
    Destroyable,
    HandleBroadcastNotification,
    HandleGetCustomFrameConfiguration,
    IMap,
    IConsoleFacade,
    MessageBroadcast,
    MessageBroadcastMetadata,
    MessageGetCustomFrameConfiguration,
    MessageGoto,
    MessageRouted,
    MessageSetFrameStyles,
    MessageMetaRouted,
    MessagingApiBroker,
    MessageStateDiscard,
    MessageStateChanged
} from '@microfrontend/common';
import { RoutedAppConfig } from './routed-app-config';
import { IParentFacade } from './parent-facade-interface';
import { IClientServiceProvider } from './client-service-provider-interface';
import { ClientServiceProvider } from './client-service-provider';

/**
 * Represents a micro frontend (a client app) the meta router routes to
 */
export class RoutedApp {
    /** Messaging API broaker */
    private messagingBroker?: MessagingApiBroker = undefined;

    /** Load listener */
    private loadListener?: Destroyable = undefined;

    /** Resize listener */
    private resizeListener?: Destroyable = undefined;

    /** ConsoleAPI facade */
    private consoleFacade: IConsoleFacade;

    /** Route changed callback */
    private callbackRouteChange?: (activated: boolean, subRoute?: string) => void;

    /** Broadcast callback */
    private callbackBroadcast?: HandleBroadcastNotification;

    /** Broadcast callback */
    private callbackGetCustomConfig?: HandleGetCustomFrameConfiguration;

    /** Discard state callback */
    private callbackDiscardState?: () => void;

    /** Event broker handling Messaging API events */
    // tslint:disable no-unused-variable
    private messageBroker?: Destroyable;

    /** Parent facade */
    private parentFacade: IParentFacade;

    /** Custom custom */
    private customConfig?: IMap<string>;

    /**
     * Constructor
     * @param config
     * @param serviceProvider
     */
    constructor(readonly config: RoutedAppConfig, private readonly serviceProvider: IClientServiceProvider = new ClientServiceProvider()) {
        this.parentFacade = serviceProvider.getParentFacade();
        this.consoleFacade = serviceProvider.getConsoleFacade(config.logLevel, config.metaRoute);

        if (!this.parentFacade.hasParent()) {
            return;
        }

        // tslint:disable no-unsafe-any
        this.messageBroker = new MessagingApiBroker(
            this.serviceProvider,
            this.consoleFacade,
            [this.config.parentOrigin],
            undefined,
            undefined,
            undefined,
            this.handleBroadcast.bind(this),
            this.handleMetaRouted.bind(this),
            this.handleGetCustomFrameConfig.bind(this),
            undefined,
            this.handleStateDiscard.bind(this)
        );
    }

    /** Indicates if the application is running in a shell  */
    get hasShell(): boolean {
        return this.parentFacade.hasParent();
    }

    /** Sends the current state status to the meta router */
    changeState(hasState: boolean, subRoute?: string): void {
        const message = new MessageStateChanged(this.config.metaRoute, hasState, subRoute);
        this.parentFacade.postMessage(message, this.config.parentOrigin);
    }

    /** Sends the current route to the meta router to include it into the url */
    sendRoute(url: string): void {
        const message = new MessageRouted(this.config.metaRoute, url);
        this.parentFacade.postMessage(message, this.config.parentOrigin);
    }

    /** Goes to another micro app */
    goTo(metaRoute: string, subRoute?: string): void {
        const message = new MessageGoto(this.config.metaRoute, metaRoute, subRoute);
        this.parentFacade.postMessage(message, this.config.parentOrigin);
    }

    /** Sends a message to all routed apps */
    broadcast(tag: string, data: object, recipients?: string[]): void {
        const metadata = new MessageBroadcastMetadata(tag, this.config.metaRoute, recipients);
        const message = new MessageBroadcast(metadata, data);
        this.parentFacade.postMessage(message, this.config.parentOrigin);
    }

    /**
     * Sets styles of the microfrontend's iframe
     * @param styles
     */
    setFrameStyles(styles: IMap<string>): void {
        const message = new MessageSetFrameStyles(this.config.metaRoute, styles);
        this.parentFacade.postMessage(message, this.config.parentOrigin);
    }

    /**
     * Registers a callback that allows the meta router to request
     * the microfronend to discard its state
     */
     registerDiscardStateCallback(callback: () => void): void {
        this.callbackDiscardState = callback;
    }

    /**
     * Registers a callback that allows the meta router to request
     * a new route within the routed application
     */
    registerRouteChangeCallback(callback: (activated: boolean, subRoute?: string) => void): void {
        this.callbackRouteChange = callback;
    }

    /**
     * Registers a callback that allows the microfrontend to receive
     * a broadcast message
     */
    registerBroadcastCallback(callback: HandleBroadcastNotification): void {
        this.callbackBroadcast = callback;
    }

    /**
     * Registers a callback that allows the microfrontend to receive
     * a frame configuration message
     */
    registerCustomFrameConfigCallback(callback: HandleGetCustomFrameConfiguration): void {
        this.callbackGetCustomConfig = callback;
    }

    /**
     * Requests custom frame configuration.
     * Use 'registerCustomFrameConfigCallback' to get the notification.
     */
    requestCustomFrameConfiguration(): void {
        const message = new MessageGetCustomFrameConfiguration(this.config.metaRoute, {});
        this.parentFacade.postMessage(message, this.config.parentOrigin);
    }

    /**
     * Handle broadcast message
     * @param msg
     */
    private handleBroadcast(msg: MessageBroadcast): Promise<void> {
        if (this.callbackBroadcast) {
            this.callbackBroadcast(msg.metadata, msg.data);
        }
        return Promise.resolve();
    }

    /**
     * Handle sub route changed message
     * @param msg
     */
    private handleMetaRouted(msg: MessageMetaRouted): Promise<void> {
        if (this.callbackRouteChange) {
            this.callbackRouteChange(msg.activated, msg.subRoute);
        }
        return Promise.resolve();
    }

    /**
     * Handle sub route changed message
     * @param msg
     */
    private handleGetCustomFrameConfig(msg: MessageGetCustomFrameConfiguration): Promise<void> {
        if (this.callbackGetCustomConfig) {
            this.callbackGetCustomConfig(msg.configuration);
        }
        return Promise.resolve();
    }

    /**
     * Handle state discard message
     * @param msg
     */
     private handleStateDiscard(msg: MessageStateDiscard): Promise<void> {
        if (this.callbackDiscardState) {
            this.callbackDiscardState();
        }
        return Promise.resolve();
    }
}
