import { MessageSetFrameStyles } from './message-set-frame-styles';
import { MESSAGE_SET_FRAME_STYLES, STYLE_NAME_HEIGHT } from './constants';

describe('MessageSetFrameStyles', async () => {
    let message: MessageSetFrameStyles;
    const source: string = 'source';

    it('should create message object', async () => {
        message = new MessageSetFrameStyles(source, {});
        await expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_SET_FRAME_STYLES', async () => {
        message = new MessageSetFrameStyles(source, { height: '100px' });
        await expect(message.message).toBe(MESSAGE_SET_FRAME_STYLES);
    });

    it('should set metaRoute correctly', async () => {
        message = new MessageSetFrameStyles(source, { height: '100px' });
        await expect(message.source).toBe(source);
    });

    it('should set height correctly', async () => {
        message = new MessageSetFrameStyles(source, { height: '100px' });
        await expect(message.styles[STYLE_NAME_HEIGHT]).toBe('100px');
    });

    it('should forbid changing display style', async () => {
        await expect(() => new MessageSetFrameStyles(source, { display: 'none' })).toThrowError();
    });
});
