import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'bkr-station-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
})
export class StationListComponent {}
