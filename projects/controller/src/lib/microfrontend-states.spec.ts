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

    it('should check microfrontend states correctly', () => {
        const mfStates = new MicrofrontendStates();
        const route = new AppRoute('a');
        mfStates.setState(route, true);
        expect(mfStates.hasState(route)).toBeTruthy();

        const missingRoute = new AppRoute('b');
        expect(mfStates.hasState(missingRoute)).toBeFalse();
    });
});
