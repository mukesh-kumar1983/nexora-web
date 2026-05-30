import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | UrlTree {

    const allowedRoles = route.data['roles'] as string[];

    const userRoles = this.authService.getRoles();

    const hasAccess = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (hasAccess) {
      return true;
    }

    // redirect if not allowed
    return this.router.createUrlTree(['/unauthorized']);
  }
}