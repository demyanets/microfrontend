export interface IDestroyable {
    destroy(): void;
    isDestroyed(): boolean;
    preventUsageUponDestruction(): void;
}
