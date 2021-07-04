import { IMap, IConsoleFacade } from '@microfrontend/common';
import { FrameFacadeMock } from './frame-facade.mock';
import { LocationHistoryFacadeMock } from './location-history-facade.mock';
import { IControllerServiceProvider } from '../lib/controller-service-provider-interface';
import { AppRoute } from '../lib/app-route';
import { FrameConfig } from '../lib/frame-config';
import { IFrameFacade } from '../lib/frame-facade-interface';
import { IHistoryApiFacade } from '../lib/history-api-facade-interface';
import { ILocationFacade } from '../lib/location-facade-interface';
import { ServiceProviderMock } from './service-provider.mock';

export class ControllerServiceProviderMock extends ServiceProviderMock implements IControllerServiceProvider {
    frameFacadeMocks: IMap<FrameFacadeMock> = {};
    locationHistoryFacadeMocks: LocationHistoryFacadeMock;

    constructor(public initialPath: string) {
        super(initialPath);
        this.locationHistoryFacadeMocks = new LocationHistoryFacadeMock(this.initialPath);
    }

    getFrameFacade(route: AppRoute, baseUrl: string, outletName: string, config: FrameConfig, consoleFacade: IConsoleFacade): IFrameFacade {
        if (!this.frameFacadeMocks[route.metaRoute]) {
            this.frameFacadeMocks[route.metaRoute] = new FrameFacadeMock(route, baseUrl, outletName, config);
        }

        if (this.frameFacadeMocks[route.metaRoute].isDestroyed()) {
            this.frameFacadeMocks[route.metaRoute] = new FrameFacadeMock(route, baseUrl, outletName, config);
        }

        return this.frameFacadeMocks[route.metaRoute];
    }

    getHistoryApiFacade(): IHistoryApiFacade {
        return this.locationHistoryFacadeMocks;
    }

    getLocationFacade(): ILocationFacade {
        return this.locationHistoryFacadeMocks;
    }
}
