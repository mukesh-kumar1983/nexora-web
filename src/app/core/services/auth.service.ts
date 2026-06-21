import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { UserContextService } from './user-context.service';
import { JwtHelper } from '../auth/helpers/jwt.helper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'auth_token';

  private authState$ = new BehaviorSubject<string | null>(null);
  token$ = this.authState$.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private userContext: UserContextService,
    private jwtHelper: JwtHelper
  ) {
    this.loadFromStorage();
  }

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`,
      request
    );
  }

  setSession(response: AuthResponse) {
    const token = response.token;

    localStorage.setItem(this.tokenKey, token);
    this.authState$.next(token);

    const user = this.jwtHelper.decode(token);
    this.userContext.setUser(user);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.authState$.next(null);
    this.userContext.clear();
    this.router.navigate(['/auth/login']);
  }

  private loadFromStorage() {
    const token = localStorage.getItem(this.tokenKey);

    if (token) {
      this.authState$.next(token);

      const user = this.jwtHelper.decode(token);
      this.userContext.setUser(user);
    }
  }

  isLoggedIn(): boolean {
    return !!this.authState$.value;
  }
}
