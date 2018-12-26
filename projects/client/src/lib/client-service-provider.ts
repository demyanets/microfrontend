import { ServiceProvider } from '@microfrontend/common';
import { IClientServiceProvider } from './client-service-provider-interface';
import { IParentFacade } from './parent-facade-interface';
import { ParentFacade } from './parent-facade';

/**
 * Provides facades for browser services
 */
export class ClientServiceProvider extends ServiceProvider implements IClientServiceProvider {
    /**
     * Creates new instance of parent facade
     */
    getParentFacade(): IParentFacade {
        return new ParentFacade();
    }
}
