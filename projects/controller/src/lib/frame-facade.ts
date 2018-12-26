import {
    ATTRIBUTE_NAME_CUSTOM_CONFIG,
    Destroyable,
    IMap,
    MessageBroadcast,
    MessageGetCustomFrameConfiguration,
    MessageMetaRouted,
    STYLE_NAME_DISPLAY
} from '@microfrontend/common';
import { FrameConfig } from './frame-config';
import { AppRoute } from './app-route';
import { IFrameFacade } from './frame-facade-interface';
import { ATTRIBUTE_NAME_ID, ATTRIBUTE_NAME_SRC, ATTRIBUTE_NAME_STYLE, DEFAULT_OUTLET_STYLE_NAME } from './constants';

/**
 * Encapsulates outlet frame handling
 */
export class FrameFacade extends Destroyable implements IFrameFacade {
    /** Encapsulated iFrame */
    private iframe?: HTMLIFrameElement;

    constructor(
        private readonly route: AppRoute,
        private readonly baseUrl: string,
        private readonly outletName: string,
        private readonly config: FrameConfig
    ) {
        super();
    }

    /**
     * Async initialization
     */
    async initialize(): Promise<IFrameFacade> {
        return new Promise<IFrameFacade>((resolve, reject) => {
            const iframe = this.createIframe(this.outletName);
            iframe.onload = (ev: Event) => {
                this.iframe = iframe;
                resolve(this);
            };
        });
    }

    /**
     * Exposes related AppRoute
     */
    getRoute(): AppRoute {
        this.preventUsageUponDestruction();
        return this.route;
    }

    /**
     * Get frame outlet
     */
    private static getOutlet(outletName: string): HTMLElement {
        const outlet = document.getElementById(outletName);
        if (outlet !== null) {
            return outlet;
        } else {
            throw new Error(`Outlet does not exist: ${outlet}`);
        }
    }

    /**
     * Create frame if necessary
     */
    private createIframe(outletName: string): HTMLIFrameElement {
        let url = '';

        if (this.route.subRoute) {
            url = `${this.baseUrl}#${this.config.hashPrefix}${this.route.subRoute}`;
        } else {
            url = this.baseUrl;
        }

        const iframe = document.createElement('iframe');
        iframe.style[STYLE_NAME_DISPLAY] = 'none';
        iframe.src = url;
        iframe.id = this.route.metaRoute;
        iframe.className = DEFAULT_OUTLET_STYLE_NAME;

        const customConfig = JSON.stringify(this.config.custom);
        iframe.setAttribute(ATTRIBUTE_NAME_CUSTOM_CONFIG, customConfig);

        this.setAttributesInner(iframe, this.config.attributes);
        this.setStylesInner(iframe, this.config.styles);

        const outlet = FrameFacade.getOutlet(outletName);
        outlet.appendChild(iframe);

        return iframe;
    }

    /**
     * Removes frame if necessary
     */
    private removeIframe(outletName: string): void {
        if (this.iframe) {
            const outlet = FrameFacade.getOutlet(outletName);
            outlet.removeChild(this.iframe);
        }
    }

    /**
     * Destroys object
     */
    destroy(): void {
        super.destroy();
        this.removeIframe(this.outletName);
    }

    /**
     * Post message into the frame
     */
    postMessage(msg: MessageBroadcast | MessageMetaRouted | MessageGetCustomFrameConfiguration): void {
        if (this.iframe) {
            this.preventUsageUponDestruction();
            if (this.iframe.contentWindow !== null) {
                this.iframe.contentWindow.postMessage(msg, this.baseUrl);
            }
        }
    }

    /**
     * Hide frame
     */
    hide(): void {
        if (this.iframe) {
            this.preventUsageUponDestruction();
            this.iframe.style[STYLE_NAME_DISPLAY] = 'none';
        }
    }

    /**
     * Show frame
     */
    show(): void {
        if (this.iframe) {
            this.preventUsageUponDestruction();
            this.iframe.style[STYLE_NAME_DISPLAY] = 'block';
        }
    }

    /**
     * Sets iframe attributes
     */
    private setAttributesInner(iframe: HTMLIFrameElement, attributes: IMap<string>): void {
        for (const attrib in attributes) {
            if (attributes.hasOwnProperty(attrib)) {
                switch (attrib) {
                    case ATTRIBUTE_NAME_ID:
                    case ATTRIBUTE_NAME_SRC:
                    case ATTRIBUTE_NAME_STYLE:
                    case ATTRIBUTE_NAME_CUSTOM_CONFIG:
                        break;

                    default:
                        iframe.setAttribute(attrib, attributes[attrib]);
                }
            }
        }
    }

    /**
     * Gets custom configration
     */
    getCustomConfig(): IMap<string> {
        return this.config.custom;
    }

    /**
     * Sets iframe styles
     */
    setStyles(styles: IMap<string>): void {
        if (this.iframe) {
            this.preventUsageUponDestruction();
            this.setStylesInner(this.iframe, styles);
        }
    }

    /**
     * Sets iframe styles
     */
    private setStylesInner(iframe: HTMLIFrameElement, styles: IMap<string>): void {
        for (const s in styles) {
            if (styles.hasOwnProperty(s)) {
                if (s !== STYLE_NAME_DISPLAY) {
                    iframe.style.setProperty(s, styles[s]);
                }
            }
        }
    }
}
