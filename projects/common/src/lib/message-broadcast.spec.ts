import { MessageBroadcast } from './message-broadcast';
import { MESSAGE_BROADCAST } from './constants';
import { MessageBroadcastMetadata } from './message-broadcast-metadata';

describe('MessageBroadcast', async () => {
    let message: MessageBroadcast;
    let metadata: MessageBroadcastMetadata;

    beforeEach(() => {
        metadata = new MessageBroadcastMetadata('tag', 'origin', ['recipient']);
    });

    it('should create new object', async () => {
        message = new MessageBroadcast(metadata, {});
        await expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_BROADCAST', async () => {
        message = new MessageBroadcast(metadata, {});
        await expect(message.message).toBe(MESSAGE_BROADCAST);
    });

    it('should set metadata correctly', async () => {
        message = new MessageBroadcast(metadata, {});
        await expect(message.metadata).toBe(metadata);
    });

    it('should set data correctly', async () => {
        const dummyData: object = {
            sample: 'msg'
        };
        message = new MessageBroadcast(metadata, dummyData);
        await expect(message.data).toBe(dummyData);
    });
});
