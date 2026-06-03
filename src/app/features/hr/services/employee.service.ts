import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { environment } from '../../../../environments/environment';
import { UserProfile } from '../models/user-profile';
import { CreateEmployeeRequest } from '../models/create-employee';  

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = `${environment.apiUrl}/employees`;

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  //getEmployees(): Observable<Employee[]> {
  //  return this.http.get<Employee[]>(this.baseUrl);
  //}

  getFullName(): string {
    const user = this.currentUserSubject.value;

    return `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  }

  //createEmployee(payload: CreateEmployeeRequest) {
  //  return this.http.post(`${environment.apiUrl}/employees`, payload);
  //}

  getEmployees() {
    return this.http.get<any[]>(`${environment.apiUrl}/employees`);
  }

  getEmployeeById(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/employees/${id}`);
  }

  createEmployee(payload: any) {
    return this.http.post(`${environment.apiUrl}/employees`, payload);
  }

  updateEmployee(id: string, payload: any) {
    debugger
    return this.http.put(`${environment.apiUrl}/employees/${id}`, payload);
  }

  deleteEmployee(id: string) {
    return this.http.delete(`${environment.apiUrl}/employees/${id}`);
  }
}
