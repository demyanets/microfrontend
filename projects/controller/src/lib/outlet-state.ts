import { AppRoute } from './app-route';

/**
 * OutletState manages state of the outlet
 */
export class OutletState {
    /** Active route */
    readonly activeRoute: AppRoute;
    constructor(readonly outlet: string, readonly routes: AppRoute[]) {
        if (outlet === '') {
            throw new Error('Outlet is empty');
        }

        if (routes.length === 0) {
            throw new Error('Routes array is empty');
        }

        this.activeRoute = routes[0];
    }
}
