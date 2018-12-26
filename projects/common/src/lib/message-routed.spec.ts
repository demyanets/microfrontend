import { MessageRouted } from './message-routed';
import { MESSAGE_ROUTED } from './constants';

describe('MessageRouted', () => {
    let message: MessageRouted;

    it('should create message routed object', () => {
        message = new MessageRouted('a', 'b');
        expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_ROUTED', () => {
        message = new MessageRouted('a', 'b');
        expect(message.message).toBe(MESSAGE_ROUTED);
    });

    it('should set metaRoute correctly', () => {
        message = new MessageRouted('a', 'b');
        expect(message.source).toBe('a');
    });

    it('should set subRoute correctly', () => {
        message = new MessageRouted('a', 'b');
        expect(message.subRoute).toBe('b');
    });

    it('should not break with empty subRoute', () => {
        message = new MessageRouted('a', '');
        expect(message.source).toBe('a');
        expect(message.subRoute).toBe('');
    });
});
