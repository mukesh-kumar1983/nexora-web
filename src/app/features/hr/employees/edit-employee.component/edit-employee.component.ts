import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { EmployeeService } from '../../services/employee.service';
import { LookupService } from '../../services/lookup.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {

  form!: FormGroup;
  id!: string;

  departments: any[] = [];
  jobTitles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['', Validators.required],
      departmentId: ['', Validators.required],
      jobTitleId: ['', Validators.required]
    });

    this.loadLookups();
    this.loadEmployee();
  }

  loadLookups() {
    this.lookupService.getDepartments().subscribe(res => this.departments = res);
    this.lookupService.getJobTitles().subscribe(res => this.jobTitles = res);
  }

  loadEmployee() {
    this.employeeService.getEmployeeById(this.id)
      .subscribe(res => {
        this.form.patchValue(res);
      });
  }

  update() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.employeeService.updateEmployee(this.id, this.form.value)
      .subscribe(() => {
        // interceptor handles success toast
      });
  }
}
