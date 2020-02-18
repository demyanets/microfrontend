# Production-quality controller for microfrontend applications

## Idea

The original idea comes from Manfred Steyer and his [meta-spa-router](https://github.com/manfredsteyer/meta-router).
Manfred have also supported this development effort at [s IT Solutions AT Spardat GmbH](https://www.s-itsolutions.at/en/home) with his valuable advice and useful hints. 

Enterprise-scale applications need a very high degree of integration and isolation between modules therefore iframes still remain the best solution to achieve it. 
However every browser has exactly one address field so you need a controller to handle many application routes simultaneously.

@microfrontend/controller provides you this type of functionality with a strong focus on a production quality of code. 

## Features

- @microfrontend/controller loads microfrontends (aka routed applications) in iframes
- Microfrontends are isolated and cannot influence each other in an unplanned way 
- Microfrontends may use any SPA framework
- Controller support switching to a specific route within a child app
- Controller Synchronizes microfrontend's routes with the route of the shell
- Controller supports resizing of iframes to prevent a scrollbar
- Solution respects origins to prevent CORS issues

## Glossary
Term | Meaning
------------ | -------------
Microfrontend (aka Routed application) | Independently deployed and maintained SPA application 
Shell (aka Parent shell)| Parent application controlling microfrontends
Outlet | Placeholder for multiple microfrontends in a shell. The outlet can show only one microfrontend at the same time.  
Controller (aka Meta router)| Shell controller managing outlets and microfrontends

## Overall design

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) but only its toolset was used.

Controller libraries do not have any run-time dependencies and are free from side-effects and shall be therefore compatible with any SPA framework.

Name | Description | Required in a shell | Required in a microfrontend
------------ | -------------| -------------| -------------
@microfrontend/common | Shared code | yes | yes
@microfrontend/controller | Controller code | yes | no
@microfrontend/client | Microfrontend code | no | yes

# URL specification

@microfrontend/controller uses its own URL format to track the state of microfrontends across outlets.

URL syntax uses following reserved symbols:

Symbol | Meaning
------------ | -------------
``;`` | Separates outlets
``~`` | Separates outlet name and microfrontend's routes
``!`` | Separates routes of microfrontends  

## URL with a default outlet

URL syntax with default outlet consists of a list of micro frontends separated by a ``!``. No outlet name is required e.g.:

``a/b/c!x/y/z``

The example above controls default outlet:
 - Microfrontend ``a``: 
   - Is currently visible in the default outlet because it is the first one in a list
   - Has currently microfrontend route ``b/c`` 
 - Microfrontend ``x``: 
    - Is currently hidden in the default outlet because it is not the first one
    - Has currently microfrontend route ``y/z``
    - 
## Full URL example

<aside class="notice">
Current version does not support multiple outlets!
</aside>

Full URL syntax consists of a list of outlets separated by ``;`` and corresponding microfrontend's routes e.g.:

``outlet1~a/b/c!x/y/z;outlet2~k/l/m``

The example above controls ``outlet1`` and ``outlet2``:
 - ``outlet1`` contains two microfrontends - ``a`` and ``x``:
     - Microfrontend ``a``: 
       - Is currently visible in the outlet ``outlet1`` because it is the first one in a list for ``outlet1``
       - Has currently microfrontend route ``b/c`` 
     - Microfrontend ``x``: 
        - Is currently hidden in the outlet ``outlet1`` because it is not the first one
        - Has currently microfrontend route ``y/z`` 
 - ``outlet2`` contains only one microfrontend - ``k``:
      - Microfrontend ``k``: 
        - Is currently visible in the outlet ``outlet2`` because it is the first one in a list for ``outlet2``
        - Has currently microfrontend route ``l/m``  
         
# Usage

## History handling and Backbutton navigation

Making sure that browserhistory is written correctly and back- or forward-buttons work as expected 
requires some extra effort in the microfrontend, because it runs within the iframe. 

Parent shell sends navigation events to the microfrontend to tell the iframe which component it should show. The microfrontend has to register a callback function for these events and has to call the `routeToUrl` method of the router.

The sample application micro-app A shows how the event handling can be implemented (using angular router in this case but similar mechanism can be used with other frameworks like react or vue)
```typescript
export class AppBComponent {
    title = 'app';

    constructor(@Inject(ROUTED_APP) private routedApp: RoutedApp, private router: Router) {
        this.initRoutedApp();
    }

    initRoutedApp() {
         this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
            this.routedApp.sendRoute(e.url);
        });

        this.routedApp.registerForRouteChange((url) => this.navigate(url));
        this.routedApp.registerForBroadcastNotification((tag, data) => {
            console.debug('app-a received broadcast', { tag, data });
            console.debug(`app-a hasShell: ${this.routedApp.hasShell}`);
        });
    }

    private navigate(url: string): void {
      this.router.navigateByUrl(url, { replaceUrl: true, });
    }
}
```

`navigate` method is used as a callback for the shell to tell the microfrontend to route to a specific component. The microfrontend does this by calling the `router.navigateByUrl` method.

# Building and running

## Development server

Run `npm run serve` to start with development server. Navigate to `http://localhost:30103/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the libraries. Build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute all unit tests.

## Measuring code coverage

Run `npm run coverage` to measure code coverage. Coverage information will be stored in the `coverage/` directory.
Exclude auxilary files from the code coverage with `codeCoverageExclude` setting in `angular.json`

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Make sure that `HTTPS_PROXY` environment variable is set to `http://proxy-sd.s-mxs.net:8080` if you are working behind the firewall ([Bug #6358](https://github.com/angular/angular-cli/issues/6358))

## Linting

Run `npm run lint` to execute `tslint` on library code. Test application and unit tests were deliberately excluded. 
