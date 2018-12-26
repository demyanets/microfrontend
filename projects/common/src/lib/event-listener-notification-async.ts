export type EventListenerNotificationAsync<T extends Event> = (event: T) => Promise<void>;
