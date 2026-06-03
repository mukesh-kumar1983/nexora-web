import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserProfileService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMyProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  updateMyProfile(model: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/me`, model);
  }

  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/me/upload-image`, formData);
  }
}
