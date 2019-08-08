import { MessageBase } from '@microfrontend/common';

/**
 * Encapsulates parent handling
 */
export interface IParentFacade {
    /**
     * Post message into the frame
     */
    postMessage(msg: MessageBase, parentOrigin: string): void;

    /** Has parent */
    hasParent(): boolean;
}
