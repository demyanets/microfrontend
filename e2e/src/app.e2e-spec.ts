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

    describe('Basic tests', () => {
        it('"link-a" should display message containing "Route to A"', async () => {
            await expect(await page.getParagraphText('link-a')).toContain('Route to A');
        });

        it('"link-b" should display message containing "Route to B"', async () => {
            await expect(await page.getParagraphText('link-b')).toContain('Route to B');
        });

        it('should create iframes based on the custom provided', async () => {
            await expect(await page.getElementsCount('iframe')).toBe(2);
        });

        it('microfrontend app should be loaded inside the iframes', async () => {
            await page.switchToIframe('a');
            await expect(await page.getPageHeaderText()).toContain('Welcome to A!');
        });
    });

    describe('layouting', () => {
        async function verifyVisibleFrameHeight(): Promise<void> {
            const visibleFrameId = await page.getIdOfVisibleIframe();
            const iFrameHeight: number = await page.getIframeHeight(visibleFrameId);
            await page.switchToIframe(visibleFrameId);
            const iDocHeight: number = await page.getDocumentElementHeight();
            console.log(`*****************docHeight - ${iDocHeight} frameHeight - ${iFrameHeight}**********`);
            await expect(iDocHeight >= iFrameHeight - iframeInternalMarginDelta && iDocHeight <= iFrameHeight + iframeInternalMarginDelta)
            .toBeTruthy();
        }

        it('should display one iframe at a time', async () => {
            await expect(await page.getElementsCount('iframe')).toBe(2);
            await expect(await page.getVisibleElementsCount('iframe')).toBe(1);
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
            await expect(url).toBe('http://localhost:30809/');
        });

        it('should navigate to correct sub route when click on the corresponding navigation link', async () => {
            await page.clickLink('#link-ab');
            const url: string = await page.getPageUrl();

            await expect(url).toBe(baseUrl + '#a/b');
        });

        it('should activate proper route when clicked on the micro frontend route', async () => {
            await page.switchToIframe('a');
            await page.clickTo('"#/b"');
            await page.switchToMainFrame();
            const url: string = await page.getPageUrl();
            await expect(url).toBe(baseUrl + '#a/b');
        });

        it('should update url properly when click on a navigation link', async () => {
            let url: string = await page.getCurrentUrl();
            await page.clickLink('#link-b');
            url = await page.getCurrentUrl();
            await expect(baseUrl + '#b!a').toBe(url);
        });
    });

    describe('browser backward button functionalities', () => {
        it('should skip state when navigate back (skipLocationChange: true)', async () => {
            let url: string = await page.getCurrentUrl();
            await expect(baseUrl + '#a').toBe(url);

            await page.clickLink('#link-aa'); // result url => #a/a
            console.log('On clicking sub route a within a', 'Expect: a/a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.switchToIframe('a');
            await page.clickLink('#router-link-a'); // result url => #a/a
            console.log('On clicking sub route a within a', 'Expect: a/a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await page.switchToMainFrame();

            await page.navigateToBack(); // result url => #a
            url = await page.getCurrentUrl();
            console.log('On clicking 1st time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#a').toBe(url);
        });

        it('should skip state when navigate back (skipLocationChange: false)', async () => {
            let url: string = await page.getCurrentUrl();
            await expect(baseUrl + '#a').toBe(url);

            await page.clickLink('#link-b'); // result url => #b!a
            url = await page.getCurrentUrl();
            console.log('On clicking meta route b', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#b!a').toBe(url);

            await page.clickLink('#link-ab'); // result url => #a/b!b
            url = await page.getCurrentUrl();
            console.log('On clicking sub route b within a', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#a/b!b').toBe(url);

            await page.switchToIframe('a');
            await page.clickLink('#router-link-c'); // result url => #a/c!b
            url = await page.getCurrentUrl();
            console.log('On clicking sub route c within a', 'Expect: a/c!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#a/c!b').toBe(url);

            await page.clickLink('#router-link-d'); // result url => #a/d!b
            url = await page.getCurrentUrl();
            console.log('On clicking sub route c within a', 'Expect: a/d!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#a/d!b').toBe(url);

            // #BACK1
            await page.navigateToBack(); // result url => '#a/c!b'
            url = await page.getCurrentUrl();
            console.log('On clicking 1st time back button', 'Expect: a/c!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#a/c!b').toBe(url);
            // #BACK2
            await page.navigateToBack(); // result url => '#a/b!b'
            url = await page.getCurrentUrl();
            console.log('On clicking 1st time back button', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#a/b!b').toBe(url);

            // #BACK3
            await page.navigateToBack(); // result url => '#b!a'
            url = await page.getCurrentUrl();
            console.log('On clicking 1st time back button', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#b!a').toBe(url);
        });

        it('should activate old state page when navigate one time back', async () => {
            await page.clickLink('#link-b'); // result url => #b!a
            console.log('**** should activate old state page when navigate one time back');
            console.log('On clicking meta route b', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #a
            console.log('On clicking 1st time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            const url: string = await page.getCurrentUrl();
            await expect(baseUrl + '#a').toBe(url);
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
            await expect(baseUrl + '#a/a!b').toBe(url);

            await page.navigateToBack();
            url = await page.getCurrentUrl(); // result url => #b!a
            console.log('On clicking 2nd time back button', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#b!a').toBe(url);

            await page.navigateToBack();
            url = await page.getCurrentUrl(); // result url => #a
            console.log('On clicking 3rd time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#a').toBe(url);
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
            await expect(baseUrl + '#a/a!b').toBe(url);

            await page.navigateToBack(); // result url => #b!a
            console.log('On clicking 2nd time back button again', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            url = await page.getCurrentUrl();
            await expect(baseUrl + '#b!a').toBe(url);

            await page.navigateToBack(); // result url => #a
            url = await page.getCurrentUrl();
            console.log('On clicking 3rd time back button again', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#a').toBe(url);
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
            await expect(baseUrl + '#b!a/b').toBe(url);

            await page.navigateToBack(); // result url => #a/b
            console.log('On clicking 2nd time back button', 'Expect: a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            url = await page.getCurrentUrl();
            await expect(baseUrl + '#a/b').toBe(url);

            await page.navigateToBack(); // result url => #a
            console.log('On clicking 3rd time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            url = await page.getCurrentUrl();
            await expect(url).toBe(baseUrl + '#a/a');
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
            await expect(baseUrl + '#b!a').toBe(url);
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
            await expect(baseUrl + '#b!a').toBe(url);

            await page.navigateToForward();
            console.log('On clicking 2nd time forward button', 'Expect: a/a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            url = await page.getCurrentUrl(); // result url => #a/a!b
            await expect(baseUrl + '#a/a!b').toBe(url);

            await page.navigateToForward();
            console.log('On clicking 3rd time forward button', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            url = await page.getCurrentUrl(); // result url => #a/b!b
            await expect(baseUrl + '#a/b!b').toBe(url);
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
            await expect(baseUrl + '#b!a/b').toBe(url);

            await page.navigateToForward();
            url = await page.getCurrentUrl(); // result url => #a/b!b
            console.log('On clicking 2nd time forward button', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            await expect(baseUrl + '#a/b!b').toBe(url);
        });
    });
});
