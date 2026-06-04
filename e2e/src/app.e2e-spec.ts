import { test, expect } from '@playwright/test';
import { AppPage } from './app.po';

const baseUrl = 'http://localhost:30103/';

test.describe('meta-router App', () => {
    let page: AppPage;

    test.beforeEach(async ({ page: playwrightPage }) => {
        page = new AppPage(playwrightPage);
        await page.navigateTo();
    });

    test.describe('Basic tests', () => {
        test('"link-a" should display message containing "Route to A"', async () => {
            expect(await page.getParagraphText('link-a')).toContain('Route to A');
        });

        test('"link-b" should display message containing "Route to B"', async () => {
            expect(await page.getParagraphText('link-b')).toContain('Route to B');
        });

        test('should create iframes based on the custom provided', async () => {
            expect(await page.getElementsCount('iframe')).toBe(2);
        });

        test('microfrontend app should be loaded inside the iframes', async () => {
            await page.switchToIframe('a');
            expect(await page.getPageHeaderText()).toContain('Welcome to A!');
        });
    });

    test.describe('layouting', () => {
        test('should display one iframe at a time', async () => {
            expect(await page.getElementsCount('iframe')).toBe(2);
            expect(await page.getVisibleElementsCount('iframe')).toBe(1);
        });
    });

    test.describe('navigation', () => {
        test('should navigate to correct meta route when click on the corresponding navigation links', async () => {
            await page.clickLink('#link-b');
            const url = await page.getUrlOfVisibleIframe();
            expect(url).toBe('http://localhost:30809/');
        });

        test('should navigate to correct sub route when click on the corresponding navigation link', async () => {
            await page.clickLink('#link-ab');
            const url = await page.getPageUrl();
            expect(url).toBe(baseUrl + '#a/b');
        });

        test('should activate proper route when clicked on the micro frontend route', async () => {
            await page.switchToIframe('a');
            await page.clickTo('"#/b"');
            await page.switchToMainFrame();
            const url = await page.getPageUrl();
            expect(url).toBe(baseUrl + '#a/b');
        });

        test('should update url properly when click on a navigation link', async () => {
            await page.clickLink('#link-b');
            const url = await page.getCurrentUrl();
            expect(baseUrl + '#b!a').toBe(url);
        });
    });

    test.describe('browser backward button functionalities', () => {
        test('should skip state when navigate back (skipLocationChange: true)', async () => {
            let url = await page.getCurrentUrl();
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

        test('should skip state when navigate back (skipLocationChange: false)', async () => {
            let url = await page.getCurrentUrl();
            expect(baseUrl + '#a').toBe(url);

            await page.clickLink('#link-b'); // result url => #b!a
            url = await page.getCurrentUrl();
            console.log('On clicking meta route b', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#b!a').toBe(url);

            await page.clickLink('#link-ab'); // result url => #a/b!b
            url = await page.getCurrentUrl();
            console.log('On clicking sub route b within a', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a/b!b').toBe(url);

            await page.switchToIframe('a');
            await page.clickLink('#router-link-c'); // result url => #a/c!b
            url = await page.getCurrentUrl();
            console.log('On clicking sub route c within a', 'Expect: a/c!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a/c!b').toBe(url);

            await page.clickLink('#router-link-d'); // result url => #a/d!b
            url = await page.getCurrentUrl();
            console.log('On clicking sub route c within a', 'Expect: a/d!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a/d!b').toBe(url);

            // #BACK1
            await page.navigateToBack(); // result url => '#a/c!b'
            url = await page.getCurrentUrl();
            console.log('On clicking 1st time back button', 'Expect: a/c!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a/c!b').toBe(url);
            // #BACK2
            await page.navigateToBack(); // result url => '#a/b!b'
            url = await page.getCurrentUrl();
            console.log('On clicking 1st time back button', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a/b!b').toBe(url);

            // #BACK3
            await page.navigateToBack(); // result url => '#b!a'
            url = await page.getCurrentUrl();
            console.log('On clicking 1st time back button', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#b!a').toBe(url);
        });

        test('should activate old state page when navigate one time back', async () => {
            await page.clickLink('#link-b'); // result url => #b!a
            console.log('On clicking meta route b', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #a
            console.log('On clicking 1st time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            const url = await page.getCurrentUrl();
            expect(baseUrl + '#a').toBe(url);
        });

        test('should activate old state page when navigate three times back', async () => {
            await page.clickLink('#link-b'); // result url => #b!a
            console.log('On clicking meta route b', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.clickLink('#link-aa'); // result url => #a/a!b
            console.log('On clicking sub route a within a', 'Expect: a/a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.clickLink('#link-ab'); // result url => #a/b!b
            console.log('On clicking sub route b within a', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #a/a!b
            let url = await page.getCurrentUrl();
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

        test('should navigate to back route properly when navigate 2 times back, then 2 times forward and assert 3 times backward', async () => {
            await page.clickLink('#link-b'); // result url => #b!a
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
            let url = await page.getCurrentUrl();
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

        test('should navigate to back route properly when navigate b/w microfrontend routes and meta routes', async () => {
            await page.switchToIframe('a');
            await page.clickTo('"#/b"'); // result url => #a/b
            console.log('On clicking sub route b', 'Expect: a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.switchToMainFrame();
            await page.clickLink('#link-b'); // result url => #b!a/b
            console.log('On clicking meta route b', 'Expect: b!a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.clickLink('#link-a'); // result url => #a!b
            console.log('On clicking meta route a', 'Expect: a!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #b!a/b
            console.log('On clicking 1st time back button', 'Expect: b!a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            let url = await page.getPageUrl();
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

    test.describe('forward button functionalities', () => {
        test('should activate old state page when navigate one time forward', async () => {
            await page.clickLink('#link-b'); // result url => #b!a
            console.log('On clicking meta route b', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToBack(); // result url => #a
            console.log('On clicking 1st time back button', 'Expect: a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));

            await page.navigateToForward(); // result url => #b!a
            console.log('On clicking 1st time forward button', 'Expect: b!a', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            const url = await page.getCurrentUrl();
            expect(baseUrl + '#b!a').toBe(url);
        });

        test('should activate old state page when navigate three times forward', async () => {
            await page.clickLink('#link-b'); // result url => #b!a
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
            let url = await page.getCurrentUrl();
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

        test('should navigate to forward route properly when navigate b/w microfrontend routes and meta routes', async () => {
            await page.switchToIframe('a');
            await page.clickTo('"#/b"'); // result url => #a/b
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
            let url = await page.getPageUrl();
            console.log('On clicking 1st time forward button', 'Expect: b!a/b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#b!a/b').toBe(url);

            await page.navigateToForward();
            url = await page.getCurrentUrl(); // result url => #a/b!b
            console.log('On clicking 2nd time forward button', 'Expect: a/b!b', 'Got: ' + page.getUrlFragment(await page.getCurrentUrl()));
            expect(baseUrl + '#a/b!b').toBe(url);
        });
    });
});
