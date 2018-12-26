/**
 * Micro frontend custom
 */
export class RoutedAppConfig {
    /**
     * Constructor
     * @param metaRoute
     * @param parentOrigin
     */
    constructor(readonly metaRoute: string, readonly parentOrigin: string) {
        if (metaRoute === '') {
            throw new Error('Empty metaRoute is not permitted');
        }
    }
}
