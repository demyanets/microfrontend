import { Destroyable, EventListenerNotificationAsync, IConsoleFacade, IMap } from '@microfrontend/common';
import { EventListenerFacadeMock } from './event-listener-facade.mock';
import { ConsoleFacadeMock } from './console-facade.mock';
import { IParentFacade } from '../lib/parent-facade-interface';
import { ParentFacadeMock } from './parent-facade-mock';
import { IClientServiceProvider } from '../lib/client-service-provider-interface';

export class ClientServiceProviderMock implements IClientServiceProvider {
    eventListenerFacadeMocks: IMap<any> = {};
    consoleFacadeMock: ConsoleFacadeMock;
    parentFacadeMock: ParentFacadeMock;

    constructor(public initialPath: string) {
        this.consoleFacadeMock = new ConsoleFacadeMock();
        this.parentFacadeMock = new ParentFacadeMock();
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

    getParentFacade(): IParentFacade {
        return this.parentFacadeMock;
    }
}
