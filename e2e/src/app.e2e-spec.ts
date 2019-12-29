/* tslint:disable:no-console */
/* tslint:disable:no-magic-numbers */

import { NgPackagedPage } from './app.po';

describe('meta-router App', () => {
    let page: NgPackagedPage = new NgPackagedPage();
    const baseUrl: string = 'http://localhost:30103/';
    const iframeInternalMarginDelta = 20;

    beforeAll(() => {
        page.waitUntilpageLoads();
    });

    beforeEach(async () => {
        page = new NgPackagedPage();
        await page.navigateTo();
    });

    /**
     * testCurrentUrl
     */
    // tslint:disable-next-line:completed-docs
    async function testCurrentUrl(expectedUrl: string, message: string): Promise<void> {
        const url = await page.getCurrentUrl();
        console.log(message, `Expected: ${expectedUrl}`, 'Actual: ' + page.getUrlFragment(await page.getCurrentUrl()));
        expect(baseUrl + expectedUrl).toBe(url);
    }

    /**
     * testBack
     */
    // tslint:disable-next-line:completed-docs
    async function testBack(expectedUrl: string, message: string): Promise<void> {
        await page.navigateToBack();
        await testCurrentUrl(expectedUrl, message);
    }

    /**
     * clickLinkAndTest
     */
    // tslint:disable-next-line:completed-docs
    async function clickLinkAndTest(linkToClick: string, expectedUrl: string, message: string): Promise<void> {
        await page.clickLink(linkToClick);
        await testCurrentUrl(expectedUrl, message);
    }

    describe('Basic tests', () => {
        it('"link-a" should display message containing "Route to A"', async () => {
            expect(await page.getParagraphText('link-a')).toContain('Route to A');
        });

        it('"link-b" should display message containing "Route to B"', async () => {
            expect(await page.getParagraphText('link-b')).toContain('Route to B');
        });

        it('should create iframes based on the custom provided', async () => {
            expect(await page.getElementsCount('iframe')).toBe(2);
        });

        it('microfrontend app should be loaded inside the iframes', async () => {
            await page.switchToIframe('a');
            expect(await page.getPageHeaderText()).toContain('Welcome to A!');
        });
    });

    describe('layouting', () => {
        async function verifyVisibleFrameHeight(): Promise<void> {
            const visibleFrameId = await page.getIdOfVisibleIframe();
            const iFrameHeight: number = await page.getIframeHeight(visibleFrameId);
            await page.switchToIframe(visibleFrameId);
            const iDocHeight: number = await page.getDocumentElementHeight();
            console.log(`*****************docHeight - ${iDocHeight} frameHeight - ${iFrameHeight}**********`);
            expect(iDocHeight >= iFrameHeight - iframeInternalMarginDelta && iDocHeight <= iFrameHeight + iframeInternalMarginDelta).toBeTruthy();
        }

        it('should display one iframe at a time', async () => {
            expect(await page.getElementsCount('iframe')).toBe(2);
            expect(await page.getVisibleElementsCount('iframe')).toBe(1);
        });

        /*
        it('iframe height should be recalculated and set correctly on screen size change', async () => {
            const existingSize: { width: number; height: number } = await page.getWindowSize();
            await page.setWindowSize(1280, 600);
            await verifyVisibleFrameHeight();
            await page.setWindowSize(existingSize.width, existingSize.height);
        });

        it('iframe height should be set correctly', async () => {
            await verifyVisibleFrameHeight();
        });
        */
    });

    describe('navigation', () => {
        it('should navigate to correct meta route when click on the corresponding navigation links', async () => {
            await page.clickLink('#link-b');
            const url: string = await page.getUrlOfVisibleIframe();
            expect(url).toBe('http://localhost:30809/');
        });

        it('should navigate to correct sub route when click on the corresponding navigation link', async () => {
            await page.clickLink('#link-ab');
            const url: string = await page.getPageUrl();

            expect(url).toBe(baseUrl + '#a/b');
        });

        it('should activate proper route when clicked on the micro frontend route', async () => {
            await page.switchToIframe('a');
            await page.clickTo('"#/b"');
            await page.switchToMainFrame();
            const url: string = await page.getPageUrl();
            expect(url).toBe(baseUrl + '#a/b');
        });

        it('should update url properly when click on a navigation link', async () => {
            let url: string = await page.getCurrentUrl();
            await page.clickLink('#link-b');
            url = await page.getCurrentUrl();
            expect(baseUrl + '#b!a').toBe(url);
        });
    });

    describe('browser backward button functionalities', () => {
        it('should skip state when navigate back (skipLocationChange: true)', async () => {
            let url: string = await page.getCurrentUrl();
            expect(baseUrl + '#a').toBe(url);

            await page.clickLink('#link-aa'); // result url => #a/a
            console.log('On clicking sub route a within a', 'Expect: a/a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.switchToIframe('a');
            await page.clickLink('#router-link-a'); // result url => #a/a
            console.log('On clicking sub route a within a', 'Expect: a/a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await page.switchToMainFrame();

            await page.navigateToBack(); // result url => #a
            url = await page.getCurrentUrl();
            console.log('On clicking 1st time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a').toBe(url);
        });

        it('should skip state when navigate back (skipLocationChange: false)', async () => {
            const url: string = await page.getCurrentUrl();
            expect(baseUrl + '#a').toBe(url);

            await clickLinkAndTest('#link-b',  '#b!a', 'On clicking meta route b');
            await clickLinkAndTest('#link-ab',  '#a/b!b', 'On clicking sub route b within a');

            await page.switchToIframe('a');
            await clickLinkAndTest('#router-link-c',  '#a/c!b', 'On clicking sub route c within a');
            await clickLinkAndTest('#router-link-d',  '#a/d!b', 'On clicking sub route d within a');

            await testBack('#a/c!b', 'On clicking 1st time back button');
            await testBack('#a/b!b', 'On clicking 2nd time back button');
            await testBack('#b!a', 'On clicking 3rd time back button');
        });

        fit('should perform back navigation correct when repeated', async () => {
            const url: string = await page.getCurrentUrl();
            expect(baseUrl + '#a').toBe(url);

            await clickLinkAndTest('#link-b',  '#b!a', 'On clicking meta route b');
            await clickLinkAndTest('#link-ab',  '#a/b!b', 'On clicking sub route b within a');

            await testBack('#b!a', 'On clicking 3rd time back button');

            await clickLinkAndTest('#link-ab',  '#a/b!b', 'On clicking sub route b within a');
            await page.switchToIframe('a');

            await clickLinkAndTest('#router-link-c',  '#a/c!b', 'On clicking sub route c within a');

            await testBack('#a/b!b', 'On clicking 2nd time back button');
        });

        it('should activate old state page when navigate one time back', async () => {
            await page.clickLink('#link-b'); // result url => #b!a
            console.log('**** should activate old state page when navigate one time back');
            console.log('On clicking meta route b', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #a
            console.log('On clicking 1st time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            const url: string = await page.getCurrentUrl();
            expect(baseUrl + '#a').toBe(url);
        });

        it('should activate old state page when navigate three times back', async () => {
            await page.clickLink('#link-b'); // result url => #b!a
            console.log('**** should activate old state page when navigate three times back');
            console.log('On clicking meta route b', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.clickLink('#link-aa'); // result url => #a/a!b
            console.log('On clicking sub route a within a', 'Expect: a/a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.clickLink('#link-ab'); // result url => #a/b!b
            console.log('On clicking sub route b within a', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #a/a!b
            let url: string = await page.getCurrentUrl();
            console.log('On clicking 1st time back button', 'Expect: a/a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a/a!b').toBe(url);

            await page.navigateToBack();
            url = await page.getCurrentUrl(); // result url => #b!a
            console.log('On clicking 2nd time back button', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#b!a').toBe(url);

            await page.navigateToBack();
            url = await page.getCurrentUrl(); // result url => #a
            console.log('On clicking 3rd time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a').toBe(url);
        });

        it('should navigate to back route properly when navigate 2 times back, then 2 times forward and assert 3 times backward ', async () => {
            await page.clickLink('#link-b'); // result url => #b!a
            console.log('**** should navigate to back route properly when navigate 2 times back, then 2 times forward and assert 3 times backward');
            console.log('On clicking meta route b', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.clickLink('#link-aa'); // result url => #a/a!b
            console.log('On clicking sub route a within a', 'Expect: a/a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.clickLink('#link-ab'); // result url => #a/b!b
            console.log('On clicking sub route b within a', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // #a/a!b
            console.log('On clicking 1st time back button', 'Expect: a/a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // #b!a
            console.log('On clicking 2nd time back button', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToForward(); // result url => #a/a!b
            console.log('On clicking 1st time forward button', 'Expect: a/a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToForward(); // result url => #a/b!b
            console.log('On clicking 2nd time forward button', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #a/a!b
            let url: string = await page.getCurrentUrl();
            console.log('On clicking 1st time back button again', 'Expect: a/a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a/a!b').toBe(url);

            await page.navigateToBack(); // result url => #b!a
            console.log('On clicking 2nd time back button again', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            url = await page.getCurrentUrl();
            expect(baseUrl + '#b!a').toBe(url);

            await page.navigateToBack(); // result url => #a
            url = await page.getCurrentUrl();
            console.log('On clicking 3rd time back button again', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a').toBe(url);
        });

        it('should navigate to back route properly when navigate b/w microfrontend routes and meta routes', async () => {
            await page.switchToIframe('a');
            await page.clickTo('"#/b"'); // result url => #a/b
            console.log('**** should navigate to back route properly when navigate b/w microfrontend routes and meta routes');
            console.log('On clicking sub route b', 'Expect: a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.switchToMainFrame();
            await page.clickLink('#link-b'); // result url => #b!a/b
            console.log('On clicking meta route b', 'Expect: b!a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.clickLink('#link-a'); // result url => #a!b
            console.log('On clicking meta route a', 'Expect: a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #b!a/b
            console.log('On clicking 1st time back button', 'Expect: b!a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            let url: string = await page.getPageUrl();
            expect(baseUrl + '#b!a/b').toBe(url);

            await page.navigateToBack(); // result url => #a/b
            console.log('On clicking 2nd time back button', 'Expect: a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            url = await page.getCurrentUrl();
            expect(baseUrl + '#a/b').toBe(url);

            await page.navigateToBack(); // result url => #a
            console.log('On clicking 3rd time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            url = await page.getCurrentUrl();
            expect(url).toBe(baseUrl + '#a/a');
        });
    });

    describe('forward button functionalities', () => {
        it('should activate old state page when navigate one time forward', async () => {
            await page.clickLink('#link-b'); // result url => #b!a
            console.log('**** should activate old state page when navigate one time forward');
            console.log('On clicking meta route b', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #a
            console.log('On clicking 1st time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToForward(); // result url => #b!a
            console.log('On clicking 1st time forward button', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            const url: string = await page.getCurrentUrl();
            expect(baseUrl + '#b!a').toBe(url);
        });

        it('should activate old state page when navigate three times forward', async () => {
            await page.clickLink('#link-b'); // result url => #b!a
            console.log('**** should activate old state page when navigate three times forward');
            console.log('On clicking meta route b', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.clickLink('#link-aa'); // result url => #a/a!b
            console.log('On clicking meta route a within a', 'Expect: a/a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.clickLink('#link-ab'); // result url => #a/b!b
            console.log('On clicking meta route b within a', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #a/a!b
            console.log('On clicking 1st time back button', 'Expect: a/a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #b!a
            console.log('On clicking 2nd time back button', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #a
            console.log('On clicking 3rd time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToForward(); // result url => #b!a
            console.log('On clicking 1st time forward button', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            let url: string = await page.getCurrentUrl();
            expect(baseUrl + '#b!a').toBe(url);

            await page.navigateToForward();
            console.log('On clicking 2nd time forward button', 'Expect: a/a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            url = await page.getCurrentUrl(); // result url => #a/a!b
            expect(baseUrl + '#a/a!b').toBe(url);

            await page.navigateToForward();
            console.log('On clicking 3rd time forward button', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            url = await page.getCurrentUrl(); // result url => #a/b!b
            expect(baseUrl + '#a/b!b').toBe(url);
        });

        it('should navigate to forward route properly when navigate b/w microfrontend routes and meta routes', async () => {
            await page.switchToIframe('a');
            await page.clickTo('"#/b"'); // result url => #a/b
            console.log('**** should navigate to forward route properly when navigate b/w microfrontend routes and meta routes');
            console.log('On clicking sub route b', 'Expect: a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await page.switchToMainFrame();

            await page.clickLink('#link-b'); // result url => #b!a/b
            console.log('On clicking meta route b', 'Expect: b!a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.clickLink('#link-ab'); // result url => #a/b!b
            console.log('On clicking sub route b within meta route a', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #b!a/b
            console.log('On clicking 1st time back button', 'Expect: b!a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await page.navigateToBack(); // result url => #a/b

            await page.navigateToForward(); // result url => #b!a/b
            let url: string = await page.getPageUrl();
            console.log('On clicking 1st time forward button', 'Expect: b!a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#b!a/b').toBe(url);

            await page.navigateToForward();
            url = await page.getCurrentUrl(); // result url => #a/b!b
            console.log('On clicking 2nd time forward button', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a/b!b').toBe(url);
        });
    });
});
