import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserProfileService {

  private baseUrl = environment.apiUrl+'/me'; // via Ocelot gateway

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/me`);
  }

  updateProfile(model: UserProfile): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, model);
  }

  getJobTitles() {
  return this.http.get<any[]>(`${this.baseUrl}/jobtitles`);
}

getDepartments() {
  return this.http.get<any[]>(`${this.baseUrl}/departments`);
}
}