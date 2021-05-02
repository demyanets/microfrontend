import { RoutedAppConfig } from './routed-app-config';

describe('RoutedAppConfig', async () => {
    let routedApp: RoutedAppConfig;
    const origins = location.origin;

    it('should create routed app config object', async () => {
        routedApp = new RoutedAppConfig('a', origins);
        await expect(routedApp).toBeTruthy();
    });

    it('should set appId correctly', async () => {
        routedApp = new RoutedAppConfig('a', origins);
        await expect(routedApp.metaRoute).toBe('a');
    });

    it('should set allowedOrigins correctly and it should be instance of AllowedOrigins', async () => {
        const dummyAllowedOrigin: string = '10.0.0.0';
        routedApp = new RoutedAppConfig('a', dummyAllowedOrigin);
        await expect(routedApp.parentOrigin).toBe(dummyAllowedOrigin);
    });

    it('should break with empty appId', async () => {
        await expect(() => new RoutedAppConfig('', origins)).toThrow();
    });
});
