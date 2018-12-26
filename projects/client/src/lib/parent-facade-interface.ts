import { MessageBase } from '@microfrontend/common';

/**
 * Encapsulates parent handling
 */
export interface IParentFacade {
    postMessage(msg: MessageBase, parentOrigin: string): void;
    hasParent(): boolean;
}
