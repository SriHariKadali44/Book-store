import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  label: string;
  route?: string;
}

/**
 * ARIA-compliant breadcrumb navigation trail.
 * The last crumb is rendered as non-linked active item.
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <nav aria-label="Breadcrumb">
      <ol class="breadcrumb mb-0">
        @for (crumb of crumbs(); track crumb.label; let last = $last) {
          <li class="breadcrumb-item" [class.active]="last" [attr.aria-current]="last ? 'page' : null">
            @if (!last && crumb.route) {
              <a [routerLink]="crumb.route">{{ crumb.label }}</a>
            } @else {
              {{ crumb.label }}
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class BreadcrumbComponent {
  crumbs = input<Crumb[]>([]);
}
