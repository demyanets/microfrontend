import { MessageBase } from '@microfrontend/common';
import { IParentFacade } from '../lib/parent-facade-interface';

export class ParentFacadeMock implements IParentFacade {
    public readonly messages: MessageBase[] = [];

    constructor() {}

    /**
     * Post message to parent
     */
    postMessage(msg: MessageBase, parentOrigin: string): void {
        this.messages.push(msg);
    }

    hasParent(): boolean {
        return true;
    }
}
