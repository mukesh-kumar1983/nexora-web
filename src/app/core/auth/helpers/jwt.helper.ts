import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../models/user-context.model';

@Injectable({
  providedIn: 'root'
})
export class JwtHelper {

  decode(token: string): UserContext {
    const decoded: any = jwtDecode(token);

    return {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      email: decoded.email,
      roles: decoded.role ? [decoded.role] : decoded.roles ?? []
    };
  }
}
