import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../models/login-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { jwtDecode } from 'jwt-decode';

export interface CurrentUser {
  fullName: string;
  email: string;
  roles: string[];
  profileImageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}`;

  // =========================
  // AUTH STATE (SINGLE SOURCE)
  // =========================
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.rehydrateUser();
  }

  // =========================
  // LOGIN
  // =========================
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, request);
  }

  // =========================
  // TOKEN
  // =========================
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  // =========================
  // ROLE CHECK
  // =========================
  getRoles(): string[] {
    const user = this.currentUserSubject.value;
    return user?.roles ?? [];
  }

  hasRole(allowedRoles: string[]): boolean {
    debugger
    const roles = this.getRoles();
   
    return allowedRoles.some((r) => roles.includes(r));
  }

  // =========================
  // DECODE TOKEN → USER
  // =========================
  private decodeUserFromToken(): CurrentUser | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);

      return {
        fullName:
          decoded[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
          ] || 'User',

        email: decoded.email,

        roles: this.extractRoles(decoded),
      };
    } catch {
      return null;
    }
  }

  private extractRoles(decoded: any): string[] {
    const roleClaim =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!roleClaim) return [];

    return Array.isArray(roleClaim) ? roleClaim : [roleClaim];
  }

  // =========================
  // REHYDRATE ON REFRESH
  // =========================
  rehydrateUser(): void {
    const user = this.decodeUserFromToken();

    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  }

  // =========================
  // MANUAL SET USER (FROM LOGIN API)
  // =========================
  setCurrentUser(user: CurrentUser): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  // =========================
  // GET CURRENT USER
  // =========================
  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);

      // optional safety: check expiry
      const exp = decoded?.exp;
      if (!exp) return true;

      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }
}
