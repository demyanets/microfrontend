import { HandleBroadcastNotification, Level } from '@microfrontend/common';
import { IAppConfig } from './app-config';
import { FrameConfig } from './frame-config';
import { UnknownRouteHandlingEnum } from './unknown-route-handling-enum';

/**
 * Meta router custom
 */
export class MetaRouterConfig {
    constructor(
        readonly outlet: string,
        readonly routes: IAppConfig[],
        readonly handleNotification: HandleBroadcastNotification,
        readonly frameConfig: FrameConfig = new FrameConfig(),
        readonly unknownRouteHandling: UnknownRouteHandlingEnum = UnknownRouteHandlingEnum.ThrowError,
        readonly  logLevel: Level = Level.LOG
    ) {
        if (outlet === '') {
            throw new Error('Outlet is empty');
        }

        if (routes.length === 0) {
            throw new Error('Routes array is empty');
        }
    }
}
