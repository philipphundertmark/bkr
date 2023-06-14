import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../components';
import { AuthService } from '../../services';

@Component({
  selector: 'bkr-team-list',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent {
  isAdmin = toSignal(this.authService.isAdmin$);

  constructor(private readonly authService: AuthService) {}
}
