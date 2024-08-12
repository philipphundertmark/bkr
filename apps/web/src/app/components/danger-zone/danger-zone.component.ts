import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ChevronRightIconComponent } from '../../icons/mini';

@Component({
  selector: 'bkr-danger-zone',
  standalone: true,
  imports: [ChevronRightIconComponent, CommonModule],
  styleUrl: './danger-zone.component.scss',
  templateUrl: './danger-zone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DangerZoneComponent {
  collapsed = signal(true);

  toggleCollapsed(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }
}
