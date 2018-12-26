import { MessageBase } from './message-base';
import { MESSAGE_GET_CUSTOM_FRAME_CONFIG } from './constants';
import { IMap } from './map';

/**
 * Meta router set height message
 */
export class MessageGetCustomFrameConfiguration extends MessageBase {
    constructor(source: string, readonly configuration: IMap<string>) {
        super(MESSAGE_GET_CUSTOM_FRAME_CONFIG, source);
    }
}
