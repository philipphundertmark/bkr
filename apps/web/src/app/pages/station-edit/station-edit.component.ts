import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'bkr-station-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './station-edit.component.html',
  styleUrls: ['./station-edit.component.scss'],
})
export class StationEditComponent {
  @Input() stationId?: string;
}
