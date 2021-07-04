import { AppComponent } from './app.component';
import { RoutedAppConfig } from '@microfrontend/client';
import { ROUTED_APP } from './app.tokens';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RoutedApp } from '@microfrontend/client';
import { Level } from '@microfrontend/common';

const config = new RoutedAppConfig('b', 'http://localhost:30103', Level.LOG);

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule],
    providers: [{ provide: ROUTED_APP, useFactory: () => new RoutedApp(config) }],
    bootstrap: [AppComponent]
})
export class AppModule {}
