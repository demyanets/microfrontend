import { AppRoute } from './app-route';

describe('AppRoute', async () => {
    it('constructor without subroute', async () => {
        const route = new AppRoute('a');
        await expect(route.url).toBe('a');
        await expect(route.metaRoute).toBe('a');
        await expect(route.subRoute).toBeFalsy();
    });

    it('constructor with empty subroute', async () => {
        const route = new AppRoute('a', '');
        await expect(route.url).toBe('a');
        await expect(route.metaRoute).toBe('a');
        await expect(route.subRoute).toBeFalsy();
    });

    it('constructor with "/"-only subroute', async () => {
        const route = new AppRoute('a', '/');
        await expect(route.url).toBe('a');
        await expect(route.metaRoute).toBe('a');
        await expect(route.subRoute).toBeFalsy();
    });

    it('constructor with subroute', async () => {
        const route = new AppRoute('a', 'b');
        await expect(route.url).toBe('a/b');
        await expect(route.metaRoute).toBe('a');
        await expect(route.subRoute).toBe('b');
    });

    it('constructor with slash and subroute', async () => {
        const route = new AppRoute('a', '/b');
        await expect(route.url).toBe('a/b');
        await expect(route.metaRoute).toBe('a');
        await expect(route.subRoute).toBe('b');
    });

    it('fromUrl without subroute', async () => {
        const route = AppRoute.fromUrl('a');
        await expect(route.url).toBe('a');
        await expect(route.metaRoute).toBe('a');
        await expect(route.subRoute).toBeFalsy();
    });

    it('fromUrl only with slash after route', async () => {
        const route = AppRoute.fromUrl('a/');
        await expect(route.url).toBe('a');
        await expect(route.metaRoute).toBe('a');
        await expect(route.subRoute).toBeFalsy();
    });

    it('fromUrl with slash and subroute', async () => {
        const route = AppRoute.fromUrl('a/b');
        await expect(route.url).toBe('a/b');
        await expect(route.metaRoute).toBe('a');
        await expect(route.subRoute).toBe('b');
    });
});
