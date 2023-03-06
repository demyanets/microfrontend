import { AppRoute } from './app-route';
import { MetaRouteStateEvaluation } from './meta-route-state-evaluation';
import { MicrofrontendStates } from './microfrontend-states';

describe('MicrofrontendStates', async () => {
    beforeEach(() => {});

    it('should create microfrontend states object', () => {
        const mfStates = new MicrofrontendStates();
        expect(mfStates).toBeDefined();
    });

    it('should set microfrontend states correctly', () => {
        const mfStates = new MicrofrontendStates();
        const route = new AppRoute('a');
        mfStates.setState(route, true);
        expect(mfStates.hasState(route)).toBeTrue();
    });

    it('should set microfrontend states with subroute correctly', () => {
        const mfStates = new MicrofrontendStates();
        const route = new AppRoute('a', 'x');
        mfStates.setState(route, true);
        expect(mfStates.hasState(route)).toBeTrue();
    });

    it('should check microfrontend states correctly', () => {
        const mfStates = new MicrofrontendStates();
        const missingRoute = new AppRoute('b');
        expect(mfStates.hasState(missingRoute)).toBeFalse();
    });

    it('should check microfrontend states with subroute correctly', () => {
        const mfStates = new MicrofrontendStates();
        const route = new AppRoute('b');
        mfStates.setState(route, true);
        const missingRoute1 = new AppRoute('b', 'x');
        expect(mfStates.hasState(missingRoute1)).toBeFalse();
        const missingRoute2 = new AppRoute('b', 'y');
        expect(mfStates.hasState(missingRoute2)).toBeFalse();
    });

    it('should check for multiple states correctly', () => {
        const metaRoute = 'a';
        const mfStates = new MicrofrontendStates();

        mfStates.setState(new AppRoute(metaRoute, 'CustomerEditForm'), false);
        mfStates.setState(new AppRoute(metaRoute, 'CustomerAddressEditForm'), true);

        // If querying route based this must return false as this route is not dirty
        expect(mfStates.hasState(new AppRoute(metaRoute, 'x'), MetaRouteStateEvaluation.RouteBased)).toBeFalse();
        // If querying app based this must return true as *some* route is dirty
        expect(mfStates.hasState(new AppRoute(metaRoute, 'x'), MetaRouteStateEvaluation.AppBased)).toBeTrue();
    });
});
