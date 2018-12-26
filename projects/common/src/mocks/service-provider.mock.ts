import { EventListenerNotificationAsync } from '../lib/event-listener-notification-async';
import { EventListenerFacadeMock } from './event-listener-facade.mock';
import { Destroyable } from '../lib/destroyable';
import { IServiceProvider } from '../lib/service-provider-interface';
import { IConsoleFacade } from '../lib/console-facade-interface';
import { IMap } from '../lib/map';
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
