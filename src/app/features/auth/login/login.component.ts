import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService, CurrentUser } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loading = false;
  errorMessage = '';

  form = this.fb.group({
    email: ['Admin@system.com', [Validators.required, Validators.email]],
    password: ['Admin@123', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  login(): void {

    if (this.form.invalid) return;

    this.loading = true;

    this.authService.login(this.form.value as any).subscribe({

      next: (response) => {

        if (response.success === true) {

          // 1. Save token
          this.authService.saveToken(response.data.token);

          // 2. Build user object
          const user: CurrentUser = {
            id: response.data.id,
            fullName: `${response.data.firstName} ${response.data.lastName}`,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            roles: response.data.roles ?? [],
            profileImageUrl: response.data.profileImageUrl
          };

          // 3. Set user (THIS triggers header update)
          this.authService.setCurrentUser(user);

          // 4. Navigate
          this.router.navigate(['/dashboard']);

        } else {
          this.errorMessage = response.message || 'Login failed';
          this.loading = false;
        }
      },

      error: (err) => {
        this.errorMessage =
          err?.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
