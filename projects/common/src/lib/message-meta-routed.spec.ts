import { MessageMetaRouted } from './message-meta-routed';
import { MESSAGE_META_ROUTED } from './constants';

describe('MessageSubroute', () => {
    let message: MessageMetaRouted;
    const source: string = 'source';

    it('should create message subrouted object', () => {
        message = new MessageMetaRouted(source, true, 'x');
        expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_META_ROUTED', () => {
        message = new MessageMetaRouted(source, true, 'x');
        expect(message.message).toBe(MESSAGE_META_ROUTED);
    });

    it('should set activated correctly', () => {
        message = new MessageMetaRouted(source, true);
        expect(message.activated).toBeTruthy();
    });

    it('should set route correctly', () => {
        message = new MessageMetaRouted(source, true, 'x');
        expect(message.subRoute).toBe('x');
    });

    it('should not break with empty route', () => {
        message = new MessageMetaRouted(source, true, '');
        expect(message.subRoute).toBe('');
    });

    it('should not break with undefinded route', () => {
        message = new MessageMetaRouted(source, true, undefined);
        expect(message.subRoute).toBeUndefined();
    });
});
