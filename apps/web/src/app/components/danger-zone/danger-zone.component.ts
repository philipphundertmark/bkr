import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ChevronRightIconComponent,
  ExclamationCircleIconComponent,
} from '../../icons/mini';

@Component({
  selector: 'bkr-danger-zone',
  standalone: true,
  imports: [
    ChevronRightIconComponent,
    CommonModule,
    ExclamationCircleIconComponent,
  ],
  templateUrl: './danger-zone.component.html',
  styleUrls: ['./danger-zone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DangerZoneComponent {
  collapsed = signal(true);

  toggleCollapsed(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }
}
