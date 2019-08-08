import {
    Destroyable,
    EventListenerNotificationAsync,
    IMap,
    MESSAGE_BROADCAST,
    MESSAGE_GOTO,
    MESSAGE_ROUTED,
    MESSAGE_SET_FRAME_STYLES,
    MESSAGE_META_ROUTED,
    MessageBroadcastMetadata
} from '@microfrontend/common';

export class EventListenerFacadeMock<T extends Event> extends Destroyable {
    constructor(public event: string, public notificationHandler: EventListenerNotificationAsync<T>, capture: boolean) {
        super();
    }

    simulatePlainEvent(origin: string): Promise<void> {
        const e: unknown = {
            origin: origin
        };
        return this.notificationHandler(<T>e);
    }

    simulateSubrouteMessage(source: string, route: string, origin: string): Promise<void> {
        const e: unknown = {
            data: { message: MESSAGE_META_ROUTED, subRoute: route },
            origin: origin
        };
        return this.notificationHandler(<T>e);
    }

    simulateSetFrameStylesMessage(source: string, styles: IMap<string>, origin: string): Promise<void> {
        const e: unknown = {
            data: { message: MESSAGE_SET_FRAME_STYLES, source: source, styles: styles },
            origin: origin
        };
        return this.notificationHandler(<T>e);
    }

    simulateRoutedMessage(source: string, metaRoute: string, subRoute: string, origin: string): Promise<void> {
        const e: unknown = {
            data: { message: MESSAGE_ROUTED, source: source, metaRoute: metaRoute, subRoute: subRoute },
            origin: origin
        };
        return this.notificationHandler(<T>e);
    }

    simulateGotoMessage(source: string, metaRoute: string, subRoute: string | undefined, origin: string): Promise<void> {
        const e: unknown = {
            data: { message: MESSAGE_GOTO, source: source, metaRoute: metaRoute, subRoute: subRoute },
            origin: origin
        };
        return this.notificationHandler(<T>e);
    }
<<<<<<< HEAD
    
    simulateGetCustomFrameConfigMessage(source: string, config: IMap<string>, origin: string): Promise<void> {
        const e: unknown = {
            data: { message: MESSAGE_GET_CUSTOM_FRAME_CONFIG, source: source, configuration: config },
            origin: origin
        };
        return this.notificationHandler(<T>e);
    }
=======
>>>>>>> parent of 0198977... Add unit testing for registerCustomFrameConfig and getParent is false

    simulateBroadcastMessage(source: string, tag: string, data: object, recipients: string[] | undefined, origin: string): Promise<void> {
        const metadata = new MessageBroadcastMetadata(tag, source, recipients);
        const e: unknown = {
            data: { message: MESSAGE_BROADCAST, source: source, metadata: metadata, data: data },
            origin: origin
        };
        return this.notificationHandler(<T>e);
    }

    simulateUnknownMessage(origin: string): Promise<void> {
        const e: unknown = {
            data: { message: 'unknown' },
            origin: origin
        };
        return this.notificationHandler(<T>e);
    }

    simulateForeignMessage(origin: string): Promise<void> {
        const e: unknown = {
            origin: origin
        };
        return this.notificationHandler(<T>e);
    }
}
