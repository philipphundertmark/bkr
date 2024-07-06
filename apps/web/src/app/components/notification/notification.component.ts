import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import {
  CheckCircleIconComponent,
  ExclamationCircleIconComponent,
  XMarkIconComponent,
} from '../../icons/mini';
import { Notification } from '../../services';
import { NotificationContainerComponent } from '../notification-container/notification-container.component';

@Component({
  selector: 'bkr-notification',
  standalone: true,
  imports: [
    CheckCircleIconComponent,
    CommonModule,
    ExclamationCircleIconComponent,
    XMarkIconComponent,
  ],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnDestroy, OnInit {
  @Input() notification?: Notification;

  private timer?: ReturnType<typeof setTimeout>;

  constructor(private readonly container: NotificationContainerComponent) {}

  /**
   * @implements {OnDestroy}
   */
  ngOnInit(): void {
    this.timer = setTimeout(
      () => this.handleClose(),
      this.notification?.duration ?? 5000,
    );
  }

  /**
   * @implements {OnDestroy}
   */
  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  handleClose(): void {
    if (this.notification) {
      this.container.removeNotification(this.notification.id);
    }
  }
}
