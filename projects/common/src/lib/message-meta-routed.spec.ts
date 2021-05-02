import { MessageMetaRouted } from './message-meta-routed';
import { MESSAGE_META_ROUTED } from './constants';

describe('MessageSubroute', async () => {
    let message: MessageMetaRouted;
    const source: string = 'source';

    it('should create message subrouted object', async () => {
        message = new MessageMetaRouted(source, true, 'x');
        await expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_META_ROUTED', async () => {
        message = new MessageMetaRouted(source, true, 'x');
        await expect(message.message).toBe(MESSAGE_META_ROUTED);
    });

    it('should set activated correctly', async () => {
        message = new MessageMetaRouted(source, true);
        await expect(message.activated).toBeTruthy();
    });

    it('should set route correctly', async () => {
        message = new MessageMetaRouted(source, true, 'x');
        await expect(message.subRoute).toBe('x');
    });

    it('should not break with empty route', async () => {
        message = new MessageMetaRouted(source, true, '');
        await expect(message.subRoute).toBe('');
    });

    it('should not break with undefinded route', async () => {
        message = new MessageMetaRouted(source, true, undefined);
        await expect(message.subRoute).toBeUndefined();
    });
});
