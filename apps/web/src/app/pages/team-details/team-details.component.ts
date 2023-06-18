import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../components';
import { AuthService } from '../../services';

@Component({
  selector: 'bkr-team-details',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
})
export class TeamDetailsComponent {
  @Input() teamId?: string;

  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });

  constructor(private readonly authService: AuthService) {}
}
