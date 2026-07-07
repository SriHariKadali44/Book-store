import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';

import { BookDetail, BookSummary } from '../../../../shared/models/book.model';
import { Review, ReviewSummary, CreateReviewDto } from '../../../../shared/models/review.model';
import { PagedResult } from '../../../../shared/models/pagination.model';
import { BookDetailService } from '../../services/book-detail.service';
import { CartService } from '../../../cart/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
import { BreadcrumbComponent } from '../../../../shared/ui/breadcrumb/breadcrumb.component';
import { LoadingSkeletonComponent } from '../../../../shared/ui/loading-skeleton/loading-skeleton.component';
import { BookInfoComponent } from '../book-info/book-info.component';
import { BookMetaComponent } from '../book-meta/book-meta.component';
import { BookDescriptionComponent } from '../book-description/book-description.component';
import { BookReviewsComponent } from '../book-reviews/book-reviews.component';
import { RelatedBooksComponent } from '../related-books/related-books.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    BreadcrumbComponent,
    LoadingSkeletonComponent,
    BookInfoComponent,
    BookMetaComponent,
    BookDescriptionComponent,
    BookReviewsComponent,
    RelatedBooksComponent,
  ],
  template: `
    @if (loading()) {
      <div class="container-xl px-3 px-lg-4 py-4">
        <app-loading-skeleton type="text" [rows]="6" />
      </div>
    } @else if (!book()) {
      <div class="container-xl px-3 py-5 text-center">
        <span class="material-icons text-muted" style="font-size:64px">search_off</span>
        <h2 class="mt-3">Book not found</h2>
        <p class="text-muted">The book you are looking for does not exist.</p>
        <a routerLink="/catalog" class="btn btn-primary">Back to Catalog</a>
      </div>
    } @else {
      <div class="container-xl px-3 px-lg-4 py-4">
        <app-breadcrumb
          [crumbs]="[
            { label: 'Home', route: '/' },
            { label: 'Catalog', route: '/catalog' },
            { label: book()!.title, route: '/catalog/' + book()!.id }
          ]"
        />

        <!-- Main grid -->
        <div class="row g-4 mt-1">
          <!-- Cover -->
          <div class="col-12 col-md-4 col-lg-3">
            <div
              class="bg-surface-muted rounded-3 d-flex align-items-center justify-content-center border"
              style="min-height:360px;overflow:hidden"
            >
              <span class="material-icons text-muted" style="font-size:96px">menu_book</span>
            </div>
          </div>

          <!-- Book info -->
          <div class="col-12 col-md-8 col-lg-5">
            <app-book-info
              [book]="book()!"
              (addToCartEvent)="onAddToCart($event)"
              (wishlistToggle)="onWishlistToggle($event)"
            />
          </div>

          <!-- Metadata -->
          <div class="col-12 col-lg-4">
            <div class="bg-surface-muted rounded-3 p-3">
              <h2 class="h6 fw-bold mb-3" style="color:var(--text-heading)">Book Details</h2>
              <app-book-meta [book]="book()!" />
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="mt-4 pt-4 border-top">
          <app-book-description [book]="book()!" />
        </div>

        <!-- Reviews -->
        @defer (on idle) {
          <div class="mt-4 pt-4 border-top">
            <app-book-reviews
              [summary]="reviewSummary()"
              [reviews]="reviews()"
              [paginationMeta]="reviewsMeta()"
              (submitReview)="onSubmitReview($event)"
              (reviewPageChange)="loadReviews($event)"
            />
          </div>
        } @loading {
          <div class="mt-4 pt-4 border-top">
            <app-loading-skeleton type="list" [rows]="3" />
          </div>
        }
      </div>

      <!-- Related books -->
      @defer (on idle) {
        <app-related-books
          [books]="relatedBooks()"
          (addToCart)="onAddToCart({ book: $event, qty: 1 })"
        />
      }
    }
  `,
})
export class BookDetailComponent implements OnInit {
  /** Route param bound via withComponentInputBindings() */
  id = input<string>('');

  private readonly bookDetailService = inject(BookDetailService);
  private readonly cartService       = inject(CartService);
  private readonly toastService      = inject(ToastService);

  readonly loading       = signal(true);
  readonly book          = signal<BookDetail | null>(null);
  readonly reviews       = signal<Review[]>([]);
  readonly reviewSummary = signal<ReviewSummary | null>(null);
  readonly reviewsMeta   = signal<import('../../../../shared/models/pagination.model').PaginationMeta | null>(null);
  readonly relatedBooks  = signal<BookSummary[]>([]);

  ngOnInit(): void {
    const bookId = this.id();
    if (!bookId) { this.loading.set(false); return; }

    this.bookDetailService.getBook(bookId).subscribe(book => {
      this.book.set(book);
      this.loading.set(false);
    });

    this.bookDetailService.getReviewSummary(bookId).subscribe(s => this.reviewSummary.set(s));
    this.loadReviews(1);
    this.bookDetailService.getRelatedBooks(bookId).subscribe(b => this.relatedBooks.set(b));
  }

  loadReviews(page: number): void {
    this.bookDetailService.getReviews(this.id(), page, 5).subscribe(r => {
      this.reviews.set(r.data);
      this.reviewsMeta.set(r.meta);
    });
  }

  onAddToCart(event: { book: BookSummary; qty: number }): void {
    this.cartService.addItem(event.book, event.qty);
    this.toastService.show(`"${event.book.title}" added to cart`, 'success');
  }

  onWishlistToggle(book: BookSummary): void {
    this.toastService.show(`"${book.title}" added to wishlist`, 'info');
  }

  onSubmitReview(dto: CreateReviewDto): void {
    this.bookDetailService.submitReview(this.id(), dto).subscribe(newReview => {
      this.reviews.update(r => [newReview, ...r]);
      this.toastService.show('Review submitted. Thank you!', 'success');
    });
  }
}
