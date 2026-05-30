import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs';

import { LoaderService } from '../services/loader.service';
import { NotificationService } from '../../shared/notifications/notification.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const loader = inject(LoaderService);
  const notification = inject(NotificationService);

  loader.show();

  return next(req).pipe(

    tap({
      next: (event: any) => {

        if (event?.body?.message && req.method !== 'GET') {
          notification.success(event.body.message);
        }
      },

      error: (error) => {

        let message = 'Something went wrong';

        if (error?.error?.message) {
          message = error.error.message;
        } else if (error?.message) {
          message = error.message;
        }

        notification.error(message);
      }
    }),

    /* always stop loader */
    finalize(() => {
      loader.hide();
    })
  );
};
