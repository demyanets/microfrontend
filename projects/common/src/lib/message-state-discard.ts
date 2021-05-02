import { MessageBase } from './message-base';
import { MESSAGE_STATE_DISCARD } from './constants';

/**
 * Meta router routed message
 */
export class MessageStateDiscard extends MessageBase {
    constructor(source: string) {
        super(MESSAGE_STATE_DISCARD, source);
    }
}
