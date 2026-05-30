import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../../services/user-profile.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LookupService } from '../../services/lookup.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  form!: FormGroup;

  isEditMode = true;
  isFormDirty = false;

  jobTitles: any[] = [];
  departments: any[] = [];

  roles: string = '';
  ownProfile: boolean = true;

  profileImageUrl: string = '';

  selectedFile!: File;

  constructor(
    private fb: FormBuilder,
    private service: UserProfileService,
    public authService: AuthService,
    public lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const currentUser = this.authService.getCurrentUser();

    // ✅ FIXED: no `.user`
    const fullName = currentUser?.fullName || 'User';

    this.profileImageUrl =
      'https://ui-avatars.com/api/?name=' + fullName;

    this.roles = currentUser?.roles?.join(',') || 'User';

    if (this.activatedRoute.snapshot.params['id']) {
      this.ownProfile = false;
    }

    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      jobTitleId: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
    });

    this.loadProfile();

    this.form.valueChanges.subscribe(() => {
      this.isFormDirty = this.form.dirty;
    });
  }

  loadProfile() {
    this.service.getMyProfile().subscribe((res) => {
      this.form.patchValue(res);

      const fullName =
        this.authService.getCurrentUser()?.fullName || 'User';

      this.profileImageUrl =
        res.profileImageUrl ??
        'https://ui-avatars.com/api/?name=' + fullName;

      this.loadDropdowns();
    });
  }

  loadDropdowns() {
    this.lookupService.getJobTitles().subscribe((res) => {
      this.jobTitles = res;
    });

    this.lookupService.getDepartments().subscribe((res) => {
      this.departments = res;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;

    // instant preview (UX upgrade)
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImageUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  finishSave() {
    this.isEditMode = false;
    this.form.markAsPristine();
    this.isFormDirty = false;
    this.loadProfile();
  }

  save() {

    debugger
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // 1. update profile JSON
    this.service.updateMyProfile(this.form.value).subscribe((res) => {
      debugger

      // 2. upload image only if selected
      if (this.selectedFile) {
        this.service.uploadProfileImage(this.selectedFile).subscribe(() => {
          this.finishSave();
        });
      } else {
        this.finishSave();
      }

    });
  }

  

 


   
    
  
}
