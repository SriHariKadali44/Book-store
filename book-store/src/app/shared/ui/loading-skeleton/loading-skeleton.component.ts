import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SkeletonType = 'card' | 'list' | 'text';

/**
 * Animated shimmer placeholder shown during data loading.
 * Uses the `.skeleton` utility class defined in styles.scss.
 */
@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (type() === 'card') {
      <div class="row g-3">
        @for (i of items(); track i) {
          <div class="col-6 col-md-4 col-lg-3">
            <div class="card border-0 shadow-sm h-100" aria-hidden="true">
              <div class="skeleton rounded-top" style="height:200px"></div>
              <div class="card-body">
                <div class="skeleton rounded mb-2" style="height:14px;width:80%"></div>
                <div class="skeleton rounded mb-2" style="height:12px;width:60%"></div>
                <div class="skeleton rounded" style="height:20px;width:40%"></div>
              </div>
            </div>
          </div>
        }
      </div>
    } @else if (type() === 'list') {
      @for (i of items(); track i) {
        <div class="d-flex align-items-center gap-3 mb-3" aria-hidden="true">
          <div class="skeleton rounded" style="width:56px;height:56px;flex-shrink:0"></div>
          <div class="flex-grow-1">
            <div class="skeleton rounded mb-2" style="height:14px;width:70%"></div>
            <div class="skeleton rounded" style="height:12px;width:45%"></div>
          </div>
        </div>
      }
    } @else {
      @for (i of items(); track i) {
        <div class="skeleton rounded mb-2" style="height:14px;width:100%" aria-hidden="true"></div>
      }
    }
  `,
})
export class LoadingSkeletonComponent {
  type = input<SkeletonType>('card');
  rows = input<number>(4);

  readonly items = computed(() => Array.from({ length: this.rows() }, (_, i) => i));
}
