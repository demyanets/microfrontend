import { IMap } from '@microfrontend/common';
import { FrameConfig, IAppConfig, MetaRouter, MetaRouterConfig, UnknownRouteHandlingEnum } from '@microfrontend/controller';

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

const settings: IMap<string> = {};
settings['test'] = 'myConfig';
const frameConfig = new FrameConfig(settings);

window.addEventListener('load', async () => {
    const config = new MetaRouterConfig(
        'outlet',
        routes,
        (tag, data) => {
            console.debug('received message from routed app', { tag, data });
        },
        new FrameConfig({ test: 'myConfig' }, {}, { class: 'my-outlet-frame' }),
        UnknownRouteHandlingEnum.ThrowError,
        false
    );

    const router = new MetaRouter(config);
    await router.initialize();
    router.preload();

    function addEventListener(id: string, route: string, subrote?: string): void {
        const link = document.getElementById(id);
        if (link) {
            if (subrote) {
                link.addEventListener('click', () => router.go(route, subrote));
            } else {
                link.addEventListener('click', () => router.go(route));
            }
        }
    }

    function addSendBroadcastListener(id: string, data: object): void {
        const link = document.getElementById(id);
        if (link) {
            link.addEventListener('click', () => router.broadcast('custom_tag', data, ['a', 'b']));
        }
    }

    if (document) {
        addEventListener('link-a', 'a');
        addEventListener('link-b', 'b');
        addEventListener('link-aa', 'a', 'a');
        addEventListener('link-ab', 'a', 'b');
        addSendBroadcastListener('link-broadcast', { message: 'Message from router' });
    }
});
