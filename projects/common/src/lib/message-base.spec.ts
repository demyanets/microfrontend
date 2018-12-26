import { MessageBase } from './message-base';

class MessageBaseTest extends MessageBase {
    constructor(readonly message: string, readonly source: string) {
        super(message, source);
    }
}

describe('MessageBase', () => {
    it('should create new object', () => {
        const message = new MessageBaseTest('a', 'b');
        expect(message).toBeDefined();
    });

    it('should throw if message is empty', () => {
        expect(() => new MessageBaseTest('', 'b')).toThrow();
    });

    it('should succeed if source is empty', () => {
        const message = new MessageBaseTest('a', '');
        expect(message).toBeDefined();
    });
});
