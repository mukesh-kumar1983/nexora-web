import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportService } from '../../../../shared/services/export.service'; 

import { EmployeeService } from '../../services/employee.service';
import { GridConfig } from '../../../../shared/interfaces/grid-config';
import { PageHeaderComponent } from '../../../../shared/page-header/page-header.component';
import { DataGridComponent } from '../../../../shared/components/data-grid-component/DataGridComponent';

import { Subject, switchMap, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataGridComponent],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  employees: any[] = [];
  totalCount = 0;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  page = 1;
  search = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  gridConfig: GridConfig = {
    apiUrl: '/employees',
    pageSize: 10,
    enableSearch: true,
    enablePagination: true,
    enableSorting: true,
    columns: [
      { field: 'firstName', header: 'First Name', sortable: true },
      { field: 'lastName', header: 'Last Name', sortable: true },
      { field: 'email', header: 'Email', sortable: true },
      { field: 'departmentName', header: 'Department', sortable: true  },
      { field: 'jobTitleName', header: 'Job Title', sortable: true },
      { field: 'phoneNumber', header: 'Phone Number' , sortable: true },
      { field: 'address', header: 'Address' },
      { field: 'city', header: 'City', sortable: true },
      { field: 'country', header: 'Country', sortable: true }
    ]
  };

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private exportService: ExportService
  ) { }

  ngOnInit() {

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),

      switchMap(search => {

        this.search = search;
        this.page = 1;

        return this.employeeService.getEmployees({
          page: this.page,
          pageSize: this.gridConfig.pageSize!,
          search: this.search,
          sortColumn: this.sortColumn,
          sortDirection: this.sortDirection
        });
      }),

      takeUntil(this.destroy$)
    )
      .subscribe(res => {
        this.employees = res.items;
        this.totalCount = res.totalCount;
      });

    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees({
      page: this.page,
      pageSize: this.gridConfig.pageSize!,
      search: this.search,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection
    }).subscribe(res => {
      this.employees = res.items;
      this.totalCount = res.totalCount;
    });
  }

  onSearch(value: string) {
    this.search = value;
    this.page = 1;
    this.loadEmployees();
  }

  onSort(event: any) {
    this.page = 1;
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.loadEmployees();
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadEmployees();
  }

  editEmployee(id: string) {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: string) {
    if (!confirm('Are you sure?')) return;

    this.employeeService.deleteEmployee(id)
      .subscribe(() => this.loadEmployees());
  }

  exportExcel() {

    const data = this.employees.map(e => ({
      'First Name': e.firstName,
      'Last Name': e.lastName,
      'Email': e.email,
      'Department': e.departmentName,
      'Job Title': e.jobTitleName,
      'City': e.city,
      'Country': e.country,
      'Phone': e.phoneNumber
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { Employees: worksheet }, SheetNames: ['Employees'] };

    XLSX.writeFile(workbook, 'employees.xlsx');
  }

  exportPDF() {

    const doc = new jsPDF();

    const rows = this.employees.map(e => [
      e.firstName + ' ' + e.lastName,
      e.email,
      e.departmentName,
      e.jobTitleName,
      e.city,
      e.country
    ]);

    autoTable(doc, {
      head: [['Name', 'Email', 'Department', 'Job Title', 'City', 'Country']],
      body: rows
    });

    doc.save('employees.pdf');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  exportServerExcel() {

    const payload = {
      format: 1, // Excel
      request: {
        search: this.search || '',
        sortField: this.sortColumn,
        sortDir: this.sortDirection,
        filters: {}
      }
    };

    this.exportService.exportEmployees(payload)
      .subscribe((response: Blob) => {

        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.xlsx';
        a.click();

        window.URL.revokeObjectURL(url);
      });
  }

  exportServerPdf() {

    const payload = {
      format: 2, // PDF
      request: {
        search: this.search || '',
        sortField: this.sortColumn,
        sortDir: this.sortDirection,
        filters: {}
      }
    };

    this.exportService.exportEmployees(payload)
      .subscribe((response: Blob) => {

        const blob = new Blob([response], {
          type: 'application/pdf'
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.pdf';
        a.click();

        window.URL.revokeObjectURL(url);
      });
  }
}
