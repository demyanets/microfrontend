import { MESSAGE_GET_CUSTOM_FRAME_CONFIG } from './constants';
import { MessageGetCustomFrameConfiguration } from './message-get-custom-frame-configuration';

describe('MessageGetCustomFrameConfiguration', () => {
    let message: MessageGetCustomFrameConfiguration;
    const source: string = 'source';

    it('should create message object', () => {
        message = new MessageGetCustomFrameConfiguration(source, {});
        expect(message).toBeTruthy();
    });

    it('should set message to MESSAGE_GET_CUSTOM_FRAME_CONFIG', () => {
        message = new MessageGetCustomFrameConfiguration(source, {});
        expect(message.message).toBe(MESSAGE_GET_CUSTOM_FRAME_CONFIG);
    });

    it('should set metaRoute correctly', () => {
        message = new MessageGetCustomFrameConfiguration(source, { test: 'test' });
        expect(message.source).toBe(source);
    });

    it('should set configuration correctly', () => {
        message = new MessageGetCustomFrameConfiguration(source, { test: 'test' });
        expect(message.configuration['test']).toBe('test');
    });
});
