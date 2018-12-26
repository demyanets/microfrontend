import { MessageBase } from './message-base';
import { MESSAGE_SET_FRAME_STYLES, STYLE_NAME_DISPLAY } from './constants';
import { IMap } from './map';

/**
 * Meta router set height message
 */
export class MessageSetFrameStyles extends MessageBase {
    constructor(source: string, readonly styles: IMap<string>) {
        super(MESSAGE_SET_FRAME_STYLES, source);

        if (styles.hasOwnProperty(STYLE_NAME_DISPLAY)) {
            throw new Error(`'${STYLE_NAME_DISPLAY}' style is forbidden`);
        }
    }
}
