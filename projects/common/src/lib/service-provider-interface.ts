import { Destroyable } from './destroyable';
import { EventListenerNotificationAsync } from './event-listener-notification-async';
import { IConsoleFacade } from './console-facade-interface';

export interface IServiceProvider {
    getConsoleFacade(): IConsoleFacade;
    getEventListenerFacade<T extends Event>(event: string, notificationHandler: EventListenerNotificationAsync<T>, capture: boolean): Destroyable;
}
