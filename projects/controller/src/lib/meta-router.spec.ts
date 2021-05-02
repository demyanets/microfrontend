import { EVENT_HASHCHANGE, EVENT_MESSAGE } from '@microfrontend/common';
import { MetaRouter } from './meta-router';
import { AppRoute } from './app-route';
import { MetaRouterConfig } from './meta-router-config';
import { ControllerServiceProviderMock } from '../mocks/controller-service-provider.mock';
import { FrameFacadeMock } from '../mocks/frame-facade.mock';
import { EventListenerFacadeMock } from '../mocks/event-listener-facade.mock';
import { MessageGetCustomFrameConfiguration } from 'projects/common/src/lib/message-get-custom-frame-configuration';
import { OutletState } from './outlet-state';

describe('MetaRouter', async () => {
    let router: MetaRouter;
    let provider: ControllerServiceProviderMock;
    let config: MetaRouterConfig;
    const HEIGHT: string = 'height';
    const initDelay = 3000;

    beforeEach(() => {
        config = new MetaRouterConfig(
            'outlet',
            [
                {
                    metaRoute: 'a',
                    baseUrl: location.origin + '/app-a/'
                },
                {
                    metaRoute: 'b',
                    baseUrl: location.origin + '/app-b/'
                }
            ],
            (tag, data) => {
                /* Do something */
            }
        );
    });

    describe('Race conditions', async () => {
        beforeEach(async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            router = new MetaRouter(config, provider);
        });

        it('Go B follows Go A but if A returns earlier it should not become visible', async () => {
            // This test is possible because frame facade mock waits 5 sec. during 1st call and does not wait during next call.
            FrameFacadeMock.initDelay = initDelay;
            await expect(provider.frameFacadeMocks.a).toBeUndefined();
            await expect(provider.frameFacadeMocks.b).toBeUndefined();
            const a = router.go('a');
            let wasRejected = false;
            // a shall reject after go b.
            a.catch((e) => (wasRejected = true));
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await router.go('b');
            try {
                await a;
            } catch (e) {
                console.log(e);
            }
            await expect(wasRejected).toBeTruthy();
            await expect(provider.frameFacadeMocks.a).toBeDefined();
            await expect(provider.frameFacadeMocks.a.visible).toBeFalsy();
            await expect(provider.frameFacadeMocks.b).toBeDefined();
            await expect(provider.frameFacadeMocks.b.visible).toBeTruthy();
        });
    });

    describe('Basic tests', async () => {
        beforeEach(async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            router = new MetaRouter(config, provider);
            await router.initialize();
        });

        it('should preload all', async () => {
            await router.preload();
            await expect(provider.frameFacadeMocks.a).toBeDefined();
            await expect(provider.frameFacadeMocks.a.isDestroyed()).toBeFalsy();
            await expect(provider.frameFacadeMocks.b).toBeDefined();
            await expect(provider.frameFacadeMocks.b.isDestroyed()).toBeFalsy();
        });

        it('should preload only a', async () => {
            const limitedRoutes = [config.routes[0]];
            await router.preload(limitedRoutes);
            await expect(provider.frameFacadeMocks.a).toBeDefined();
            await expect(provider.frameFacadeMocks.a.isDestroyed()).toBeFalsy();
            await expect(provider.frameFacadeMocks.b).toBeUndefined;
        });

        it('should unload all', async () => {
            await router.preload();
            router.unloadAll();
            await expect(provider.frameFacadeMocks.a).toBeDefined();
            await expect(provider.frameFacadeMocks.a.isDestroyed()).toBeTruthy();
            await expect(provider.frameFacadeMocks.b).toBeDefined();
            await expect(provider.frameFacadeMocks.b.isDestroyed()).toBeTruthy();
            await router.go('a');
            await expect(provider.frameFacadeMocks.a).toBeDefined();
            await expect(provider.frameFacadeMocks.a.isDestroyed()).toBeFalsy();
            await expect(provider.frameFacadeMocks.b).toBeDefined();
            await expect(provider.frameFacadeMocks.b.isDestroyed()).toBeTruthy();
        });

        it('should create the MetaRouter', async () => {
            await expect(router).toBeTruthy();
            await expect(provider.locationHistoryFacadeMocks.path).toBe('http://localhost:8080/#b!a/x');
            await expect(provider.locationHistoryFacadeMocks.getPath()).toBe('http://localhost:8080/');
            await expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).toBe('b!a/x');
        });

        it('should put something to console', async () => {
            await expect(provider.consoleFacadeMock.messages.length).toBeGreaterThan(0);
        });

        it('should create iframe for the route if the iframe for that route does not exist', async () => {
            await expect(provider.frameFacadeMocks.b).toBeDefined();
            await expect(provider.frameFacadeMocks.a).toBeUndefined();
            await expect(provider.frameFacadeMocks.b.route.metaRoute).not.toBe('a');
            spyOn(provider, 'getFrameFacade').and.callThrough();
            await router.go('a', 'x');
            await expect(provider.getFrameFacade).toHaveBeenCalled();
            await expect(provider.frameFacadeMocks.b).toBeDefined();
            await expect(provider.frameFacadeMocks.a).toBeDefined();
            await expect(provider.frameFacadeMocks.b.getRoute()).toEqual(new AppRoute('b', undefined));
            await expect(provider.frameFacadeMocks.a.getRoute()).toEqual(new AppRoute('a', 'x'));
        });

        it('should not create iframe for the route if iframe already exist', async () => {
            await expect(provider.frameFacadeMocks.b).toBeDefined();
            await expect(provider.frameFacadeMocks.a).toBeUndefined();
            await router.go('a', 'x');
            await expect(provider.frameFacadeMocks.a).toBeDefined();
            spyOn(provider, 'getFrameFacade').and.callThrough();
            await router.go('b');
            await expect(provider.getFrameFacade).not.toHaveBeenCalled();
            await expect(provider.frameFacadeMocks.b).toBeDefined();
            await expect(provider.frameFacadeMocks.b.getRoute()).toEqual(new AppRoute('b', undefined));
            await expect(provider.frameFacadeMocks.a.getRoute()).toEqual(new AppRoute('a', 'x'));
        });

        it('should make routeToActivate visible and other routes hidden', async () => {
            await router.preload();
            await expect(provider.frameFacadeMocks.a.visible).toBeFalsy();
            await router.go('a', 'x');
            await expect(provider.frameFacadeMocks.a.isDestroyed()).toBeFalsy();
            await expect(provider.frameFacadeMocks.a.visible).toBeTruthy();
            await expect(provider.frameFacadeMocks.b.isDestroyed()).toBeFalsy();
            await expect(provider.frameFacadeMocks.b.visible).toBeFalsy();
        });

        it('should notify microfrontend app about route activation', async () => {
            await router.preload();
            spyOn(provider.frameFacadeMocks.b, 'postMessage');
            spyOn(provider.frameFacadeMocks.a, 'postMessage');
            await router.go('a', 'x');
            await expect(provider.frameFacadeMocks.b.postMessage).not.toHaveBeenCalled();
            await expect(provider.frameFacadeMocks.a.postMessage).toHaveBeenCalled();
        });

        it('should update route hash when route changes', async () => {
            const prevHash = provider.locationHistoryFacadeMocks.getTruncatedHash();
            await expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).not.toBe('a/x!b');
            await router.go('a', 'x');
            await expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).toBe('a/x!b');
        });

        it('should go to "a/x"', async () => {
            await router.go('a', 'x');
            await expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).toBe('a/x!b');
            await expect(provider.frameFacadeMocks.b.visible).toBeFalsy();
            await expect(provider.frameFacadeMocks.a.visible).toBeTruthy();
            await expect(router).toBeTruthy();
        });

        it('should replace history on route change', async () => {
            await router.go('a', 'x');
            const initLength = provider.locationHistoryFacadeMocks.history.length;
            await router.go('b', 'y');
            await expect(provider.locationHistoryFacadeMocks.history.length).toBe(initLength + 1);
        });

        it('should update history on subroute change', async () => {
            await router.go('b', 'x');
            const initLength = provider.locationHistoryFacadeMocks.history.length;
            await router.go('b', 'y');
            await expect(provider.locationHistoryFacadeMocks.history.length).toBe(initLength + 1);
        });
    });

    describe('getOutletState', async () => {
        beforeEach(async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            router = new MetaRouter(config, provider);
            await router.initialize();
        });

        it('should return state for named outlet', async () => {
            const state = router.getOutletState('outlet');
            await expect(state).toBeDefined();
            await expect(state.outlet).toBe('outlet');
            await expect(state.activeRoute).toBeDefined();
            await expect(state.activeRoute.metaRoute).toBe('b');
            await expect(state.activeRoute.subRoute).toBeUndefined();
            await expect(state.activeRoute.url).toBe('b');
            await expect(state.routes).toBeDefined();
            await expect(state.routes.length).toBe(2);
            await expect(state.routes[0].metaRoute).toEqual(state.activeRoute.metaRoute);
            await expect(state.routes[1].metaRoute).toBe('a');
            await expect(state.routes[1].subRoute).toBe('x');
        });

        it('should return default outlet state', async () => {
            const state = router.getOutletState();
            await expect(state).toBeDefined();
            await expect(state.outlet).toBe('outlet');
            await expect(state.activeRoute).toBeDefined();
            await expect(state.activeRoute.metaRoute).toBe('b');
            await expect(state.activeRoute.subRoute).toBeUndefined();
            await expect(state.activeRoute.url).toBe('b');
            await expect(state.routes).toBeDefined();
            await expect(state.routes.length).toBe(2);
            await expect(state.routes[0].metaRoute).toEqual(state.activeRoute.metaRoute);
            await expect(state.routes[1].metaRoute).toBe('a');
            await expect(state.routes[1].subRoute).toBe('x');
        });
    });

    describe('OutletStateChanged', async () => {
        it('should return state for named outlet', async () => {
            let stateChangedCalled: boolean = false;
            let stateParam: OutletState | undefined = undefined;
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            router = new MetaRouter(config, provider);
            router.outletStateChanged = (s) => {
                stateChangedCalled = true;
                stateParam = s;
            };
            await router.initialize();
            await router.go('a', 'x');
            await expect(stateChangedCalled).toBeTruthy();
            await expect(stateParam).toBeDefined();

            if (stateParam) {
                const state: OutletState = stateParam;
                await expect(state.outlet).toBe('outlet');
                await expect(state.activeRoute).toBeDefined();
                await expect(state.activeRoute.metaRoute).toBe('a');
                await expect(state.activeRoute.subRoute).toBe('x');
                await expect(state.activeRoute.url).toBe('a/x');
                await expect(state.routes).toBeDefined();
                await expect(state.routes.length).toBe(2);
                await expect(state.routes[0].metaRoute).toEqual(state.activeRoute.metaRoute);
                await expect(state.routes[1].metaRoute).toBe('b');
                await expect(state.routes[1].subRoute).toBeUndefined();
            }
        });
    });

    describe('handleEvent', async () => {
        beforeEach(() => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            router = new MetaRouter(config, provider);
        });

        it('should fail with wrong origin', async () => {
            const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
            let failed = false;
            try {
                await eventMock.simulateRoutedMessage('a', 'a', 'y', 'http://1.2.3.4');
            } catch (e) {
                failed = true;
            }
            await expect(failed).toBeTruthy();
        });

        it('should update hash when the subroute of the microfront changes', async () => {
            const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
            await eventMock.simulateRoutedMessage('a', 'a', 'y', location.origin);
            await expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).toBe('b!a/y');
        });

        it('should set frame height', async () => {
            await router.preload();
            const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
            await eventMock.simulateSetFrameStylesMessage('b', { height: '22px' }, location.origin);
            await expect(provider.frameFacadeMocks.b.lastStyles[HEIGHT]).toBe('22px');
            await eventMock.simulateSetFrameStylesMessage('b', { height: '55px' }, location.origin);
            await expect(provider.frameFacadeMocks.b.lastStyles[HEIGHT]).toBe('55px');
        });

        it('should send message notification', async () => {
            const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
            spyOn(router, 'go').and.callThrough();
            await eventMock.simulateGotoMessage('a', 'a', undefined, location.origin);
            await expect(router.go).toHaveBeenCalledWith('a', undefined);
        });

        it('should get custom frame config msg', async () => {
            const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
            await eventMock.simulateGetCustomFrameConfigMessage('a', {}, location.origin).then(async (res) => {
                await expect(true).toBeTruthy();
            });
        });
    });

    describe('routeByUrl', async () => {
        it('should route to first route from config if no route is found', async () => {
            const route = new AppRoute(config.routes[0].metaRoute, undefined);
            provider = new ControllerServiceProviderMock('http://localhost:8080');
            router = new MetaRouter(config, provider);
            await router.initialize();
            await expect(provider.frameFacadeMocks.a.getRoute()).toEqual(route);
            await expect(provider.frameFacadeMocks.a.visible).toBeTruthy();
        });

        it('should drop invalid routes from the url (outlet=a/x!a!a!b -> outlet=a/x!b)', async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#a/x!a!a!b');
            router = new MetaRouter(config, provider);
            await router.initialize();
            await provider.eventListenerFacadeMocks[EVENT_HASHCHANGE].simulatePlainEvent(location.origin);
            await expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).toBe('a/x!b');
        });

        it('should throw error if no valid route is entered (outlet=c/x!d -> exception)', async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#c/x!d');
            router = new MetaRouter(config, provider);
            let rejected = false;
            await router.initialize().catch(() => (rejected = true));
            await expect(rejected).toBeTruthy();
        });

        it('should throw error if first route in the url is invalid (outlet=c/x!a!a!b -> exception)', async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#c/x!a!a!b');
            router = new MetaRouter(config, provider);
            let rejected = false;
            await router.initialize().catch(() => (rejected = true));
            await expect(rejected).toBeTruthy();
        });

        it('should return error if outlet name is invalid (outlet= -> exception)', async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#invalid=a');
            router = new MetaRouter(config, provider);
            let rejected = false;
            await router.initialize().catch(() => (rejected = true));
            await expect(rejected).toBeTruthy();
        });
    });

    describe('broadcast', async () => {
        beforeEach(() => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            router = new MetaRouter(config, provider);
        });

        it('should broadcast message to all iframes', async () => {
            const dummyData: object = {
                sample: 'msg'
            };

            await router.preload();
            await expect(provider.frameFacadeMocks.a.messages.length).toBe(0);
            await expect(provider.frameFacadeMocks.b.messages.length).toBe(0);
            spyOn(provider.frameFacadeMocks.a, 'postMessage').and.callThrough();
            spyOn(provider.frameFacadeMocks.b, 'postMessage').and.callThrough();

            await router.broadcast('sampleTag', dummyData, undefined);
            await expect(provider.frameFacadeMocks.a.postMessage).toHaveBeenCalled();
            await expect(provider.frameFacadeMocks.b.postMessage).toHaveBeenCalled();
            await expect(provider.frameFacadeMocks.a.messages.length).toBe(1);
            await expect(provider.frameFacadeMocks.b.messages.length).toBe(1);
        });

        it('should broadcast message only to selected recipients', async () => {
            const dummyData: object = {
                sample: 'msg'
            };

            await router.preload();
            await expect(provider.frameFacadeMocks.a.messages.length).toBe(0);
            await expect(provider.frameFacadeMocks.b.messages.length).toBe(0);
            spyOn(provider.frameFacadeMocks.a, 'postMessage').and.callThrough();
            spyOn(provider.frameFacadeMocks.b, 'postMessage').and.callThrough();

            await router.broadcast('sampleTag', dummyData, ['b']);
            await expect(provider.frameFacadeMocks.a.postMessage).not.toHaveBeenCalled();
            await expect(provider.frameFacadeMocks.b.postMessage).toHaveBeenCalled();
            await expect(provider.frameFacadeMocks.a.messages.length).toBe(0);
            await expect(provider.frameFacadeMocks.b.messages.length).toBe(1);
        });
    });
});
