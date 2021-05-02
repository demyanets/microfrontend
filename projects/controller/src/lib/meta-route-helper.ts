import { IMap } from '@microfrontend/common';
import { AppRoute } from './app-route';
import { IAppConfig } from './app-config';

/**
 * MetaRouteHelper handles internal logic of the meta router
 */
export class MetaRouteHelper {
    /**
     * Get visible route in outlet
     * @param outlets map
     * @returns route or undefined
     */
    static getOutletRoute(outlets: IMap<AppRoute[]>): AppRoute | undefined {
        for (const key in outlets) {
            if (outlets.hasOwnProperty(key)) {
                if (outlets[key].length > 0) {
                    return outlets[key][0];
                }
            }
        }
        return undefined;
    }

    /**
     * Activates the route
     * If subroute if undefined it will keep existing subroute
     * If subroute is empty it will navigate to the empty subroute
     * @param routeToActivate Route that has to be activated.
     * @param currentRoutes Map with current route.
     * @param outlet Related outlet.
     * @returns Updated map.
     */
    static activateRoute(routeToActivate: AppRoute, currentRoutes: IMap<AppRoute[]>, outlet: string): IMap<AppRoute[]> {
        let newRoute: AppRoute = routeToActivate;
        const newOutletApps: AppRoute[] = [];

        for (const appRoute of currentRoutes[outlet]) {
            if (routeToActivate.metaRoute !== appRoute.metaRoute) {
                newOutletApps.push(appRoute);
            } else {
                if (routeToActivate.subRoute === undefined) {
                    newRoute = appRoute;
                }
            }
        }
        newOutletApps.unshift(newRoute);
        return MetaRouteHelper.createNewMap(newOutletApps, outlet);
    }

    /**
     * Updates the route
     * @param newRoute New route to be updated.
     * @param currentRoutes Map with current route.
     * @param outlet Related outlet.
     * @returns Updated map.
     */
    static setRoute(newRoute: AppRoute, currentRoutes: IMap<AppRoute[]>, outlet: string): IMap<AppRoute[]> {
        const newOutletApps: AppRoute[] = [];
        for (const appRoute of currentRoutes[outlet]) {
            if (newRoute.metaRoute === appRoute.metaRoute) {
                newOutletApps.push(newRoute);
            } else {
                newOutletApps.push(appRoute);
            }
        }
        return MetaRouteHelper.createNewMap(newOutletApps, outlet);
    }

    /**
     * Creates new routes map
     * @param routes
     * @param outlet
     */
    private static createNewMap(routes: AppRoute[], outlet: string): IMap<AppRoute[]> {
        const retVal: IMap<AppRoute[]> = {};
        retVal[outlet] = routes;
        return retVal;
    }

    /**
     * Joins application custom with routes to get full route
     * @param apps List of app configurations.
     * @param currentRoutes Map with current route.
     * @returns Updated map.
     */
    static join(apps: IAppConfig[], routes: AppRoute[]): AppRoute[] {
        const result: AppRoute[] = [];
        for (const app of apps) {
            let matched = false;
            for (const route of routes) {
                if (app.metaRoute === route.metaRoute) {
                    matched = true;
                    result.push(route);
                }
            }
            if (!matched) {
                result.push(new AppRoute(app.metaRoute));
            }
        }
        return result;
    }
}
