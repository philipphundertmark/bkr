import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { Team } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import { AuthService, TeamService } from '../../services';

@Component({
  selector: 'bkr-home',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    LoadingComponent,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isStation = toSignal(this.authService.isStation$);
  loading = toSignal(this.teamService.loading$, { initialValue: false });
  teams = toSignal(this.teamService.teams$, { initialValue: [] as Team[] });

  constructor(
    private readonly authService: AuthService,
    private readonly teamService: TeamService
  ) {}
}
