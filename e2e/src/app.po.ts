import { browser, by, element, ElementFinder, ElementArrayFinder, promise } from 'protractor';

export class NgPackagedPage {
    waitUntilpageLoads(): void {
        browser.waitForAngularEnabled(false);
    }

    async navigateTo(): Promise<string> {
        return await browser.get('/');
    }

    async getParagraphText(id: string): Promise<string> {
        return element(by.id(id)).getText();
    }

    async getPageHeaderText(): Promise<string> {
        const el: ElementFinder = await element(by.tagName('h1'));
        return await el.getText();
    }

    getCurrentUrl(): promise.Promise<string> {
        return browser.getCurrentUrl();
    }

    getPageUrl(): promise.Promise<string> {
        return browser.executeScript('return document.location.href');
    }

    async getIframeUrl(id: string): Promise<string> {
        await this.switchToIframe(id);
        return await this.getPageUrl();
    }

    async getUrlOfVisibleIframe(): Promise<string> {
        const iframes: ElementArrayFinder = this.getElements('iframe');
        const visibleIframes: ElementArrayFinder = iframes.filter((iframe) => {
            return iframe.isDisplayed();
        });
        const visibleIframeId: string = await visibleIframes.first().getAttribute('id');
        return this.getIframeUrl(visibleIframeId);
    }

    async switchToIframe(id: string): Promise<void> {
        const driver = browser.driver;
        const loc = by.id(id);
        const el = await driver.findElement(loc);
        return await browser.switchTo().frame(el);
    }

    async switchToMainFrame(): Promise<void> {
        await browser.switchTo().defaultContent();
    }

    async clickLink(selector: string): Promise<void> {
        const el: ElementFinder = await element(by.css(selector));
        await el.click();
    }

    async clickTo(url: string): Promise<void> {
        const el: ElementFinder = await element(by.css(`a[href*= ${url}]`));
        await el.click();
    }

    async isElementVisible(id: string): Promise<boolean> {
        return await element(by.id(id)).isDisplayed();
    }

    async navigateToBack(): Promise<void> {
        return await browser.navigate().back();
    }

    async navigateToForward(): Promise<void> {
        return await browser.navigate().forward();
    }

    getWindowSize(): promise.Promise<{ width: number; height: number }> {
        return browser.driver
            .manage()
            .window()
            .getSize();
    }

    setWindowSize(width: number, height: number): promise.Promise<void> {
        return browser.driver
            .manage()
            .window()
            .setSize(width, height);
    }

    getIdOfVisibleIframe(): promise.Promise<string> {
        const visibleIframes: ElementArrayFinder = this.getVisibleElements('iframe');
        return visibleIframes.first().getAttribute('id');
    }

    async getElementsCount(el: string): Promise<number> {
        return await this.getElements(el).count();
    }

    async getVisibleElementsCount(el: string): Promise<number> {
        return await this.getVisibleElements(el).count();
    }

    async getIframeHeight(id: string): Promise<number> {
        return (await element(by.id(id)).getSize()).height;
    }

    getDocumentElementHeight(): promise.Promise<number> {
        return browser.executeScript('return document.documentElement.offsetHeight');
    }

    getElements(elem: string): ElementArrayFinder {
        return element.all(by.tagName(elem));
    }

    private getVisibleElements(el: string): ElementArrayFinder {
        const elements: ElementArrayFinder = this.getElements(el);
        const visibleElements: ElementArrayFinder = elements.filter((ef) => {
            return ef.isDisplayed();
        });
        return visibleElements;
    }

    getUrlFragment(url: string): string {
        return url.split('#')[1];
    }
}
