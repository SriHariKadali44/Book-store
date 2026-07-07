import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Displays 5 stars filled/half/empty based on a 0–5 rating.
 * When `interactive` is true, clicking a star emits `ratingChange`.
 */
@Component({
  selector: 'app-star-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="d-flex align-items-center gap-1"
      [attr.aria-label]="ariaLabel()"
      [attr.role]="interactive() ? 'radiogroup' : 'img'"
    >
      @for (star of stars(); track star.index) {
        @if (interactive()) {
          <button
            type="button"
            class="btn p-0 border-0 bg-transparent"
            [attr.aria-label]="'Rate ' + star.index + ' star' + (star.index > 1 ? 's' : '')"
            [attr.aria-pressed]="star.index <= value()"
            (click)="onStarClick(star.index)"
            style="line-height:1"
          >
            <ng-container *ngTemplateOutlet="starIcon; context: { $implicit: star.type }" />
          </button>
        } @else {
          <span aria-hidden="true" style="line-height:1">
            <ng-container *ngTemplateOutlet="starIcon; context: { $implicit: star.type }" />
          </span>
        }
      }
    </div>

    <ng-template #starIcon let-type>
      @switch (type) {
        @case ('full') {
          <span class="material-icons" [style.color]="'var(--brand-accent)'" [style.font-size]="fontSize()">star</span>
        }
        @case ('half') {
          <span class="material-icons" [style.color]="'var(--brand-accent)'" [style.font-size]="fontSize()">star_half</span>
        }
        @default {
          <span class="material-icons text-muted" [style.font-size]="fontSize()">star_border</span>
        }
      }
    </ng-template>
  `,
  styles: [`
    button:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 2px; border-radius: 2px; }
  `],
  imports: [NgTemplateOutlet],
})
export class StarRatingComponent {
  value = input<number>(0);
  interactive = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');

  ratingChange = output<number>();

  readonly fontSize = computed(() => {
    const map = { sm: '14px', md: '18px', lg: '24px' };
    return map[this.size()];
  });

  readonly ariaLabel = computed(() =>
    `Rating: ${this.value().toFixed(1)} out of 5 stars`
  );

  readonly stars = computed(() => {
    const val = Math.max(0, Math.min(5, this.value()));
    return Array.from({ length: 5 }, (_, i) => {
      const index = i + 1;
      const diff = val - i;
      const type = diff >= 1 ? 'full' : diff >= 0.5 ? 'half' : 'empty';
      return { index, type } as { index: number; type: 'full' | 'half' | 'empty' };
    });
  });

  onStarClick(index: number): void {
    if (this.interactive()) {
      this.ratingChange.emit(index);
    }
  }
}
