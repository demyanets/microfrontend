import { ROUTED_APP } from './app.tokens';
import { RoutedApp } from '@microfrontend/client';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

    constructor(@Inject(ROUTED_APP) private routedApp: RoutedApp) {
        console.log('app-b', this.routedApp);

        this.routedApp.registerBroadcastCallback((tag, data) => {
            console.debug('app-b received broadcast', { tag, data });
            console.debug(`app-b hasShell: ${this.routedApp.hasShell}`);
        });
    }

    gotoA(): void {
        this.routedApp.goTo('a');
    }

    gotoAA(): void {
        this.routedApp.goTo('a', 'a');
    }

    gotoAB(): void {
        this.routedApp.goTo('a', 'b');
    }
}
