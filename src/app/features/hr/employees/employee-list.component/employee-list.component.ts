import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { EmployeeService } from '../../services/employee.service';
import { PageHeaderComponent } from '../../../../shared/page-header/page-header.component';  

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  employees: any[] = [];
  loading = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * Load all employees
   */
  loadEmployees() {
    this.loading = true;

    this.employeeService.getEmployees()
      .subscribe({
        next: (res) => {
          this.employees = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  /**
   * Navigate to edit page
   */
  editEmployee(id: string) {
    this.router.navigate(['/employees/edit', id]);
  }

  /**
   * Delete employee (handled via interceptor notifications)
   */
  deleteEmployee(id: string) {

    const confirmDelete = confirm('Are you sure you want to delete this employee?');

    if (!confirmDelete) return;

    this.employeeService.deleteEmployee(id)
      .subscribe(() => {
        // NO toast here (interceptor handles it)
        this.loadEmployees();
      });
  }

  /**
 * Export employees to Excel file
 */
  exportExcel() {

    const exportData = this.employees.map(e => ({
      'First Name': e.firstName,
      'Last Name': e.lastName,
      'Email': e.email,
      'Department': e.departmentName,
      'Job Title': e.jobTitleName,
      'City': e.city,
      'Country': e.country,
      'Phone': e.phoneNumber
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Employees': worksheet },
      SheetNames: ['Employees']
    };

    XLSX.writeFile(workbook, 'nexora-employees.xlsx');
  }

  /**
 * Export employees to PDF file
 */
  exportPDF() {

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Nexora Employee Report', 14, 10);

    const tableData = this.employees.map(e => [
      e.firstName + ' ' + e.lastName,
      e.email,
      e.departmentName,
      e.jobTitleName,
      e.city,
      e.country
    ]);

    autoTable(doc, {
      head: [[
        'Name',
        'Email',
        'Department',
        'Job Title',
        'City',
        'Country'
      ]],
      body: tableData,
      startY: 20
    });

    doc.save('nexora-employees.pdf');
  }
}
