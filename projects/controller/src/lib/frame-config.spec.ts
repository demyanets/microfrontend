import { ATTRIBUTE_NAME_CUSTOM_CONFIG, STYLE_NAME_HEIGHT, IMap } from '@microfrontend/common';
import { ATTRIBUTE_NAME_ID, ATTRIBUTE_NAME_SRC, ATTRIBUTE_NAME_STYLE } from './constants';
import { FrameConfig } from './frame-config';

describe('FrameConfig', async () => {
    let frameConfig: FrameConfig;

    it('should create frame config object', async () => {
        frameConfig = new FrameConfig({}, {}, {}, '$');
        await expect(frameConfig).toBeTruthy();
    });

    it('should set custom correctly', async () => {
        frameConfig = new FrameConfig({ test: 'config' }, {}, {}, '$');
        await expect(frameConfig.custom).toBeDefined();
        await expect(frameConfig.custom.test).toBe('config');
    });

    it('should set hashPrefix correctly', async () => {
        frameConfig = new FrameConfig({}, {}, {}, '$');
        await expect(frameConfig.hashPrefix).toBe('$');
    });

    it('should set hashPrefix to default if no hashPrefix is passed', async () => {
        frameConfig = new FrameConfig({}, {}, {}, undefined);
        await expect(frameConfig.hashPrefix).toBe('/');
    });

    it('should set height style correctly', async () => {
        frameConfig = new FrameConfig({}, { height: '100px' });
        await expect(frameConfig.styles[STYLE_NAME_HEIGHT]).toBe('100px');
    });

    it('should forbid changing display style', async () => {
        await expect(() => new FrameConfig({}, { display: 'none' })).toThrowError();
    });

    it('should set class attribute correctly', async () => {
        frameConfig = new FrameConfig({}, {}, { class: 'class-name' });
        await expect(frameConfig.attributes['class']).toBe('class-name');
    });

    it('should forbid changing reserved attributes style', async () => {
        const style: IMap<string> = {};
        style[ATTRIBUTE_NAME_STYLE] = 'test';
        await expect(() => new FrameConfig({}, {}, style)).toThrowError();

        const src: IMap<string> = {};
        src[ATTRIBUTE_NAME_SRC] = 'test';
        await expect(() => new FrameConfig({}, {}, src)).toThrowError();

        const id: IMap<string> = {};
        id[ATTRIBUTE_NAME_ID] = 'test';
        await expect(() => new FrameConfig({}, {}, id)).toThrowError();

        const config: IMap<string> = {};
        config[ATTRIBUTE_NAME_CUSTOM_CONFIG] = 'test';
        await expect(() => new FrameConfig({}, {}, config)).toThrowError();
    });
});
