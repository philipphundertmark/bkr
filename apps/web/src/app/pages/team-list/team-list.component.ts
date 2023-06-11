import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../components';

@Component({
  selector: 'bkr-team-list',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent {}
