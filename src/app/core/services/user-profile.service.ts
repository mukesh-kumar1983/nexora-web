import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private profileSubject =
    new BehaviorSubject<any>(null);

  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadProfile() {

    return this.http
      .get('/api/users/me')
      .pipe(
        tap(profile => {
          this.profileSubject.next(profile);
        })
      );
  }

  getProfileValue() {
    return this.profileSubject.value;
  }
}