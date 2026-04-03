import { type Page, type FrameLocator } from '@playwright/test';

export class AppPage {
  private activeFrame: Page | FrameLocator;

  constructor(private page: Page) {
    this.activeFrame = page;
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForSelector('iframe');
  }

  async getParagraphText(id: string): Promise<string> {
    return this.page.locator(`#${id}`).innerText();
  }

  async getPageHeaderText(): Promise<string> {
    return (this.activeFrame as FrameLocator).locator('h1').innerText();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getPageUrl(): Promise<string> {
    return this.page.evaluate(() => document.location.href);
  }

  async switchToIframe(id: string): Promise<void> {
    this.activeFrame = this.page.frameLocator(`iframe#${id}`);
  }

  async switchToMainFrame(): Promise<void> {
    this.activeFrame = this.page;
  }

  async getUrlOfVisibleIframe(): Promise<string> {
    const iframes = this.page.locator('iframe');
    const count = await iframes.count();
    for (let i = 0; i < count; i++) {
      const iframe = iframes.nth(i);
      if (await iframe.isVisible()) {
        const id = await iframe.getAttribute('id');
        if (id) {
          // Use the iframe's FrameLocator to evaluate location.href inside the frame
          const frameLocator = this.page.frameLocator(`iframe#${id}`);
          return frameLocator.locator('html').evaluate(() => document.location.href);
        }
      }
    }
    return '';
  }

  async getIdOfVisibleIframe(): Promise<string> {
    const iframes = this.page.locator('iframe');
    const count = await iframes.count();
    for (let i = 0; i < count; i++) {
      const iframe = iframes.nth(i);
      if (await iframe.isVisible()) {
        return (await iframe.getAttribute('id')) ?? '';
      }
    }
    return '';
  }

  async clickLink(selector: string): Promise<void> {
    if (this.activeFrame === this.page) {
      await this.page.locator(selector).click();
    } else {
      await (this.activeFrame as FrameLocator).locator(selector).click();
    }
    await this.page.waitForTimeout(300);
  }

  async clickTo(url: string): Promise<void> {
    await (this.activeFrame as FrameLocator).locator(`a[href*= ${url}]`).click();
    await this.page.waitForTimeout(300);
  }

  async getElementsCount(tagName: string): Promise<number> {
    return this.page.locator(tagName).count();
  }

  async getVisibleElementsCount(tagName: string): Promise<number> {
    const elements = this.page.locator(tagName);
    const count = await elements.count();
    let visibleCount = 0;
    for (let i = 0; i < count; i++) {
      if (await elements.nth(i).isVisible()) {
        visibleCount++;
      }
    }
    return visibleCount;
  }

  async getIframeHeight(id: string): Promise<number> {
    const box = await this.page.locator(`iframe#${id}`).boundingBox();
    return box?.height ?? 0;
  }

  async getDocumentElementHeight(): Promise<number> {
    return (this.activeFrame as FrameLocator).locator('html').evaluate(
      (el) => (el as HTMLElement).offsetHeight
    );
  }

  async navigateToBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'load' });
    await this.page.waitForTimeout(300);
  }

  async navigateToForward(): Promise<void> {
    await this.page.goForward({ waitUntil: 'load' });
    await this.page.waitForTimeout(300);
  }

  getUrlFragment(url: string): string {
    return url.split('#')[1];
  }
}
