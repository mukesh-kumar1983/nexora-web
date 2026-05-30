import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LucideAngularModule } from 'lucide-angular';
import { lucideIcons } from './shared/lucide-icons';
import { importProvidersFrom } from '@angular/core';


import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
        // ✅ FIX: register lucide icons here
    importProvidersFrom(
      LucideAngularModule.pick(lucideIcons)
    ),

    provideHttpClient(
      withInterceptors([authInterceptor, loadingInterceptor])
    ),

    provideAnimations()
  ]
};