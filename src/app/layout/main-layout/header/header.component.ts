import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import  {AuthService} from '../../../core/services/auth.service';
import {UserProfile} from '../../../features/hr/models/user-profile';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  
})
export class HeaderComponent {

  constructor(private authService: AuthService) {

  }

 userProfile$ = this.authService.currentUser$;

  menuOpen = false;

  

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    localStorage.removeItem('token');

    window.location.href = '/auth/login';
  }

  closeMenu() {
  this.menuOpen = false;
  }
}