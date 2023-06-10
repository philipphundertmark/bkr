import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserIconComponent } from './icons/solid';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  imports: [RouterModule, UserIconComponent],
  selector: 'bkr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.restore();
  }
}
