import {
    EVENT_MESSAGE,
    MESSAGE_BROADCAST,
    MESSAGE_GET_CUSTOM_FRAME_CONFIG,
    MESSAGE_GOTO,
    MESSAGE_ROUTED,
    MESSAGE_SET_FRAME_STYLES,
    MESSAGE_META_ROUTED,
    MESSAGE_STATE_CHANGED,
    MESSAGE_STATE_DISCARD
} from './constants';
import { Destroyable } from './destroyable';
import { MessageHandlerAsync } from './messaging-api-handler-async';
import { MessageSetFrameStyles } from './message-set-frame-styles';
import { MessageBroadcast } from './message-broadcast';
import { MessageRouted } from './message-routed';
import { MessageBase } from './message-base';
import { MessageGoto } from './message-goto';
import { MessageMetaRouted } from './message-meta-routed';
import { MessageStateChanged } from './message-state-changed';
import { MessageStateDiscard } from './message-state-discard';
import { IServiceProvider } from './service-provider-interface';
import { MessageGetCustomFrameConfiguration } from './message-get-custom-frame-configuration';

/**
 * Message broker (https://en.wikipedia.org/wiki/Message_broker)
 * to translate between MessagingAPI events and app or router.
 */
export class MessagingApiBroker extends Destroyable {
    /** Message listener */
    // tslint:disable no-unused-variable
    private messageListener: Destroyable;

    constructor(
        private readonly serviceProvider: IServiceProvider,
        private readonly allowedOrigins: string[],
        private readonly handleRouted?: MessageHandlerAsync<MessageRouted>,
        private readonly handleSetFrameStyles?: MessageHandlerAsync<MessageSetFrameStyles>,
        private readonly handleGoto?: MessageHandlerAsync<MessageGoto>,
        private readonly handleBroadcast?: MessageHandlerAsync<MessageBroadcast>,
        private readonly handleSubroute?: MessageHandlerAsync<MessageMetaRouted>,
        private readonly handleGetFrameConfig?: MessageHandlerAsync<MessageGetCustomFrameConfiguration>,
        private readonly handleStateChanged?: MessageHandlerAsync<MessageStateChanged>,
        private readonly handleStateDiscard?: MessageHandlerAsync<MessageStateDiscard>
    ) {
        super();

        // tslint:disable no-unsafe-any
        this.messageListener = serviceProvider.getEventListenerFacade<MessageEvent>(EVENT_MESSAGE, this.handleEvent.bind(this), false);
    }

    /**
     * Verifies if origin provided is allowed
     */
    private isAllowed(origin: string): boolean {
        for (const o of this.allowedOrigins) {
            if (o.startsWith(origin)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Handles incoming event
     */
    private handleEvent(event: MessageEvent): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject(new Error('Object has been already destroyed!'));
        }

        if (!event.data || !event.data.message) {
            return Promise.resolve();
        }

        if (!this.isAllowed(event.origin)) {
            return Promise.reject(new Error('Received message from not allowed origin'));
        }

        // tslint:disable no-unsafe-any
        return this.notify(event.data);
    }

    /**
     * Notify about all incoming Messaging API messages
     */
    private notify(data: MessageBase): Promise<void> {
        switch (data.message) {
            case MESSAGE_ROUTED:
                return this.notifyRouted(data);

            case MESSAGE_SET_FRAME_STYLES:
                return this.notifySetFrameStyles(data);

            case MESSAGE_GOTO:
                return this.notifyGoto(data);

            case MESSAGE_BROADCAST:
                return this.notifyBroadcast(data);

            case MESSAGE_META_ROUTED:
                return this.notifySubroute(data);

            case MESSAGE_GET_CUSTOM_FRAME_CONFIG:
                return this.notifyGetCustomFrameConfiguration(data);

            case MESSAGE_STATE_CHANGED:
                return this.notifyStateChanged(data);

            case MESSAGE_STATE_DISCARD:
                return this.notifyStateDiscard(data);

            default:
                return Promise.reject(new Error('Unknown message received'));
        }
    }

    /** Notify about MessageStateChanged */
    private notifyStateChanged(data: MessageBase): Promise<void> {
        if (this.handleStateChanged) {
            return this.handleStateChanged(<MessageStateChanged>data);
        } else {
            return Promise.resolve();
        }
    }

    /** Notify about MessageStateDiscard( */
    private notifyStateDiscard(data: MessageBase): Promise<void> {
        if (this.handleStateDiscard) {
            return this.handleStateDiscard(<MessageStateDiscard>data);
        } else {
            return Promise.resolve();
        }
    }

    /** Notify about MessageSubroute */
    private notifySubroute(data: MessageBase): Promise<void> {
        if (this.handleSubroute) {
            return this.handleSubroute(<MessageMetaRouted>data);
        } else {
            return Promise.resolve();
        }
    }

    /** Notify about MessageBroadcast */
    private notifyBroadcast(data: MessageBase): Promise<void> {
        if (this.handleBroadcast) {
            return this.handleBroadcast(<MessageBroadcast>data);
        } else {
            return Promise.resolve();
        }
    }

    /** Notify about MessageNotification */
    private notifyGoto(data: MessageBase): Promise<void> {
        if (this.handleGoto) {
            return this.handleGoto(<MessageGoto>data);
        } else {
            return Promise.resolve();
        }
    }

    /** Notify about MessageSetHeight */
    private notifySetFrameStyles(data: MessageBase): Promise<void> {
        if (this.handleSetFrameStyles) {
            return this.handleSetFrameStyles(<MessageSetFrameStyles>data);
        } else {
            return Promise.resolve();
        }
    }

    /** Notify about MessageGetCustomFrameConfiguration */
    private notifyGetCustomFrameConfiguration(data: MessageBase): Promise<void> {
        if (this.handleGetFrameConfig) {
            return this.handleGetFrameConfig(<MessageGetCustomFrameConfiguration>data);
        } else {
            return Promise.resolve();
        }
    }

    /** Notify about MessageRouted */
    private notifyRouted(data: MessageBase): Promise<void> {
        if (this.handleRouted) {
            return this.handleRouted(<MessageRouted>data);
        } else {
            return Promise.resolve();
        }
    }

    /**
     * Destroys object
     */
    destroy(): void {
        super.destroy();
        this.messageListener.destroy();
    }
}
