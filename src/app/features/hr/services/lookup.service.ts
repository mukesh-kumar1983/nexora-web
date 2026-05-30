import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl  // via Ocelot gateway

  getJobTitles() {
    return this.http.get<any[]>(`${this.baseUrl}/jobtitles`);
  }

  getDepartments() {
    return this.http.get<any[]>(`${this.baseUrl}/departments`);
  }
}
