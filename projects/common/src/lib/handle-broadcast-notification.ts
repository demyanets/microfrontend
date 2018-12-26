// tslint:disable no-any
import { MessageBroadcastMetadata } from './message-broadcast-metadata';

export type HandleBroadcastNotification = (metadata: MessageBroadcastMetadata, data: any) => void;
