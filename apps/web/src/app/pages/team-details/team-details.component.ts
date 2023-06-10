import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'bkr-team-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
})
export class TeamDetailsComponent {
  @Input() teamId?: string;
}
