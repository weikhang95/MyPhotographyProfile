import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AdminApiService } from './admin-api.service';

/**
 * Sends signed-out visitors to the login page. This only improves UX: the real
 * protection is the Worker rejecting admin API calls without a valid session.
 */
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AdminApiService)
    .isSignedIn()
    .pipe(map((signedIn) => signedIn || router.createUrlTree(['/admin/login'])));
};
