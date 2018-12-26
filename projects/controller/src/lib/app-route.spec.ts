import { AppRoute } from './app-route';

describe('AppRoute', () => {
    it('constructor without subroute', () => {
        const route = new AppRoute('a');
        expect(route.url).toBe('a');
        expect(route.metaRoute).toBe('a');
        expect(route.subRoute).toBeFalsy();
    });

    it('constructor with empty subroute', () => {
        const route = new AppRoute('a', '');
        expect(route.url).toBe('a');
        expect(route.metaRoute).toBe('a');
        expect(route.subRoute).toBeFalsy();
    });

    it('constructor with "/"-only subroute', () => {
        const route = new AppRoute('a', '/');
        expect(route.url).toBe('a');
        expect(route.metaRoute).toBe('a');
        expect(route.subRoute).toBeFalsy();
    });

    it('constructor with subroute', () => {
        const route = new AppRoute('a', 'b');
        expect(route.url).toBe('a/b');
        expect(route.metaRoute).toBe('a');
        expect(route.subRoute).toBe('b');
    });

    it('constructor with slash and subroute', () => {
        const route = new AppRoute('a', '/b');
        expect(route.url).toBe('a/b');
        expect(route.metaRoute).toBe('a');
        expect(route.subRoute).toBe('b');
    });

    it('fromUrl without subroute', () => {
        const route = AppRoute.fromUrl('a');
        expect(route.url).toBe('a');
        expect(route.metaRoute).toBe('a');
        expect(route.subRoute).toBeFalsy();
    });

    it('fromUrl only with slash after route', () => {
        const route = AppRoute.fromUrl('a/');
        expect(route.url).toBe('a');
        expect(route.metaRoute).toBe('a');
        expect(route.subRoute).toBeFalsy();
    });

    it('fromUrl with slash and subroute', () => {
        const route = AppRoute.fromUrl('a/b');
        expect(route.url).toBe('a/b');
        expect(route.metaRoute).toBe('a');
        expect(route.subRoute).toBe('b');
    });
});
