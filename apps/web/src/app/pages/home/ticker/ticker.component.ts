import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmptyComponent } from '../../../components';
import { TimePipe } from '../../../pipes';
import { Event, EventType } from '../../../services/store';

@Component({
  selector: 'bkr-ticker',
  standalone: true,
  imports: [CommonModule, EmptyComponent, RouterModule, TimePipe],
  host: { class: 'card' },
  styleUrl: './ticker.component.scss',
  templateUrl: './ticker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TickerComponent {
  readonly EventType = EventType;

  events = input.required<Event[]>();
  isRaceOver = input(false);
}
