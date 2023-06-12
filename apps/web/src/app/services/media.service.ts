import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export enum ScreenSize {
  XS = 0,
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280,
  XXL = 1536,
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  readonly screenSize$ = this.observeScreenSize();

  constructor(private readonly breakpointObserver: BreakpointObserver) {}

  observeScreenSize(): Observable<ScreenSize> {
    const minWidthQueriesMap = new Map([
      // Screen sizes must be sorted in descending order
      [this.minWidthQuery(ScreenSize.XXL), ScreenSize.XXL],
      [this.minWidthQuery(ScreenSize.XL), ScreenSize.XL],
      [this.minWidthQuery(ScreenSize.LG), ScreenSize.LG],
      [this.minWidthQuery(ScreenSize.MD), ScreenSize.MD],
      [this.minWidthQuery(ScreenSize.SM), ScreenSize.SM],
      [this.minWidthQuery(ScreenSize.XS), ScreenSize.XS],
    ]);

    return this.breakpointObserver.observe([...minWidthQueriesMap.keys()]).pipe(
      map((result) => {
        for (const query of minWidthQueriesMap.keys()) {
          if (result.breakpoints[query]) {
            return minWidthQueriesMap.get(query) ?? ScreenSize.XS;
          }
        }

        return ScreenSize.XS;
      })
    );
  }

  private minWidthQuery(minWidth: number): string {
    return `(min-width: ${minWidth}px)`;
  }
}
