import { MESSAGE_GET_CUSTOM_FRAME_CONFIG } from './constants';
import { MessageGetCustomFrameConfiguration } from './message-get-custom-frame-configuration';

describe('MessageGetCustomFrameConfiguration', async () => {
    let message: MessageGetCustomFrameConfiguration;
    const source: string = 'source';

    it('should create message object', async () => {
        message = new MessageGetCustomFrameConfiguration(source, {});
        await expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_GET_CUSTOM_FRAME_CONFIG', async () => {
        message = new MessageGetCustomFrameConfiguration(source, {});
        await expect(message.message).toBe(MESSAGE_GET_CUSTOM_FRAME_CONFIG);
    });

    it('should set metaRoute correctly', async () => {
        message = new MessageGetCustomFrameConfiguration(source, { test: 'test' });
        await expect(message.source).toBe(source);
    });

    it('should set configuration correctly', async () => {
        message = new MessageGetCustomFrameConfiguration(source, { test: 'test' });
        await expect(message.configuration['test']).toBe('test');
    });
});
