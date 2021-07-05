import { MessageBase } from './message-base';
import {MESSAGE_MICROFRONTEND_LOADED} from './constants';

/**
 * Microfrontend loaded message
 */
export class MessageMicrofrontendLoaded extends MessageBase {
    constructor(source: string, readonly metaRoute: string) {
        super(MESSAGE_MICROFRONTEND_LOADED, source);
    }
}
