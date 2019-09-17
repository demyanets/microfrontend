import { AppBComponent } from './app-b.component';
import { RoutedAppConfig } from '@microfrontend/client';
import { ROUTED_APP } from './app-b.tokens';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RoutedApp } from '@microfrontend/client';

const config = new RoutedAppConfig('b', 'http://localhost:30103');

@NgModule({
    declarations: [AppBComponent],
    imports: [BrowserModule],
    providers: [{ provide: ROUTED_APP, useFactory: () => new RoutedApp(config) }],
    bootstrap: [AppBComponent]
})
export class AppBModule {}
