import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { HostBinding } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MediaService, Notification, ScreenSize } from '../../services';
import { NotificationComponent } from '../notification/notification.component';

const notificationMotion = trigger('notificationMotion', [
  transition(':enter', [
    style({
      opacity: 0,
      transform:
        'translateX({{enterTranslateXFrom}}rem) translateY({{enterTranslateYFrom}}rem)',
    }),
    animate(
      '150ms ease-out',
      style({
        opacity: 1,
        transform: 'translateX(0px) translateY(0px)',
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
export class NotificationContainerComponent implements OnInit {
  @HostBinding('attr.aria-live') readonly ariaLive = 'assertive';

  notifications: Notification[] = [];

  private readonly destroyRef = inject(DestroyRef);

  private screenSize: ScreenSize = ScreenSize.XS;

  get enterTranslateXFrom(): number {
    return this.screenSize >= ScreenSize.SM ? 0.5 : 0;
  }

  get enterTranslateYFrom(): number {
    return this.screenSize >= ScreenSize.SM ? 0 : 0.5;
  }

  constructor(private readonly mediaService: MediaService) {}

  /**
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.mediaService.screenSize$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((screenSize) => {
        this.screenSize = screenSize;
      });
  }

  addNotification(notification: Notification): void {
    this.notifications.unshift(notification);
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter(
      (notification) => notification.id !== id
    );
  }
}
