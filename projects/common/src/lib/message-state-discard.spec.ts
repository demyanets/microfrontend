import { MessageStateDiscard } from './message-state-discard';
import { MESSAGE_STATE_DISCARD } from './constants';

describe('MessageStateChanged', async () => {
    let message: MessageStateDiscard;

    it('should create message routed object', async () => {
        message = new MessageStateDiscard('source', 'a');
        await expect(message).toBeDefined();
    });

    it('should set message to MESSAGE_ROUTED', async () => {
        message = new MessageStateDiscard('source', 'a');
        await expect(message.message).toBe(MESSAGE_STATE_DISCARD);
    });

    it('should set metaRoute correctly', async () => {
        message = new MessageStateDiscard('source', 'a');
        await expect(message.source).toBe('source');
        await expect(message.metaRoute).toBe('a');
    });

    it('should set subRoute correctly', async () => {
        message = new MessageStateDiscard('source', 'a', 'x');
        await expect(message.subRoute).toBeDefined();
        await expect(message.subRoute).toBe('x');
    });
});
