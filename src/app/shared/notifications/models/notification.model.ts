export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationMessage {
  id: number;
  type: NotificationType;
  message: string;
}
