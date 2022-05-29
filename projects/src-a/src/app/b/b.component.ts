import { Component, Inject } from '@angular/core';
import { ROUTED_APP } from '../app.tokens';
import { RoutedApp } from '@microfrontend/client';

@Component({
    selector: 'app-b',
    templateUrl: './b.component.html',
    styleUrls: ['./b.component.css']
})
export class BComponent {
    public haveState: boolean = false;

    constructor(@Inject(ROUTED_APP) private routedApp: RoutedApp) {}

    gotoB(): void {
        this.routedApp.goTo('b');
    }

    toggleState(): void {
        this.haveState = !this.haveState;
        this.routedApp.changeState(this.haveState, 'b');
    }
}
