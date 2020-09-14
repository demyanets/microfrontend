import { AppRoute } from './app-route';
import { OutletState } from './outlet-state';

describe('OutletState', async () => {
    let outlet: string;
    let routes: AppRoute[];
    let outletState: OutletState;

    beforeEach(() => {
        outlet = 'outlet';
        routes = [
            new AppRoute('a'),
            new AppRoute('b')
        ];
    });

    it('should create meta outlet state object', async () => {
        outletState = new OutletState(outlet, routes);
        await expect(outletState).toBeTruthy();
    });

    it('should set outlet state object properties correctly', async () => {
        outletState = new OutletState(outlet, routes);
        await expect(outletState.outlet).toBe(outlet);
        await expect(outletState.routes).toEqual(routes);
    });

    it('should throw error for empty outlet', async () => {
        await expect(() => new OutletState('', routes)).toThrow();
    });

    it('should throw error for empty routes', async () => {
        await expect(() => new OutletState(outlet, [])).toThrow();
    });
});
