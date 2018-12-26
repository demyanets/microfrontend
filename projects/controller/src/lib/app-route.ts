/**
 * Represents application meta route and its optional subroute
 */
export class AppRoute {
    /** Full meta Url */
    readonly url: string;
    constructor(readonly metaRoute: string, readonly subRoute?: string) {
        if (this.subRoute) {
            if (this.subRoute.startsWith('/')) {
                this.subRoute = this.subRoute.substr(1);
            }

            if (this.subRoute.length > 0) {
                this.url = `${this.metaRoute}/${this.subRoute}`;
            } else {
                this.url = this.metaRoute;
                this.subRoute = undefined;
            }
        } else {
            this.url = this.metaRoute;
        }
    }

    /**
     * Creates new instance from full meta route url
     */
    static fromUrl(url: string): AppRoute {
        const segments: string[] = url.split('/');
        const route = segments[0];
        if (segments.length > 1) {
            const subRoute = segments.slice(1).join('/');
            return new AppRoute(route, subRoute);
        } else {
            return new AppRoute(route);
        }
    }
}
