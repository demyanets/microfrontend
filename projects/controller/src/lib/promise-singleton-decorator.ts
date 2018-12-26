/**
 * Provides singleton functionality for promises
 */
export class PromiseSingletonDecorator<T> {
    /** Active promise */
    private lastPromise: Promise<T> | undefined = undefined;

    /** Decorates promise with the singleton code */
    public async decorate(thisFramePromise: Promise<T>): Promise<T> {
        try {
            // Remember current promise
            this.lastPromise = thisFramePromise;

            // Wait for resolution of current promise
            const frame = await thisFramePromise;

            // Make sure that current promise is still the same as original
            // otherwise assume that it has changed in a meantime and reject
            if (thisFramePromise === this.lastPromise) {
                this.lastPromise = undefined;
                return thisFramePromise;
            } else {
                return Promise.reject('Rejected by next call');
            }
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
