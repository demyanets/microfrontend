import { MessageStateChanged } from './message-state-changed';
import { MESSAGE_STATE_CHANGED } from './constants';

describe('MessageStateChanged', async () => {
    let message: MessageStateChanged;

    it('should create message routed object', async () => {
        message = new MessageStateChanged('a', true);
        await expect(message).toBeDefined();
    });

    it('should set message to MESSAGE_ROUTED', async () => {
        message = new MessageStateChanged('a', true);
        await expect(message.message).toBe(MESSAGE_STATE_CHANGED);
    });

    it('should set metaRoute correctly', async () => {
        message = new MessageStateChanged('a', true);
        await expect(message.source).toBe('a');
    });

    it('should set hasState correctly', async () => {
        message = new MessageStateChanged('a', true);
        await expect(message.hasState).toBe(true);
    });

    it('should set subRoute correctly', async () => {
        message = new MessageStateChanged('a', true, 'x');
        await expect(message.subRoute).toBeDefined();
        await expect(message.subRoute).toBe('x');
    });
});
