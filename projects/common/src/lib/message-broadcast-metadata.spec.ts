import { MessageBroadcastMetadata } from './message-broadcast-metadata';

describe('MessageBroadcastMetadata', () => {
    let metadata: MessageBroadcastMetadata;

    it('should create new object', () => {
        metadata = new MessageBroadcastMetadata('tag', 'source', ['recipient']);
        expect(metadata).toBeTruthy();
    });

    it('should set tag correctly', () => {
        metadata = new MessageBroadcastMetadata('tag', 'source', ['recipient']);
        expect(metadata.tag).toBe('tag');
    });

    it('should set source correctly', () => {
        metadata = new MessageBroadcastMetadata('tag', 'source', ['recipient']);
        expect(metadata.source).toBe('source');
    });

    it('should set default recipients to undefined', () => {
        metadata = new MessageBroadcastMetadata('tag', 'source', undefined);
        expect(metadata.recipients).toBeUndefined();
    });

    it('should set recipients correctly', () => {
        metadata = new MessageBroadcastMetadata('tag', 'source', ['recipient']);
        expect(metadata.recipients).toBeDefined();
        if (metadata.recipients) {
            expect(metadata.recipients.length).toBe(1);
            expect(metadata.recipients[0]).toBe('recipient');
        }
    });

    it('should not break with empty tag, empty origin and undefined recipients', () => {
        metadata = new MessageBroadcastMetadata('', '', undefined);
        expect(metadata.tag).toBe('');
        expect(metadata.source).toEqual('');
        expect(metadata.recipients).toBeUndefined();
    });
});
