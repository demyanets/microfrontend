import { IConsoleFacade, IMap } from '@microfrontend/common';
import { MetaRouterConfig } from './meta-router-config';
import { AppRoute } from './app-route';
import { IFrameFacade } from './frame-facade-interface';
import { IControllerServiceProvider } from './controller-service-provider-interface';
import { UnknownRouteHandlingEnum } from './unknown-route-handling-enum';
import { IAppConfig } from './app-config';

/**
 * Manager of iFrames
 */
export class FramesManager {
    /** Map for all meta routes and their corresponding frames */
    private frames: IMap<IFrameFacade> = {};

    /** Map for all meta routes and their corresponding frames */
    private frameInitializers: IMap<Promise<IFrameFacade>> = {};

    /** ConsoleAPI facade */
    private consoleFacade: IConsoleFacade;

    constructor(private readonly config: MetaRouterConfig, private readonly serviceProvider: IControllerServiceProvider) {
        this.consoleFacade = serviceProvider.getConsoleFacade();
    }

    /**
     * Returns existing frame or creates a new one if necessary
     * @param metaRoute
     * @param subRoute
     */
    async getFrame(metaRoute: string, subRoute?: string): Promise<IFrameFacade> {
        if (this.frames.hasOwnProperty(metaRoute)) {
            return Promise.resolve(this.frames[metaRoute]);
        } else {
            if (!this.frameInitializers.hasOwnProperty(metaRoute)) {
                this.frameInitializers[metaRoute] = this.initializeFrame(metaRoute, subRoute);
            }
            return this.frameInitializers[metaRoute];
        }
    }

    /**
     * Returns existing frame or creates a new one if necessary
     * @param route
     */
    async getFrameWithRoute(route: AppRoute): Promise<IFrameFacade> {
        return this.getFrame(route.metaRoute, route.subRoute);
    }

    /**
     * Initializes new frame
     * @param metaRoute
     * @param subRoute
     */
    private initializeFrame(metaRoute: string, subRoute?: string): Promise<IFrameFacade> {
        return new Promise<IFrameFacade>((resolve, reject) => {
            let r = this.config.routes.find((rc) => rc.metaRoute === metaRoute);
            r = this.handleUnknownRoute(r);
            if (r) {
                const route = new AppRoute(metaRoute, subRoute);
                this.serviceProvider
                    .getFrameFacade(route, r.baseUrl, this.config.outlet, this.config.frameConfig)
                    .initialize()
                    .then((frame) => {
                        resolve(this.frameInitialized(metaRoute, frame));
                    })
                    .catch((err) => {
                        reject(this.frameInitializationFailed(metaRoute, err));
                    });
            } else {
                reject(`Unknown route ${metaRoute}`);
            }
        });
    }

    /**
     * Implements unknown route handling strategy
     * @param r route
     */
    private handleUnknownRoute(r?: IAppConfig): IAppConfig | undefined {
        switch (this.config.unknownRouteHandling) {
            case UnknownRouteHandlingEnum.RedirectToFirstKnown:
                if (r === undefined) {
                    return this.config.routes[0];
                }
                break;

            case UnknownRouteHandlingEnum.ThrowError:
            default:
                break;
        }
        return r;
    }

    /**
     * Handles task after successful initialization
     * @param metaRoute
     * @param frame
     */
    private frameInitialized(metaRoute: string, frame: IFrameFacade): IFrameFacade {
        this.consoleFacade.debug(`frameInitialized: delete initializer for: ${metaRoute}`);
        delete this.frameInitializers[metaRoute];
        this.frames[metaRoute] = frame;
        return frame;
    }

    /**
     * Handles task after failed initialization
     * @param metaRoute
     * @param error
     */
    // tslint:disable no-any
    private frameInitializationFailed(metaRoute: string, error: any): any {
        this.consoleFacade.debug(`ensureFrameExists: delete initializer on catch for: ${metaRoute}`);
        delete this.frameInitializers[metaRoute];
        return error;
    }

    /**
     * Preloads all the micro frontends by loading them into the page
     */
    async preload(routes: AppRoute[]): Promise<IFrameFacade[]> {
        this.consoleFacade.debug('Before preload()');
        const promises: Array<Promise<IFrameFacade>> = [];
        for (const route of routes) {
            promises.push(this.getFrameWithRoute(route));
        }
        return Promise.all(promises);
    }

    /**
     * Unloads all the micro frontends by unloading them from the page
     */
    unloadAll(): void {
        this.consoleFacade.debug('Before unloadAll()');

        for (const route in this.frames) {
            if (this.frames.hasOwnProperty(route)) {
                const frame = this.frames[route];
                delete this.frames[route];
                frame.destroy();
            }
        }
        this.consoleFacade.debug('After unloadAll()');
    }

    /**
     * Executes a callback on every initialized frame
     * @param callback
     */
    forEach(callback: (frame: IFrameFacade) => void): void {
        for (const route in this.frames) {
            if (this.frames.hasOwnProperty(route)) {
                callback(this.frames[route]);
            }
        }
    }
}
