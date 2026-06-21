import { MenuItem } from '../models/menu.model';

export const APP_MENU: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'home',
    roles: ['SuperAdmin', 'HR', 'User']
  },

  {
    label: 'Identity',
    icon: 'user',
    roles: ['SuperAdmin', 'HR'],
    children: [
      {
        label: 'User Profile',
        route: '/profile',
        roles: ['SuperAdmin', 'HR', 'User']
      }
    ]
  },

  {
    label: 'HR',
    icon: 'users',
    roles: ['SuperAdmin', 'HR'],
    children: [
      {
        label: 'Employees',
        route: '/hr/employees',
        roles: ['SuperAdmin', 'HR']
      },
      {
        label: 'Departments',
        route: '/hr/departments',
        roles: ['SuperAdmin', 'HR']
      },
      {
        label: 'Designations',
        route: '/hr/designations',
        roles: ['SuperAdmin', 'HR']
      }
    ]
  },

  {
    label: 'Admin',
    icon: 'shield',
    roles: ['SuperAdmin'],
    children: [
      {
        label: 'Tenants',
        route: '/admin/tenants',
        roles: ['SuperAdmin']
      },
      {
        label: 'Modules',
        route: '/admin/modules',
        roles: ['SuperAdmin']
      }
    ]
  }
];
