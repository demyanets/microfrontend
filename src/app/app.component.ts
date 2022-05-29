import { Level } from '@microfrontend/common';
import { Component, OnInit } from '@angular/core';
import { FrameConfig, IAppConfig, MetaRouter, MetaRouterConfig, UnknownRouteHandlingEnum } from '@microfrontend/controller';
import { OutletState } from 'projects/controller/src/lib/outlet-state';
import { $ } from 'protractor';

const routes: IAppConfig[] = [
    {
        metaRoute: 'a',
        baseUrl: 'http://localhost:30307'
    },
    {
        metaRoute: 'b',
        baseUrl: 'http://localhost:30809'
    }
];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'microfrontend';
    router: MetaRouter;

    constructor() {
        const config = new MetaRouterConfig(
            'outlet',
            routes,
            (tag, data) => {
                console.debug('received message from routed app', { tag, data });
            },
            new FrameConfig({ test: 'myConfig' }, {}, { class: 'my-outlet-frame' }),
            UnknownRouteHandlingEnum.ThrowError,
            Level.LOG
        );

        this.router = new MetaRouter(config);
        this.router.outletStateChanged = (state: OutletState) => this.logState(state);
        this.router.registerAllowStateDiscardCallbackAsync(async (metaroute: string, subRoute?: string) => {
            console.log(`registerAllowStateDiscardCallbackAsync: ${metaroute}/${subRoute}`);
            if (subRoute) {
                if (subRoute === 'a') {
                    return Promise.resolve(false);
                } else {
                    return Promise.resolve(true);
                }
            }

            return Promise.resolve(true);
        });
    }

    ngOnInit(): void {
        this.init();
    }

    async init(): Promise<void> {
        //Uncomment to preload the microfrontend
        //await this.router.preload([routes[0]]);
        await this.router.preload();
        await this.router.initialize();
    }

    async go(route: string, subrote?: string): Promise<void> {
        await this.router.go(route, subrote);
    }

    broadcast(): void {
        this.router.broadcast('custom_tag', { message: 'Message from router' }, ['a', 'b']);
    }

    logState(state: OutletState): void {
        console.log(`Active route in '${state.outlet}' is '${state.activeRoute.url}'`);
    }
}
