import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BookSummary } from '../../../../shared/models/book.model';
import { Review, ReviewSummary } from '../../../../shared/models/review.model';
import { PaginationMeta } from '../../../../shared/models/pagination.model';
import { SlicePipe } from '@angular/common';
import { AuthService } from '../../../../shared/auth/auth.service';
import { inject } from '@angular/core';
import { StarRatingComponent } from '../../../../shared/ui/star-rating/star-rating.component';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { CreateReviewDto } from '../../../../shared/models/review.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-reviews',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StarRatingComponent, SlicePipe, PaginationComponent, ReviewFormComponent, RouterLink],
  template: `
    <section aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" class="h5 fw-bold mb-4" style="color:var(--text-heading)">Customer Reviews</h2>

      @if (summary()) {
        <!-- Rating Distribution -->
        <div class="d-flex flex-column flex-md-row gap-4 mb-4 p-4 bg-surface-muted rounded-3">
          <!-- Big number -->
          <div class="text-center flex-shrink-0">
            <div class="font-heading fw-bold" style="font-size:3rem;color:var(--text-heading);line-height:1">
              {{ summary()!.averageRating.toFixed(1) }}
            </div>
            <app-star-rating [value]="summary()!.averageRating" size="md" />
            <div class="text-muted small mt-1">{{ summary()!.totalReviews }} reviews</div>
          </div>

          <!-- Distribution bars -->
          <div class="flex-grow-1">
            @for (star of [5, 4, 3, 2, 1]; track star) {
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="small text-muted" style="width:30px">{{ star }}★</span>
                <div class="flex-grow-1 bg-white rounded-pill overflow-hidden" style="height:10px;border:1px solid var(--border-default)">
                  <div
                    class="h-100 rounded-pill"
                    style="background:var(--brand-accent)"
                    [style.width.%]="getBarWidth(star)"
                  ></div>
                </div>
                <span class="small text-muted" style="width:36px">
                  {{ getStar(star) }}
                </span>
              </div>
            }
          </div>
        </div>
      }

      <!-- Review Form (auth only) -->
      @if (auth.isAuthenticated()) {
        <app-review-form (submitReview)="submitReview.emit($event)" />
      } @else {
        <div class="alert alert-light border mb-4 small">
          <a routerLink="/auth/login" style="color:var(--brand-primary)">Sign in</a> to write a review.
        </div>
      }

      <!-- Review list -->
      <div class="d-flex flex-column gap-3">
        @for (review of reviews(); track review.id) {
          <div class="bg-surface-muted rounded-3 p-3">
            <div class="d-flex align-items-center justify-content-between mb-1">
              <div class="d-flex align-items-center gap-2">
                <strong class="small">{{ review.userName }}</strong>
                @if (review.verifiedPurchase) {
                  <span class="badge small" style="background:var(--status-success-bg);color:var(--status-success-text)">
                    ✓ Verified
                  </span>
                }
              </div>
              <span class="text-muted" style="font-size:0.75rem">{{ review.createdAt | slice:0:10 }}</span>
            </div>
            <app-star-rating [value]="review.rating" size="sm" />
            <p class="fw-semibold small mb-1 mt-1">{{ review.title }}</p>
            <p class="text-body small mb-0">{{ review.body }}</p>
          </div>
        }
      </div>

      @if ((paginationMeta()?.totalPages ?? 0) > 1) {
        <div class="mt-3">
          <app-pagination
            [meta]="paginationMeta()!"
            (pageChange)="reviewPageChange.emit($event)"
          />
        </div>
      }
    </section>
  `,
})
export class BookReviewsComponent {
  summary        = input<ReviewSummary | null>(null);
  reviews        = input.required<Review[]>();
  paginationMeta = input<PaginationMeta | null>(null);

  submitReview    = output<CreateReviewDto>();
  reviewPageChange = output<number>();

  readonly auth = inject(AuthService);

  getStar(star: number): number {
    return this.summary()?.ratingDistribution[star as 1|2|3|4|5] ?? 0;
  }

  getBarWidth(star: number): number {
    const total = this.summary()?.totalReviews ?? 0;
    if (!total) return 0;
    return Math.round((this.getStar(star) / total) * 100);
  }
}
