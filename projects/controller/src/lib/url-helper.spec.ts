import { IMap } from '@microfrontend/common';
import { UrlHelper } from './url-helper';
import { AppRoute } from './app-route';

describe('UrlHelper', async () => {
    it('removeStartingSlash from "/a"', async () => {
        const result = UrlHelper.removeStartingSlash('/a');
        await expect(result).toBe('a');
    });

    it('removeStartingSlash from "a"', async () => {
        const result = UrlHelper.removeStartingSlash('a');
        await expect(result).toBe('a');
    });

    it('removeStartingSlash from empty', async () => {
        const result = UrlHelper.removeStartingSlash('');
        await expect(result).toBe('');
    });

    it('constructUrl with empty map', async () => {
        const x: IMap<AppRoute[]> = {};
        await expect(() => UrlHelper.constructUrl(x, 'outlet')).toThrow();
    });

    it('constructUrl with missing outlet', async () => {
        const x: IMap<AppRoute[]> = {
            outlet: [AppRoute.fromUrl('x/y/z')]
        };
        await expect(() => UrlHelper.constructUrl(x, 'outlet2')).toThrow();
    });

    it('constructUrl x/y/z', async () => {
        const x: IMap<AppRoute[]> = {
            outlet1: [AppRoute.fromUrl('x/y/z')],
            outlet2: [AppRoute.fromUrl('a/b/c')]
        };
        const result = UrlHelper.constructUrl(x, 'outlet2');
        await expect(result).toBe('outlet2~a/b/c;outlet1~x/y/z');
    });

    it('constructUrl a/b/c!x/y/z', async () => {
        const x: IMap<AppRoute[]> = {
            outlet: [AppRoute.fromUrl('a/b/c'), AppRoute.fromUrl('x/y/z')]
        };
        const result = UrlHelper.constructUrl(x, 'outlet');
        await expect(result).toBe('a/b/c!x/y/z');
    });

    it('constructUrl outlet2~a/b/c;outlet1~a/b/c!x/y/z', async () => {
        const x: IMap<AppRoute[]> = {
            outlet1: [AppRoute.fromUrl('a/b/c'), AppRoute.fromUrl('x/y/z')],
            outlet2: [AppRoute.fromUrl('a/b/c')]
        };
        const result = UrlHelper.constructUrl(x, 'outlet2');
        await expect(result).toBe('outlet2~a/b/c;outlet1~a/b/c!x/y/z');
    });

    it('constructFullUrl with "path" and "x/y/z"', async () => {
        const x: IMap<AppRoute[]> = {
            outlet: [AppRoute.fromUrl('x/y/z')]
        };
        const result = UrlHelper.constructFullUrl('path', x, 'outlet');
        await expect(result).toBe('path#x/y/z');
    });
});
