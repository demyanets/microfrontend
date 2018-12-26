/**
 * Abstract base class for meta router messages
 */
export abstract class MessageBase {
    constructor(readonly message: string, readonly source: string) {
        if (message === '') {
            throw new Error('message is empty');
        }
    }
}
