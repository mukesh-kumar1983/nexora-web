import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../../services/user-profile.service';
import { AuthService } from '../../../../core/services/auth.service';
import { HostListener } from '@angular/core';

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
  imagePreviewOpen = false;
  zoomLevel = 1;
  isDragging = false;
  startX = 0;
  startY = 0;
  translateX = 0;
  translateY = 0;

  @HostListener('document:keydown.escape')
  onEscPress() {
    if (this.imagePreviewOpen) {
      this.closeImagePreview();
    }
  }

  profileImageUrl =
    'https://ui-avatars.com/api/?name=' +
    (this.authService.getCurrentUser()?.user?.fullName || 'User');

  jobTitles: any[] = [];
  departments: any[] = [];

  roles: string = '';

  constructor(
    private fb: FormBuilder,
    private service: UserProfileService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      address: [''],
      city: [''],
      country: [''],

      gender: [''],
      jobTitleId: [''],
      departmentId: [''],
    });

    this.roles =
      this.authService.getCurrentUser()?.roles?.join(',') || 'User, ABC';
    debugger;
    // this.loadProfile();
    // this.loadDropdowns();
    //this.loadProfile();
  }

  loadProfile() {
    this.service.getMyProfile().subscribe((res) => {
      this.form.patchValue(res);
      this.profileImageUrl =
        res.profileImageUrl ??
        'https://ui-avatars.com/api/?name=' +
          this.authService.getCurrentUser()?.user?.fullName;
    });
  }

  loadDropdowns() {
    this.service.getJobTitles().subscribe((res) => (this.jobTitles = res));
    this.service.getDepartments().subscribe((res) => (this.departments = res));
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
  }

  openImagePreview() {
    this.imagePreviewOpen = true;
    this.zoomLevel = 1;
  }

  closeImagePreview() {
    this.imagePreviewOpen = false;
    this.zoomLevel = 1;
  }

  save() {
    this.service.updateProfile(this.form.value).subscribe(() => {
      this.isEditMode = false;
      this.loadProfile();
    });
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX - this.translateX;
    this.startY = event.clientY - this.translateY;
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;

    this.translateX = event.clientX - this.startX;
    this.translateY = event.clientY - this.startY;
  }

  stopDrag() {
    this.isDragging = false;
  }
}
