import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http'; // `provideHttpClient` ve `withFetch` eklendi


import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration()]
// };


export const appConfig: ApplicationConfig = {
  providers: [
    // importProvidersFrom(HttpClientModule), // HttpClientModule burada eklendi
    provideHttpClient(withFetch()),
    provideRouter(routes), // Router burada varsa eklenebilir
  ],
};