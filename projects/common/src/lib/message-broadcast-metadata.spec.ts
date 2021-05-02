import { MessageBroadcastMetadata } from './message-broadcast-metadata';

describe('MessageBroadcastMetadata', async () => {
    let metadata: MessageBroadcastMetadata;

    it('should create new object', async () => {
        metadata = new MessageBroadcastMetadata('tag', 'source', ['recipient']);
        await expect(metadata).toBeTruthy();
    });

    it('should set tag correctly', async () => {
        metadata = new MessageBroadcastMetadata('tag', 'source', ['recipient']);
        await expect(metadata.tag).toBe('tag');
    });

    it('should set source correctly', async () => {
        metadata = new MessageBroadcastMetadata('tag', 'source', ['recipient']);
        await expect(metadata.source).toBe('source');
    });

    it('should set default recipients to undefined', async () => {
        metadata = new MessageBroadcastMetadata('tag', 'source', undefined);
        await expect(metadata.recipients).toBeUndefined();
    });

    it('should set recipients correctly', async () => {
        metadata = new MessageBroadcastMetadata('tag', 'source', ['recipient']);
        await expect(metadata.recipients).toBeDefined();
        if (metadata.recipients) {
            await expect(metadata.recipients.length).toBe(1);
            await expect(metadata.recipients[0]).toBe('recipient');
        }
    });

    it('should not break with empty tag, empty origin and undefined recipients', async () => {
        metadata = new MessageBroadcastMetadata('', '', undefined);
        await expect(metadata.tag).toBe('');
        await expect(metadata.source).toEqual('');
        await expect(metadata.recipients).toBeUndefined();
    });
});
