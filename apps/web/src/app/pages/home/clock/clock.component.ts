import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bkr-clock',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'card' },
  styleUrl: './clock.component.scss',
  templateUrl: './clock.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent {}
