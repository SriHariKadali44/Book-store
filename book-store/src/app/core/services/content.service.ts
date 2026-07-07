import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AppContent } from '../content/content.model';

/**
 * Loads `en.json` once at app startup (via APP_INITIALIZER) and
 * exposes typed content access to all components.
 *
 * Components reference: `contentService.get('header').searchPlaceholder`
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly _content = signal<AppContent | null>(null);

  readonly content = this._content.asReadonly();

  /** Called by APP_INITIALIZER — loads the i18n JSON before the app renders. */
  load(): Promise<void> {
    return new Promise(resolve => {
      this.http
        .get<AppContent>('/assets/i18n/en.json')
        .pipe(tap(data => this._content.set(data)))
        .subscribe({ next: () => resolve(), error: () => resolve() });
    });
  }

  /** Returns a top-level section of the content tree. */
  get<K extends keyof AppContent>(section: K): AppContent[K] {
    return this._content()?.[section] ?? ({} as AppContent[K]);
  }

  /** Returns a single string key; falls back to empty string if not loaded. */
  getKey<K extends keyof AppContent>(section: K, key: keyof AppContent[K]): string {
    const sect = this.get(section);
    return (sect[key] as unknown as string) ?? '';
  }
}
