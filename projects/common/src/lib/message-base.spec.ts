import { MessageBase } from './message-base';

class MessageBaseTest extends MessageBase {
    constructor(readonly message: string, readonly source: string) {
        super(message, source);
    }
}

describe('MessageBase', async () => {
    it('should create new object', async () => {
        const message = new MessageBaseTest('a', 'b');
        await expect(message).toBeDefined();
    });

    it('should throw if message is empty', async () => {
        await expect(() => new MessageBaseTest('', 'b')).toThrow();
    });

    it('should succeed if source is empty', async () => {
        const message = new MessageBaseTest('a', '');
        await expect(message).toBeDefined();
    });
});
