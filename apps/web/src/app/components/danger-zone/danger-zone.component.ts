import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ExclamationCircleIconComponent } from '../../icons/mini';

@Component({
  selector: 'bkr-danger-zone',
  standalone: true,
  imports: [CommonModule, ExclamationCircleIconComponent],
  templateUrl: './danger-zone.component.html',
  styleUrls: ['./danger-zone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DangerZoneComponent {}
