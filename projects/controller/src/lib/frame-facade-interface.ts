import { IDestroyable, IMap, MessageBroadcast, MessageMetaRouted, MessageGetCustomFrameConfiguration } from '@microfrontend/common';
import { AppRoute } from './app-route';

export interface IFrameFacade extends IDestroyable {
    initialize(): Promise<IFrameFacade>;

    /**
     * Post message into the frame
     */
    postMessage(msg: MessageBroadcast | MessageMetaRouted | MessageGetCustomFrameConfiguration): void;

    /**
     * Provides visibility status of the frame
     */
    isVisible(): boolean;

    /**
     * Hide frame
     */
    hide(): void;

    /**
     * Show frame
     */
    show(): void;

    /**
     * Sets iframe styles
     */
    setStyles(styles: IMap<string>): void;

    /**
     * Gets custom configration
     */
    getCustomConfig(): IMap<string>;

    /**
     * Get related application route
     */
    getRoute(): AppRoute;
}
