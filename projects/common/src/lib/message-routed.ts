import { MessageBase } from './message-base';
import { MESSAGE_ROUTED } from './constants';

/**
 * Meta router routed message
 */
export class MessageRouted extends MessageBase {
    constructor(source: string, readonly subRoute: string) {
        super(MESSAGE_ROUTED, source);
    }
}
