import { IServiceProvider } from '@microfrontend/common';
import { AppRoute } from './app-route';
import { FrameConfig } from './frame-config';
import { IFrameFacade } from './frame-facade-interface';
import { IHistoryApiFacade } from './history-api-facade-interface';
import { ILocationFacade } from './location-facade-interface';

export interface IControllerServiceProvider extends IServiceProvider {
    getFrameFacade(route: AppRoute, baseUrl: string, outletName: string, config: FrameConfig): IFrameFacade;
    getHistoryApiFacade(): IHistoryApiFacade;
    getLocationFacade(): ILocationFacade;
}
