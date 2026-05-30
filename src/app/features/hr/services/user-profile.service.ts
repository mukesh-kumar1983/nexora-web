import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private baseUrl = environment.apiUrl  // via Ocelot gateway

  constructor(
    private http: HttpClient, 
    private authService: AuthService)
    {

    }

  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/me`);
  }

  updateMyProfile(model: UserProfile): Observable<any> {
    
    return this.http.put(`${this.baseUrl}/me`, model);
  }

  uploadProfileImage(file: File) {
    debugger
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.baseUrl}/me/upload-image`,
      formData
    );
  }
}
