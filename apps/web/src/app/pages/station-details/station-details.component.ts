import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../components';
import { AuthService } from '../../services';

@Component({
  selector: 'bkr-station-details',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss'],
})
export class StationDetailsComponent {
  @Input() stationId?: string;

  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });

  constructor(private readonly authService: AuthService) {}
}
