import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  // ================= AUTH LAYOUT =================
  {
    path: 'auth',
    loadComponent: () =>
      import('./layout/auth-layout/auth-layout.component')
        .then(m => m.AuthLayoutComponent),

    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component')
            .then(m => m.LoginComponent)
      }
    ]
  },

  // ================= MAIN LAYOUT =================
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent),

    canActivate: [authGuard],

    children: [

      // DASHBOARD
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },

      // EMPLOYEES
      {
        path: 'hr/employees',
        loadComponent: () =>
          import('./features/hr/employees/employee-conpoment/employee.component')
            .then(m => m.EmployeeComponent)
      },
      {
        path: 'hr/employees/my-profile',
        loadComponent: () =>
          import('./features/hr/employees/user-profile/user-profile.component')
            .then(m => m.UserProfileComponent)
      }
    ]
  },

  // ================= DEFAULT ROUTE =================
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];