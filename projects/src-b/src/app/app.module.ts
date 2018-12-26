import { AppComponent } from './app.component';
import { RoutedAppConfig } from '@microfrontend/client';
import { ROUTED_APP } from './app.tokens';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RoutedApp } from '@microfrontend/client';

const config = new RoutedAppConfig('b', 'http://localhost:30103');

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule],
    providers: [{ provide: ROUTED_APP, useFactory: () => new RoutedApp(config) }],
    bootstrap: [AppComponent]
})
export class AppModule {}
