import { IMap } from '@microfrontend/common';
import { UrlHelper } from './url-helper';
import { AppRoute } from './app-route';

describe('UrlHelper', () => {
    it('removeStartingSlash from "/a"', () => {
        const result = UrlHelper.removeStartingSlash('/a');
        expect(result).toBe('a');
    });

    it('removeStartingSlash from "a"', () => {
        const result = UrlHelper.removeStartingSlash('a');
        expect(result).toBe('a');
    });

    it('removeStartingSlash from empty', () => {
        const result = UrlHelper.removeStartingSlash('');
        expect(result).toBe('');
    });

    it('constructUrl with empty map', () => {
        const x: IMap<AppRoute[]> = {};
        expect(() => UrlHelper.constructUrl(x, 'outlet')).toThrow();
    });

    it('constructUrl with missing outlet', () => {
        const x: IMap<AppRoute[]> = {
            outlet: [AppRoute.fromUrl('x/y/z')]
        };
        expect(() => UrlHelper.constructUrl(x, 'outlet2')).toThrow();
    });

    it('constructUrl x/y/z', () => {
        const x: IMap<AppRoute[]> = {
            outlet1: [AppRoute.fromUrl('x/y/z')],
            outlet2: [AppRoute.fromUrl('a/b/c')]
        };
        const result = UrlHelper.constructUrl(x, 'outlet2');
        expect(result).toBe('outlet2=a/b/c;outlet1=x/y/z');
    });

    it('constructUrl a/b/c!x/y/z', () => {
        const x: IMap<AppRoute[]> = {
            outlet: [AppRoute.fromUrl('a/b/c'), AppRoute.fromUrl('x/y/z')]
        };
        const result = UrlHelper.constructUrl(x, 'outlet');
        expect(result).toBe('a/b/c!x/y/z');
    });

    it('constructUrl outlet2=a/b/c;outlet1=a/b/c!x/y/z', () => {
        const x: IMap<AppRoute[]> = {
            outlet1: [AppRoute.fromUrl('a/b/c'), AppRoute.fromUrl('x/y/z')],
            outlet2: [AppRoute.fromUrl('a/b/c')]
        };
        const result = UrlHelper.constructUrl(x, 'outlet2');
        expect(result).toBe('outlet2=a/b/c;outlet1=a/b/c!x/y/z');
    });

    it('constructFullUrl with "path" and "x/y/z"', () => {
        const x: IMap<AppRoute[]> = {
            outlet: [AppRoute.fromUrl('x/y/z')]
        };
        const result = UrlHelper.constructFullUrl('path', x, 'outlet');
        expect(result).toBe('path#x/y/z');
    });
});
