import { Destroyable } from './destroyable';
import { EventListenerNotificationAsync } from './event-listener-notification-async';

/**
 * EventListenerFacade
 */
export class EventListenerFacade<T extends Event> extends Destroyable {
    /** Event context required for destruction */
    // tslint:disable no-any
    private eventContext: any;

    constructor(private event: string, private notificationHandler: EventListenerNotificationAsync<T>, capture: boolean) {
        super();

        this.eventContext = this.handleEvent.bind(this);

        // tslint:disable no-unsafe-any
        window.addEventListener(this.event, this.eventContext, capture);
    }

    /**
     * Handles incoming event
     */
    private async handleEvent(event: T): Promise<void> {
        this.preventUsageUponDestruction();
        return this.notificationHandler(event);
    }

    /**
     * Destroys object
     */
    destroy(): void {
        super.destroy();

        // tslint:disable no-unsafe-any
        window.removeEventListener(this.event, this.eventContext);
    }
}
