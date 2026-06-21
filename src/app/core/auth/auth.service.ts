import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profileImageUrl?: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { } 

  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  // -------------------------
  // GET CURRENT USER
  // -------------------------
  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  // -------------------------
  // UPDATE PROFILE (IMPORTANT)
  // -------------------------
  updateProfile(profile: Partial<CurrentUser>) {

    const current = this.currentUserSubject.value;
    if (!current) return;

    const updated: CurrentUser = {
      ...current,
      firstName: profile.firstName ?? current.firstName,
      lastName: profile.lastName ?? current.lastName,
      fullName: `${profile.firstName ?? current.firstName} ${profile.lastName ?? current.lastName}`,
      profileImageUrl: profile.profileImageUrl ?? current.profileImageUrl
    };

    this.currentUserSubject.next(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  }

  // -------------------------
  // LOAD FROM LOCAL STORAGE
  // -------------------------
  private loadUser(): CurrentUser | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  // =========================
  // LOGIN API
  // =========================
  login(model: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, model);
  }

  logout(): void {

    // 1. Clear BehaviorSubject (IMPORTANT for header update)
    this.currentUserSubject.next(null);

    // 2. Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('current_user');
    localStorage.removeItem('token'); // if you store JWT

    // 3. Optional: clear session storage (if used)
    sessionStorage.clear();

  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getRoles(): string[] {
    return this.currentUserSubject.value?.roles ?? [];
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setCurrentUser(user: CurrentUser): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  rehydrateUser(): void {
    const data = localStorage.getItem('user');

    if (!data) return;

    const user: CurrentUser = JSON.parse(data);
    this.currentUserSubject.next(user);
  }
}
