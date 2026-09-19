import { enableProdMode, ENVIRONMENT_INITIALIZER, importProvidersFrom, inject } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { IAppState, INITIAL_STATE, rootReducer } from './app/store';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserModule, FormsModule, NgReduxModule),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const ngRedux = inject(NgRedux);
        ngRedux.configureStore(rootReducer, INITIAL_STATE);
      },
    },
  ],
}).catch((err) => console.error(err));
