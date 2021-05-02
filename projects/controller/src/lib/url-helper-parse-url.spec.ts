import { UrlHelper } from './url-helper';

const DEFAULT_OUTLET = 'outlet';

/* tslint:disable no-string-literal */
/* tslint:disable no-magic-numbers */
describe('UrlHelper / parseUrl', async () => {
    it('parses x/y/z', async () => {
        const url = 'x/y/z';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        await expect(result[DEFAULT_OUTLET].length).toBe(1);
        await expect(result[DEFAULT_OUTLET][0].url).toBe(url);
        await expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('x');
        await expect(result[DEFAULT_OUTLET][0].subRoute).toBe('y/z');
    });

    it('parses x/y/z(a:1//b:2)', async () => {
        const url = 'x/y/z(a:1//b:2)';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        await expect(result[DEFAULT_OUTLET].length).toBe(1);
        await expect(result[DEFAULT_OUTLET][0].url).toBe(url);
        await expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('x');
        await expect(result[DEFAULT_OUTLET][0].subRoute).toBe('y/z(a:1//b:2)');
    });

    it('parses x/y/z;outlet2~a/b/c', async () => {
        const url = 'x/y/z;outlet2~a/b/c';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        await expect(result[DEFAULT_OUTLET].length).toBe(1);
        await expect(result[DEFAULT_OUTLET][0].url).toBe('x/y/z');
        await expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('x');
        await expect(result[DEFAULT_OUTLET][0].subRoute).toBe('y/z');
        await expect(result[OUTLET_2].length).toBe(1);
        await expect(result[OUTLET_2][0].url).toBe('a/b/c');
        await expect(result[OUTLET_2][0].metaRoute).toBe('a');
        await expect(result[OUTLET_2][0].subRoute).toBe('b/c');
    });

    it('parses x/y/z(a:1//b:2);outlet2~a/b/c(a:4//b:5)', async () => {
        const url = 'x/y/z(a:1//b:2);outlet2~a/b/c(a:4//b:5)';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        await expect(result[DEFAULT_OUTLET].length).toBe(1);
        await expect(result[DEFAULT_OUTLET][0].url).toBe('x/y/z(a:1//b:2)');
        await expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('x');
        await expect(result[DEFAULT_OUTLET][0].subRoute).toBe('y/z(a:1//b:2)');
        await expect(result[OUTLET_2].length).toBe(1);
        await expect(result[OUTLET_2][0].url).toBe('a/b/c(a:4//b:5)');
        await expect(result[OUTLET_2][0].metaRoute).toBe('a');
        await expect(result[OUTLET_2][0].subRoute).toBe('b/c(a:4//b:5)');
    });

    it('parses x/y/z;outlet2~a/b/c;outlet3~q/e/r/t/y', async () => {
        const url = 'x/y/z;outlet2~a/b/c;outlet3~q/e/r/t/y';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        const OUTLET_3 = `${DEFAULT_OUTLET}3`;
        await expect(result[DEFAULT_OUTLET].length).toBe(1);
        await expect(result[DEFAULT_OUTLET][0].url).toBe('x/y/z');
        await expect(result[OUTLET_2].length).toBe(1);
        await expect(result[OUTLET_2][0].url).toBe('a/b/c');
        await expect(result[OUTLET_3].length).toBe(1);
        await expect(result[OUTLET_3][0].url).toBe('q/e/r/t/y');
    });

    it('parses outlet7~x/y/z;outlet2~a/b/c;outlet3~q/e/r/t/y', async () => {
        const url = 'outlet7~x/y/z;outlet2~a/b/c;outlet3~q/e/r/t/y';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        const OUTLET_3 = `${DEFAULT_OUTLET}3`;
        const OUTLET_7 = `${DEFAULT_OUTLET}7`;
        await expect(result[OUTLET_7].length).toBe(1);
        await expect(result[OUTLET_2].length).toBe(1);
        await expect(result[OUTLET_3].length).toBe(1);
        await expect(result[OUTLET_7][0].url).toBe('x/y/z');
        await expect(result[OUTLET_2][0].url).toBe('a/b/c');
        await expect(result[OUTLET_3][0].url).toBe('q/e/r/t/y');
    });

    it('parses outlet7~x/y/z(a:1//b:2);outlet2~a/b/c(a:4//b:5)', async () => {
        const url = 'outlet7~x/y/z(a:1//b:2);outlet2~a/b/c(a:4//b:5)';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        const OUTLET_7 = `${DEFAULT_OUTLET}7`;
        await expect(result[OUTLET_7].length).toBe(1);
        await expect(result[OUTLET_2].length).toBe(1);
        await expect(result[OUTLET_7][0].url).toBe('x/y/z(a:1//b:2)');
        await expect(result[OUTLET_2][0].url).toBe('a/b/c(a:4//b:5)');
    });

    it('parses a/b/c!x/y/z', async () => {
        const url = 'a/b/c!x/y/z';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        await expect(result[DEFAULT_OUTLET].length).toBe(2);
        await expect(result[DEFAULT_OUTLET][0].url).toBe('a/b/c');
        await expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('a');
        await expect(result[DEFAULT_OUTLET][0].subRoute).toBe('b/c');
        await expect(result[DEFAULT_OUTLET][1].url).toBe('x/y/z');
        await expect(result[DEFAULT_OUTLET][1].metaRoute).toBe('x');
        await expect(result[DEFAULT_OUTLET][1].subRoute).toBe('y/z');
    });

    it('parses outlet~a/b/c!x/y/z', async () => {
        const url = 'outlet~a/b/c!x/y/z';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        await expect(result[DEFAULT_OUTLET].length).toBe(2);
        await expect(result[DEFAULT_OUTLET][0].url).toBe('a/b/c');
        await expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('a');
        await expect(result[DEFAULT_OUTLET][0].subRoute).toBe('b/c');
        await expect(result[DEFAULT_OUTLET][1].url).toBe('x/y/z');
        await expect(result[DEFAULT_OUTLET][1].metaRoute).toBe('x');
        await expect(result[DEFAULT_OUTLET][1].subRoute).toBe('y/z');
    });

    it('parses outlet~x/y/z!a/b/c', async () => {
        const url = 'outlet~x/y/z!a/b/c';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        await expect(result[DEFAULT_OUTLET].length).toBe(2);
        await expect(result[DEFAULT_OUTLET][1].url).toBe('a/b/c');
        await expect(result[DEFAULT_OUTLET][1].metaRoute).toBe('a');
        await expect(result[DEFAULT_OUTLET][1].subRoute).toBe('b/c');
        await expect(result[DEFAULT_OUTLET][0].url).toBe('x/y/z');
        await expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('x');
        await expect(result[DEFAULT_OUTLET][0].subRoute).toBe('y/z');
    });

    it('parses outlet~a/b/c!x/y/z;outlet2~a/b/c!x/y/z', async () => {
        const url = 'outlet~a/b/c!x/y/z;outlet2~a/b/c!x/y/z';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        await expect(result[DEFAULT_OUTLET].length).toBe(2);
        await expect(result[DEFAULT_OUTLET][0].url).toBe('a/b/c');
        await expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('a');
        await expect(result[DEFAULT_OUTLET][0].subRoute).toBe('b/c');
        await expect(result[DEFAULT_OUTLET][1].url).toBe('x/y/z');
        await expect(result[DEFAULT_OUTLET][1].metaRoute).toBe('x');
        await expect(result[DEFAULT_OUTLET][1].subRoute).toBe('y/z');
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        await expect(result[OUTLET_2].length).toBe(2);
        await expect(result[OUTLET_2][0].url).toBe('a/b/c');
        await expect(result[OUTLET_2][0].metaRoute).toBe('a');
        await expect(result[OUTLET_2][0].subRoute).toBe('b/c');
        await expect(result[OUTLET_2][1].url).toBe('x/y/z');
        await expect(result[OUTLET_2][1].metaRoute).toBe('x');
        await expect(result[OUTLET_2][1].subRoute).toBe('y/z');
    });
});
