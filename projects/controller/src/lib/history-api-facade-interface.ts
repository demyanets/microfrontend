export interface IHistoryApiFacade {
    /**
     * Facade for go navigation
     * @param url
     * @param title
     * @param click
     */
    go(url: string, title?: string, click?: boolean): void;
}
