import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuOpen = false;
 

  user$ = this.authService.currentUser$;

  

  constructor(
    private el: ElementRef,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  

  closeAll(): void {
    this.menuOpen = false;
  }

  canManageEmployees(user: any): boolean {
    return user?.roles?.includes('Admin') || user?.roles?.includes('HR');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeAll();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) {
      this.closeAll();
    }
  }
}
