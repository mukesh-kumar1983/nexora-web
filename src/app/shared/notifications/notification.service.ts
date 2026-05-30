import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationMessage, NotificationType } from './models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationsSubject = new BehaviorSubject<NotificationMessage[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private counter = 0;

  show(type: NotificationType, message: string) {
    const current = this.notificationsSubject.value;

    const notification: NotificationMessage = {
      id: ++this.counter,
      type,
      message
    };

    this.notificationsSubject.next([...current, notification]);

    setTimeout(() => this.remove(notification.id), 3000);
  }

  success(message: string) {
    this.show('success', message);
  }

  error(message: string) {
    this.show('error', message);
  }

  info(message: string) {
    this.show('info', message);
  }

  warning(message: string) {
    this.show('warning', message);
  }

  private remove(id: number) {
    const updated = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(updated);
  }
}
