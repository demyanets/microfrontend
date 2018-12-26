import { Destroyable, EventListenerNotificationAsync, IConsoleFacade, IMap, IServiceProvider } from '@microfrontend/common';
import { EventListenerFacadeMock } from './event-listener-facade.mock';
import { ConsoleFacadeMock } from './console-facade.mock';

export class ServiceProviderMock implements IServiceProvider {
    eventListenerFacadeMocks: IMap<any> = {};
    consoleFacadeMock: ConsoleFacadeMock;

    constructor(public initialPath: string) {
        this.consoleFacadeMock = new ConsoleFacadeMock();
    }

    getEventListenerFacade<T extends Event>(event: string, notificationHandler: EventListenerNotificationAsync<T>, capture: boolean): Destroyable {
        if (!this.eventListenerFacadeMocks[event]) {
            this.eventListenerFacadeMocks[event] = new EventListenerFacadeMock<T>(event, notificationHandler, capture);
        }
        return <EventListenerFacadeMock<T>>this.eventListenerFacadeMocks[event];
    }

    getConsoleFacade(): IConsoleFacade {
        return this.consoleFacadeMock;
    }
}
