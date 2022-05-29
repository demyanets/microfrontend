import { IMap } from '@microfrontend/common';
import { AppRoute } from './app-route';

/**
 * MicrofrontendStates manages information about state of the microfrontend
 * o prevent data loss
 */
export class MicrofrontendStates {
    /** Last reported microfrontend state */
    private microfrontendsStates: IMap<boolean> = {};

    /**
     * Check if route has state that might get lost set
     */
     public hasState(activeRoute: AppRoute): boolean {
        if (this.microfrontendsStates.hasOwnProperty(activeRoute.metaRoute)) {
            if (this.microfrontendsStates[activeRoute.metaRoute]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if route has state set that might get lost
     */
     public setState(route: AppRoute, hasState: boolean): void {
        this.microfrontendsStates[route.metaRoute] = hasState;
    }
}
