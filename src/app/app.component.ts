import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalLoaderComponent } from './shared/components/global-loader/global-loader.component';
import { AuthService } from './core/services/auth.service';
import { NotificationComponent } from './shared/notifications/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GlobalLoaderComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'nexora-web';

  constructor(private authService: AuthService) {
    console.log('APP COMPONENT CONSTRUCTOR');
    this.authService.rehydrateUser(); // 🔥 IMPORTANT
  }

  ngOnInit() {}
}
