import { ILocationFacade } from '../lib/location-facade-interface';
import { IHistoryApiFacade } from '../lib/history-api-facade-interface';

export class LocationHistoryFacadeMock implements ILocationFacade, IHistoryApiFacade {
    public history: Array<{ url: string; title: string | undefined }> = [];

    constructor(public path: string) {
        //this.history.push({ url: path, title: undefined });
    }

    go(url: string, title?: string, click?: boolean): void {
        this.path = url;
        this.history.push({ url: url, title: title });
    }

    private splitPath() {
        return this.path.split('#');
    }

    /**
     * Provides location.pathname
     */
    getPath(): string {
        const parts = this.splitPath();
        return parts[0];
    }

    /**
     * Provides information if hash is available
     */
    hasHash(): boolean {
        const parts = this.splitPath();
        return parts.length > 1;
    }

    /**
     * Provides path after hash sign if hash is available
     */
    getTruncatedHash(): string | undefined {
        if (!this.hasHash()) {
            return undefined;
        }
        const parts = this.splitPath();
        return parts[1];
    }
}
