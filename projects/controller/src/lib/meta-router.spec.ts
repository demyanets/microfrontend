import { EVENT_HASHCHANGE, EVENT_MESSAGE } from '@microfrontend/common';
import { MetaRouter } from './meta-router';
import { AppRoute } from './app-route';
import { MetaRouterConfig } from './meta-router-config';
import { ControllerServiceProviderMock } from '../mocks/controller-service-provider.mock';
import { FrameFacadeMock } from '../mocks/frame-facade.mock';
import { EventListenerFacadeMock } from '../mocks/event-listener-facade.mock';
import { MessageGetCustomFrameConfiguration } from 'projects/common/src/lib/message-get-custom-frame-configuration';

describe('MetaRouter', () => {
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

    describe('Race conditions', () => {
        beforeEach(async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            router = new MetaRouter(config, provider);
        });

        it('Go B follows Go A but if A returns earlier it should not become visible', async () => {
            // This test is possible because frame facade mock waits 5 sec. during 1st call and does not wait during next call.
            FrameFacadeMock.initDelay = initDelay;
            expect(provider.frameFacadeMocks.a).toBeUndefined();
            expect(provider.frameFacadeMocks.b).toBeUndefined();
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
            expect(wasRejected).toBeTruthy();
            expect(provider.frameFacadeMocks.a).toBeDefined();
            expect(provider.frameFacadeMocks.a.visible).toBeFalsy();
            expect(provider.frameFacadeMocks.b).toBeDefined();
            expect(provider.frameFacadeMocks.b.visible).toBeTruthy();
        });
    });

    describe('Basic tests', () => {
        beforeEach(async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            router = new MetaRouter(config, provider);
            await router.initialize();
        });

        it('should preload all', async () => {
            await router.preload();
            expect(provider.frameFacadeMocks.a).toBeDefined();
            expect(provider.frameFacadeMocks.a.isDestroyed()).toBeFalsy();
            expect(provider.frameFacadeMocks.b).toBeDefined();
            expect(provider.frameFacadeMocks.b.isDestroyed()).toBeFalsy();
        });

        it('should unload all', async () => {
            await router.preload();
            router.unloadAll();
            expect(provider.frameFacadeMocks.a).toBeDefined();
            expect(provider.frameFacadeMocks.a.isDestroyed()).toBeTruthy();
            expect(provider.frameFacadeMocks.b).toBeDefined();
            expect(provider.frameFacadeMocks.b.isDestroyed()).toBeTruthy();
            await router.go('a');
            expect(provider.frameFacadeMocks.a).toBeDefined();
            expect(provider.frameFacadeMocks.a.isDestroyed()).toBeFalsy();
            expect(provider.frameFacadeMocks.b).toBeDefined();
            expect(provider.frameFacadeMocks.b.isDestroyed()).toBeTruthy();
        });

        it('should create the MetaRouter', () => {
            expect(router).toBeTruthy();
            expect(provider.locationHistoryFacadeMocks.path).toBe('http://localhost:8080/#b!a/x');
            expect(provider.locationHistoryFacadeMocks.getPath()).toBe('http://localhost:8080/');
            expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).toBe('b!a/x');
        });

        it('should put something to console', () => {
            expect(provider.consoleFacadeMock.messages.length).toBeGreaterThan(0);
        });

        it('should create iframe for the route if the iframe for that route does not exist', async () => {
            expect(provider.frameFacadeMocks.b).toBeDefined();
            expect(provider.frameFacadeMocks.a).toBeUndefined();
            expect(provider.frameFacadeMocks.b.route.metaRoute).not.toBe('a');
            spyOn(provider, 'getFrameFacade').and.callThrough();
            await router.go('a', 'x');
            expect(provider.getFrameFacade).toHaveBeenCalled();
            expect(provider.frameFacadeMocks.b).toBeDefined();
            expect(provider.frameFacadeMocks.a).toBeDefined();
            expect(provider.frameFacadeMocks.b.getRoute()).toEqual(new AppRoute('b', undefined));
            expect(provider.frameFacadeMocks.a.getRoute()).toEqual(new AppRoute('a', 'x'));
        });

        it('should not create iframe for the route if iframe already exist', async () => {
            expect(provider.frameFacadeMocks.b).toBeDefined();
            expect(provider.frameFacadeMocks.a).toBeUndefined();
            await router.go('a', 'x');
            expect(provider.frameFacadeMocks.a).toBeDefined();
            spyOn(provider, 'getFrameFacade').and.callThrough();
            await router.go('b');
            expect(provider.getFrameFacade).not.toHaveBeenCalled();
            expect(provider.frameFacadeMocks.b).toBeDefined();
            expect(provider.frameFacadeMocks.b.getRoute()).toEqual(new AppRoute('b', undefined));
            expect(provider.frameFacadeMocks.a.getRoute()).toEqual(new AppRoute('a', 'x'));
        });

        it('should make routeToActivate visible and other routes hidden', async () => {
            await router.preload();
            expect(provider.frameFacadeMocks.a.visible).toBeFalsy();
            await router.go('a', 'x');
            expect(provider.frameFacadeMocks.a.isDestroyed()).toBeFalsy();
            expect(provider.frameFacadeMocks.a.visible).toBeTruthy();
            expect(provider.frameFacadeMocks.b.isDestroyed()).toBeFalsy();
            expect(provider.frameFacadeMocks.b.visible).toBeFalsy();
        });

        it('should notify microfrontend app about route activation', async () => {
            await router.preload();
            spyOn(provider.frameFacadeMocks.b, 'postMessage');
            spyOn(provider.frameFacadeMocks.a, 'postMessage');
            await router.go('a', 'x');
            expect(provider.frameFacadeMocks.b.postMessage).not.toHaveBeenCalled();
            expect(provider.frameFacadeMocks.a.postMessage).toHaveBeenCalled();
        });

        it('should update route hash when route changes', async () => {
            const prevHash = provider.locationHistoryFacadeMocks.getTruncatedHash();
            expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).not.toBe('a/x!b');
            await router.go('a', 'x');
            expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).toBe('a/x!b');
        });

        it('should go to "a/x"', async () => {
            await router.go('a', 'x');
            expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).toBe('a/x!b');
            expect(provider.frameFacadeMocks.b.visible).toBeFalsy();
            expect(provider.frameFacadeMocks.a.visible).toBeTruthy();
            expect(router).toBeTruthy();
        });

        it('should replace history on route change', async () => {
            await router.go('a', 'x');
            const initLength = provider.locationHistoryFacadeMocks.history.length;
            await router.go('b', 'y');
            expect(provider.locationHistoryFacadeMocks.history.length).toBe(initLength + 1);
        });

        it('should update history on subroute change', async () => {
            await router.go('b', 'x');
            const initLength = provider.locationHistoryFacadeMocks.history.length;
            await router.go('b', 'y');
            expect(provider.locationHistoryFacadeMocks.history.length).toBe(initLength + 1);
        });
    });

    describe('handleEvent', () => {
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
            expect(failed).toBeTruthy();
        });

        it('should update hash when the subroute of the microfront changes', async () => {
            const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
            await eventMock.simulateRoutedMessage('a', 'a', 'y', location.origin);
            expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).toBe('b!a/y');
        });

        it('should set frame height', async () => {
            await router.preload();
            const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
            await eventMock.simulateSetFrameStylesMessage('b', { height: '22px' }, location.origin);
            expect(provider.frameFacadeMocks.b.lastStyles[HEIGHT]).toBe('22px');
            await eventMock.simulateSetFrameStylesMessage('b', { height: '55px' }, location.origin);
            expect(provider.frameFacadeMocks.b.lastStyles[HEIGHT]).toBe('55px');
        });

        it('should send message notification', async () => {
            const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
            spyOn(router, 'go').and.callThrough();
            await eventMock.simulateGotoMessage('a', 'a', undefined, location.origin);
            expect(router.go).toHaveBeenCalledWith('a', undefined);
        });

        it('should get custom frame config msg', async () => {
            const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
            await eventMock.simulateGetCustomFrameConfigMessage('a', {}, location.origin).then((res) => {
                expect(true).toBeTruthy();
            });
        });
    });

    describe('routeByUrl', () => {
        it('should route to first route from config if no route is found', async () => {
            const route = new AppRoute(config.routes[0].metaRoute, undefined);
            provider = new ControllerServiceProviderMock('http://localhost:8080');
            router = new MetaRouter(config, provider);
            await router.initialize();
            expect(provider.frameFacadeMocks.a.getRoute()).toEqual(route);
            expect(provider.frameFacadeMocks.a.visible).toBeTruthy();
        });

        it('should drop invalid routes from the url (outlet=a/x!a!a!b -> outlet=a/x!b)', async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#a/x!a!a!b');
            router = new MetaRouter(config, provider);
            await router.initialize();
            await provider.eventListenerFacadeMocks[EVENT_HASHCHANGE].simulatePlainEvent(location.origin);
            expect(provider.locationHistoryFacadeMocks.getTruncatedHash()).toBe('a/x!b');
        });

        it('should throw error if no valid route is entered (outlet=c/x!d -> exception)', async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#c/x!d');
            router = new MetaRouter(config, provider);
            let rejected = false;
            await router.initialize().catch(() => (rejected = true));
            expect(rejected).toBeTruthy();
        });

        it('should throw error if first route in the url is invalid (outlet=c/x!a!a!b -> exception)', async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#c/x!a!a!b');
            router = new MetaRouter(config, provider);
            let rejected = false;
            await router.initialize().catch(() => (rejected = true));
            expect(rejected).toBeTruthy();
        });

        it('should return error if outlet name is invalid (outlet= -> exception)', async () => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#invalid=a');
            router = new MetaRouter(config, provider);
            let rejected = false;
            await router.initialize().catch(() => (rejected = true));
            expect(rejected).toBeTruthy();
        });
    });

    describe('broadcast', () => {
        beforeEach(() => {
            provider = new ControllerServiceProviderMock('http://localhost:8080/#b!a/x');
            router = new MetaRouter(config, provider);
        });

        it('should broadcast message to all iframes', async () => {
            const dummyData: object = {
                sample: 'msg'
            };

            await router.preload();
            expect(provider.frameFacadeMocks.a.messages.length).toBe(0);
            expect(provider.frameFacadeMocks.b.messages.length).toBe(0);
            spyOn(provider.frameFacadeMocks.a, 'postMessage').and.callThrough();
            spyOn(provider.frameFacadeMocks.b, 'postMessage').and.callThrough();

            await router.broadcast('sampleTag', dummyData, undefined);
            expect(provider.frameFacadeMocks.a.postMessage).toHaveBeenCalled();
            expect(provider.frameFacadeMocks.b.postMessage).toHaveBeenCalled();
            expect(provider.frameFacadeMocks.a.messages.length).toBe(1);
            expect(provider.frameFacadeMocks.b.messages.length).toBe(1);
        });

        it('should broadcast message only to selected recipients', async () => {
            const dummyData: object = {
                sample: 'msg'
            };

            await router.preload();
            expect(provider.frameFacadeMocks.a.messages.length).toBe(0);
            expect(provider.frameFacadeMocks.b.messages.length).toBe(0);
            spyOn(provider.frameFacadeMocks.a, 'postMessage').and.callThrough();
            spyOn(provider.frameFacadeMocks.b, 'postMessage').and.callThrough();

            await router.broadcast('sampleTag', dummyData, ['b']);
            expect(provider.frameFacadeMocks.a.postMessage).not.toHaveBeenCalled();
            expect(provider.frameFacadeMocks.b.postMessage).toHaveBeenCalled();
            expect(provider.frameFacadeMocks.a.messages.length).toBe(0);
            expect(provider.frameFacadeMocks.b.messages.length).toBe(1);
        });
    });
});
