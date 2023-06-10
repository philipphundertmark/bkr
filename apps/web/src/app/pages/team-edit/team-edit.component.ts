import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'bkr-team-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.scss'],
})
export class TeamEditComponent {
  @Input() teamId?: string;
}
