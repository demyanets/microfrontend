import { ROUTED_APP } from './app-b.tokens';
import { RoutedApp } from '@microfrontend/client';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app-b.component.html',
    styleUrls: ['./app-b.component.css']
})
export class AppBComponent {
    title = 'app';

    constructor(@Inject(ROUTED_APP) private routedApp: RoutedApp) {
        console.log('app-b', this.routedApp);

        this.routedApp.registerBroadcastCallback((tag, data) => {
            console.debug('app-b received broadcast', { tag, data });
            console.debug(`app-b hasShell: ${this.routedApp.hasShell}`);
        });
    }
}
