import { Destroyable } from './destroyable';
import { EventListenerNotificationAsync } from './event-listener-notification-async';

/**
 * EventListenerFacade
 */
export class EventListenerFacade<T extends Event> extends Destroyable {
    /** Event context required for destruction */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private eventContext: any;

    constructor(private event: string, private notificationHandler: EventListenerNotificationAsync<T>, capture: boolean) {
        super();

        this.eventContext = this.handleEvent.bind(this);

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

        window.removeEventListener(this.event, this.eventContext);
    }
}
