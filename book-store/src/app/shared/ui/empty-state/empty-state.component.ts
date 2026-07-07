import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Generic empty / no-results state with optional CTA.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex flex-column align-items-center justify-content-center py-5 px-3 text-center">
      <span class="material-icons mb-3" style="font-size:56px;color:var(--text-muted)">{{ icon() }}</span>
      <h5 class="fw-semibold mb-2" style="color:var(--text-heading)">{{ title() }}</h5>
      <p class="text-muted mb-4" style="max-width:360px">{{ description() }}</p>
      @if (ctaLabel()) {
        <button
          type="button"
          class="btn btn-primary"
          (click)="ctaClick.emit()"
        >{{ ctaLabel() }}</button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  icon        = input<string>('inventory_2');
  title       = input<string>('Nothing here yet');
  description = input<string>('');
  ctaLabel    = input<string>('');

  ctaClick = output<void>();
}
