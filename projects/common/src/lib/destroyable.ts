import { IDestroyable } from './destroyable-interface';

/**
 * Abstract base class for destroyable classes
 */
export class Destroyable implements IDestroyable {
    /** Destroyed flag */
    private destroyed: boolean = false;

    /**
     * Destroy object
     */
    destroy(): void {
        this.preventUsageUponDestruction();
        this.destroyed = true;
    }

    /**
     * Provides information if object was already destroyed
     */
    isDestroyed(): boolean {
        return this.destroyed;
    }

    /**
     * Prevents any usage of object after destruction
     */
    preventUsageUponDestruction(): void {
        if (this.destroyed) {
            throw new Error('Object has been already destroyed!');
        }
    }
}
