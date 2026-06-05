import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { EmployeeService } from '../../services/employee.service';
import { LookupService } from '../../services/lookup.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/notifications/notification.service';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {

  // -----------------------------
  // STEP CONTROL
  // -----------------------------
  currentStep = 0;

  // -----------------------------
  // FORM GROUPS (Enterprise pattern)
  // -----------------------------
  form!: FormGroup;

  // -----------------------------
  // LOOKUPS
  // -----------------------------
  departments: any[] = [];
  jobTitles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private lookupService: LookupService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {

    // -----------------------------
    // STEP-WISE FORM DESIGN
    // -----------------------------
    this.form = this.fb.group({

      // STEP 1: Personal Info
      personal: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', Validators.required]
      }),

      // STEP 2: Contact Info
      contact: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required]
      }),

      // STEP 3: Address Info
      address: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required]
      }),

      // STEP 4: Work Info
      work: this.fb.group({
        departmentId: ['', Validators.required],
        jobTitleId: ['', Validators.required]
      })
    });

    this.loadLookups();
  }

  // -----------------------------
  // LOAD DROPDOWNS
  // -----------------------------
  loadLookups() {
    this.lookupService.getDepartments().subscribe(res => {
      this.departments = res;
    });

    this.lookupService.getJobTitles().subscribe(res => {
      this.jobTitles = res;
    });
  }

  // -----------------------------
  // STEP NAVIGATION
  // -----------------------------
  nextStep() {
    if (this.isStepInvalid()) return;
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  isStepInvalid(): boolean {
    const stepGroup = this.getStepGroup();
    stepGroup.markAllAsTouched();
    return stepGroup.invalid;
  }

  getStepGroup(): FormGroup {
    const steps = ['personal', 'contact', 'address', 'work'];
    return this.form.get(steps[this.currentStep]) as FormGroup;
  }

  // -----------------------------
  // FINAL SUBMIT
  // -----------------------------
  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.value.personal,
      ...this.form.value.contact,
      ...this.form.value.address,
      ...this.form.value.work
    };

    this.employeeService.createEmployee(payload)
      .subscribe({
        next: () => {
          this.form.reset();
          this.currentStep = 0;
          this.router.navigate(['/hr/employees']);
        },
        error: (res) => {
          console.error(res);
          this.notificationService.error('Failed to create employee. Please try again.');
        }
      });
  }
}
