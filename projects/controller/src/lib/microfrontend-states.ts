import { IMap } from '@microfrontend/common';
import { AppRoute } from './app-route';
import { MetaRouteStateEvaluation } from './meta-route-state-evaluation';

/**
 * MicrofrontendStates manages information about state of the microfrontend
 * o prevent data loss
 */
export class MicrofrontendStates {
    /** Key to use is subRoute is missing */
    private static readonly emptySubrouteKey = '';

    /** Last reported microfrontend state */
    private readonly microfrontendsStates: IMap<IMap<boolean>> = {};

    /**
     * Check if route has state that might get lost set
     */
    public hasState(route: AppRoute, stateHandling: MetaRouteStateEvaluation = MetaRouteStateEvaluation.RouteBased): boolean {
        if (!this.microfrontendsStates.hasOwnProperty(route.metaRoute)) {
            return false;
        }

        switch (stateHandling) {
            case MetaRouteStateEvaluation.RouteBased:
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
                return false;

            case MetaRouteStateEvaluation.AppBased:
                // Check if metaroute has any dirty state
                return Object.values(this.microfrontendsStates[route.metaRoute]).some((hasState) => hasState);

            default:
                throw new Error(`unhandled MetaRouteStateEvaluation in hasState: '${stateHandling}'`);
        }
    }

    /**
     * Check if route has state set that might get lost
     */
    public setState(route: AppRoute, hasState: boolean): void {
        if (!this.microfrontendsStates.hasOwnProperty(route.metaRoute)) {
            this.microfrontendsStates[route.metaRoute] = {};
        }

        // The subRoute may be any string and must not correspond
        // to a valid application route.
        if (route.subRoute) {
            this.microfrontendsStates[route.metaRoute][route.subRoute] = hasState;
        } else {
            this.microfrontendsStates[route.metaRoute][MicrofrontendStates.emptySubrouteKey] = hasState;
        }
    }
}
