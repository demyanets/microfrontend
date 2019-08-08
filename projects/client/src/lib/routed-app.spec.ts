import {
    EVENT_MESSAGE,
    HandleBroadcastNotification,
    HandleGetCustomFrameConfiguration,
    MessageBroadcast,
    MessageBroadcastMetadata,
    MessageGoto,
    MessageRouted,
    MessageSetFrameStyles,
    MessageGetCustomFrameConfiguration
} from '@microfrontend/common';
import { RoutedApp } from './routed-app';
import { RoutedAppConfig } from './routed-app-config';
import { ClientServiceProviderMock } from '../mocks/client-service-provider.mock';

describe('RoutedApp', () => {
    let routedApp: RoutedApp;
    let provider: ClientServiceProviderMock;
    let config: RoutedAppConfig;
    // let parentFacade: ParentFacadeMock;

    beforeEach(() => {
        config = new RoutedAppConfig('a', location.origin);
        provider = new ClientServiceProviderMock('http://localhost:8080/#b!a/x', true);
        routedApp = new RoutedApp(config, provider);
    });

    it('should return true when hasParent is called',()=>{
        const returnValue:Boolean = routedApp.hasShell;
        expect(returnValue).toBe(true)
    })

    it('should be excuted successfully when getParent is false',()=>{
        provider = new ClientServiceProviderMock('http://localhost:8080/#b!a/x', false);
        routedApp = new RoutedApp(config, provider);
        expect(true).toBeTruthy();

    })

    it('should post routed message to parent', () => {
        const url: string = 'b';
        spyOn(provider.parentFacadeMock, 'postMessage');
        routedApp.sendRoute(url);
        const message = new MessageRouted(config.metaRoute, url);
        expect(provider.parentFacadeMock.postMessage).toHaveBeenCalledWith(message, config.parentOrigin);
    });

    it('should post goto message to parent', () => {
        spyOn(provider.parentFacadeMock, 'postMessage');
        routedApp.goTo('a', 'y');
        const message = new MessageGoto(config.metaRoute, 'a', 'y');
        expect(provider.parentFacadeMock.postMessage).toHaveBeenCalledWith(message, config.parentOrigin);
    });

    it('should post set frame styles message to parent', () => {
        const style = { height: '100px' };
        const message = new MessageSetFrameStyles(config.metaRoute, style);
        spyOn(provider.parentFacadeMock, 'postMessage');
        routedApp.setFrameStyles(style);
        expect(provider.parentFacadeMock.postMessage).toHaveBeenCalledWith(message, config.parentOrigin);
    });

    it('should post broadcast message to parent', () => {
        const tag = 'test broadcast';
        const data = { info: 456 };
        const receipents = ['10.0.0.10'];
        const metadata = new MessageBroadcastMetadata(tag, config.metaRoute, receipents);
        const message = new MessageBroadcast(metadata, data);
        spyOn(provider.parentFacadeMock, 'postMessage');
        routedApp.broadcast(tag, data, receipents);
        expect(provider.parentFacadeMock.postMessage).toHaveBeenCalledWith(message, config.parentOrigin);
    });

    it('should handle sub routing', () => {
        let subRoute: string | undefined = '';
        routedApp.registerRouteChangeCallback((activated: boolean, route?: string) => {
            subRoute = route;
        });
        provider.eventListenerFacadeMocks[EVENT_MESSAGE].simulateSubrouteMessage('http://localhost:8080', 'x', location.origin);
        expect(subRoute).toBeDefined();
        expect(subRoute).toBe('x');
    });

    it('should register registerCustomFrameConfigCallback and handle get customer frame config correctly', ()=>{
        let handled = false;
        const dummyHandleGetCustomFrameConfiguration: HandleGetCustomFrameConfiguration = (cfg) => {
            handled = true;
        };

        // Register the callback
        routedApp.registerCustomFrameConfigCallback(dummyHandleGetCustomFrameConfiguration);


        // Request Custom Frame Configuration
        spyOn(provider.parentFacadeMock, 'postMessage');
        routedApp.requestCustomFrameConfiguration();
        const message = new MessageGetCustomFrameConfiguration(config.metaRoute, {});
        expect(provider.parentFacadeMock.postMessage).toHaveBeenCalledWith(message, config.parentOrigin);


        // Simulates to Get Custom Frame Configuration
        provider.eventListenerFacadeMocks[EVENT_MESSAGE].simulateGetCustomFrameConfigMessage('http://10.0.0.1', { test: 'test' }, location.origin);
        expect(handled).toBeTruthy();

    })


    it('should register registerBroadcastCallback and handle broadcast correctly', () => {
        let handled = false;
        const dummyHandleNotification: HandleBroadcastNotification = (tag, data) => {
            handled = true;
        };
        routedApp.registerBroadcastCallback(dummyHandleNotification);
        provider.eventListenerFacadeMocks[EVENT_MESSAGE].simulateBroadcastMessage(
            'http://10.0.0.1',
            'test broadcast',
            { info: 456 },
            undefined,
            location.origin
        );
        expect(handled).toBeTruthy();
    });
});
