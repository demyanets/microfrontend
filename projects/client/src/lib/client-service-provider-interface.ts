import { IServiceProvider } from '@microfrontend/common';
import { IParentFacade } from './parent-facade-interface';

export interface IClientServiceProvider extends IServiceProvider {
    /**
     * Creates new instance of parent facade
     */
    getParentFacade(): IParentFacade;
}
