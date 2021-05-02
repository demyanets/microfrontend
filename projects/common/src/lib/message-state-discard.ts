import { MessageBase } from './message-base';
import { MESSAGE_STATE_DISCARD } from './constants';

/**
 * Discard state in the microfrontend if required
 */
export class MessageStateDiscard extends MessageBase {
    constructor(source: string) {
        super(MESSAGE_STATE_DISCARD, source);
    }
}
