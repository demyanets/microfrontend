import { ILocationFacade } from './location-facade-interface';

/**
 * Facade for the operations with location object
 */
export class LocationFacade implements ILocationFacade {
    /**
     * Provides location.pathname
     */
    public getPath(): string {
        return location.pathname;
    }

    /**
     * Provides information if hash is available
     */
    public hasHash(): boolean {
        return location.hash.length > 0;
    }

    /**
     * Provides path after hash sign if hash is available
     */
    public getTruncatedHash(): string | undefined {
        if (!this.hasHash()) {
            return undefined;
        }
        return location.hash.substr(1);
    }
}
