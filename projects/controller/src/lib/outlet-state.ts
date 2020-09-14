import { AppRoute } from './app-route';

export class OutletState {
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
