import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { LucideAngularModule } from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // ✅ V2 LUCIDE (WORKING MODE)
    importProvidersFrom(LucideAngularModule),

    provideHttpClient(
      withInterceptors([authInterceptor, loadingInterceptor])
    ),

    provideAnimations()
  ]
};
