import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RoutedApp, RoutedAppConfig } from '@microfrontend/client';
import { AComponent } from './a/a.component';
import { AppComponent } from './app.component';
import { ROUTED_APP } from './app.tokens';
import { BComponent } from './b/b.component';
import { CComponent } from './c/c.component';
import { DComponent } from './d/d.component';

const config = new RoutedAppConfig('a', 'http://localhost:30103');

@NgModule({
    declarations: [AppComponent, AComponent, BComponent, CComponent, DComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            [
                { path: 'a', component: AComponent },
                { path: 'b', component: BComponent },
                { path: 'c', component: CComponent },
                { path: 'd', component: DComponent },
                { path: '**', redirectTo: 'a' }
            ],
            {
    useHash: true,
    relativeLinkResolution: 'legacy'
}
        )
    ],
    providers: [{ provide: ROUTED_APP, useFactory: () => new RoutedApp(config) }],
    bootstrap: [AppComponent]
})
export class AppModule {}
