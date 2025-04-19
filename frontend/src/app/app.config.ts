import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ Added
import { provideToastr } from 'ngx-toastr'; // ✅ Added

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(), // ✅ Working implementation
    provideToastr({ positionClass: 'toast-bottom-right' }) // ✅ Working implementation
  ]
};
