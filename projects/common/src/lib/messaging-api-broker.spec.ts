import { ServiceProviderMock } from '../mocks/service-provider.mock';
import { MessagingApiBroker } from './messaging-api-broker';
import { MessageGoto } from './message-goto';
import { MessageRouted } from './message-routed';
import { MessageSetFrameStyles } from './message-set-frame-styles';
import { MessageMetaRouted } from './message-meta-routed';
import { MessageBroadcast } from './message-broadcast';
import { EVENT_MESSAGE } from './constants';
import { EventListenerFacadeMock } from '../mocks/event-listener-facade.mock';
import { MessageGetCustomFrameConfiguration } from './message-get-custom-frame-configuration';
import { MessageStateChanged } from './message-state-changed';
import { MessageStateDiscard } from './message-state-discard';
import { Level } from './level.enum';
import { IConsoleFacade } from './console-facade-interface';
import { ConsoleFacade } from './console-facade';

describe('MessagingApiBroker', async () => {
    let consoleFacade: IConsoleFacade;
    let provider: ServiceProviderMock;
    let broker: MessagingApiBroker;
    let handleRoutedCalled = false;
    let handleSetFrameStylesCalled = false;
    let handleGetFrameConfigCalled = false;
    let handleGotoCalled = false;
    let handleBroadcastCalled = false;
    let handleSubrouteCalled = false;
    let handleStateChangedCalled = false;
    let handleStateDiscardCalled = false;

    function initBroker(withHandlers: boolean): void {
        consoleFacade = new ConsoleFacade(Level.LOG, 'MessagingApiBroker');
        handleRoutedCalled = false;
        handleSetFrameStylesCalled = false;
        handleGotoCalled = false;
        handleBroadcastCalled = false;
        handleSubrouteCalled = false;
        handleGetFrameConfigCalled = false;
        handleStateChangedCalled = false;
        handleStateDiscardCalled = false;
        provider = new ServiceProviderMock('http://localhost:8080/#b!a/x');

        if (withHandlers) {
            broker = new MessagingApiBroker(
                provider,
                consoleFacade,
                [location.origin],
                (data: MessageRouted): Promise<void> => {
                    handleRoutedCalled = true;
                    return Promise.resolve();
                },
                (data: MessageSetFrameStyles): Promise<void> => {
                    handleSetFrameStylesCalled = true;
                    return Promise.resolve();
                },
                (data: MessageGoto): Promise<void> => {
                    handleGotoCalled = true;
                    return Promise.resolve();
                },
                (data: MessageBroadcast): Promise<void> => {
                    handleBroadcastCalled = true;
                    return Promise.resolve();
                },
                (data: MessageMetaRouted): Promise<void> => {
                    handleSubrouteCalled = true;
                    return Promise.resolve();
                },
                (data: MessageGetCustomFrameConfiguration): Promise<void> => {
                    handleGetFrameConfigCalled = true;
                    return Promise.resolve();
                },
                (data: MessageStateChanged): Promise<void> => {
                    handleStateChangedCalled = true;
                    return Promise.resolve();
                },
                (data: MessageStateDiscard): Promise<void> => {
                    handleStateDiscardCalled = true;
                    return Promise.resolve();
                }
            );
        } else {
            broker = new MessagingApiBroker(provider, consoleFacade, [location.origin]);
        }
    }

    it('should return error if message does not contain expected data', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        await eventMock.simulatePlainEvent(location.origin);
    });

    it('should succeed if foreign message was received', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        await eventMock.simulateForeignMessage(location.origin);
    });

    it('should return error if unknown message was received', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        let rejected = false;
        await eventMock.simulateUnknownMessage(location.origin).catch(() => (rejected = true));
        await expect(rejected).toBeTruthy();
    });

    it('should return error if origin is wrong', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        let rejected = false;
        await eventMock.simulateRoutedMessage('a', 'a', 'b', 'http://hacker.com').catch(() => (rejected = true));
        await expect(rejected).toBeTruthy();
    });

    it('should call correct handler to update when sub route message is received', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        const status = await eventMock.simulateSubrouteMessage('http://10.0.0.1', 'a', location.origin);
        await expect(handleSubrouteCalled).toBeTruthy();
    });

    it('should not return error if handler to update sub route is not defined', async () => {
        initBroker(false);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        await eventMock.simulateSubrouteMessage('http://10.0.0.1', 'a', location.origin);
        await expect(handleSubrouteCalled).toBeFalsy();
    });

    it('should call correct handler when broadcast message is received', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        const status = await eventMock.simulateBroadcastMessage('http://10.0.0.1', 'test broadcast', { info: 456 }, undefined, location.origin);
        await expect(handleBroadcastCalled).toBeTruthy();
    });

    it('should not return error if broadcast message handler is not defined', async () => {
        initBroker(false);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        await eventMock.simulateBroadcastMessage('http://10.0.0.1', 'test broadcast', { info: 456 }, undefined, location.origin);
        await expect(handleBroadcastCalled).toBeFalsy();
    });

    it('should call correct handler when goto message is received', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        const status = await eventMock.simulateGotoMessage('http://10.0.0.1', 'b', undefined, location.origin);
        await expect(handleGotoCalled).toBeTruthy();
    });

    it('should not return error if goto message handler is not defined', async () => {
        initBroker(false);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        await eventMock.simulateGotoMessage('http://10.0.0.1', 'b', undefined, location.origin);
        await expect(handleGotoCalled).toBeFalsy();
    });

    it('should call correct handler when set height message is received', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        const status = await eventMock.simulateSetFrameStylesMessage('http://10.0.0.1', { height: '500px' }, location.origin);
        await expect(handleSetFrameStylesCalled).toBeTruthy();
    });

    it('should not return error when set height handler is not defined', async () => {
        initBroker(false);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        await eventMock.simulateSetFrameStylesMessage('http://10.0.0.1', { height: '500px' }, location.origin);
        await expect(handleSetFrameStylesCalled).toBeFalsy();
    });

    it('should call correct handler when get custom frame config is received', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        const status = await eventMock.simulateGetCustomFrameConfigMessage('http://10.0.0.1', { test: 'test' }, location.origin);
        await expect(handleGetFrameConfigCalled).toBeTruthy();
    });

    it('should not return error when get custom frame config handler is not defined', async () => {
        initBroker(false);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        await eventMock.simulateGetCustomFrameConfigMessage('http://10.0.0.1', { test: 'test' }, location.origin);
        await expect(handleGetFrameConfigCalled).toBeFalsy();
    });

    it('should call correct handler when routed message is received', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        const status = await eventMock.simulateRoutedMessage('http://10.0.0.1', 'b', 'y', location.origin);
        await expect(handleRoutedCalled).toBeTruthy();
    });

    it('should not return error when routed handler is not defined', async () => {
        initBroker(false);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        await eventMock.simulateRoutedMessage('http://10.0.0.1', 'b', 'y', location.origin);
        await expect(handleRoutedCalled).toBeFalsy();
    });

    it('should call correct handler when state changed message is received', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        const status = await eventMock.simulateStateChangedMessage('http://10.0.0.1', true, location.origin);
        await expect(handleStateChangedCalled).toBeTruthy();
    });

    it('should not return error if state changed message handler is not defined', async () => {
        initBroker(false);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        await eventMock.simulateStateChangedMessage('http://10.0.0.1', true, location.origin);
        await expect(handleStateChangedCalled).toBeFalsy();
    });

    it('should call correct handler when state discard message is received', async () => {
        initBroker(true);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        const status = await eventMock.simulateStateDiscardMessage('http://10.0.0.1', location.origin);
        await expect(handleStateDiscardCalled).toBeTruthy();
    });

    it('should not return error if state changed discard handler is not defined', async () => {
        initBroker(false);
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        await eventMock.simulateStateDiscardMessage('http://10.0.0.1', location.origin);
        await expect(handleStateDiscardCalled).toBeFalsy();
    });

    it('should destroy messaging api broker on destroy', async () => {
        initBroker(true);
        broker.destroy();
        await expect(broker.isDestroyed).toBeTruthy();
        const eventMock: EventListenerFacadeMock<MessageEvent> = provider.eventListenerFacadeMocks[EVENT_MESSAGE];
        let rejected = false;
        await eventMock.simulateSetFrameStylesMessage('http://10.0.0.1', { height: '500px' }, location.origin).catch(() => (rejected = true));
        await expect(rejected).toBeTruthy();
    });
});
