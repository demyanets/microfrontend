import { UrlHelper } from './url-helper';

const DEFAULT_OUTLET = 'outlet';

/* tslint:disable no-string-literal */
/* tslint:disable no-magic-numbers */
describe('UrlHelper / parseUrl', () => {
    it('parses x/y/z', () => {
        const url = 'x/y/z';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        expect(result[DEFAULT_OUTLET].length).toBe(1);
        expect(result[DEFAULT_OUTLET][0].url).toBe(url);
        expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('x');
        expect(result[DEFAULT_OUTLET][0].subRoute).toBe('y/z');
    });

    it('parses x/y/z(a:1//b:2)', () => {
        const url = 'x/y/z(a:1//b:2)';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        expect(result[DEFAULT_OUTLET].length).toBe(1);
        expect(result[DEFAULT_OUTLET][0].url).toBe(url);
        expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('x');
        expect(result[DEFAULT_OUTLET][0].subRoute).toBe('y/z(a:1//b:2)');
    });

    it('parses x/y/z;outlet2~a/b/c', () => {
        const url = 'x/y/z;outlet2~a/b/c';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        expect(result[DEFAULT_OUTLET].length).toBe(1);
        expect(result[DEFAULT_OUTLET][0].url).toBe('x/y/z');
        expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('x');
        expect(result[DEFAULT_OUTLET][0].subRoute).toBe('y/z');
        expect(result[OUTLET_2].length).toBe(1);
        expect(result[OUTLET_2][0].url).toBe('a/b/c');
        expect(result[OUTLET_2][0].metaRoute).toBe('a');
        expect(result[OUTLET_2][0].subRoute).toBe('b/c');
    });

    it('parses x/y/z(a:1//b:2);outlet2~a/b/c(a:4//b:5)', () => {
        const url = 'x/y/z(a:1//b:2);outlet2~a/b/c(a:4//b:5)';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        expect(result[DEFAULT_OUTLET].length).toBe(1);
        expect(result[DEFAULT_OUTLET][0].url).toBe('x/y/z(a:1//b:2)');
        expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('x');
        expect(result[DEFAULT_OUTLET][0].subRoute).toBe('y/z(a:1//b:2)');
        expect(result[OUTLET_2].length).toBe(1);
        expect(result[OUTLET_2][0].url).toBe('a/b/c(a:4//b:5)');
        expect(result[OUTLET_2][0].metaRoute).toBe('a');
        expect(result[OUTLET_2][0].subRoute).toBe('b/c(a:4//b:5)');
    });

    it('parses x/y/z;outlet2~a/b/c;outlet3~q/e/r/t/y', () => {
        const url = 'x/y/z;outlet2~a/b/c;outlet3~q/e/r/t/y';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        const OUTLET_3 = `${DEFAULT_OUTLET}3`;
        expect(result[DEFAULT_OUTLET].length).toBe(1);
        expect(result[DEFAULT_OUTLET][0].url).toBe('x/y/z');
        expect(result[OUTLET_2].length).toBe(1);
        expect(result[OUTLET_2][0].url).toBe('a/b/c');
        expect(result[OUTLET_3].length).toBe(1);
        expect(result[OUTLET_3][0].url).toBe('q/e/r/t/y');
    });

    it('parses outlet7~x/y/z;outlet2~a/b/c;outlet3~q/e/r/t/y', () => {
        const url = 'outlet7~x/y/z;outlet2~a/b/c;outlet3~q/e/r/t/y';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        const OUTLET_3 = `${DEFAULT_OUTLET}3`;
        const OUTLET_7 = `${DEFAULT_OUTLET}7`;
        expect(result[OUTLET_7].length).toBe(1);
        expect(result[OUTLET_2].length).toBe(1);
        expect(result[OUTLET_3].length).toBe(1);
        expect(result[OUTLET_7][0].url).toBe('x/y/z');
        expect(result[OUTLET_2][0].url).toBe('a/b/c');
        expect(result[OUTLET_3][0].url).toBe('q/e/r/t/y');
    });

    it('parses outlet7~x/y/z(a:1//b:2);outlet2~a/b/c(a:4//b:5)', () => {
        const url = 'outlet7~x/y/z(a:1//b:2);outlet2~a/b/c(a:4//b:5)';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        const OUTLET_7 = `${DEFAULT_OUTLET}7`;
        expect(result[OUTLET_7].length).toBe(1);
        expect(result[OUTLET_2].length).toBe(1);
        expect(result[OUTLET_7][0].url).toBe('x/y/z(a:1//b:2)');
        expect(result[OUTLET_2][0].url).toBe('a/b/c(a:4//b:5)');
    });

    it('parses a/b/c!x/y/z', () => {
        const url = 'a/b/c!x/y/z';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        expect(result[DEFAULT_OUTLET].length).toBe(2);
        expect(result[DEFAULT_OUTLET][0].url).toBe('a/b/c');
        expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('a');
        expect(result[DEFAULT_OUTLET][0].subRoute).toBe('b/c');
        expect(result[DEFAULT_OUTLET][1].url).toBe('x/y/z');
        expect(result[DEFAULT_OUTLET][1].metaRoute).toBe('x');
        expect(result[DEFAULT_OUTLET][1].subRoute).toBe('y/z');
    });

    it('parses outlet~a/b/c!x/y/z', () => {
        const url = 'outlet~a/b/c!x/y/z';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        expect(result[DEFAULT_OUTLET].length).toBe(2);
        expect(result[DEFAULT_OUTLET][0].url).toBe('a/b/c');
        expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('a');
        expect(result[DEFAULT_OUTLET][0].subRoute).toBe('b/c');
        expect(result[DEFAULT_OUTLET][1].url).toBe('x/y/z');
        expect(result[DEFAULT_OUTLET][1].metaRoute).toBe('x');
        expect(result[DEFAULT_OUTLET][1].subRoute).toBe('y/z');
    });

    it('parses outlet~x/y/z!a/b/c', () => {
        const url = 'outlet~x/y/z!a/b/c';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        expect(result[DEFAULT_OUTLET].length).toBe(2);
        expect(result[DEFAULT_OUTLET][1].url).toBe('a/b/c');
        expect(result[DEFAULT_OUTLET][1].metaRoute).toBe('a');
        expect(result[DEFAULT_OUTLET][1].subRoute).toBe('b/c');
        expect(result[DEFAULT_OUTLET][0].url).toBe('x/y/z');
        expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('x');
        expect(result[DEFAULT_OUTLET][0].subRoute).toBe('y/z');
    });

    it('parses outlet~a/b/c!x/y/z;outlet2~a/b/c!x/y/z', () => {
        const url = 'outlet~a/b/c!x/y/z;outlet2~a/b/c!x/y/z';
        const result = UrlHelper.parseUrl(url, DEFAULT_OUTLET);
        expect(result[DEFAULT_OUTLET].length).toBe(2);
        expect(result[DEFAULT_OUTLET][0].url).toBe('a/b/c');
        expect(result[DEFAULT_OUTLET][0].metaRoute).toBe('a');
        expect(result[DEFAULT_OUTLET][0].subRoute).toBe('b/c');
        expect(result[DEFAULT_OUTLET][1].url).toBe('x/y/z');
        expect(result[DEFAULT_OUTLET][1].metaRoute).toBe('x');
        expect(result[DEFAULT_OUTLET][1].subRoute).toBe('y/z');
        const OUTLET_2 = `${DEFAULT_OUTLET}2`;
        expect(result[OUTLET_2].length).toBe(2);
        expect(result[OUTLET_2][0].url).toBe('a/b/c');
        expect(result[OUTLET_2][0].metaRoute).toBe('a');
        expect(result[OUTLET_2][0].subRoute).toBe('b/c');
        expect(result[OUTLET_2][1].url).toBe('x/y/z');
        expect(result[OUTLET_2][1].metaRoute).toBe('x');
        expect(result[OUTLET_2][1].subRoute).toBe('y/z');
    });
});
