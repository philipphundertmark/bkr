import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'bkr-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {}
