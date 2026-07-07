import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../../shared/models/category.model';

@Component({
  selector: 'app-category-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <a
      [routerLink]="['/catalog']"
      [queryParams]="{ categoryId: category().id }"
      class="d-flex flex-column align-items-center text-center text-decoration-none p-3 rounded-3 h-100"
      style="background:var(--surface-card);border:1px solid var(--border-default);transition:box-shadow 0.18s,transform 0.18s"
      [attr.aria-label]="'Browse ' + category().name + ' books'"
    >
      <span
        class="material-icons mb-2 rounded-circle d-flex align-items-center justify-content-center"
        style="font-size:28px;color:var(--brand-primary);background:var(--surface-muted);width:56px;height:56px"
      >{{ category().iconName }}</span>
      <span class="fw-semibold small" style="color:var(--text-heading)">{{ category().name }}</span>
      <span class="text-muted" style="font-size:0.75rem">{{ category().bookCount }} books</span>
    </a>
  `,
  styles: [`
    a:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-2px); }
  `],
})
export class CategoryCardComponent {
  category = input.required<Category>();
}
