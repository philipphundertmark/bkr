import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../components';
import { AuthService } from '../../services';

@Component({
  selector: 'bkr-home',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isStation = toSignal(this.authService.isStation$);

  constructor(private readonly authService: AuthService) {}
}
