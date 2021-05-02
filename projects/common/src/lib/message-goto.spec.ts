import { MessageGoto } from './message-goto';
import { MESSAGE_GOTO } from './constants';

describe('MessageGoto', async () => {
    let message: MessageGoto;
    let source: string = 'source';

    it('should create message notification object', async () => {
        message = new MessageGoto(source, 'a', 'x');
        await expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_GOTO', async () => {
        message = new MessageGoto(source, 'a');
        await expect(message.message).toBe(MESSAGE_GOTO);
    });

    it('should set metaRoute correctly', async () => {
        message = new MessageGoto(source, 'a');
        await expect(message.metaRoute).toBe('a');
    });

    it('should set subRoute correctly', async () => {
        message = new MessageGoto(source, 'a', 'x');
        await expect(message.subRoute).toBe('x');
    });

    it('should break with empty metaRoute', async () => {
        await expect(() => new MessageGoto(source, '')).toThrow();
    });

    it('should not break without subRoute', async () => {
        message = new MessageGoto(source, 'a');
        await expect(message.subRoute).toBeUndefined();
    });
});
