import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';

import { Role } from '@bkr/api-interface';

import { AuthService } from '../services';

export const roleCanActivateFn: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const requiredRoles = (route.data['roles'] || []) as Role[];

  return redirectIfUnauthorized(requiredRoles);
};

function redirectIfUnauthorized(requiredRoles: Role[]): Observable<boolean> {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.role$.pipe(
    take(1),
    map(
      (role) =>
        !requiredRoles.length || (role !== null && requiredRoles.includes(role))
    ),
    tap((isAuthorized) => {
      if (!isAuthorized) {
        router.navigate(['/']);
      }
    })
  );
}
