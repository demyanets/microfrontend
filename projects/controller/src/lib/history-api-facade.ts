import { IHistoryApiFacade } from './history-api-facade-interface';

/**
 * Encapsulates HistoryAPI handling
 */
export class HistoryApiFacade implements IHistoryApiFacade {
    /**
     * Navigate to the url
     * @param url page url
     * @param title page title
     */
    go(url: string, title?: string, click?: boolean): void {
        const current = window.location.pathname + window.location.hash;

        const t: string = title ? title : '';

        if (click && current !== url) {
            history.pushState({}, t, url);
        } else {
            history.replaceState({}, t, url);
        }
    }
}
