import { browser, by, element, ElementArrayFinder, ElementFinder, promise } from 'protractor';

/**
 * NgPackagedPage
 */
export class NgPackagedPage {
    /**
     * This method will wait until page is fully loaded
     */
    waitUntilpageLoads(): void {
        browser.waitForAngularEnabled(false);
    }

    /**
     * This method will navigate to root
     */
    async navigateTo(): Promise<string> {
        return await browser.get('/');
    }

    /**
     * Gets paragraph text
     * @param id
     * @returns paragraph text
     */
    async getParagraphText(id: string): Promise<string> {
        return element(by.id(id)).getText();
    }

    /**
     * Gets page header text
     * @returns page header text
     */
    async getPageHeaderText(): Promise<string> {
        const el: ElementFinder = await element(by.tagName('h1'));
        return await el.getText();
    }

    /**
     * Gets current url
     * @returns current url
     */
    getCurrentUrl(): promise.Promise<string> {
        return browser.getCurrentUrl();
    }

    /**
     * Gets page url
     * @returns page url
     */
    getPageUrl(): promise.Promise<string> {
        return browser.executeScript('return document.location.href');
    }

    /**
     * Gets iframe url
     * @param id
     * @returns iframe url
     */
    async getIframeUrl(id: string): Promise<string> {
        await this.switchToIframe(id);
        return await this.getPageUrl();
    }

    /**
     * Gets url of visible iframe
     * @returns url of visible iframe
     */
    async getUrlOfVisibleIframe(): Promise<string> {
        const iframes: ElementArrayFinder = this.getElements('iframe');
        const visibleIframes: ElementArrayFinder = iframes.filter((iframe) => {
            return iframe.isDisplayed();
        });
        const visibleIframeId: string = await visibleIframes.first().getAttribute('id');
        return this.getIframeUrl(visibleIframeId);
    }

    /**
     * Switchs to iframe
     * @param id
     * @returns to iframe
     */
    async switchToIframe(id: string): Promise<void> {
        const driver = browser.driver;
        const loc = by.id(id);
        const el = await driver.findElement(loc);
        return await browser.switchTo().frame(el);
    }

    /**
     * Switchs to main frame
     * @returns to main frame
     */
    async switchToMainFrame(): Promise<void> {
        await browser.switchTo().defaultContent();
    }

    /**
     * Clicks link
     * @param selector
     * @returns link
     */
    async clickLink(selector: string): Promise<void> {
        const el: ElementFinder = await element(by.css(selector));
        await el.click();
    }

    /**
     * Clicks to
     * @param url
     * @returns to
     */
    async clickTo(url: string): Promise<void> {
        const el: ElementFinder = await element(by.css(`a[href*= ${url}]`));
        await el.click();
    }

    /**
     * Determines whether element visible is
     * @param id
     * @returns element visible
     */
    async isElementVisible(id: string): Promise<boolean> {
        return await element(by.id(id)).isDisplayed();
    }

    /**
     * Navigates to back
     * @returns to back
     */
    async navigateToBack(): Promise<void> {
        return await browser.navigate().back();
    }

    /**
     * Navigates to forward
     * @returns to forward
     */
    async navigateToForward(): Promise<void> {
        return await browser.navigate().forward();
    }

    /**
     * Gets window size
     * @returns window size
     */
    getWindowSize(): promise.Promise<{ width: number; height: number }> {
        return browser.driver
            .manage()
            .window()
            .getSize();
    }

    /**
     * Sets window size
     * @param width
     * @param height
     * @returns window size
     */
    setWindowSize(width: number, height: number): promise.Promise<void> {
        return browser.driver
            .manage()
            .window()
            .setSize(width, height);
    }

    /**
     * Gets id of visible iframe
     * @returns id of visible iframe
     */
    getIdOfVisibleIframe(): promise.Promise<string> {
        const visibleIframes: ElementArrayFinder = this.getVisibleElements('iframe');
        return visibleIframes.first().getAttribute('id');
    }

    /**
     * Gets elements count
     * @param el
     * @returns elements count
     */
    async getElementsCount(el: string): Promise<number> {
        return await this.getElements(el).count();
    }

    /**
     * Gets visible elements count
     * @param el
     * @returns visible elements count
     */
    async getVisibleElementsCount(el: string): Promise<number> {
        return await this.getVisibleElements(el).count();
    }

    /**
     * Gets iframe height
     * @param id
     * @returns iframe height
     */
    async getIframeHeight(id: string): Promise<number> {
        return (await element(by.id(id)).getSize()).height;
    }

    /**
     * Gets document element height
     * @returns document element height
     */
    getDocumentElementHeight(): promise.Promise<number> {
        return browser.executeScript('return document.documentElement.offsetHeight');
    }

    /**
     * Gets elements
     * @param elem
     * @returns elements
     */
    getElements(elem: string): ElementArrayFinder {
        return element.all(by.tagName(elem));
    }

    /**
     * Gets visible elements
     * @param el
     * @returns visible elements
     */
    private getVisibleElements(el: string): ElementArrayFinder {
        const elements: ElementArrayFinder = this.getElements(el);
        const visibleElements: ElementArrayFinder = elements.filter((ef) => {
            return ef.isDisplayed();
        });
        return visibleElements;
    }

    /**
     * Gets url fragment
     * @param url
     * @returns url fragment
     */
    getUrlFragment(url: string): string {
        return url.split('#')[1];
    }
}
