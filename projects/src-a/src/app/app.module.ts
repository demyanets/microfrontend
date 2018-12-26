import { AppComponent } from './app.component';
import { AComponent } from './a/a.component';
import { BComponent } from './b/b.component';
import { ROUTED_APP } from './app.tokens';
import { RoutedAppConfig } from '@microfrontend/client';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RoutedApp } from '@microfrontend/client';

const config = new RoutedAppConfig('a', 'http://localhost:30103');

@NgModule({
    declarations: [AppComponent, AComponent, BComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot([{ path: 'a', component: AComponent }, { path: 'b', component: BComponent }, { path: '**', redirectTo: 'a' }], {
            useHash: true
        })
    ],
    providers: [{ provide: ROUTED_APP, useFactory: () => new RoutedApp(config) }],
    bootstrap: [AppComponent]
})
export class AppModule {}
