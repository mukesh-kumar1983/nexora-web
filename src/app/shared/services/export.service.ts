import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment"; 

@Injectable({ providedIn: 'root' })
export class ExportService {

  

  constructor(private http: HttpClient) { }

  private baseUrl = environment.apiUrl;

  exportEmployees(payload: any) {
    return this.http.post(
      `${this.baseUrl}/employees/export`,
      payload,
      {
        responseType: 'blob'   // IMPORTANT
      }
    );
  }
}
