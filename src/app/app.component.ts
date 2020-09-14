import { Component, OnInit } from '@angular/core';
import { FrameConfig, IAppConfig, MetaRouter, MetaRouterConfig, UnknownRouteHandlingEnum } from '@microfrontend/controller';
import { OutletState } from 'projects/controller/src/lib/outlet-state';

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
            UnknownRouteHandlingEnum.ThrowError
        );

        this.router = new MetaRouter(config,
            undefined,
            (state: OutletState) => console.log(`Outlet state changed: '${state.outlet}'='${state.activeRoute.url}'`));
    }

    ngOnInit(): void {
        this.init();
    }

    async init(): Promise<void> {
        await this.router.preload();
        await this.router.initialize();
    }

    async go(route: string, subrote?: string): Promise<void> {
        await this.router.go(route, subrote);
    }

    broadcast(): void {
        this.router.broadcast('custom_tag', { message: 'Message from router' }, ['a', 'b']);
    }
}
