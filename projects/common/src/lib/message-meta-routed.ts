import { MessageBase } from './message-base';
import { MESSAGE_META_ROUTED } from './constants';

/**
 * Meta router  meta roted message
 */
export class MessageMetaRouted extends MessageBase {
    constructor(source: string, readonly activated: boolean, readonly subRoute?: string) {
        super(MESSAGE_META_ROUTED, source);
    }
}
