import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../components';
import { AuthService } from '../../services';

@Component({
  selector: 'bkr-station-list',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
})
export class StationListComponent {
  isAdmin = toSignal(this.authService.isAdmin$);

  constructor(private readonly authService: AuthService) {}
}
