import { EventListenerFacade } from './event-listener-facade';
import { EventListenerNotificationAsync } from './event-listener-notification-async';
import { Destroyable } from './destroyable';
import { IServiceProvider } from './service-provider-interface';
import { IConsoleFacade } from './console-facade-interface';
import { ConsoleFacade } from './console-facade';
import { Level } from './level.enum';

/**
 * Provides facades for browser services
 */
export class ServiceProvider implements IServiceProvider {
    /**
     * Creates new instance of HistoryAI facade
     * @returns
     */
    getConsoleFacade(logLevel: Level, appName: string): IConsoleFacade {
        return new ConsoleFacade(logLevel, appName);
    }

    /**
     * Creates new instance of event listener facade
     * @param event
     * @param notificationHandler
     * @param capture
     * @returns
     */
    getEventListenerFacade<T extends Event>(event: string, notificationHandler: EventListenerNotificationAsync<T>, capture: boolean): Destroyable {
        return new EventListenerFacade<T>(event, notificationHandler, capture);
    }
}
