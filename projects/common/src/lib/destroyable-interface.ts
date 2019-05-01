export interface IDestroyable {
    /**
     * Destroy object
     */
    destroy(): void;

    /**
     * Provides information if object was already destroyed
     */
    isDestroyed(): boolean;

    /**
     * Prevents any usage of object after destruction
     */
    preventUsageUponDestruction(): void;
}
