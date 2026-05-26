import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  stats = [
    { title: 'Employees', value: 120, icon: 'bi-people' },
    { title: 'Products', value: 45, icon: 'bi-box' },
    { title: 'Orders', value: 87, icon: 'bi-cart' },
    { title: 'Revenue', value: '$12,400', icon: 'bi-currency-dollar' }
  ];
}