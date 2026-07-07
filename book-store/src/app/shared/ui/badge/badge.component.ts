import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant = 'genre' | 'format' | 'status' | 'new' | 'sale' | 'success' | 'warning' | 'error' | 'info';

/**
 * Token-mapped status/genre/format badge using Bootstrap badge + custom CSS vars.
 */
@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="classes()" role="status">{{ label() }}</span>
  `,
  styles: [`
    .badge-new  { background-color: var(--brand-accent);       color: var(--text-inverse); }
    .badge-sale { background-color: var(--status-error-bg);    color: var(--status-error-text); }
    .badge-genre,
    .badge-format { background-color: var(--surface-muted);     color: var(--text-body); border: 1px solid var(--border-default); }
  `],
})
export class BadgeComponent {
  label = input.required<string>();
  variant = input<BadgeVariant>('info');

  readonly classes = computed(() => {
    const v = this.variant();
    const map: Record<BadgeVariant, string> = {
      success: 'badge badge-success',
      warning: 'badge badge-warning',
      error:   'badge badge-error',
      info:    'badge badge-info',
      new:     'badge badge-new',
      sale:    'badge badge-sale',
      genre:   'badge badge-genre',
      format:  'badge badge-format rounded-pill',
      status:  'badge bg-secondary',
    };
    return map[v] ?? 'badge bg-secondary';
  });
}
