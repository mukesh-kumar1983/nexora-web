import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.form.value as any).subscribe({
      next: (response) => {
        if (response.success === true) {
          this.authService.saveToken(response.data.token);
          this.authService.rehydrateUser(); // 🔥 IMPORTANT

          const currentUser = {
            fullName: `${response.data.firstName} ${response.data.lastName}`,
            email: response.data.email,
            roles: response.data.roles ?? [],
            profileImageUrl: response.data.profileImageUrl,
          };

          this.authService.setCurrentUser(currentUser);

          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Login failed';
          this.loading = false;
        }
      },

      error: (response) => {
        console.log(response);
        this.errorMessage =
          response?.message + ' TraceId: ' + response?.error?.traceId ||
          'Login failed';
        this.loading = false;
      },
    });
  }
}
