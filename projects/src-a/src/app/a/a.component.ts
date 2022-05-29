import { Component, Inject } from '@angular/core';
import { ROUTED_APP } from '../app.tokens';
import { RoutedApp } from '@microfrontend/client';

@Component({
    selector: 'app-a',
    templateUrl: './a.component.html',
    styleUrls: ['./a.component.css']
})
export class AComponent {
    public haveState: boolean = false;
    constructor(@Inject(ROUTED_APP) private routedApp: RoutedApp) {}

    sendBroadcast(): void {
        this.routedApp.broadcast('test broadcast', { info: 456 });
    }

    gotoB(): void {
        this.routedApp.goTo('b');
    }

    getConfig(): void {
        if (this.routedApp.hasShell) {
            console.log('requestCustomFrameConfiguration');
            this.routedApp.requestCustomFrameConfiguration();
        }
    }

    toggleState(): void {
        this.haveState = !this.haveState;
        this.routedApp.changeState(this.haveState, 'a');
    }
}
