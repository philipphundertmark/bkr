import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';

import { Notification } from '../../services';
import { NotificationComponent } from '../notification/notification.component';

const notificationMotion = trigger('notificationMotion', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(0rem) translateY(0.5rem)',
    }),
    animate(
      '150ms ease-out',
      style({
        opacity: 1,
        transform: 'translateX(0) translateY(0)',
      })
    ),
  ]),
  transition(':leave', [animate('100ms ease-in', style({ opacity: 0 }))]),
]);

@Component({
  animations: [notificationMotion],
  selector: 'bkr-notification-container',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss'],
})
export class NotificationContainerComponent {
  @HostBinding('attr.aria-live') readonly ariaLive = 'assertive';

  notifications: Notification[] = [];

  addNotification(notification: Notification): void {
    this.notifications.unshift(notification);
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter(
      (notification) => notification.id !== id
    );
  }
}
