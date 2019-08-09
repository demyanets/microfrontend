import { IServiceProvider } from '@microfrontend/common';
import { AppRoute } from './app-route';
import { FrameConfig } from './frame-config';
import { IFrameFacade } from './frame-facade-interface';
import { IHistoryApiFacade } from './history-api-facade-interface';
import { ILocationFacade } from './location-facade-interface';

export interface IControllerServiceProvider extends IServiceProvider {
    /**
     * Creates new instance of FrameFacade
     * @param route
     * @param baseUrl
     * @param outletName
     * @param allowedOrigins
     * @param config
     * @returns
     */
    getFrameFacade(route: AppRoute, baseUrl: string, outletName: string, config: FrameConfig): IFrameFacade;

    /**
     * Creates new instance of HistoryAI facade
     * @returns
     */
    getHistoryApiFacade(): IHistoryApiFacade;

    /**
     * Creates new instance of location service facade
     * @returns
     */
    getLocationFacade(): ILocationFacade;
}
