# Production-quality controller for microfrontend applications

Enterprise-scale applications need a very high degree of integration and isolation between modules therefore iframes still remain the best solution to achieve it. However every browser has only one address field so you need a controller to handle many application routes simultaneously.

Microfrontend libries provide you exactly this type of functionality with a strong focus on a production quality of code.

This is the application shell library that shall be included into the application controller together with the [@microfrontend/common](https://www.npmjs.com/package/@microfrontend/common) library.

## Credits

The original idea comes from Manfred Steyer and his [meta-spa-router](https://github.com/manfredsteyer/meta-router).

Manfred has also supported this development effort at [s IT Solutions AT Spardat GmbH](https://www.s-itsolutions.at/en/home) with his valuable advice and useful hints. 

## Features

- The controller loads microfrontends (aka routed applications) in iframes
- Microfrontends are isolated and cannot influence each other in an unplanned way 
- Microfrontends may use any SPA framework
- Controller supports switching to a specific route within a child app
- Controller synchronizes microfrontend's routes with the route of the shell
- Solution supports flexible configuration of iframes
- Solution respects origins to prevent CORS issues

## Overall design

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) but only its toolset was used.

Controller libraries do not have any run-time dependencies and are free from side-effects and shall be therefore compatible with any SPA framework.

Name | Description | Required in a shell | Required in a microfrontend
------------ | -------------| -------------| -------------
[@microfrontend/common](https://www.npmjs.com/package/@microfrontend/common) | Shared code | yes | yes
[@microfrontend/controller](https://www.npmjs.com/package/@microfrontend/controller) | Controller code | yes | no
[@microfrontend/client](https://www.npmjs.com/package/@microfrontend/client) | Microfrontend code | no | yes

## Install

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @microfrontend/common
$ npm install @microfrontend/controller
```

## Documentation

Additional documentation is located in [GitHub repository](https://github.com/demyanets/microfrontend).

## License

MIT