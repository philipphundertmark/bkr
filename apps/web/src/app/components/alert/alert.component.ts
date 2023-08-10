import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { InformationCircleIconComponent } from '../../icons/mini';

@Component({
  selector: 'bkr-alert',
  standalone: true,
  imports: [CommonModule, InformationCircleIconComponent],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {}
