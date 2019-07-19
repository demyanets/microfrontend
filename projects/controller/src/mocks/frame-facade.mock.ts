import { timer } from 'rxjs/internal/observable/timer';
import { MessageMetaRouted, Destroyable, IMap, MessageBase, MessageBroadcast, MESSAGE_META_ROUTED } from '@microfrontend/common';
import { IFrameFacade } from '../lib/frame-facade-interface';
import { AppRoute } from '../lib/app-route';
import { FrameConfig } from '../lib/frame-config';

export class FrameFacadeMock extends Destroyable implements IFrameFacade {
    public static initDelay = 0;
    public size: number = 0;
    public visible: boolean = false;
    public readonly messages: MessageBase[] = [];
    public lastStyles: IMap<string> = {};

    constructor(
        public readonly route: AppRoute,
        public readonly baseUrl: string,
        public readonly outletName: string,
        public readonly config: FrameConfig,
        public readonly FrameFacadeMockInitShouldBeSuccess: boolean = true,
    ) {
        super();
    }

    async initialize(): Promise<IFrameFacade> {
        const me = this;
        return new Promise<IFrameFacade>((resolve, reject) => {
            const source = timer(FrameFacadeMock.initDelay);
            // Reset delay to simulate race conditions
            FrameFacadeMock.initDelay = 0;
            const subscribe = source.subscribe((val) => {
                if (me.FrameFacadeMockInitShouldBeSuccess)
                    resolve(me);
                else
                    reject(me);
            });
        });
    }

    /**
     * Post message into the frame
     */
    postMessage(msg: MessageBroadcast | MessageMetaRouted): void {
        this.messages.push(msg);
    }

    /**
     * Provides visibility status of the frame
     */
    isVisible(): boolean {
        return this.visible;
    }

    /**
     * Hide frame
     */
    hide(): void {
        this.visible = false;
    }

    /**
     * Show frame
     */
    show(): void {
        this.visible = true;
    }

    setStyles(styles: IMap<string>): void {
        this.lastStyles = styles;
    }

    /**
     * Gets custom configuration
     */
    getCustomConfig(): IMap<string> {
        return { testing: "helloWorld" };
    }

    getRoute(): AppRoute {
        return this.route;
    }

    /**
     * Destroys object
     */
    destroy(): void {
        super.destroy();
    }
}
