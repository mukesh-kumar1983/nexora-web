import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuOpen = false;

  @HostListener('document:keydown.escape')
  onEsc() {
    this.menuOpen = false;
  }

  // ✅ Single source of truth
  userProfile$ = this.authService.currentUser$;

  constructor(
    private el: ElementRef,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    console.log('CURRENT USER:', this.authService.getCurrentUser());
  }

  // 🔐 role check
  // canManageEmployees(): boolean {
  //   return this.authService.hasRole(['Admin', 'HR']);
  // }

  canManageEmployees(user: any): boolean {
    return user?.roles?.includes('Admin') || user?.roles?.includes('HR');
  }

  // 🔽 toggle dropdown
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // ❌ close dropdown
  closeMenu() {
    this.menuOpen = false;
  }

  // 🚪 logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  // 🧠 optional: close menu on route change safety
  navigateAndClose(route: string) {
    this.menuOpen = false;
    this.router.navigate([route]);
  }

  // ✅ THIS is the real outside click fix
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // if click is outside header
    if (!this.el.nativeElement.contains(target)) {
      this.menuOpen = false;
    }
  }
}
