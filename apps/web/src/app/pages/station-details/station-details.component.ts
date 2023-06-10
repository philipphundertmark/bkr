import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'bkr-station-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss'],
})
export class StationDetailsComponent {
  @Input() stationId?: string;
}
