import { MessageBase } from './message-base';
import { MESSAGE_STATE_CHANGED } from './constants';

/**
 * Meta router routed message
 */
export class MessageStateChanged extends MessageBase {
    constructor(source: string, readonly hasState: boolean) {
        super(MESSAGE_STATE_CHANGED, source);
    }
}
