export interface ILocationFacade {
    /**
     * Provides location.pathname
     */
    getPath(): string;

    /**
     * Provides information if hash is available
     */
    hasHash(): boolean;

    /**
     * Provides path after hash sign if hash is available
     */
    getTruncatedHash(): string | undefined;
}
