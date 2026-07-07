import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import { BookSummary } from '../../../../shared/models/book.model';
import { Category } from '../../../../shared/models/category.model';
import {
  CatalogFilters,
  DEFAULT_CATALOG_FILTERS,
} from '../../../../shared/models/catalog-filter.model';
import { PagedResult } from '../../../../shared/models/pagination.model';
import { CatalogService } from '../../services/catalog.service';
import { CartService } from '../../../cart/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
import { BreadcrumbComponent } from '../../../../shared/ui/breadcrumb/breadcrumb.component';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
import { CatalogFiltersComponent } from '../catalog-filters/catalog-filters.component';
import { CatalogToolbarComponent } from '../catalog-toolbar/catalog-toolbar.component';
import { BookGridComponent } from '../book-grid/book-grid.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BreadcrumbComponent,
    PaginationComponent,
    CatalogFiltersComponent,
    CatalogToolbarComponent,
    BookGridComponent,
  ],
  template: `
    <div class="container-xl px-3 px-lg-4 py-4">
      <app-breadcrumb [crumbs]="[{ label: 'Home', route: '/' }, { label: 'All Books', route: '/catalog' }]" />

      <div class="row g-4 mt-1">
        <!-- Sidebar filters: hidden on mobile via collapse, sticky on desktop -->
        <div class="col-lg-3 d-none d-lg-block">
          <div style="position:sticky;top:80px">
            <app-catalog-filters
              [filters]="filters()"
              [categories]="categories()"
              (filtersChange)="patchFilters($event)"
              (clearAll)="clearFilters()"
            />
          </div>
        </div>

        <!-- Mobile filter toggle -->
        <div class="col-12 d-lg-none">
          <button
            class="btn btn-outline-secondary btn-sm w-100"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mobileFilters"
            aria-expanded="false"
            aria-controls="mobileFilters"
          >
            <span class="material-icons align-middle me-1" style="font-size:16px">tune</span>
            Filters
          </button>
          <div class="collapse mt-2" id="mobileFilters">
            <app-catalog-filters
              [filters]="filters()"
              [categories]="categories()"
              (filtersChange)="patchFilters($event)"
              (clearAll)="clearFilters()"
            />
          </div>
        </div>

        <!-- Main content -->
        <div class="col-lg-9">
          <app-catalog-toolbar
            [filters]="filters()"
            [totalItems]="pagedResult()?.meta?.totalItems ?? 0"
            (filtersChange)="patchFilters($event)"
          />

          <app-book-grid
            [books]="pagedResult()?.data ?? []"
            [loading]="loading()"
            (addToCart)="onAddToCart($event)"
            (wishlistToggle)="onWishlistToggle($event)"
            (clearFilters)="clearFilters()"
          />

          @if ((pagedResult()?.meta?.totalPages ?? 0) > 1) {
            <div class="mt-4">
              <app-pagination
                [meta]="pagedResult()!.meta"
                (pageChange)="patchFilters({ page: $event })"
              />
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class CatalogComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly cartService    = inject(CartService);
  private readonly toastService   = inject(ToastService);
  private readonly router         = inject(Router);
  private readonly route          = inject(ActivatedRoute);
  private readonly destroy$       = new Subject<void>();

  readonly filters      = signal<CatalogFilters>({ ...DEFAULT_CATALOG_FILTERS });
  readonly pagedResult  = signal<PagedResult<BookSummary> | null>(null);
  readonly categories   = signal<Category[]>([]);
  readonly loading      = signal(false);

  ngOnInit(): void {
    // Load categories
    this.catalogService.getCategories().subscribe(cats => this.categories.set(cats));

    // Sync URL query params → filters on init
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.filters.update(f => ({
        ...DEFAULT_CATALOG_FILTERS,
        ...f,
        ...(params['q']          && { query:      params['q']                   }),
        ...(params['categoryId'] && { categoryId: params['categoryId']           }),
        ...(params['page']       && { page:        +params['page']               }),
        ...(params['pageSize']   && { pageSize:    +params['pageSize']           }),
        ...(params['sortBy']     && { sortBy:      params['sortBy']              }),
        ...(params['priceMin']   && { priceMin:    +params['priceMin']           }),
        ...(params['priceMax']   && { priceMax:    +params['priceMax']           }),
        ...(params['rating']     && { rating:      +params['rating']             }),
      }));
      this.fetchBooks();
    });
  }

  patchFilters(patch: Partial<CatalogFilters>): void {
    this.filters.update(f => ({ ...f, ...patch, page: patch.page ?? 1 }));
    this.updateQueryParams();
    this.fetchBooks();
  }

  clearFilters(): void {
    this.filters.set({ ...DEFAULT_CATALOG_FILTERS });
    this.updateQueryParams();
    this.fetchBooks();
  }

  private fetchBooks(): void {
    this.loading.set(true);
    this.catalogService.getBooks(this.filters()).subscribe({
      next: result => {
        this.pagedResult.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.show('Failed to load books.', 'error');
      },
    });
  }

  private updateQueryParams(): void {
    const f = this.filters();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q:          f.query      || undefined,
        categoryId: f.categoryId || undefined,
        page:       f.page > 1   ? f.page : undefined,
        pageSize:   f.pageSize !== DEFAULT_CATALOG_FILTERS.pageSize ? f.pageSize : undefined,
        sortBy:     f.sortBy !== 'relevance' ? f.sortBy : undefined,
        priceMin:   f.priceMin,
        priceMax:   f.priceMax,
        rating:     f.rating,
        format:     f.format?.join(',') || undefined,
      },
      queryParamsHandling: 'merge',
    });
  }

  onAddToCart(book: BookSummary): void {
    this.cartService.addItem(book);
    this.toastService.show(`"${book.title}" added to cart`, 'success');
  }

  onWishlistToggle(event: { book: BookSummary; wishlisted: boolean }): void {
    const action = event.wishlisted ? 'added to' : 'removed from';
    this.toastService.show(`"${event.book.title}" ${action} wishlist`, 'info');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
