import { AppRoute } from './app-route';
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
});
