import { IMap } from '@microfrontend/common';
import { AppRoute } from './app-route';

/**
 * Provides helper functions for url handling
 */
export class UrlHelper {
    /**
     * Removes starting slash from route if necessary
     */
    public static removeStartingSlash(route: string): string {
        if (route && route.startsWith('/')) {
            return route.substr(1);
        } else {
            return route;
        }
    }

    /**
     * Parse URL into meta routes object
     */
    // tslint:disable-next-line:cyclomatic-complexity
    public static parseUrl(url: string, defaultOutlet: string): IMap<AppRoute[]> {
        type STATE = 'key' | 'value';

        let key: string = defaultOutlet;
        let value: string = '';
        let depth = 0;
        let state: STATE = 'value';
        const result: IMap<AppRoute[]> = {};

        const urlInner = url + '\0';

        for (let i = 0; i < urlInner.length; i++) {
            const c = urlInner.substr(i, 1);

            switch (state) {
                case 'key':
                    if (c === '=') {
                        // new
                        state = 'value';
                    } else {
                        key += c;
                    }
                    break;
                case 'value':
                    if (c === '(') {
                        value += c;
                        depth += 1;
                    } else if (c === ')') {
                        value += c;
                        depth -= 1;
                    } else if (depth > 0) {
                        value += c;
                    } else if (c === '\0' || c === ';') {
                        this.addAppRoute(result, key, value);
                        key = value = '';
                        state = 'key';
                    } else if (c === '=') {
                        key = value;
                        value = '';
                        state = 'value';
                    } else if (c === '!') {
                        this.addAppRoute(result, key, value);
                        value = '';
                    } else {
                        value += c;
                    }
                    break;
                default:
                    throw new Error(`unknown urlparser state: ${state}`);
            }
        }
        return result;
    }

    /**
     * Adds app route to the map
     * @param result
     * @param key
     * @param value
     */
    private static addAppRoute(result: IMap<AppRoute[]>, key: string, value: string): void {
        // tslint:disable strict-boolean-expressions
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(AppRoute.fromUrl(value));
    }

    /**
     * Construct full URL with location path from meta routes
     */
    public static constructFullUrl(locationPath: string, routes: IMap<AppRoute[]>, outlet: string): string {
        return `${locationPath}#${UrlHelper.constructUrl(routes, outlet)}`;
    }

    /**
     * Construct URL from meta routes
     */
    public static constructUrl(routes: IMap<AppRoute[]>, outlet: string): string {
        let url = '';
        // tslint:disable strict-boolean-expressions
        if (routes[outlet]) {
            if (Object.keys(routes).length > 1) {
                url = this.getUrlForKey(routes, outlet);
            } else {
                url = UrlHelper.getUrlForApps(routes[outlet]);
            }
        } else {
            throw new Error(`Outlet is unknown: ${outlet}`);
        }

        for (const key in routes) {
            if (routes.hasOwnProperty(key)) {
                if (key !== outlet) {
                    if (url) {
                        url += ';';
                    }
                    url += this.getUrlForKey(routes, key);
                }
            }
        }

        return url;
    }

    /**
     * Constructs url out of app routes
     * @param apps
     * @returns
     */
    private static getUrlForApps(apps: AppRoute[]): string {
        let url = '';
        const urls: string[] = [];
        for (const app of apps) {
            urls.push(app.url);
        }
        url = urls.join('!');
        return url;
    }

    /**
     * Constructs url out of app routes for the outlet
     * @param routes
     * @param key
     * @returns
     */
    private static getUrlForKey(routes: IMap<AppRoute[]>, key: string): string {
        return `${key}=${UrlHelper.getUrlForApps(routes[key])}`;
    }
}
