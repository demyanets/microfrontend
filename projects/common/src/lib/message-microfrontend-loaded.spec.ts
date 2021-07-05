import { MessageMicrofrontendLoaded } from './message-microfrontend-loaded';
import {MESSAGE_MICROFRONTEND_LOADED} from './constants';

describe('MessageSubroute', async () => {
    let message: MessageMicrofrontendLoaded;
    const source: string = 'source';

    it('should create message microfrontend loaded object', async () => {
        message = new MessageMicrofrontendLoaded(source, 'x');
        await expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_MICROFRONTEND_LOADED', async () => {
        message = new MessageMicrofrontendLoaded(source, 'x');
        await expect(message.message).toBe(MESSAGE_MICROFRONTEND_LOADED);
    });

    it('should set route correctly', async () => {
        message = new MessageMicrofrontendLoaded(source, 'x');
        await expect(message.metaRoute).toBe('x');
    });

    it('should not break with empty route', async () => {
        message = new MessageMicrofrontendLoaded(source, '');
        await expect(message.metaRoute).toBe('');
    });
});
