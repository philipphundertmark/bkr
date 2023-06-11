import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../components';

@Component({
  selector: 'bkr-station-list',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
})
export class StationListComponent {}
