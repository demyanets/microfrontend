import { MessageSetFrameStyles } from './message-set-frame-styles';
import { MESSAGE_SET_FRAME_STYLES, STYLE_NAME_HEIGHT } from './constants';

describe('MessageSetFrameStyles', () => {
    let message: MessageSetFrameStyles;
    const source: string = 'source';

    it('should create message object', () => {
        message = new MessageSetFrameStyles(source, {});
        expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_SET_FRAME_STYLES', () => {
        message = new MessageSetFrameStyles(source, { height: '100px' });
        expect(message.message).toBe(MESSAGE_SET_FRAME_STYLES);
    });

    it('should set metaRoute correctly', () => {
        message = new MessageSetFrameStyles(source, { height: '100px' });
        expect(message.source).toBe(source);
    });

    it('should set height correctly', () => {
        message = new MessageSetFrameStyles(source, { height: '100px' });
        expect(message.styles[STYLE_NAME_HEIGHT]).toBe('100px');
    });

    it('should forbid changing display style', () => {
        expect(() => new MessageSetFrameStyles(source, { display: 'none' })).toThrowError();
    });
});
