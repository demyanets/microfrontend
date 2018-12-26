import { MessageBase } from './message-base';

export type MessageHandlerAsync<T extends MessageBase> = (msg: T) => Promise<void>;
