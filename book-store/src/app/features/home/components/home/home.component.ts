import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { BookSummary } from '../../../../shared/models/book.model';
import { Category } from '../../../../shared/models/category.model';
import { PromoInfo } from '../../models/home.model';
import { HomeService } from '../../services/home.service';
import { CartService } from '../../../cart/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingSkeletonComponent } from '../../../../shared/ui/loading-skeleton/loading-skeleton.component';
import { HeroBannerComponent } from '../hero-banner/hero-banner.component';
import { FeaturedCategoriesComponent } from '../featured-categories/featured-categories.component';
import { FeaturedBooksComponent } from '../featured-books/featured-books.component';
import { PromosBannerComponent } from '../promos-banner/promos-banner.component';
import { NewArrivalsComponent } from '../new-arrivals/new-arrivals.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingSkeletonComponent,
    HeroBannerComponent,
    FeaturedCategoriesComponent,
    FeaturedBooksComponent,
    PromosBannerComponent,
    NewArrivalsComponent,
  ],
  template: `
    <!-- Hero -->
    <app-hero-banner />

    <!-- Featured Categories -->
    @defer (on idle) {
      <app-featured-categories [categories]="categories()" />
    } @loading {
      <div class="container-xl px-3 py-5">
        <app-loading-skeleton type="list" [rows]="1" />
      </div>
    }

    <!-- Promo Banners -->
    @defer (on idle) {
      <app-promos-banner [promos]="promos()" />
    }

    <!-- Featured Books -->
    @defer (on idle) {
      <app-featured-books
        [books]="featuredBooks()"
        (addToCart)="onAddToCart($event)"
        (wishlistToggle)="onWishlistToggle($event)"
      />
    } @loading {
      <div class="container-xl px-3 py-5">
        <app-loading-skeleton type="card" [rows]="4" />
      </div>
    }

    <!-- New Arrivals -->
    @defer (on idle) {
      <app-new-arrivals
        [books]="newArrivals()"
        (addToCart)="onAddToCart($event)"
        (wishlistToggle)="onWishlistToggle($event)"
      />
    } @loading {
      <div class="container-xl px-3 py-5">
        <app-loading-skeleton type="card" [rows]="4" />
      </div>
    }
  `,
})
export class HomeComponent implements OnInit {
  private readonly homeService = inject(HomeService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);

  readonly categories    = signal<Category[]>([]);
  readonly featuredBooks = signal<BookSummary[]>([]);
  readonly newArrivals   = signal<BookSummary[]>([]);
  readonly promos        = signal<PromoInfo[]>([]);

  ngOnInit(): void {
    this.homeService.getCategories().subscribe(data => this.categories.set(data));
    this.homeService.getFeaturedBooks().subscribe(data => this.featuredBooks.set(data));
    this.homeService.getNewArrivals().subscribe(data => this.newArrivals.set(data));
    this.homeService.getPromos().subscribe(data => this.promos.set(data));
  }

  onAddToCart(book: BookSummary): void {
    this.cartService.addItem(book);
    this.toastService.show(`"${book.title}" added to cart`, 'success');
  }

  onWishlistToggle(event: { book: BookSummary; wishlisted: boolean }): void {
    const action = event.wishlisted ? 'added to' : 'removed from';
    this.toastService.show(`"${event.book.title}" ${action} wishlist`, 'info');
  }
}
