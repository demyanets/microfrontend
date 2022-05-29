import { IMap } from '@microfrontend/common';
import { AppRoute } from './app-route';

/**
 * MicrofrontendStates manages information about state of the microfrontend
 * o prevent data loss
 */
export class MicrofrontendStates {
    /** Key to use is subRoute is missing */
    private static emptySubrouteKey = '';

    /** Last reported microfrontend state */
    private microfrontendsStates: IMap<IMap<boolean>> = {};

    /**
     * Check if route has state that might get lost set
     */
     public hasState(route: AppRoute): boolean {
        if (this.microfrontendsStates.hasOwnProperty(route.metaRoute)) {
            if (route.subRoute) {
                if (this.microfrontendsStates[route.metaRoute].hasOwnProperty(route.subRoute)) {
                    if (this.microfrontendsStates[route.metaRoute][route.subRoute]) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                if (this.microfrontendsStates[route.metaRoute][MicrofrontendStates.emptySubrouteKey]) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Check if route has state set that might get lost
     */
     public setState(route: AppRoute, hasState: boolean): void {
        if (!this.microfrontendsStates.hasOwnProperty(route.metaRoute)) {
            this.microfrontendsStates[route.metaRoute] = {};
        }

        if (route.subRoute) {
            this.microfrontendsStates[route.metaRoute][route.subRoute] = hasState;
        } else {
            this.microfrontendsStates[route.metaRoute][MicrofrontendStates.emptySubrouteKey] = hasState;
        }
    }
}
