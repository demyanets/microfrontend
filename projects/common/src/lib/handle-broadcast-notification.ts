import { MessageBroadcastMetadata } from './message-broadcast-metadata';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandleBroadcastNotification = (metadata: MessageBroadcastMetadata, data: any) => void;
