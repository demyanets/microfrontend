import { IMap } from '@microfrontend/common';
import { MetaRouteHelper } from './meta-route-helper';
import { AppRoute } from './app-route';
import { IAppConfig } from './app-config';

describe('MetaRouteHelper', async () => {
    let routeToActivate: AppRoute;
    let newRoute: AppRoute;
    let currentRoutes: IMap<AppRoute[]>;
    let outlet: string;

    beforeEach(() => {
        outlet = 'outlet';
    });

    describe('activateRoute', async () => {
        it('with no values in currentRoutes should return atleast one route', async () => {
            routeToActivate = new AppRoute('a');
            currentRoutes = {
                outlet: []
            };
            outlet = 'outlet';
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            await expect(currentRoutes[outlet][0]).toBe(routeToActivate);
        });

        it('should remove subroute (outlet=a/y!b -> outlet=a!b)', async () => {
            routeToActivate = new AppRoute('a', '');
            currentRoutes = {
                outlet: [new AppRoute('a', 'y'), new AppRoute('b')]
            };
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            await expect(currentRoutes.hasOwnProperty(outlet)).toBeTruthy();
            await expect(currentRoutes[outlet].length).toBe(2);

            let outletFirstRoute = currentRoutes[outlet][0];
            await expect(outletFirstRoute.url).toBe('a');
            await expect(outletFirstRoute.metaRoute).toBe('a');
            await expect(outletFirstRoute.subRoute).toBe('');

            let outletSecondRoute = currentRoutes[outlet][1];
            await expect(outletSecondRoute.url).toBe('b');
            await expect(outletSecondRoute.metaRoute).toBe('b');
            await expect(outletSecondRoute.subRoute).toBeFalsy();
        });

        it('should return correct updated currentRoutes (outlet=a/y!b -> outlet=a/x!b)', async () => {
            routeToActivate = new AppRoute('a', 'x');
            currentRoutes = {
                outlet: [new AppRoute('a', 'y'), new AppRoute('b')]
            };
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            await expect(currentRoutes.hasOwnProperty(outlet)).toBeTruthy();
            await expect(currentRoutes[outlet].length).toBe(2);

            let outletFirstRoute = currentRoutes[outlet][0];
            await expect(outletFirstRoute.url).toBe('a/x');
            await expect(outletFirstRoute.metaRoute).toBe('a');
            await expect(outletFirstRoute.subRoute).toBe('x');

            let outletSecondRoute = currentRoutes[outlet][1];
            await expect(outletSecondRoute.url).toBe('b');
            await expect(outletSecondRoute.metaRoute).toBe('b');
            await expect(outletSecondRoute.subRoute).toBeFalsy();
        });

        it('should not update currentRoutes if route is already present (outlet=a/x!b -> outlet=a/x!b)', async () => {
            routeToActivate = new AppRoute('a', 'x');
            currentRoutes = {
                outlet: [new AppRoute('a', 'x'), new AppRoute('b')]
            };
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            await expect(currentRoutes.hasOwnProperty(outlet)).toBeTruthy();
            await expect(currentRoutes[outlet].length).toBe(2);

            let outletFirstRoute = currentRoutes[outlet][0];
            await expect(outletFirstRoute.url).toBe('a/x');
            await expect(outletFirstRoute.metaRoute).toBe('a');
            await expect(outletFirstRoute.subRoute).toBe('x');

            let outletSecondRoute = currentRoutes[outlet][1];
            await expect(outletSecondRoute.url).toBe('b');
            await expect(outletSecondRoute.metaRoute).toBe('b');
            await expect(outletSecondRoute.subRoute).toBeFalsy();
        });

        it('should return only one activated micro frontend route in currentRoutes (outlet=a/x!a!a!b -> outlet=a/x!b)', async () => {
            routeToActivate = new AppRoute('a', 'x');
            currentRoutes = {
                outlet: [new AppRoute('a', 'x'), new AppRoute('a'), new AppRoute('a'), new AppRoute('b')]
            };
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            await expect(currentRoutes.hasOwnProperty(outlet)).toBeTruthy();
            await expect(currentRoutes[outlet].length).toBe(2);

            let outletFirstRoute = currentRoutes[outlet][0];
            await expect(outletFirstRoute.url).toBe('a/x');
            await expect(outletFirstRoute.metaRoute).toBe('a');
            await expect(outletFirstRoute.subRoute).toBe('x');

            let outletSecondRoute = currentRoutes[outlet][1];
            await expect(outletSecondRoute.url).toBe('b');
            await expect(outletSecondRoute.metaRoute).toBe('b');
            await expect(outletSecondRoute.subRoute).toBeFalsy();
        });

        it('should change the order of applications (outlet=a/x!b/y!c/x -> outlet=b/y!a/x!c/x)', async () => {
            routeToActivate = new AppRoute('b', 'y');
            currentRoutes = {
                outlet: [new AppRoute('a', 'x'), new AppRoute('b', 'y'), new AppRoute('c', 'x')]
            };
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            await expect(currentRoutes[outlet].length).toBe(3);

            let outletFirstRoute = currentRoutes[outlet][0];
            await expect(outletFirstRoute.url).toBe('b/y');
            await expect(outletFirstRoute.metaRoute).toBe('b');
            await expect(outletFirstRoute.subRoute).toBe('y');

            let outletSecondRoute = currentRoutes[outlet][1];
            await expect(outletSecondRoute.url).toBe('a/x');
            await expect(outletSecondRoute.metaRoute).toBe('a');
            await expect(outletSecondRoute.subRoute).toBe('x');

            let outletThirdRoute = currentRoutes[outlet][2];
            await expect(outletThirdRoute.url).toBe('c/x');
            await expect(outletThirdRoute.metaRoute).toBe('c');
            await expect(outletThirdRoute.subRoute).toBe('x');
        });

        it('should keep the subroute (outlet=a/x!b/y!c/x -> outlet=b/y!a/x!c/x)', async () => {
            routeToActivate = new AppRoute('b', undefined);
            currentRoutes = {
                outlet: [new AppRoute('a', 'x'), new AppRoute('b', 'y'), new AppRoute('c', 'x')]
            };
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            await expect(currentRoutes[outlet].length).toBe(3);

            let outletFirstRoute = currentRoutes[outlet][0];
            await expect(outletFirstRoute.url).toBe('b/y');
            await expect(outletFirstRoute.metaRoute).toBe('b');
            await expect(outletFirstRoute.subRoute).toBe('y');

            let outletSecondRoute = currentRoutes[outlet][1];
            await expect(outletSecondRoute.url).toBe('a/x');
            await expect(outletSecondRoute.metaRoute).toBe('a');
            await expect(outletSecondRoute.subRoute).toBe('x');

            let outletThirdRoute = currentRoutes[outlet][2];
            await expect(outletThirdRoute.url).toBe('c/x');
            await expect(outletThirdRoute.metaRoute).toBe('c');
            await expect(outletThirdRoute.subRoute).toBe('x');
        });
    });

    describe('setRoute', async () => {
        it('with no values in currentRoutes should return empty currentRoutes', async () => {
            newRoute = new AppRoute('a');
            currentRoutes = {
                outlet: []
            };
            outlet = 'outlet';
            currentRoutes = MetaRouteHelper.setRoute(newRoute, currentRoutes, outlet);
            await expect(currentRoutes[outlet].length).toBe(0);
        });

        it('should return correct updated currentRoutes', async () => {
            newRoute = new AppRoute('a', 'x');
            currentRoutes = {
                outlet: [new AppRoute('a', 'y'), new AppRoute('b')]
            };
            currentRoutes = MetaRouteHelper.setRoute(newRoute, currentRoutes, outlet);
            await expect(currentRoutes.hasOwnProperty(outlet)).toBeTruthy();
            await expect(currentRoutes[outlet].length).toBe(2);

            let outletFirstRoute = currentRoutes[outlet][0];
            await expect(outletFirstRoute.url).toBe('a/x');
            await expect(outletFirstRoute.metaRoute).toBe('a');
            await expect(outletFirstRoute.subRoute).toBe('x');

            let outletSecondRoute = currentRoutes[outlet][1];
            await expect(outletSecondRoute.url).toBe('b');
            await expect(outletSecondRoute.metaRoute).toBe('b');
            await expect(outletSecondRoute.subRoute).toBeFalsy();
        });

        it('should NOT change the order of applications', async () => {
            newRoute = new AppRoute('b', 'x');
            currentRoutes = {
                outlet: [new AppRoute('a', 'x'), new AppRoute('b', 'y'), new AppRoute('c', 'x')]
            };
            currentRoutes = MetaRouteHelper.setRoute(newRoute, currentRoutes, outlet);
            await expect(currentRoutes.hasOwnProperty(outlet)).toBeTruthy();
            await expect(currentRoutes[outlet].length).toBe(3);

            let outletFirstRoute = currentRoutes[outlet][0];
            await expect(outletFirstRoute.url).toBe('a/x');
            await expect(outletFirstRoute.metaRoute).toBe('a');
            await expect(outletFirstRoute.subRoute).toBe('x');

            let outletSecondRoute = currentRoutes[outlet][1];
            await expect(outletSecondRoute.url).toBe('b/x');
            await expect(outletSecondRoute.metaRoute).toBe('b');
            await expect(outletSecondRoute.subRoute).toBe('x');

            let outletThirdRoute = currentRoutes[outlet][2];
            await expect(outletThirdRoute.url).toBe('c/x');
            await expect(outletThirdRoute.metaRoute).toBe('c');
            await expect(outletThirdRoute.subRoute).toBe('x');
        });
    });

    describe('join', async () => {
        let existingRoutes: AppRoute[];
        let configRoutes: IAppConfig[] = [
            {
                metaRoute: 'a',
                baseUrl: '/app-a/'
            },
            {
                metaRoute: 'b',
                baseUrl: '/app-b/'
            }
        ];

        it('should keep valid routes from existing routes and remove invalid ones', async () => {
            existingRoutes = [new AppRoute('a', 'x'), new AppRoute('c')];
            const routes: AppRoute[] = MetaRouteHelper.join(configRoutes, existingRoutes);

            await expect(routes.length).toBe(2);

            let firstRoute = routes[0];
            await expect(firstRoute.url).toBe('a/x');
            await expect(firstRoute.metaRoute).toBe('a');
            await expect(firstRoute.subRoute).toBe('x');

            let secondRoute = routes[1];
            await expect(secondRoute.url).toBe('b');
            await expect(secondRoute.metaRoute).toBe('b');
            await expect(secondRoute.subRoute).toBeFalsy();
        });
    });
});
