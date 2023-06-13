import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonComponent, InputDirective } from '../../components';
import { TeamService } from '../../services';

@Component({
  selector: 'bkr-team-new',
  standalone: true,
  imports: [ButtonComponent, CommonModule, InputDirective, RouterModule],
  templateUrl: './team-new.component.html',
  styleUrls: ['./team-new.component.scss'],
})
export class TeamNewComponent {
  constructor(private readonly teamService: TeamService) {}
}
