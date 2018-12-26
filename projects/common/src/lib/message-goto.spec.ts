import { MessageGoto } from './message-goto';
import { MESSAGE_GOTO } from './constants';

describe('MessageGoto', () => {
    let message: MessageGoto;
    let source: string = 'source';

    it('should create message notification object', () => {
        message = new MessageGoto(source, 'a', 'x');
        expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_GOTO', () => {
        message = new MessageGoto(source, 'a');
        expect(message.message).toBe(MESSAGE_GOTO);
    });

    it('should set metaRoute correctly', () => {
        message = new MessageGoto(source, 'a');
        expect(message.metaRoute).toBe('a');
    });

    it('should set subRoute correctly', () => {
        message = new MessageGoto(source, 'a', 'x');
        expect(message.subRoute).toBe('x');
    });

    it('should break with empty metaRoute', () => {
        expect(() => new MessageGoto(source, '')).toThrow();
    });

    it('should not break without subRoute', () => {
        message = new MessageGoto(source, 'a');
        expect(message.subRoute).toBeUndefined();
    });
});
