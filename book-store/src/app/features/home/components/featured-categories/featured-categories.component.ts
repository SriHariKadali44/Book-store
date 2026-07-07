import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Category } from '../../../../shared/models/category.model';
import { CategoryCardComponent } from '../category-card/category-card.component';

@Component({
  selector: 'app-featured-categories',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryCardComponent],
  template: `
    <section class="py-5 bg-surface-muted" aria-labelledby="categories-heading">
      <div class="container-xl px-3 px-lg-4">
        <h2
          id="categories-heading"
          class="font-heading fw-bold text-center mb-4"
          style="color:var(--text-heading);font-size:clamp(1.5rem,3vw,2rem)"
        >Browse by Category</h2>

        <div class="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-8">
          @for (cat of categories(); track cat.id) {
            <div class="col">
              <app-category-card [category]="cat" />
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class FeaturedCategoriesComponent {
  categories = input.required<Category[]>();
}
