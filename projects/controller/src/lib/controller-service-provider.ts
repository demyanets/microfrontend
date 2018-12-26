import { ServiceProvider } from '@microfrontend/common';
import { AppRoute } from './app-route';
import { FrameConfig } from './frame-config';
import { FrameFacade } from './frame-facade';
import { HistoryApiFacade } from './history-api-facade';
import { LocationFacade } from './location-facade';
import { IControllerServiceProvider } from './controller-service-provider-interface';
import { IFrameFacade } from './frame-facade-interface';
import { IHistoryApiFacade } from './history-api-facade-interface';
import { ILocationFacade } from './location-facade-interface';

/**
 * Provides facades for browser services
 */
export class ControllerServiceProvider extends ServiceProvider implements IControllerServiceProvider {
    /**
     * Creates new instance of FrameFacade
     * @param route
     * @param baseUrl
     * @param outletName
     * @param allowedOrigins
     * @param config
     * @returns
     */
    getFrameFacade(route: AppRoute, baseUrl: string, outletName: string, config: FrameConfig): IFrameFacade {
        return new FrameFacade(route, baseUrl, outletName, config);
    }

    /**
     * Creates new instance of HistoryAI facade
     * @returns
     */
    getHistoryApiFacade(): IHistoryApiFacade {
        return new HistoryApiFacade();
    }

    /**
     * Creates new instance of location service facade
     * @returns
     */
    getLocationFacade(): ILocationFacade {
        return new LocationFacade();
    }
}
