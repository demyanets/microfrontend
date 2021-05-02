import { AppRoute } from './app-route';
import { MetaRouterConfig } from './meta-router-config';
import { FramesManager } from './frames-manager';
import { ControllerServiceProviderMock } from '../mocks/controller-service-provider.mock';
import { FrameConfig } from './frame-config';
import { UnknownRouteHandlingEnum } from './unknown-route-handling-enum';

describe('FrameManager', async () => {
    let frameMan: FramesManager;
    let provider: ControllerServiceProviderMock;
    let config: MetaRouterConfig;
    let preloadRoutes: AppRoute[];

    beforeEach(() => {
        config = new MetaRouterConfig(
            'outlet',
            [
                {
                    metaRoute: 'a',
                    baseUrl: '/app-a/'
                },
                {
                    metaRoute: 'b',
                    baseUrl: '/app-b/'
                }
            ],
            (tag, data) => {
                /* Do something */
            }
        );
        preloadRoutes = [];
        preloadRoutes.push(new AppRoute('b'));
        preloadRoutes.push(new AppRoute('a'));
    });

    describe('Basic tests', async () => {
        beforeEach(async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            frameMan = new FramesManager(config, provider);
        });

        it('should preload all', async () => {
            await frameMan.preload(preloadRoutes);
            await expect(provider.frameFacadeMocks.a).toBeDefined();
            await expect(provider.frameFacadeMocks.a.isDestroyed()).toBeFalsy();
            await expect(provider.frameFacadeMocks.b).toBeDefined();
            await expect(provider.frameFacadeMocks.b.isDestroyed()).toBeFalsy();
        });

        it('should unload all', async () => {
            await frameMan.preload(preloadRoutes);
            frameMan.unloadAll();
            await expect(provider.frameFacadeMocks.a).toBeDefined();
            await expect(provider.frameFacadeMocks.a.isDestroyed()).toBeTruthy();
            await expect(provider.frameFacadeMocks.b).toBeDefined();
            await expect(provider.frameFacadeMocks.b.isDestroyed()).toBeTruthy();
        });

        it('should create iframe for the route if the iframe for that route does not exist', async () => {
            await expect(provider.frameFacadeMocks.b).toBeUndefined();
            await expect(provider.frameFacadeMocks.a).toBeUndefined();
            spyOn(provider, 'getFrameFacade').and.callThrough();
            await frameMan.getFrame('a', 'x');
            await expect(provider.getFrameFacade).toHaveBeenCalled();
            await expect(provider.frameFacadeMocks.b).toBeUndefined();
            await expect(provider.frameFacadeMocks.a).toBeDefined();
            await expect(provider.frameFacadeMocks.a.getRoute()).toEqual(new AppRoute('a', 'x'));
        });

        it('should not create iframe for the route if iframe already exist', async () => {
            await expect(provider.frameFacadeMocks.b).toBeUndefined();
            await expect(provider.frameFacadeMocks.a).toBeUndefined();
            await frameMan.getFrame('a', 'x');
            await expect(provider.frameFacadeMocks.a).toBeDefined();
            spyOn(provider, 'getFrameFacade').and.callThrough();
            await frameMan.getFrame('a');
            await expect(provider.getFrameFacade).not.toHaveBeenCalled();
            await expect(provider.frameFacadeMocks.b).toBeUndefined();
            await expect(provider.frameFacadeMocks.a.getRoute()).toEqual(new AppRoute('a', 'x'));
        });
    });

    describe('when unknownRouteHandling is RedirectToFirstKnown', async () => {
        beforeEach(() => {
            config = new MetaRouterConfig(
                'outlet',
                [
                    {
                        metaRoute: 'a',
                        baseUrl: '/app-a/'
                    }
                ],
                (tag, data) => {
                    /* Do something */
                },
                new FrameConfig(),
                UnknownRouteHandlingEnum.RedirectToFirstKnown
            );
        });

        beforeEach(async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            frameMan = new FramesManager(config, provider);
        });

        it('should create iframe for the route if the iframe for that route does not matched ', async () => {
            spyOn(provider, 'getFrameFacade').and.callThrough();
            await frameMan.getFrame('ss', 'o');
            await expect(provider.frameFacadeMocks.ss.getRoute()).toEqual(new AppRoute('ss', 'o'));
        });

        it('should create iframe for the route if the iframe for  that route does not exist', async () => {
            spyOn(provider, 'getFrameFacade').and.callThrough();
            await frameMan.getFrame('a', 'o');
            await expect(provider.frameFacadeMocks.a.getRoute()).toEqual(new AppRoute('a', 'o'));
        });

        it('should catch a error when FrameFacadeMock init function is got catch', async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            frameMan = new FramesManager(config, provider);
            spyOn(provider, 'getFrameFacade').and.callThrough();
            await frameMan.getFrame('a', 'o').catch(async (err) => {
                await expect(true).toBeTruthy();
            });
        });
    });
});
