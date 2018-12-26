import { MessageBase } from './message-base';
import { MESSAGE_BROADCAST } from './constants';
import { MessageBroadcastMetadata } from './message-broadcast-metadata';

/**
 * Meta router broadcast message
 */
export class MessageBroadcast extends MessageBase {
    constructor(readonly metadata: MessageBroadcastMetadata, readonly data: object) {
        super(MESSAGE_BROADCAST, metadata.source);
    }
}
