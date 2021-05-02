import { MessageRouted } from './message-routed';
import { MESSAGE_ROUTED } from './constants';

describe('MessageRouted', async () => {
    let message: MessageRouted;

    it('should create message routed object', async () => {
        message = new MessageRouted('a', 'b');
        await expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_ROUTED', async () => {
        message = new MessageRouted('a', 'b');
        await expect(message.message).toBe(MESSAGE_ROUTED);
    });

    it('should set metaRoute correctly', async () => {
        message = new MessageRouted('a', 'b');
        await expect(message.source).toBe('a');
    });

    it('should set subRoute correctly', async () => {
        message = new MessageRouted('a', 'b');
        await expect(message.subRoute).toBe('b');
    });

    it('should not break with empty subRoute', async () => {
        message = new MessageRouted('a', '');
        await expect(message.source).toBe('a');
        await expect(message.subRoute).toBe('');
    });
});
