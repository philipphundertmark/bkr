import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ChevronRightIconComponent,
  ExclamationCircleIconComponent,
} from '../../icons/mini';

@Component({
  animations: [
    trigger('collapse', [
      transition(':enter', [
        style({ height: '0px', marginTop: 0, opacity: 0 }),
        animate(
          '100ms ease-in-out',
          style({ height: '*', marginTop: '24px' /* mt-6 */, opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '100ms ease-in-out',
          style({ height: '0px', marginTop: 0, opacity: 0 })
        ),
      ]),
    ]),
  ],
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
