import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest } from '../models/login-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { UserProfile } from '../../features/hr/models/user-profile';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}`;

  // ====================================
  // Current User State (memory only)
  // ====================================
  
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ====================================
  // Login
  // ====================================
  login(request: LoginRequest): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.baseUrl}/auth/login`,
      request
    );
  }

  // ====================================
  // Save JWT
  // ====================================
  saveToken(token: string): void {

    localStorage.setItem(
      'access_token',
      token
    );
  }

  // ====================================
  // Get JWT
  // ====================================
  getToken(): string | null {

    return localStorage.getItem(
      'access_token'
    );
  }

  // ====================================
  // Logout
  // ====================================
  logout(): void {

    localStorage.removeItem(
      'access_token'
    );

    this.currentUserSubject.next(null);
  }

  // ====================================
  // Is Logged In
  // ====================================
  isLoggedIn(): boolean {

    return !!this.getToken();
  }

  // ====================================
  // Set Current User
  // ====================================
  setCurrentUser(user: any): void {

    debugger
    this.currentUserSubject.next(user);
  }

  // ====================================
  // Get Current User
  // ====================================
  getCurrentUser(): any {

    debugger
    return this.currentUserSubject.value;
  }
}