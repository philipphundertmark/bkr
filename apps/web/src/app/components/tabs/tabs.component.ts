import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  contentChildren,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';

import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'bkr-tabs',
  standalone: true,
  imports: [CommonModule],
  host: { '[attr.aria-label]': 'Tabs' },
  styleUrl: './tabs.component.scss',
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements AfterContentInit {
  tabs = contentChildren(TabComponent);

  activeTab = input<string | null>(null);

  activeTabChange = output<string>();

  private readonly destroyRef = inject(DestroyRef);

  /**
   * @implements {AfterContentInit}
   */
  ngAfterContentInit(): void {
    const activeTab = this.tabs().find((tab) => tab.active);

    if (!activeTab) {
      const tabToActivate =
        this.tabs().find((tab) => tab.key() === this.activeTab()) ??
        this.tabs().at(0);

      if (tabToActivate) {
        this.selectTab(tabToActivate);
      }
    }

    merge(...(this.tabs().map((tab) => tab.activate$) ?? []))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tab) => {
        this.selectTab(tab);
        this.activeTabChange.emit(tab.key());
      });
  }

  private selectTab(tab: TabComponent): void {
    this.tabs().forEach((t) => (t.active = false));
    tab.active = true;
  }
}
