import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AccountService } from '../../services/account.service';
import { CartService } from '../../../cart/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
import { BookSummary } from '../../../../shared/models/book.model';
import { BookCardComponent } from '../../../../shared/ui/book-card/book-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookCardComponent],
  template: `
    <h2 class="h6 fw-bold mb-4" style="color:var(--text-heading)">My Wishlist</h2>

    @if (loading()) {
      <p class="text-muted small">Loading wishlist…</p>
    } @else if (books().length === 0) {
      <div class="text-center py-4">
        <span class="material-icons text-muted" style="font-size:48px">favorite_border</span>
        <p class="text-muted mt-2">Your wishlist is empty.</p>
      </div>
    } @else {
      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
        @for (book of books(); track book.id) {
          <div class="col">
            <app-book-card
              [book]="book"
              [showWishlist]="true"
              [initialWishlisted]="true"
              (addToCart)="onMoveToCart($event)"
              (wishlistToggle)="onRemove($event)"
            />
          </div>
        }
      </div>
    }
  `,
})
export class WishlistComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly cartService    = inject(CartService);
  private readonly toastService   = inject(ToastService);

  readonly loading = signal(true);
  readonly books   = signal<BookSummary[]>([]);

  ngOnInit(): void {
    this.accountService.getWishlist().subscribe(b => {
      this.books.set(b);
      this.loading.set(false);
    });
  }

  onMoveToCart(book: BookSummary): void {
    this.cartService.addItem(book);
    this.toastService.show(`"${book.title}" moved to cart`, 'success');
  }

  onRemove(event: { book: BookSummary; wishlisted: boolean }): void {
    if (!event.wishlisted) {
      this.accountService.removeFromWishlist(event.book.id).subscribe(() => {
        this.books.update(b => b.filter(x => x.id !== event.book.id));
        this.toastService.show(`"${event.book.title}" removed from wishlist`, 'info');
      });
    }
  }
}
