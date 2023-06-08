import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'bkr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.restore();
  }
}
