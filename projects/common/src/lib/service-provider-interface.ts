import { Level } from './level.enum';
import { Destroyable } from './destroyable';
import { EventListenerNotificationAsync } from './event-listener-notification-async';
import { IConsoleFacade } from './console-facade-interface';

export interface IServiceProvider {
    /**
     * Creates new instance of HistoryAI facade
     * @returns
     */
    getConsoleFacade(logLevel: Level, appName: string): IConsoleFacade;

    /**
     * Creates new instance of event listener facade
     * @param event
     * @param notificationHandler
     * @param capture
     * @returns
     */
    getEventListenerFacade<T extends Event>(event: string, notificationHandler: EventListenerNotificationAsync<T>, capture: boolean): Destroyable;
}
