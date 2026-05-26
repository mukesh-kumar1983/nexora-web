import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];
  loading = false;
  errorMessage = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;

    this.employeeService.getEmployees()
      .subscribe({
        next: (data) => {
          
          this.employees = data;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load employees';
          this.loading = false;
        }
      });
  }
}