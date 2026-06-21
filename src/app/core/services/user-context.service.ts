import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserContext } from '../models/user-context.model';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {

  private _user$ = new BehaviorSubject<UserContext | null>(null);

  user$ = this._user$.asObservable();

  setUser(user: UserContext) {
    this._user$.next(user);
  }

  getUser(): UserContext | null {
    return this._user$.value;
  }

  clear() {
    this._user$.next(null);
  }

  isAuthenticated(): boolean {
    return !!this._user$.value;
  }

  hasRole(role: string): boolean {
    return this._user$.value?.roles?.includes(role) ?? false;
  }
}
