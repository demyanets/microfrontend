import { RoutedAppConfig } from './routed-app-config';

describe('RoutedAppConfig', () => {
    let routedApp: RoutedAppConfig;
    const origins = location.origin;

    it('should create routed app config object', () => {
        routedApp = new RoutedAppConfig('a', origins);
        expect(routedApp).toBeTruthy();
    });

    it('should set appId correctly', () => {
        routedApp = new RoutedAppConfig('a', origins);
        expect(routedApp.metaRoute).toBe('a');
    });

    it('should set allowedOrigins correctly and it should be instance of AllowedOrigins', () => {
        const dummyAllowedOrigin: string = '10.0.0.0';
        routedApp = new RoutedAppConfig('a', dummyAllowedOrigin);
        expect(routedApp.parentOrigin).toBe(dummyAllowedOrigin);
    });

    it('should break with empty appId', () => {
        expect(() => new RoutedAppConfig('', origins)).toThrow();
    });
});
