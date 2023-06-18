import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'bkr-empty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss'],
})
export class EmptyComponent {}
