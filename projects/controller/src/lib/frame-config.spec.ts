import { ATTRIBUTE_NAME_CUSTOM_CONFIG, STYLE_NAME_HEIGHT, IMap } from '@microfrontend/common';
import { ATTRIBUTE_NAME_ID, ATTRIBUTE_NAME_SRC, ATTRIBUTE_NAME_STYLE } from './constants';
import { FrameConfig } from './frame-config';

describe('FrameConfig', () => {
    let frameConfig: FrameConfig;

    it('should create frame config object', () => {
        frameConfig = new FrameConfig({}, {}, {}, '$');
        expect(frameConfig).toBeTruthy();
    });

    it('should set custom correctly', () => {
        frameConfig = new FrameConfig({ test: 'config' }, {}, {}, '$');
        expect(frameConfig.custom).toBeDefined();
        expect(frameConfig.custom.test).toBe('config');
    });

    it('should set hashPrefix correctly', () => {
        frameConfig = new FrameConfig({}, {}, {}, '$');
        expect(frameConfig.hashPrefix).toBe('$');
    });

    it('should set hashPrefix to default if no hashPrefix is passed', () => {
        frameConfig = new FrameConfig({}, {}, {}, undefined);
        expect(frameConfig.hashPrefix).toBe('/');
    });

    it('should set height style correctly', () => {
        frameConfig = new FrameConfig({}, { height: '100px' });
        expect(frameConfig.styles[STYLE_NAME_HEIGHT]).toBe('100px');
    });

    it('should forbid changing display style', () => {
        expect(() => new FrameConfig({}, { display: 'none' })).toThrowError();
    });

    it('should set class attribute correctly', () => {
        frameConfig = new FrameConfig({}, {}, { class: 'class-name' });
        expect(frameConfig.attributes['class']).toBe('class-name');
    });

    it('should forbid changing reserved attributes style', () => {
        const style: IMap<string> = {};
        style[ATTRIBUTE_NAME_STYLE] = 'test';
        expect(() => new FrameConfig({}, {}, style)).toThrowError();

        const src: IMap<string> = {};
        src[ATTRIBUTE_NAME_SRC] = 'test';
        expect(() => new FrameConfig({}, {}, src)).toThrowError();

        const id: IMap<string> = {};
        id[ATTRIBUTE_NAME_ID] = 'test';
        expect(() => new FrameConfig({}, {}, id)).toThrowError();

        const config: IMap<string> = {};
        config[ATTRIBUTE_NAME_CUSTOM_CONFIG] = 'test';
        expect(() => new FrameConfig({}, {}, config)).toThrowError();
    });
});
