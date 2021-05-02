import { MessageBase } from './message-base';
import { MESSAGE_STATE_CHANGED } from './constants';

/**
 * Notify shell about the state change in the microfrontend
 */
export class MessageStateChanged extends MessageBase {
    constructor(source: string, readonly hasState: boolean) {
        super(MESSAGE_STATE_CHANGED, source);
    }
}
