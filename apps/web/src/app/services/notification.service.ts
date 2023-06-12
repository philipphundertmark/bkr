import { ComponentType, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { NotificationContainerComponent } from '../components/notification-container/notification-container.component';

export interface Notification {
  id: number;
  type: 'success' | 'error';
  message: string;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private container?: NotificationContainerComponent;
  private notificationCounter = 0;

  constructor(
    private readonly injector: Injector,
    private readonly overlay: Overlay
  ) {}

  success(message: string, duration = 3000): void {
    this.createNotification({
      id: this.createNotificationId(),
      type: 'success',
      message,
      duration,
    });
  }

  error(message: string, duration = 3000): void {
    this.createNotification({
      id: this.createNotificationId(),
      type: 'error',
      message,
      duration,
    });
  }

  private createContainer(
    ctor: ComponentType<NotificationContainerComponent>
  ): NotificationContainerComponent {
    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().global(),
    });

    const componentPortal = new ComponentPortal(ctor, null, this.injector);
    const componentRef = overlayRef.attach(componentPortal);

    return componentRef.instance;
  }

  private createNotification(notification: Notification): void {
    if (!this.container) {
      this.container = this.createContainer(NotificationContainerComponent);
    }

    this.container.addNotification(notification);
  }

  private createNotificationId(): number {
    return this.notificationCounter++;
  }
}
