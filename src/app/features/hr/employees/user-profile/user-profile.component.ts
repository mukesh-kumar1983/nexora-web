import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { UserProfileService } from '../../services/user-profile.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LookupService } from '../../services/lookup.service';
import { NotificationService } from '../../../../shared/notifications/notification.service';
import { PageHeaderComponent } from '../../../../shared/page-header/page-header.component';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {

  // ==========================
  // FORM
  // ==========================
  form!: FormGroup;

  /**
   * Stores initial form state for reliable dirty-checking.
   * We use this instead of form.dirty because patchValue + async loads
   * make Angular dirty tracking unreliable in enterprise apps.
   */
  private initialFormValue: any;

  // ==========================
  // LOOKUP DATA
  // ==========================
  jobTitles: any[] = [];
  departments: any[] = [];

  // ==========================
  // USER CONTEXT
  // ==========================
  roles: string = '';
  ownProfile: boolean = true;

  // ==========================
  // PROFILE IMAGE
  // ==========================
  profileImageUrl: string = '';
  selectedFile!: File;

  constructor(
    private fb: FormBuilder,
    private service: UserProfileService,
    public authService: AuthService,
    public lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notification: NotificationService // global toast system
  ) { }

  ngOnInit(): void {

    // ---------------------------------------------------
    // STEP 1: Get logged-in user from AuthService
    // ---------------------------------------------------
    const currentUser = this.authService.getCurrentUser();

    const fullName = currentUser?.fullName || 'User';

    this.roles = currentUser?.roles?.join(',') || 'User';

    // Default avatar (fallback if no profile image exists)
    this.profileImageUrl =
      'https://ui-avatars.com/api/?name=' + fullName;

    // Detect if profile belongs to logged-in user or admin view
    this.ownProfile = !this.activatedRoute.snapshot.params['id'];

    // ---------------------------------------------------
    // STEP 2: Build Reactive Form
    // ---------------------------------------------------
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],

      // Email is intentionally disabled (identity field in Auth systems)
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],

      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['', Validators.required],
      jobTitleId: ['', Validators.required],
      departmentId: ['', Validators.required],
    });

    // ---------------------------------------------------
    // STEP 3: Load profile data from backend
    // ---------------------------------------------------
    this.loadProfile();
  }

  // =====================================================
  // LOAD USER PROFILE FROM API
  // =====================================================
  loadProfile() {
    this.service.getMyProfile().subscribe((res) => {

      // Patch API data into form
      this.form.patchValue(res);

      // Store snapshot for dirty comparison (important fix)
      this.initialFormValue = this.form.getRawValue();

      // Set profile image
      const fullName =
        this.authService.getCurrentUser()?.fullName || 'User';

      this.profileImageUrl =
        res.profileImageUrl ??
        'https://ui-avatars.com/api/?name=' + fullName;

      // Load dropdown data after profile is ready
      this.loadDropdowns();
    });
  }

  // =====================================================
  // LOAD DROPDOWN DATA (LOOKUPS)
  // =====================================================
  loadDropdowns() {
    this.lookupService.getJobTitles().subscribe(res => {
      this.jobTitles = res;
    });

    this.lookupService.getDepartments().subscribe(res => {
      this.departments = res;
    });
  }

  // =====================================================
  // PROFILE IMAGE UPLOAD (PREVIEW BEFORE SAVE)
  // =====================================================
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    // Show instant preview (UX improvement)
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImageUrl = reader.result as string;
    };

    reader.readAsDataURL(file);

    this.notification.showWithDuration("info", 'Profile image selected. It will be uploaded when you save your profile.', 5000);
  }

  // =====================================================
  // FORM VALIDATION HELPER
  // =====================================================
  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  // =====================================================
  // DIRTY STATE CHECK (ENTERPRISE SAFE)
  // =====================================================
  isFormDirty(): boolean {
    return JSON.stringify(this.form.getRawValue()) !== JSON.stringify(this.initialFormValue);
  }

  // -------------------------
  // SAVE PROFILE (FIXED FLOW)
  // -------------------------
  save() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.warning('Please fix validation errors');
      return;
    }

    const profileData = this.form.getRawValue();

    this.service.updateMyProfile(profileData).subscribe({

      next: () => {

        if (this.selectedFile) {

          this.service.uploadProfileImage(this.selectedFile).subscribe({

            next: (imageUrl: any) => {

              const finalProfile = {
                ...profileData,
                profileImageUrl: imageUrl
              };

              this.authService.updateProfile(finalProfile);

              this.notification.success('Profile updated successfully');
            },

            error: () => {
              this.notification.error('Image upload failed');
            }
          });

        } else {

          this.authService.updateProfile(profileData);

          this.notification.success('Profile updated successfully');
        }
      },

      error: () => {
        this.notification.error('Profile update failed');
      }
    });
  }

  // =====================================================
  // POST-SAVE CLEANUP
  // =====================================================
  finishSave() {

    // Reset form state
    //this.form.markAsPristine();

    // Reload latest data from server
    //this.loadProfile();
  }
}
