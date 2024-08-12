import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
} from '@angular/core';

import {
  ChevronLeftIconComponent,
  ChevronRightIconComponent,
} from '../../icons/mini';
import { SpinnerComponent } from '../spinner/spinner.component';

export type ButtonType = 'primary' | 'default' | 'danger';

@Component({
  selector:
    'a[bkr-button], a[bkr-backward-button], a[bkr-forward-button], a[bkr-icon-button], button[bkr-button], button[bkr-icon-button]',
  standalone: true,
  imports: [
    ChevronLeftIconComponent,
    ChevronRightIconComponent,
    CommonModule,
    SpinnerComponent,
  ],
  styleUrl: './button.component.scss',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() bkrLoading = false;
  @Input() bkrType: ButtonType = 'default';

  @HostBinding('class.primary') get typePrimary(): boolean {
    return this.bkrType === 'primary';
  }
  @HostBinding('class.default') get typeDefault(): boolean {
    return this.bkrType === 'default';
  }
  @HostBinding('class.danger') get typeDanger(): boolean {
    return this.bkrType === 'danger';
  }
  @HostBinding('class.icon') get isIconButton(): boolean {
    return this.getHostAttribute('bkr-icon-button') !== null;
  }
  @HostBinding('class.anchor') get isAnchor(): boolean {
    return this.getHostTagName() === 'a';
  }
  @HostBinding('class.backward') get isBackward(): boolean {
    return this.getHostAttribute('bkr-backward-button') !== null;
  }
  @HostBinding('class.forward') get isForward(): boolean {
    return this.getHostAttribute('bkr-forward-button') !== null;
  }

  constructor(private readonly elementRef: ElementRef<HTMLButtonElement>) {}

  private getHostAttribute(attribute: string): string | null {
    return this.getHostElement().getAttribute(attribute);
  }

  private getHostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private getHostTagName(): string {
    return this.getHostElement().tagName.toLowerCase();
  }
}
