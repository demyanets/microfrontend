import { ATTRIBUTE_NAME_CUSTOM_CONFIG, IMap, STYLE_NAME_DISPLAY } from '@microfrontend/common';
import { ATTRIBUTE_NAME_ID, ATTRIBUTE_NAME_SRC, ATTRIBUTE_NAME_STYLE } from './constants';

/**
 * Meta router frame custom
 */
export class FrameConfig {
    constructor(
        readonly custom: IMap<string> = {},
        readonly styles: IMap<string> = {},
        readonly attributes: IMap<string> = {},
        readonly hashPrefix: string = '/'
    ) {
        if (styles.hasOwnProperty(STYLE_NAME_DISPLAY)) {
            throw new Error(`'${STYLE_NAME_DISPLAY}' style is forbidden`);
        }

        if (attributes.hasOwnProperty(ATTRIBUTE_NAME_STYLE)) {
            throw new Error(`'${ATTRIBUTE_NAME_STYLE}' attribute is forbidden`);
        }

        if (attributes.hasOwnProperty(ATTRIBUTE_NAME_SRC)) {
            throw new Error(`'${ATTRIBUTE_NAME_SRC}' attribute is forbidden`);
        }

        if (attributes.hasOwnProperty(ATTRIBUTE_NAME_ID)) {
            throw new Error(`'${ATTRIBUTE_NAME_ID}' attribute is forbidden`);
        }

        if (attributes.hasOwnProperty(ATTRIBUTE_NAME_CUSTOM_CONFIG)) {
            throw new Error(`'${ATTRIBUTE_NAME_CUSTOM_CONFIG}' attribute is forbidden`);
        }
    }
}
