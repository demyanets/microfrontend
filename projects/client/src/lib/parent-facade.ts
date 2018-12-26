import { MessageBase } from '@microfrontend/common';
import { IParentFacade } from './parent-facade-interface';

/**
 * Encapsulates parent handling
 */
export class ParentFacade implements IParentFacade {
    /**
     * Post message into the frame
     */
    postMessage(msg: MessageBase, parentOrigin: string): void {
        if (this.hasParent()) {
            parent.postMessage(msg, parentOrigin);
        }
    }

    /** Has parent */
    hasParent(): boolean {
        return self !== top;
    }
}
