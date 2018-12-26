import { MessageBroadcast } from './message-broadcast';
import { MESSAGE_BROADCAST } from './constants';
import { MessageBroadcastMetadata } from './message-broadcast-metadata';

describe('MessageBroadcast', () => {
    let message: MessageBroadcast;
    let metadata: MessageBroadcastMetadata;

    beforeEach(() => {
        metadata = new MessageBroadcastMetadata('tag', 'origin', ['recipient']);
    });

    it('should create new object', () => {
        message = new MessageBroadcast(metadata, {});
        expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_BROADCAST', () => {
        message = new MessageBroadcast(metadata, {});
        expect(message.message).toBe(MESSAGE_BROADCAST);
    });

    it('should set metadata correctly', () => {
        message = new MessageBroadcast(metadata, {});
        expect(message.metadata).toBe(metadata);
    });

    it('should set data correctly', () => {
        const dummyData: object = {
            sample: 'msg'
        };
        message = new MessageBroadcast(metadata, dummyData);
        expect(message.data).toBe(dummyData);
    });
});
