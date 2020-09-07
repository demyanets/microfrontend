import { HandleBroadcastNotification } from '@microfrontend/common';
import { MetaRouterConfig } from './meta-router-config';
import { IAppConfig } from './app-config';
import { FrameConfig } from './frame-config';

describe('MetaRouterConfig', async () => {
    let outlet: string;
    let routes: IAppConfig[];
    let handleNotification: HandleBroadcastNotification;
    let metaRouterConfig: MetaRouterConfig;
    let frameConfig: FrameConfig;

    beforeEach(() => {
        outlet = 'outlet';
        routes = [
            {
                metaRoute: 'a',
                baseUrl: '/app-a/'
            },
            {
                metaRoute: 'b',
                baseUrl: '/app-b/'
            }
        ];
        handleNotification = () => {};
        frameConfig = new FrameConfig({ test: 'testConfig' }, {}, {}, '$');
    });

    it('should create meta router config object', async () => {
        metaRouterConfig = new MetaRouterConfig(outlet, routes, handleNotification);
        await expect(metaRouterConfig).toBeTruthy();
    });

    it('should set meta router config object properties correctly', async () => {
        metaRouterConfig = new MetaRouterConfig(outlet, routes, handleNotification, frameConfig);
        await expect(metaRouterConfig.outlet).toBe(outlet);
        await expect(metaRouterConfig.routes).toEqual(routes);
        await expect(metaRouterConfig.handleNotification).toEqual(handleNotification);
        await expect(metaRouterConfig.frameConfig).toEqual(frameConfig);
    });

    it('should set frameConfig to default object if no frameConfig is passed', async () => {
        const defaultFrameConfig: FrameConfig = new FrameConfig();
        metaRouterConfig = new MetaRouterConfig(outlet, routes, handleNotification);
        await expect(metaRouterConfig.frameConfig.hashPrefix).toBe(defaultFrameConfig.hashPrefix);
    });

    it('should throw error for empty outlet', async () => {
        await expect(() => new MetaRouterConfig('', routes, handleNotification, frameConfig)).toThrow();
    });

    it('should throw error for empty routes', async () => {
        await expect(() => new MetaRouterConfig(outlet, [], handleNotification, frameConfig)).toThrow();
    });
});
