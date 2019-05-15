import { IMap } from '@microfrontend/common';
import { MetaRouteHelper } from './meta-route-helper';
import { AppRoute } from './app-route';
import { IAppConfig } from './app-config';

describe('MetaRouteHelper', () => {
    let routeToActivate: AppRoute;
    let newRoute: AppRoute;
    let currentRoutes: IMap<AppRoute[]>;
    let outlet: string;

    beforeEach(() => {
        outlet = 'outlet';
    });

    describe('activateRoute', () => {
        it('with no values in currentRoutes should return atleast one route', () => {
            routeToActivate = new AppRoute('a');
            currentRoutes = {
                outlet: []
            };
            outlet = 'outlet';
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            expect(currentRoutes[outlet][0]).toBe(routeToActivate);
        });

        it('should return correct updated currentRoutes (outlet=a/y!b -> outlet=a/x!b)', () => {
            routeToActivate = new AppRoute('a', 'x');
            currentRoutes = {
                outlet: [new AppRoute('a', 'y'), new AppRoute('b')]
            };
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            expect(currentRoutes.hasOwnProperty(outlet)).toBeTruthy();
            expect(currentRoutes[outlet].length).toBe(2);

            let outletFirstRoute = currentRoutes[outlet][0];
            expect(outletFirstRoute.url).toBe('a/x');
            expect(outletFirstRoute.metaRoute).toBe('a');
            expect(outletFirstRoute.subRoute).toBe('x');

            let outletSecondRoute = currentRoutes[outlet][1];
            expect(outletSecondRoute.url).toBe('b');
            expect(outletSecondRoute.metaRoute).toBe('b');
            expect(outletSecondRoute.subRoute).toBeFalsy();
        });

        it('should not update currentRoutes if route is already present (outlet=a/x!b -> outlet=a/x!b)', () => {
            routeToActivate = new AppRoute('a', 'x');
            currentRoutes = {
                outlet: [new AppRoute('a', 'x'), new AppRoute('b')]
            };
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            expect(currentRoutes.hasOwnProperty(outlet)).toBeTruthy();
            expect(currentRoutes[outlet].length).toBe(2);

            let outletFirstRoute = currentRoutes[outlet][0];
            expect(outletFirstRoute.url).toBe('a/x');
            expect(outletFirstRoute.metaRoute).toBe('a');
            expect(outletFirstRoute.subRoute).toBe('x');

            let outletSecondRoute = currentRoutes[outlet][1];
            expect(outletSecondRoute.url).toBe('b');
            expect(outletSecondRoute.metaRoute).toBe('b');
            expect(outletSecondRoute.subRoute).toBeFalsy();
        });

        it('should return only one activated micro frontend route in currentRoutes (outlet=a/x!a!a!b -> outlet=a/x!b)', () => {
            routeToActivate = new AppRoute('a', 'x');
            currentRoutes = {
                outlet: [new AppRoute('a', 'x'), new AppRoute('a'), new AppRoute('a'), new AppRoute('b')]
            };
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            expect(currentRoutes.hasOwnProperty(outlet)).toBeTruthy();
            expect(currentRoutes[outlet].length).toBe(2);

            let outletFirstRoute = currentRoutes[outlet][0];
            expect(outletFirstRoute.url).toBe('a/x');
            expect(outletFirstRoute.metaRoute).toBe('a');
            expect(outletFirstRoute.subRoute).toBe('x');

            let outletSecondRoute = currentRoutes[outlet][1];
            expect(outletSecondRoute.url).toBe('b');
            expect(outletSecondRoute.metaRoute).toBe('b');
            expect(outletSecondRoute.subRoute).toBeFalsy();
        });

        it('should change the order of applications (outlet=a/x!b/y!c/x -> outlet=b/y!a/x!c/x)', () => {
            routeToActivate = new AppRoute('b', 'y');
            currentRoutes = {
                outlet: [new AppRoute('a', 'x'), new AppRoute('b', 'y'), new AppRoute('c', 'x')]
            };
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            expect(currentRoutes[outlet].length).toBe(3);

            let outletFirstRoute = currentRoutes[outlet][0];
            expect(outletFirstRoute.url).toBe('b/y');
            expect(outletFirstRoute.metaRoute).toBe('b');
            expect(outletFirstRoute.subRoute).toBe('y');

            let outletSecondRoute = currentRoutes[outlet][1];
            expect(outletSecondRoute.url).toBe('a/x');
            expect(outletSecondRoute.metaRoute).toBe('a');
            expect(outletSecondRoute.subRoute).toBe('x');

            let outletThirdRoute = currentRoutes[outlet][2];
            expect(outletThirdRoute.url).toBe('c/x');
            expect(outletThirdRoute.metaRoute).toBe('c');
            expect(outletThirdRoute.subRoute).toBe('x');
        });

        it('should keep the subroute (outlet=a/x!b/y!c/x -> outlet=b/y!a/x!c/x)', () => {
            routeToActivate = new AppRoute('b', undefined);
            currentRoutes = {
                outlet: [new AppRoute('a', 'x'), new AppRoute('b', 'y'), new AppRoute('c', 'x')]
            };
            currentRoutes = MetaRouteHelper.activateRoute(routeToActivate, currentRoutes, outlet);
            expect(currentRoutes[outlet].length).toBe(3);

            let outletFirstRoute = currentRoutes[outlet][0];
            expect(outletFirstRoute.url).toBe('b/y');
            expect(outletFirstRoute.metaRoute).toBe('b');
            expect(outletFirstRoute.subRoute).toBe('y');

            let outletSecondRoute = currentRoutes[outlet][1];
            expect(outletSecondRoute.url).toBe('a/x');
            expect(outletSecondRoute.metaRoute).toBe('a');
            expect(outletSecondRoute.subRoute).toBe('x');

            let outletThirdRoute = currentRoutes[outlet][2];
            expect(outletThirdRoute.url).toBe('c/x');
            expect(outletThirdRoute.metaRoute).toBe('c');
            expect(outletThirdRoute.subRoute).toBe('x');
        });
    });

    describe('setRoute', () => {
        it('with no values in currentRoutes should return empty currentRoutes', () => {
            newRoute = new AppRoute('a');
            currentRoutes = {
                outlet: []
            };
            outlet = 'outlet';
            currentRoutes = MetaRouteHelper.setRoute(newRoute, currentRoutes, outlet);
            expect(currentRoutes[outlet].length).toBe(0);
        });

        it('should return correct updated currentRoutes', () => {
            newRoute = new AppRoute('a', 'x');
            currentRoutes = {
                outlet: [new AppRoute('a', 'y'), new AppRoute('b')]
            };
            currentRoutes = MetaRouteHelper.setRoute(newRoute, currentRoutes, outlet);
            expect(currentRoutes.hasOwnProperty(outlet)).toBeTruthy();
            expect(currentRoutes[outlet].length).toBe(2);

            let outletFirstRoute = currentRoutes[outlet][0];
            expect(outletFirstRoute.url).toBe('a/x');
            expect(outletFirstRoute.metaRoute).toBe('a');
            expect(outletFirstRoute.subRoute).toBe('x');

            let outletSecondRoute = currentRoutes[outlet][1];
            expect(outletSecondRoute.url).toBe('b');
            expect(outletSecondRoute.metaRoute).toBe('b');
            expect(outletSecondRoute.subRoute).toBeFalsy();
        });

        it('should NOT change the order of applications', () => {
            newRoute = new AppRoute('b', 'x');
            currentRoutes = {
                outlet: [new AppRoute('a', 'x'), new AppRoute('b', 'y'), new AppRoute('c', 'x')]
            };
            currentRoutes = MetaRouteHelper.setRoute(newRoute, currentRoutes, outlet);
            expect(currentRoutes.hasOwnProperty(outlet)).toBeTruthy();
            expect(currentRoutes[outlet].length).toBe(3);

            let outletFirstRoute = currentRoutes[outlet][0];
            expect(outletFirstRoute.url).toBe('a/x');
            expect(outletFirstRoute.metaRoute).toBe('a');
            expect(outletFirstRoute.subRoute).toBe('x');

            let outletSecondRoute = currentRoutes[outlet][1];
            expect(outletSecondRoute.url).toBe('b/x');
            expect(outletSecondRoute.metaRoute).toBe('b');
            expect(outletSecondRoute.subRoute).toBe('x');

            let outletThirdRoute = currentRoutes[outlet][2];
            expect(outletThirdRoute.url).toBe('c/x');
            expect(outletThirdRoute.metaRoute).toBe('c');
            expect(outletThirdRoute.subRoute).toBe('x');
        });
    });

    describe('join', () => {
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

        it('should keep valid routes from existing routes and remove invalid ones', () => {
            existingRoutes = [new AppRoute('a', 'x'), new AppRoute('c')];
            const routes: AppRoute[] = MetaRouteHelper.join(configRoutes, existingRoutes);

            expect(routes.length).toBe(2);

            let firstRoute = routes[0];
            expect(firstRoute.url).toBe('a/x');
            expect(firstRoute.metaRoute).toBe('a');
            expect(firstRoute.subRoute).toBe('x');

            let secondRoute = routes[1];
            expect(secondRoute.url).toBe('b');
            expect(secondRoute.metaRoute).toBe('b');
            expect(secondRoute.subRoute).toBeFalsy();
        });
    });
});
