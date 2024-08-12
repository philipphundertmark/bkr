import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bkr-alert',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './alert.component.scss',
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {}
