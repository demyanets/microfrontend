import { MessageBase } from './message-base';
import { MESSAGE_GOTO } from './constants';

/**
 * Meta router notification message
 */
export class MessageGoto extends MessageBase {
    constructor(source: string, readonly metaRoute: string, readonly subRoute?: string) {
        super(MESSAGE_GOTO, source);

        if (metaRoute === '') {
            throw new Error('metaRoute is empty');
        }
    }
}
