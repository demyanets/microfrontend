import { IServiceProvider } from '@microfrontend/common';
import { IParentFacade } from './parent-facade-interface';

export interface IClientServiceProvider extends IServiceProvider {
    getParentFacade(): IParentFacade;
}
