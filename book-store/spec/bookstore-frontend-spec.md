# eCommerce Bookstore — Frontend Specification

**Project**: book-store  
**Framework**: Angular 18 (Standalone Components, OnPush)  
**Version**: 1.0.0  
**Date**: 2026-07-07  
**Status**: SPECIFICATION — No code has been generated yet

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [User Stories & Functional Requirements](#user-stories--functional-requirements)
4. [UI Pages & Screen Map](#ui-pages--screen-map)
5. [Component Hierarchy](#component-hierarchy)
6. [Folder Structure](#folder-structure)
7. [Routing & Navigation](#routing--navigation)
8. [Data Models & Interfaces](#data-models--interfaces)
9. [Services](#services)
10. [State Management Strategy](#state-management-strategy)
11. [Shared UI Components](#shared-ui-components)
12. [Design Tokens & Theming](#design-tokens--theming)
13. [Content & i18n Strategy](#content--i18n-strategy)
14. [API Integration Points](#api-integration-points)
15. [Accessibility & Responsive Breakpoints](#accessibility--responsive-breakpoints)
16. [Task List](#task-list)
17. [Dependencies Graph](#dependencies-graph)

---

## Overview

A fully responsive, production-ready Angular 18 eCommerce bookstore application. Users can browse books by category, search, view book details, manage a shopping cart, complete checkout, and track orders. An admin panel allows inventory management.

### Core Features
| Feature              | Description                                                        |
|----------------------|--------------------------------------------------------------------|
| Public Catalog       | Browse, search, filter and sort books                              |
| Book Detail          | Rich product page with cover, description, reviews, related books  |
| Shopping Cart        | Add/remove items, update quantities, persistent across sessions     |
| Checkout             | Multi-step: address → shipping → payment → confirmation            |
| User Authentication  | Register, login, logout, password reset, profile management        |
| Order History        | List & detail view of past orders                                  |
| Wishlist             | Save books for later                                               |
| Admin Panel          | Manage books, categories, inventory, orders (role-gated route)     |

---

## Tech Stack

| Concern            | Technology                                                      |
|--------------------|-----------------------------------------------------------------|
| Framework          | Angular 20 (standalone components)                             |
| Language           | TypeScript 5.8 (strict mode)                                   |
| Styling            | Bootstrap 5 + Angular Material 18                              |
| Icons              | Angular Material Icons (`mat-icon`) + `@angular/material`      |
| Forms              | Angular Reactive Forms (strictly typed)                        |
| HTTP               | `HttpClient` with functional interceptors                      |
| State              | Signals + RxJS BehaviorSubject; NgRx for cart & auth           |
| Routing            | `provideRouter` with lazy-loaded feature routes                |
| Testing            | Jest + jest-preset-angular + Angular Testing Library           |
| Change Detection   | `ChangeDetectionStrategy.OnPush` on all components            |
| DI                 | `inject()` function (not constructor injection)                |
| Animations         | `@angular/animations`                                          |
| Image Optimization | `NgOptimizedImage` (`ngSrc`)                                   |
| Linting            | ESLint + `angular-eslint`                                      |
| Formatting         | Prettier                                                       |

---

## User Stories & Functional Requirements

### Shopper (unauthenticated / authenticated)
- **US-001** As a visitor I can browse books by category so I can discover new books.
- **US-002** As a visitor I can search books by title, author, or ISBN so I can find specific books.
- **US-003** As a visitor I can filter by genre, price range, rating, and format (eBook/print) so I can narrow results.
- **US-004** As a visitor I can sort results by relevance, price (asc/desc), rating, newest so I can control ordering.
- **US-005** As a visitor I can view a book's full detail page including cover, synopsis, author bio, reviews, and related books.
- **US-006** As a visitor I can add a book to the cart and see the cart icon update immediately.
- **US-007** As a visitor I can view and edit the cart (change quantity, remove items) before checkout.
- **US-008** As a visitor I must register or log in to complete checkout.
- **US-009** As an authenticated user I can complete checkout with a saved or new address and payment method.
- **US-010** As an authenticated user I can view my order history and individual order details.
- **US-011** As an authenticated user I can add books to a wishlist and move them to the cart.
- **US-012** As an authenticated user I can manage my profile (name, email, addresses, password).
- **US-013** As an admin I can manage books (CRUD) and categories from the admin panel.
- **US-014** As an admin I can manage inventory stock levels and receive low-stock alerts.
- **US-015** As an admin I can view and update order statuses.

---

## UI Pages & Screen Map

```
/                           → HomeComponent (featured books, hero banner, categories)
/catalog                    → CatalogComponent (book grid with filters + pagination)
/catalog/:id                → BookDetailComponent (rich detail + reviews)
/cart                       → CartComponent (cart line items, order summary)
/checkout                   → CheckoutShellComponent
  /checkout/address         → CheckoutAddressComponent
  /checkout/shipping        → CheckoutShippingComponent
  /checkout/payment         → CheckoutPaymentComponent
  /checkout/confirmation    → CheckoutConfirmationComponent
/auth/login                 → LoginComponent
/auth/register              → RegisterComponent
/auth/forgot-password       → ForgotPasswordComponent
/auth/reset-password        → ResetPasswordComponent
/account                    → AccountShellComponent (authenticated guard)
  /account/profile          → AccountProfileComponent
  /account/orders           → OrderListComponent
  /account/orders/:id       → OrderDetailComponent
  /account/wishlist         → WishlistComponent
  /account/addresses        → AddressBookComponent
/admin                      → AdminShellComponent (admin guard)
  /admin/books              → AdminBooksComponent
  /admin/books/new          → AdminBookFormComponent (create)
  /admin/books/:id/edit     → AdminBookFormComponent (edit)
  /admin/categories         → AdminCategoriesComponent
  /admin/orders             → AdminOrdersComponent
  /admin/inventory          → AdminInventoryComponent
/**                         → NotFoundComponent (404)
```

---

## Component Hierarchy

### Layout Shell
```
AppComponent
└── LayoutShellComponent
    ├── HeaderComponent
    │   ├── NavLogoComponent
    │   ├── SearchBarComponent
    │   ├── CartIconButtonComponent
    │   └── UserMenuComponent
    ├── <router-outlet>              ← feature pages render here
    └── FooterComponent
        ├── FooterLinksComponent
        └── FooterNewsletterComponent
```

### Home Feature
```
HomeComponent (smart)
├── HeroBannerComponent
├── FeaturedCategoriesComponent
│   └── CategoryCardComponent (presentational, n×)
├── FeaturedBooksComponent
│   └── BookCardComponent (presentational, n×)
├── PromosBannerComponent
└── NewArrivalsComponent
    └── BookCardComponent (shared, n×)
```

### Catalog Feature
```
CatalogComponent (smart)
├── CatalogFiltersComponent
│   ├── FilterCategoryComponent
│   ├── FilterPriceRangeComponent
│   ├── FilterRatingComponent
│   └── FilterFormatComponent
├── CatalogToolbarComponent (sort + result count)
├── BookGridComponent
│   └── BookCardComponent (shared, n×)
├── EmptyStateComponent (shared)
└── PaginationComponent (shared)
```

### Book Detail Feature
```
BookDetailComponent (smart)
├── BookCoverGalleryComponent
├── BookInfoComponent
│   ├── BookMetaComponent (author, publisher, ISBN, pages)
│   └── AddToCartButtonComponent
├── BookDescriptionComponent
├── BookReviewsComponent
│   ├── ReviewStarsSummaryComponent
│   ├── ReviewFormComponent
│   └── ReviewListComponent
│       └── ReviewItemComponent (n×)
└── RelatedBooksComponent
    └── BookCardComponent (shared, n×)
```

### Cart Feature
```
CartComponent (smart)
├── CartLineItemComponent (n×)
│   └── QuantityStepperComponent (shared)
├── CartEmptyStateComponent
├── OrderSummaryComponent
└── PromoCodeComponent
```

### Checkout Feature
```
CheckoutShellComponent (smart, guards)
├── CheckoutStepperComponent
├── <router-outlet>
│   ├── CheckoutAddressComponent
│   ├── CheckoutShippingComponent
│   ├── CheckoutPaymentComponent
│   └── CheckoutConfirmationComponent
└── CheckoutOrderSummaryComponent (sidebar)
```

### Auth Feature
```
LoginComponent (smart)
RegisterComponent (smart)
ForgotPasswordComponent (smart)
ResetPasswordComponent (smart)
```

### Account Feature
```
AccountShellComponent (smart, auth guard)
├── AccountSidebarComponent
└── <router-outlet>
    ├── AccountProfileComponent
    ├── OrderListComponent
    │   └── OrderRowComponent (n×)
    ├── OrderDetailComponent
    │   └── OrderLineItemComponent (n×)
    ├── WishlistComponent
    │   └── BookCardComponent (shared, n×)
    └── AddressBookComponent
        └── AddressCardComponent (n×)
```

### Admin Feature
```
AdminShellComponent (smart, admin guard)
├── AdminSidebarComponent
└── <router-outlet>
    ├── AdminBooksComponent
    │   └── AdminBookRowComponent (n×)
    ├── AdminBookFormComponent
    ├── AdminCategoriesComponent
    ├── AdminOrdersComponent
    │   └── AdminOrderRowComponent (n×)
    └── AdminInventoryComponent
```

### Shared Components (used across features)
- `BookCardComponent` — book thumbnail, title, author, price, rating stars, wishlist toggle, add-to-cart CTA
- `PaginationComponent` — page controls
- `EmptyStateComponent` — generic empty/no-results state
- `QuantityStepperComponent` — numeric + / − stepper
- `StarRatingComponent` — display-only or interactive rating stars
- `LoadingSkeletonComponent` — skeleton placeholder
- `ToastNotificationComponent` — ephemeral toast/snackbar
- `BreadcrumbComponent` — contextual breadcrumb trail
- `ConfirmDialogComponent` — reusable confirmation modal (CDK)
- `PriceDisplayComponent` — formats currency with optional strikethrough
- `BadgeComponent` — status / genre / format badge

---

## Folder Structure

```
book-store/src/app/
├── app.component.ts
├── app.component.html
├── app.component.scss
├── app.config.ts
├── app.routes.ts
│
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   ├── services/
│   │   ├── content.service.ts
│   │   └── error-handler.service.ts
│   └── content/
│       └── content.model.ts
│
├── shared/
│   ├── models/
│   │   ├── book.model.ts
│   │   ├── category.model.ts
│   │   ├── cart.model.ts
│   │   ├── order.model.ts
│   │   ├── user.model.ts
│   │   ├── review.model.ts
│   │   ├── address.model.ts
│   │   ├── pagination.model.ts
│   │   └── api-response.model.ts
│   ├── ui/
│   │   ├── book-card/
│   │   │   ├── book-card.component.ts
│   │   │   ├── book-card.component.html
│   │   │   └── book-card.component.scss
│   │   ├── pagination/
│   │   ├── empty-state/
│   │   ├── quantity-stepper/
│   │   ├── star-rating/
│   │   ├── loading-skeleton/
│   │   ├── toast-notification/
│   │   ├── breadcrumb/
│   │   ├── confirm-dialog/
│   │   ├── price-display/
│   │   └── badge/
│   ├── utils/
│   │   ├── class.util.ts        (helper for conditional class binding)
│   │   ├── currency.pipe.ts
│   │   ├── truncate.pipe.ts
│   │   └── format-date.util.ts
│   └── auth/
│       ├── auth.service.ts
│       └── auth.model.ts
│
├── layout/
│   ├── layout-shell/
│   │   ├── layout-shell.component.ts
│   │   ├── layout-shell.component.html
│   │   └── layout-shell.component.scss
│   ├── header/
│   │   ├── header.component.ts
│   │   ├── header.component.html
│   │   └── header.component.scss
│   ├── footer/
│   │   ├── footer.component.ts
│   │   ├── footer.component.html
│   │   └── footer.component.scss
│   └── nav-logo/
│       ├── nav-logo.component.ts
│       └── nav-logo.component.html
│
├── features/
│   ├── home/
│   │   ├── home.routes.ts
│   │   ├── components/
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   └── home.component.scss
│   │   │   ├── hero-banner/
│   │   │   ├── featured-categories/
│   │   │   ├── category-card/
│   │   │   ├── featured-books/
│   │   │   ├── promos-banner/
│   │   │   └── new-arrivals/
│   │   ├── services/
│   │   │   └── home.service.ts
│   │   └── models/
│   │       └── home.model.ts
│   │
│   ├── catalog/
│   │   ├── catalog.routes.ts
│   │   ├── components/
│   │   │   ├── catalog/
│   │   │   ├── catalog-filters/
│   │   │   ├── filter-category/
│   │   │   ├── filter-price-range/
│   │   │   ├── filter-rating/
│   │   │   ├── filter-format/
│   │   │   ├── catalog-toolbar/
│   │   │   └── book-grid/
│   │   ├── services/
│   │   │   └── catalog.service.ts
│   │   └── models/
│   │       └── catalog-filter.model.ts
│   │
│   ├── book-detail/
│   │   ├── book-detail.routes.ts
│   │   ├── components/
│   │   │   ├── book-detail/
│   │   │   ├── book-cover-gallery/
│   │   │   ├── book-info/
│   │   │   ├── book-meta/
│   │   │   ├── add-to-cart-button/
│   │   │   ├── book-description/
│   │   │   ├── book-reviews/
│   │   │   ├── review-stars-summary/
│   │   │   ├── review-form/
│   │   │   ├── review-list/
│   │   │   ├── review-item/
│   │   │   └── related-books/
│   │   ├── services/
│   │   │   └── book-detail.service.ts
│   │   └── models/
│   │       └── book-detail.model.ts
│   │
│   ├── cart/
│   │   ├── cart.routes.ts
│   │   ├── components/
│   │   │   ├── cart/
│   │   │   ├── cart-line-item/
│   │   │   ├── cart-empty-state/
│   │   │   ├── order-summary/
│   │   │   └── promo-code/
│   │   ├── services/
│   │   │   └── cart.service.ts
│   │   └── models/
│   │       └── cart.model.ts
│   │
│   ├── checkout/
│   │   ├── checkout.routes.ts
│   │   ├── components/
│   │   │   ├── checkout-shell/
│   │   │   ├── checkout-stepper/
│   │   │   ├── checkout-address/
│   │   │   ├── checkout-shipping/
│   │   │   ├── checkout-payment/
│   │   │   ├── checkout-confirmation/
│   │   │   └── checkout-order-summary/
│   │   ├── services/
│   │   │   └── checkout.service.ts
│   │   └── models/
│   │       └── checkout.model.ts
│   │
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── components/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   └── services/
│   │       └── auth-feature.service.ts
│   │
│   ├── account/
│   │   ├── account.routes.ts
│   │   ├── components/
│   │   │   ├── account-shell/
│   │   │   ├── account-sidebar/
│   │   │   ├── account-profile/
│   │   │   ├── order-list/
│   │   │   ├── order-row/
│   │   │   ├── order-detail/
│   │   │   ├── order-line-item/
│   │   │   ├── wishlist/
│   │   │   ├── address-book/
│   │   │   └── address-card/
│   │   ├── services/
│   │   │   └── account.service.ts
│   │   └── models/
│   │       └── account.model.ts
│   │
│   └── admin/
│       ├── admin.routes.ts
│       ├── components/
│       │   ├── admin-shell/
│       │   ├── admin-sidebar/
│       │   ├── admin-books/
│       │   ├── admin-book-row/
│       │   ├── admin-book-form/
│       │   ├── admin-categories/
│       │   ├── admin-orders/
│       │   ├── admin-order-row/
│       │   └── admin-inventory/
│       ├── services/
│       │   └── admin.service.ts
│       └── models/
│           └── admin.model.ts
│
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

Also under `src/assets/`:
```
assets/
├── i18n/
│   └── en.json
└── images/
    └── placeholder-book.png
```

---

## Routing & Navigation

```typescript
// app.routes.ts — top-level lazy routes
[
  { path: '',          loadComponent: () => LayoutShellComponent,  children: [
    { path: '',          loadComponent: () => HomeComponent },
    { path: 'catalog',   loadChildren: () => catalogRoutes },
    { path: 'cart',      loadComponent: () => CartComponent },
    { path: 'checkout',  loadChildren: () => checkoutRoutes,  canActivate: [authGuard] },
    { path: 'auth',      loadChildren: () => authRoutes },
    { path: 'account',   loadChildren: () => accountRoutes,   canActivate: [authGuard] },
    { path: 'admin',     loadChildren: () => adminRoutes,     canActivate: [adminGuard] },
    { path: '**',        loadComponent: () => NotFoundComponent },
  ]},
]
```

### Guards
| Guard       | Logic                                                          |
|-------------|----------------------------------------------------------------|
| `authGuard` | Checks `AuthService.isAuthenticated()` signal; redirects `/auth/login` |
| `adminGuard`| Checks `AuthService.userRole()` === `'admin'`; redirects `/`  |

### Route Parameter Binding
- Use `withComponentInputBindings()` to bind `:id` to signal `input()` in `BookDetailComponent` and `OrderDetailComponent`.

---

## Data Models & Interfaces

### `book.model.ts`
```
BookSummary          id, title, author, coverUrl, price, discountPrice?,
                     rating, reviewCount, categoryId, format, isNew, isBestseller

BookDetail           extends BookSummary + description, publisher, isbn,
                     publishedDate, pageCount, language, tags[], relatedBookIds[]

BookFormat           'paperback' | 'hardcover' | 'ebook' | 'audiobook'
```

### `category.model.ts`
```
Category             id, name, slug, iconName, bookCount
```

### `cart.model.ts`
```
CartItem             bookId, title, coverUrl, price, quantity, format
Cart                 items: CartItem[], subtotal, discount, tax, total
PromoCode            code, discountPercent, isValid
```

### `order.model.ts`
```
OrderStatus          'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
OrderItem            bookId, title, coverUrl, price, quantity, format
Order                id, userId, items: OrderItem[], shippingAddress: Address,
                     shippingMethod, paymentSummary, subtotal, discount, tax, total,
                     status: OrderStatus, placedAt, updatedAt
```

### `user.model.ts`
```
UserRole             'shopper' | 'admin'
User                 id, email, firstName, lastName, role: UserRole,
                     avatarUrl?, createdAt
```

### `address.model.ts`
```
Address              id, label, fullName, street1, street2?, city, state,
                     zipCode, country, isDefault
```

### `review.model.ts`
```
Review               id, bookId, userId, userName, rating, title, body,
                     createdAt, verifiedPurchase
ReviewSummary        averageRating, totalReviews, ratingDistribution: Record<1|2|3|4|5, number>
```

### `pagination.model.ts`
```
PaginationMeta       page, pageSize, totalItems, totalPages
PagedResult<T>       data: T[], meta: PaginationMeta
```

### `api-response.model.ts`
```
ApiResponse<T>       data: T, message?: string
ApiError             statusCode, message, errors?: Record<string, string[]>
```

### `catalog-filter.model.ts`
```
CatalogFilters       categoryId?, priceMin?, priceMax?, rating?, format?: BookFormat[],
                     sortBy?: 'relevance'|'price_asc'|'price_desc'|'rating'|'newest',
                     page: number, pageSize: number
```

### `checkout.model.ts`
```
ShippingMethod       id, name, description, price, estimatedDays
CheckoutState        address: Address | null, shippingMethod: ShippingMethod | null,
                     paymentToken: string | null, step: 1|2|3|4
```

---

## Services

### `shared/auth/auth.service.ts`
```
currentUser():  Signal<User | null>
isAuthenticated(): Signal<boolean>
userRole(): Signal<UserRole | null>
login(email, password): Observable<User>
register(dto): Observable<User>
logout(): void
refreshToken(): Observable<void>
forgotPassword(email): Observable<void>
resetPassword(token, newPassword): Observable<void>
```

### `features/cart/services/cart.service.ts`
```
cart(): Signal<Cart>
itemCount(): Signal<number>
addItem(book: BookSummary, quantity, format): void
removeItem(bookId, format): void
updateQuantity(bookId, format, quantity): void
applyPromoCode(code): Observable<PromoCode>
clearCart(): void
```
> Cart state persists to `sessionStorage` on change. Uses `BehaviorSubject<Cart>` internally exposed as a signal via `toSignal()`.

### `features/catalog/services/catalog.service.ts`
```
getBooks(filters: CatalogFilters): Observable<PagedResult<BookSummary>>
getCategories(): Observable<Category[]>
```

### `features/book-detail/services/book-detail.service.ts`
```
getBook(id: string): Observable<BookDetail>
getReviews(bookId, page, pageSize): Observable<PagedResult<Review>>
submitReview(bookId, dto): Observable<Review>
getRelatedBooks(bookId): Observable<BookSummary[]>
```

### `features/home/services/home.service.ts`
```
getFeaturedBooks(): Observable<BookSummary[]>
getCategories(): Observable<Category[]>
getNewArrivals(): Observable<BookSummary[]>
getPromos(): Observable<PromoInfo[]>
```

### `features/checkout/services/checkout.service.ts`
```
checkoutState(): Signal<CheckoutState>
setAddress(address: Address): void
setShippingMethod(method: ShippingMethod): void
setPaymentToken(token: string): void
getShippingMethods(): Observable<ShippingMethod[]>
placeOrder(): Observable<Order>
resetCheckout(): void
```

### `features/account/services/account.service.ts`
```
getProfile(): Observable<User>
updateProfile(dto): Observable<User>
getOrders(page, pageSize): Observable<PagedResult<Order>>
getOrderDetail(orderId): Observable<Order>
getWishlist(): Observable<BookSummary[]>
addToWishlist(bookId): Observable<void>
removeFromWishlist(bookId): Observable<void>
getAddresses(): Observable<Address[]>
addAddress(address): Observable<Address>
updateAddress(id, address): Observable<Address>
deleteAddress(id): Observable<void>
setDefaultAddress(id): Observable<void>
changePassword(currentPw, newPw): Observable<void>
```

### `features/admin/services/admin.service.ts`
```
getBooks(filters): Observable<PagedResult<BookDetail>>
createBook(dto): Observable<BookDetail>
updateBook(id, dto): Observable<BookDetail>
deleteBook(id): Observable<void>
getCategories(): Observable<Category[]>
createCategory(dto): Observable<Category>
updateCategory(id, dto): Observable<Category>
deleteCategory(id): Observable<void>
getOrders(filters): Observable<PagedResult<Order>>
updateOrderStatus(orderId, status): Observable<Order>
getInventory(): Observable<InventoryItem[]>
updateInventoryStock(bookId, stock): Observable<void>
```

### `core/services/content.service.ts`
```
get(section: keyof AppContent): Observable<SectionContent>
getKey(section, key): string
```

---

## State Management Strategy

| State                    | Strategy                                     | Location                  |
|--------------------------|----------------------------------------------|---------------------------|
| Cart items               | `BehaviorSubject<Cart>` + `toSignal()`       | `CartService`             |
| Auth (current user)      | `signal<User \| null>` in `AuthService`      | `shared/auth/`            |
| Checkout wizard state    | `signal<CheckoutState>` in `CheckoutService` | `checkout/services/`      |
| Catalog filters / sort   | `signal<CatalogFilters>` in component        | `CatalogComponent`        |
| UI loading states        | `signal<boolean>` per component              | Local to component        |
| Toast queue              | `BehaviorSubject<Toast[]>` in `ToastService` | `shared/ui/`              |
| Admin table sorting/page | `signal<TableState>` in component            | Local to admin components |

> NgRx is **not** needed for this application scope. Signals + services are sufficient. Use NgRx only if requirements expand to cross-feature synchronization with complex effect chains.

---

## Shared UI Components

Each component lives in `src/app/shared/ui/<component-name>/`.

| Component                | Inputs                                        | Outputs               | Notes                                     |
|--------------------------|-----------------------------------------------|-----------------------|-------------------------------------------|
| `BookCardComponent`      | `book: BookSummary`, `showWishlist?: boolean` | `addToCart`, `wishlistToggle` | Used in home, catalog, related, wishlist  |
| `PaginationComponent`    | `meta: PaginationMeta`                        | `pageChange: number`  | Keyboard navigable                        |
| `EmptyStateComponent`    | `icon: string`, `title`, `description`, `ctaLabel?` | `ctaClick`       | Shared no-results / empty-cart states     |
| `QuantityStepperComponent` | `value: number`, `min?: number`, `max?: number` | `valueChange: number` | +/− with validation                    |
| `StarRatingComponent`    | `value: number`, `interactive?: boolean`, `size?: 'sm'\|'md'\|'lg'` | `ratingChange?: number` | Filled/half/empty SVG stars       |
| `LoadingSkeletonComponent` | `rows?: number`, `type?: 'card'\|'list'\|'text'` | —             | Animated shimmer skeleton                 |
| `ToastNotificationComponent` | `message`, `type: 'success'\|'error'\|'info'\|'warning'`, `duration?` | `dismissed` | Positioned fixed top-right         |
| `BreadcrumbComponent`    | `crumbs: {label,route}[]`                     | —                     | Aria breadcrumb landmark                  |
| `ConfirmDialogComponent` | `title`, `message`, `confirmLabel?`, `destructive?` | `confirmed`, `cancelled` | Angular CDK overlay              |
| `PriceDisplayComponent`  | `price: number`, `discountPrice?: number`, `currency?: string` | —       | Strikethrough on discount                 |
| `BadgeComponent`         | `label: string`, `variant: 'genre'\|'format'\|'status'\|'new'\|'sale'` | — | Token-mapped colors                 |

---

## Design Tokens & Theming

Define all tokens once in `src/styles.scss` under `:root`. Angular Material theming is configured via `@use '@angular/material' as mat` and a custom Material palette.

### Color Tokens

```scss
:root {
  /* Brand */
  --brand-primary:        #1a3c5e;   /* deep navy */
  --brand-primary-hover:  #14304e;
  --brand-accent:         #d97706;   /* amber — CTAs, highlights */
  --brand-accent-hover:   #b45309;

  /* Surface */
  --surface-page:         #f8f7f4;   /* warm off-white page bg */
  --surface-card:         #ffffff;
  --surface-muted:        #f1ede6;   /* category chip bg */

  /* Text */
  --text-heading:         #1a1a1a;
  --text-body:            #374151;
  --text-muted:           #6b7280;
  --text-inverse:         #ffffff;

  /* Status */
  --status-success-bg:    #d1fae5;
  --status-success-text:  #065f46;
  --status-warning-bg:    #fef3c7;
  --status-warning-text:  #92400e;
  --status-error-bg:      #fee2e2;
  --status-error-text:    #991b1b;
  --status-info-bg:       #dbeafe;
  --status-info-text:     #1e40af;

  /* Borders */
  --border-default:       #e5e7eb;
  --border-focus:         #1a3c5e;

  /* Bootstrap overrides */
  --bs-body-bg:    var(--surface-page);
  --bs-body-color: var(--text-body);
  --bs-border-color: var(--border-default);
  --bs-primary:    var(--brand-primary);
  --bs-link-color: var(--brand-primary);
}
```

### Typography

| Role          | Font              | Weight  | Size (default) |
|---------------|-------------------|---------|----------------|
| Display/Hero  | Playfair Display  | 700     | 3rem–4rem      |
| Section Heading | Playfair Display | 600   | 1.75rem–2rem   |
| Body text     | Lato              | 400     | 1rem           |
| UI / labels   | Lato              | 500/600 | 0.875rem       |
| Price         | Lato              | 700     | inherit        |

> Load both fonts via Google Fonts in `index.html`. Define `font-family` tokens in `:root` and reference them via Bootstrap's `$font-family-base` SCSS variable override.

---

## Content & i18n Strategy

All user-facing strings live in `src/assets/i18n/en.json`, structured by feature section. No hardcoded text in templates.

```jsonc
{
  "common": {
    "addToCart": "Add to Cart",
    "viewDetails": "View Details",
    "loading": "Loading...",
    "noResults": "No results found",
    "errorGeneric": "Something went wrong. Please try again.",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit"
  },
  "header": {
    "searchPlaceholder": "Search by title, author, ISBN…",
    "cartAriaLabel": "Shopping cart, {{count}} items",
    "myAccount": "My Account",
    "logout": "Sign Out"
  },
  "home": {
    "heroHeading": "Discover Your Next Great Read",
    "heroSubheading": "Thousands of books across every genre, delivered to your door.",
    "shopNow": "Shop Now",
    "featuredCategories": "Browse by Category",
    "featuredBooks": "Staff Picks",
    "newArrivals": "New Arrivals"
  },
  "catalog": {
    "heading": "All Books",
    "filters": "Filters",
    "sortBy": "Sort by",
    "resultsCount": "{{count}} books found",
    "noBooks": "No books match your filters.",
    "clearFilters": "Clear Filters"
  },
  "bookDetail": {
    "addToCart": "Add to Cart",
    "addToWishlist": "Add to Wishlist",
    "outOfStock": "Out of Stock",
    "reviews": "Customer Reviews",
    "writeReview": "Write a Review",
    "relatedBooks": "You May Also Like"
  },
  "cart": {
    "heading": "Your Cart",
    "empty": "Your cart is empty",
    "startShopping": "Start Shopping",
    "orderSummary": "Order Summary",
    "subtotal": "Subtotal",
    "discount": "Discount",
    "tax": "Tax",
    "total": "Total",
    "promoCode": "Promo Code",
    "applyPromo": "Apply",
    "proceedToCheckout": "Proceed to Checkout"
  },
  "checkout": {
    "steps": {
      "address": "Shipping Address",
      "shipping": "Shipping Method",
      "payment": "Payment",
      "confirmation": "Order Confirmed"
    },
    "placeOrder": "Place Order",
    "orderConfirmed": "Order Confirmed!",
    "confirmationMessage": "Your order #{{orderId}} has been placed."
  },
  "auth": {
    "login": "Sign In",
    "register": "Create Account",
    "forgotPassword": "Forgot Password?",
    "resetPassword": "Reset Password",
    "emailLabel": "Email Address",
    "passwordLabel": "Password",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?"
  },
  "account": {
    "profile": "Profile",
    "orders": "Order History",
    "wishlist": "Wishlist",
    "addresses": "Saved Addresses",
    "changePassword": "Change Password"
  },
  "admin": {
    "dashboard": "Admin Dashboard",
    "books": "Manage Books",
    "categories": "Manage Categories",
    "orders": "Manage Orders",
    "inventory": "Inventory"
  }
}
```

---

## API Integration Points

All HTTP calls are made exclusively inside services. Components never call `HttpClient` directly.

> **Note on Date Fields**: Any service method that accepts or returns a date field (e.g., `placedAt`, `publishedDate`, `updatedAt`) for API request payloads must format dates as `yyyy-MM-dd`. Use the `formatDateForApi` utility from `@shared/utils` in the request mapper before sending to the API.

### Base URL
Defined in `environment.ts`:
```typescript
export const environment = {
  apiBaseUrl: 'http://localhost:3000/api/v1',
  production: false,
};
```

### Endpoint Map

| Service Method                   | HTTP            | Path                                    |
|----------------------------------|-----------------|-----------------------------------------|
| `catalogService.getBooks()`      | GET             | `/books?page=&pageSize=&...filters`     |
| `catalogService.getCategories()` | GET             | `/categories`                           |
| `bookDetailService.getBook(id)`  | GET             | `/books/:id`                            |
| `bookDetailService.getReviews()` | GET             | `/books/:id/reviews?page=&pageSize=`    |
| `bookDetailService.submitReview()`| POST           | `/books/:id/reviews`                    |
| `authService.login()`            | POST            | `/auth/login`                           |
| `authService.register()`         | POST            | `/auth/register`                        |
| `authService.logout()`           | POST            | `/auth/logout`                          |
| `authService.forgotPassword()`   | POST            | `/auth/forgot-password`                 |
| `authService.resetPassword()`    | POST            | `/auth/reset-password`                  |
| `cartService.applyPromoCode()`   | POST            | `/promo-codes/validate`                 |
| `checkoutService.getShippingMethods()` | GET      | `/shipping-methods`                     |
| `checkoutService.placeOrder()`   | POST            | `/orders`                               |
| `accountService.getProfile()`    | GET             | `/account/profile`                      |
| `accountService.updateProfile()` | PATCH           | `/account/profile`                      |
| `accountService.getOrders()`     | GET             | `/account/orders?page=&pageSize=`       |
| `accountService.getOrderDetail()`| GET             | `/account/orders/:id`                   |
| `accountService.getWishlist()`   | GET             | `/account/wishlist`                     |
| `accountService.addToWishlist()` | POST            | `/account/wishlist/:bookId`             |
| `accountService.removeFromWishlist()` | DELETE     | `/account/wishlist/:bookId`             |
| `accountService.getAddresses()`  | GET             | `/account/addresses`                    |
| `accountService.addAddress()`    | POST            | `/account/addresses`                    |
| `accountService.updateAddress()` | PATCH           | `/account/addresses/:id`                |
| `accountService.deleteAddress()` | DELETE          | `/account/addresses/:id`                |
| `accountService.changePassword()`| POST            | `/account/change-password`              |
| `adminService.getBooks()`        | GET             | `/admin/books?...`                      |
| `adminService.createBook()`      | POST            | `/admin/books`                          |
| `adminService.updateBook()`      | PATCH           | `/admin/books/:id`                      |
| `adminService.deleteBook()`      | DELETE          | `/admin/books/:id`                      |
| `adminService.getOrders()`       | GET             | `/admin/orders?...`                     |
| `adminService.updateOrderStatus()` | PATCH         | `/admin/orders/:id/status`              |
| `adminService.getInventory()`    | GET             | `/admin/inventory`                      |
| `adminService.updateInventoryStock()` | PATCH      | `/admin/inventory/:bookId`              |

### Interceptors
| Interceptor         | Behavior                                                              |
|---------------------|-----------------------------------------------------------------------|
| `authInterceptor`   | Attaches `Authorization: Bearer <token>` from `AuthService` to every request |
| `errorInterceptor`  | `401` → clear auth + redirect `/auth/login`; `403` → navigate `/`; `500` → emit toast |

---

## Accessibility & Responsive Breakpoints

### Responsive Targets
| Breakpoint | Width     | Notes                                      |
|------------|-----------|--------------------------------------------|
| Mobile     | 320–767px | Single-column, drawer nav, stacked checkout|
| Tablet     | 768–1023px| 2-col catalog, mini sidebar                |
| Desktop    | 1024px+   | Full sidebar/nav, 3–4-col book grid        |

### Key Responsive Behaviors
- **Header**: full nav on `lg+`; hamburger menu + slide-in drawer on `< lg`
- **Book grid**: `grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- **Catalog filters**: collapsible drawer on mobile, sticky sidebar on desktop
- **Checkout**: single-column on mobile, 2-col (form + summary) on `lg+`
- **Tables** (admin): `overflow-x-auto` wrapper
- **Touch targets**: minimum 44×44px for all interactive elements
- Test at 320px, 768px, 1024px, 1440px

### Accessibility Requirements
- All interactive elements keyboard accessible (Tab, Enter, Space, Escape, Arrow keys)
- ARIA landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>` for filters
- `aria-label` on icon-only buttons (cart icon, wishlist icon, quantity steppers)
- `aria-live="polite"` on cart count, search result count updates
- `role="dialog"` + `aria-labelledby` on confirm dialogs; `FocusTrap` via Angular CDK
- WCAG AA color contrast on all text/background pairs
- `alt` text on all book cover images via `NgOptimizedImage`
- Pagination: `aria-label="Pagination"` + `aria-current="page"` on active page

---

## Task List

> All tasks are **Status: PENDING** — no files have been created.  
> Execution order follows the dependency graph: infrastructure → models → services → shared UI → layout → features.

---

### FE-TASK-001 — Project Infrastructure Setup
**Status**: COMPLETED
**Dependencies**: None  
**Priority**: Critical  

**Scope**: Configure the Angular 18 project with all required dependencies and tooling.

**Acceptance Criteria**:
- Install Bootstrap 5 (`bootstrap`) and configure in `angular.json` styles/scripts
- Install Angular Material 18 (`@angular/material`) + Angular CDK (`@angular/cdk`) + `@angular/animations`
- Install `jest`, `jest-preset-angular`, `@testing-library/angular` and remove Karma/Jasmine
- Configure `jest.config.ts` and update `tsconfig.spec.json`
- Install `prettier` and `eslint` with `angular-eslint`; add `.prettierrc` and `.eslintrc.json`
- Add Google Fonts (Playfair Display + Lato) to `index.html`
- Update `app.config.ts` to add `provideAnimationsAsync()`, `provideHttpClient(withInterceptors([...]))`, `provideRouter(routes, withComponentInputBinding())`
- Add `tsconfig.json` path aliases for `@shared/*`, `@core/*`, `@features/*`, `@layout/*`, `@env/*`
- `ng build` completes without errors

---

### FE-TASK-002 — Design Tokens & Global Styles
**Status**: COMPLETED
**Dependencies**: FE-TASK-001  
**Priority**: Critical  

**Scope**: Establish the complete design system in `src/styles.scss`.

**Acceptance Criteria**:
- All CSS custom properties defined in `:root` as specified in [Design Tokens & Theming](#design-tokens--theming)
- Angular Material custom theme configured via `mat.define-theme()` with brand palette in `styles.scss`
- Bootstrap CSS variables overridden to match brand tokens
- Dark mode support stubbed (`.dark` class toggle)
- Global base styles: body font set to Lato; heading font set to Playfair Display
- `classUtil` helper (`class.util.ts`) for conditional `[ngClass]` object construction
- `CurrencyPipe` (custom, wraps `Intl.NumberFormat`) at `shared/utils/currency.pipe.ts`
- `TruncatePipe` at `shared/utils/truncate.pipe.ts`
- `formatDateForApi` helper at `shared/utils/format-date.util.ts` — formats `Date` to `yyyy-MM-dd` string
- All token colors verified against WCAG AA contrast

---

### FE-TASK-003 — Shared Data Models
**Status**: COMPLETED
**Dependencies**: FE-TASK-001  
**Priority**: Critical  

**Scope**: Define all TypeScript interfaces in `src/app/shared/models/`.

**Acceptance Criteria**:
- All model files created as specified in [Data Models & Interfaces](#data-models--interfaces)
- No `any` types — every field explicitly typed
- Enums/union types for `BookFormat`, `OrderStatus`, `UserRole`
- `ApiResponse<T>` and `ApiError` generics defined
- `PaginationMeta` and `PagedResult<T>` generic defined
- All models exported from a barrel `shared/models/index.ts`

---

### FE-TASK-004 — Authentication Service & Guards
**Status**: COMPLETED
**Dependencies**: FE-TASK-003  
**Priority**: Critical  

**Scope**: Implement `AuthService`, `authGuard`, and `adminGuard`.

**Acceptance Criteria**:
- `AuthService` at `shared/auth/auth.service.ts` with all methods defined in [Services](#services)
- Auth state stored as `signal<User | null>` — `isAuthenticated()` and `userRole()` derived as `computed()`
- JWT token stored in memory (not localStorage); refresh via `/auth/refresh` on 401
- `authGuard` and `adminGuard` functional guards redirect to `/auth/login` and `/` respectively
- Mock data: one `shopper` user, one `admin` user in `auth.service.mock.ts`
- Unit tests: login success, login failure, guard redirect, guard pass

---

### FE-TASK-005 — HTTP Interceptors
**Status**: COMPLETED
**Dependencies**: FE-TASK-004  
**Priority**: Critical  

**Scope**: Implement `authInterceptor` and `errorInterceptor`.

**Acceptance Criteria**:
- `authInterceptor` reads JWT from `AuthService` and attaches `Authorization` header
- `errorInterceptor` handles 401 (clear auth + redirect), 403 (navigate home), 500 (emit toast)
- Both interceptors are functional (not class-based)
- Registered in `app.config.ts` via `withInterceptors([...])`
- Unit tests for both interceptors cover success and error scenarios

---

### FE-TASK-006 — Shared UI Component Library
**Status**: COMPLETED
**Dependencies**: FE-TASK-002  
**Priority**: High  

**Scope**: Build all reusable components in `src/app/shared/ui/` as specified in [Shared UI Components](#shared-ui-components).

**Acceptance Criteria**:
- All 11 shared components created with `OnPush`, standalone, strictly typed signal `input()`/`output()`
- `BookCardComponent`: cover image (`NgOptimizedImage`), title, author, price (with discount), star rating, wishlist heart icon (toggle), "Add to Cart" button; `@Output` for `addToCart` and `wishlistToggle`
- `StarRatingComponent`: renders 5 stars (filled / half / empty); supports `interactive` mode emitting `ratingChange`
- `PaginationComponent`: prev/next + numbered pages; keyboard navigable; `aria-label` on nav
- `QuantityStepperComponent`: +/− buttons with `min`/`max` bounds; emits `valueChange`
- `LoadingSkeletonComponent`: animated shimmer (CSS `@keyframes`); supports `card` and `list` layouts
- `ConfirmDialogComponent`: uses Angular CDK `Overlay`; traps focus; closes on Escape
- `ToastNotificationComponent`: fixed position, auto-dismiss, queued via `ToastService`
- `EmptyStateComponent`, `BreadcrumbComponent`, `PriceDisplayComponent`, `BadgeComponent` completed
- All components have a `*.spec.ts` with ≥ 3 tests each

---

### FE-TASK-007 — App Layout Shell (Header + Footer)
**Status**: COMPLETED
**Dependencies**: FE-TASK-006, FE-TASK-004  
**Priority**: High  

**Scope**: Implement `LayoutShellComponent`, `HeaderComponent`, and `FooterComponent`.

**Acceptance Criteria**:
- `LayoutShellComponent` wraps all pages with header + `<router-outlet>` + footer
- **Header** (sticky, `z-50`): logo left, search bar center, cart icon + count badge + user menu right
- Cart count badge uses `CartService.itemCount()` signal — updates without page refresh
- `SearchBarComponent` emits `search` event; navigates to `/catalog?q=<query>` on submit; keyboard accessible (Enter)
- `UserMenuComponent`: if authenticated, shows avatar + dropdown (My Account, Orders, Sign Out); if not, shows Sign In / Register links
- Hamburger menu on `< lg`; slide-in drawer overlay on mobile with full nav links
- **Footer**: logo, 4 link columns (Company, Help, Categories, Social), newsletter email signup (non-functional form UI), copyright
- Layout respects all responsive breakpoints; no horizontal overflow at 320px
- `ContentService` provides all text content — no hardcoded strings in templates

---

### FE-TASK-008 — Home Feature
**Status**: PENDING  
**Dependencies**: FE-TASK-007  
**Priority**: High  

**Scope**: Implement the home page (`/`) with all sub-components.

**Acceptance Criteria**:
- `HeroBannerComponent`: full-width (desktop), responsive hero with headline, subheading, CTA button routing to `/catalog`; background is a subtle warm gradient with decorative book imagery (CSS or SVG — no external image)
- `FeaturedCategoriesComponent`: horizontal scroll on mobile, 4-column grid on desktop; each `CategoryCardComponent` shows a `<mat-icon>`, category name, book count; navigates to `/catalog?categoryId=<id>`
- `FeaturedBooksComponent`: 4-column grid desktop / 2-col mobile; uses `BookCardComponent`; add-to-cart triggers `CartService.addItem()`
- `PromosBannerComponent`: highlighted banner for current promotions (mock data)
- `NewArrivalsComponent`: horizontally scrollable row of `BookCardComponent` cards
- All sections use `@defer` with `@loading` skeleton fallback
- `HomeService` provides all data with mock responses in `home.service.mock.ts`
- Loading and empty states handled for each section

---

### FE-TASK-009 — Catalog Feature (Browse & Filter)
**Status**: PENDING  
**Dependencies**: FE-TASK-007, FE-TASK-003  
**Priority**: High  

**Scope**: Implement the catalog page (`/catalog`) with filtering, sorting, and pagination.

**Acceptance Criteria**:
- `CatalogComponent` (smart): reads `queryParams` via signal `input()` for `q`, `categoryId`, `page`, `pageSize`, `sortBy`, `priceMin`, `priceMax`, `rating`, `format`
- `CatalogFiltersComponent`: sticky sidebar on desktop (`lg+`); collapsible sheet/drawer on mobile
  - `FilterCategoryComponent`: checkbox list of categories
  - `FilterPriceRangeComponent`: dual-handle range slider (CSS-only approach acceptable)
  - `FilterRatingComponent`: clickable star rows (4+, 3+, 2+, 1+)
  - `FilterFormatComponent`: checkboxes for paperback / hardcover / ebook / audiobook
- `CatalogToolbarComponent`: result count, sort dropdown (5 options), "Clear Filters" button
- `BookGridComponent`: `grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`; uses `BookCardComponent`
- Filter changes update URL query params (`Router.navigate` with `queryParamsHandling: 'merge'`)
- `PaginationComponent` at bottom; page size options: 12, 24, 48
- `EmptyStateComponent` shown when no books match filters
- Loading skeleton shown during API call (`LoadingSkeletonComponent` type `card`, ×8)
- `CatalogService.getBooks()` called with filter signal; debounced 300ms on text search
- Mock data: ≥ 20 books across ≥ 5 categories in `catalog.service.mock.ts`

---

### FE-TASK-010 — Book Detail Feature
**Status**: PENDING  
**Dependencies**: FE-TASK-009  
**Priority**: High  

**Scope**: Implement the book detail page (`/catalog/:id`).

**Acceptance Criteria**:
- `BookDetailComponent` (smart): route param `:id` bound via `withComponentInputBindings()`
- `BookCoverGalleryComponent`: main cover + thumbnail strip (for multiple images); enlarge on click
- `BookInfoComponent`: title, author, `PriceDisplayComponent`, format selector (`radio-group` style), stock badge, `AddToCartButtonComponent`, wishlist button
- `BookMetaComponent`: publisher, ISBN, published date, page count, language in a clean metadata table
- `BookDescriptionComponent`: full synopsis with "Show more / Show less" toggle (`signal<boolean>`)
- `BookReviewsComponent`:
  - `ReviewStarsSummaryComponent`: aggregate rating with distribution bar chart (CSS widths, no charting lib)
  - `ReviewFormComponent` (authenticated users only): Reactive Form — rating (`StarRatingComponent`), title, body; validates required, max lengths
  - `ReviewListComponent`: paginated list of `ReviewItemComponent` (reviewer name, date, rating, body, verified badge)
- `RelatedBooksComponent`: horizontal scroll of `BookCardComponent` — max 6 books
- `BreadcrumbComponent` at top: Home → Category Name → Book Title
- Loading skeleton during fetch; error state if book not found (404 message + back button)
- `BookDetailService.submitReview()` requires auth guard — redirect to login if not authenticated

---

### FE-TASK-011 — Cart Feature
**Status**: PENDING  
**Dependencies**: FE-TASK-010, FE-TASK-006  
**Priority**: High  

**Scope**: Implement the cart page (`/cart`) and the `CartService`.

**Acceptance Criteria**:
- `CartService` uses `BehaviorSubject<Cart>` internally; exposes `cart()` and `itemCount()` as signals via `toSignal()`
- Cart state serialized to `sessionStorage` on every change; restored on service init
- `CartComponent` (smart): shows `CartLineItemComponent` list, `OrderSummaryComponent`, `PromoCodeComponent`
- `CartLineItemComponent`: book cover (`NgOptimizedImage`), title, format, `QuantityStepperComponent` (min 1, max 99), `PriceDisplayComponent`, remove button with `ConfirmDialogComponent`
- `OrderSummaryComponent`: subtotal, promo discount, tax (10%), total; "Proceed to Checkout" CTA — navigates `/checkout/address`
- `PromoCodeComponent`: Reactive Form input + Apply button; calls `CartService.applyPromoCode()`; shows success/error toast
- `CartEmptyStateComponent`: shown when cart is empty — illustration + "Start Shopping" CTA
- Cart count in header updates reactively via `CartService.itemCount()` signal
- Adding same book+format increments quantity; does not duplicate line item
- Mock: 3 promo codes in `cart.service.mock.ts` (valid, expired, invalid)

---

### FE-TASK-012 — Checkout Feature
**Status**: PENDING  
**Dependencies**: FE-TASK-011, FE-TASK-004  
**Priority**: High  

**Scope**: Implement the 4-step checkout wizard.

**Acceptance Criteria**:
- `CheckoutShellComponent`: 2-col layout on `lg+` (steps left, `CheckoutOrderSummaryComponent` right); single-col on mobile
- `CheckoutStepperComponent`: horizontal stepper showing 4 steps with active/completed/upcoming states
- **Step 1 — Address**: Reactive Form; fields: full name, street 1, street 2, city, state (dropdown), zip, country; option to select saved address (dropdown if user has saved addresses); all required fields validated; "Save address to account" checkbox
- **Step 2 — Shipping**: list of `ShippingMethod` options (radio group); each shows name, description, price, estimated days; loaded via `CheckoutService.getShippingMethods()`
- **Step 3 — Payment**: card number, cardholder, expiry (MM/YY), CVC fields (Reactive Form, masked input); note — use mock token, not real card processing
- **Step 4 — Confirmation**: success icon + "Order Confirmed!" heading; order ID; summary of items; "Continue Shopping" and "View Order" CTAs
- Step navigation is linear; back buttons available on steps 2–4; cannot skip ahead
- `CheckoutService` holds state as `signal<CheckoutState>`; cleared after confirmation
- `placeOrder()` formats any date fields using `formatDateForApi` before sending to API
- After successful `placeOrder()`, cart is cleared via `CartService.clearCart()`
- Loading spinner on "Place Order" submit; error toast on failure

---

### FE-TASK-013 — Auth Feature
**Status**: PENDING  
**Dependencies**: FE-TASK-004, FE-TASK-002  
**Priority**: High  

**Scope**: Implement login, register, forgot password, and reset password pages.

**Acceptance Criteria**:
- All forms use Reactive Forms with strict typing and client-side validation
- **Login**: email, password; "Remember me" checkbox (stub); "Forgot password?" link; success → redirect to previous page (or `/`) via `Router` state
- **Register**: first name, last name, email, password, confirm password (cross-field validator); terms checkbox
- **Forgot Password**: email input; submits to `AuthService.forgotPassword()`; success shows confirmation message
- **Reset Password**: token from URL query param; new password + confirm password; success redirects to login
- All pages are centered, max-width card layout, with link to the complementary auth action
- Error messages displayed inline under fields; server errors shown as alert banners
- Redirect authenticated users away from auth pages (canActivate inverse guard)
- Loading state on submit buttons — disabled + spinner

---

### FE-TASK-014 — Account Feature
**Status**: PENDING  
**Dependencies**: FE-TASK-013  
**Priority**: Medium  

**Scope**: Implement the authenticated account area.

**Acceptance Criteria**:
- `AccountShellComponent`: left sidebar on `lg+`; tab bar on mobile
- `AccountSidebarComponent`: nav links for Profile, Orders, Wishlist, Addresses; highlights active route
- **Profile**: Reactive Form (first name, last name, email, avatar URL); separate "Change Password" form; both submit independently with loading states
- **Order List**: table/list of orders with columns: order ID, date (`formatDateForApi`-formatted display), items count, total, status badge; links to detail; paginated
- **Order Detail**: all order items, shipping address, shipping method, payment summary, status timeline
- **Wishlist**: grid of `BookCardComponent`; each has "Move to Cart" and "Remove" buttons; empty state if no items
- **Address Book**: list of `AddressCardComponent`; add/edit via inline form or modal; delete with confirmation; default address badge
- All sections load data via `AccountService` with `@defer` + skeleton fallback
- Success toasts on all mutations

---

### FE-TASK-015 — Admin Feature
**Status**: PENDING  
**Dependencies**: FE-TASK-004, FE-TASK-007  
**Priority**: Medium  

**Scope**: Implement the admin panel (admin-role gated).

**Acceptance Criteria**:
- `AdminShellComponent`: persistent sidebar with nav links; breadcrumb at top of content
- **Admin Books**: data table with columns — cover thumbnail, title, author, category, price, stock, format; sortable columns; search by title/author; add/edit/delete actions; delete triggers `ConfirmDialogComponent`
- **Admin Book Form** (create & edit): Reactive Form — cover URL, title, author, description, category (select), price, discount price, format, stock, ISBN, publisher, published date (`yyyy-MM-dd` format via `formatDateForApi`), page count, language; all required fields validated
- **Admin Categories**: simple CRUD table — name, slug, book count; inline add/edit; delete with confirmation
- **Admin Orders**: filterable table — order ID, customer, date, total, status; status update dropdown per row
- **Admin Inventory**: table of all books with current stock level; inline stock update input; low-stock highlight (< 5)
- All tables paginated (20 rows/page); `overflow-x-auto` for mobile
- Data loaded via `AdminService` with mock data in `admin.service.mock.ts`

---

### FE-TASK-016 — Content Service & i18n
**Status**: PENDING  
**Dependencies**: FE-TASK-001  
**Priority**: Medium  

**Scope**: Implement `ContentService` and populate `en.json` with all strings.

**Acceptance Criteria**:
- `en.json` contains all user-facing strings as specified in [Content & i18n Strategy](#content--i18n-strategy)
- `ContentService` loads `en.json` via `HttpClient` on app init (using `APP_INITIALIZER`)
- `content.model.ts` defines typed interfaces for all sections
- All components consume text via `ContentService` — zero hardcoded UI strings in templates
- Unit test: `ContentService.getKey()` returns correct string; missing key returns empty string not undefined

---

### FE-TASK-017 — Not Found Page & Error Handling
**Status**: PENDING  
**Dependencies**: FE-TASK-007  
**Priority**: Low  

**Scope**: Implement `NotFoundComponent` and global error handler.

**Acceptance Criteria**:
- `NotFoundComponent`: centered, shows 404 illustration (SVG inline), heading "Page Not Found", subtext, "Back to Home" CTA
- Custom `ErrorHandler` in `core/` logs errors and emits toast via `ToastService`
- Error boundary test: navigating to unknown route renders `NotFoundComponent`

---

### FE-TASK-018 — Performance & A11y Audit
**Status**: PENDING  
**Dependencies**: FE-TASK-015  
**Priority**: Medium  

**Scope**: Final review pass for performance optimizations and accessibility compliance.

**Acceptance Criteria**:
- Every `<img>` uses `NgOptimizedImage` (`ngSrc`) with `width` and `height` attributes
- `@defer` used on all below-the-fold sections (featured books, reviews, related books, admin tables)
- `@for` blocks all have `track` expressions
- No functions called inside templates — only `computed()` signals and pure pipes
- All interactive elements pass keyboard navigation check (Tab → Space/Enter → Escape)
- All ARIA requirements listed in [Accessibility](#accessibility--responsive-breakpoints) implemented
- WCAG AA contrast verified on all brand color pairs
- `ng build --configuration production` produces bundle ≤ 1MB initial; no budget errors

---

## Dependencies Graph

```
FE-TASK-001 (Infrastructure)
    └── FE-TASK-002 (Design Tokens)
    └── FE-TASK-003 (Models)
        └── FE-TASK-004 (Auth Service + Guards)
            └── FE-TASK-005 (Interceptors)
            └── FE-TASK-013 (Auth Pages)
                └── FE-TASK-014 (Account)
            └── FE-TASK-015 (Admin)
    └── FE-TASK-016 (Content Service)
    └── FE-TASK-006 (Shared UI)
        └── FE-TASK-007 (Layout Shell)
            └── FE-TASK-008 (Home)
            └── FE-TASK-009 (Catalog)
                └── FE-TASK-010 (Book Detail)
                    └── FE-TASK-011 (Cart)
                        └── FE-TASK-012 (Checkout)
            └── FE-TASK-017 (404 + Error Handling)

FE-TASK-018 (Audit) depends on: ALL tasks complete
```

### Critical Path
```
001 → 002 → 006 → 007 → 009 → 010 → 011 → 012
001 → 003 → 004 → 013 → 014
```

### Parallel Workstreams
| Track A (Storefront)                    | Track B (Infrastructure + Account)       |
|-----------------------------------------|------------------------------------------|
| FE-TASK-002 Design Tokens               | FE-TASK-003 Models                       |
| FE-TASK-006 Shared UI                   | FE-TASK-004 Auth Service                 |
| FE-TASK-007 Layout                      | FE-TASK-005 Interceptors                 |
| FE-TASK-008 Home                        | FE-TASK-016 Content Service              |
| FE-TASK-009 Catalog                     | FE-TASK-013 Auth Pages                   |
| FE-TASK-010 Book Detail                 | FE-TASK-014 Account                      |
| FE-TASK-011 Cart                        | FE-TASK-015 Admin                        |
| FE-TASK-012 Checkout                    |                                          |
| FE-TASK-017 404/Error                   |                                          |

---

## Next Steps

1. **Review this specification** with the team and confirm scope, UX patterns, and data models
2. **Validate API contracts** — confirm endpoint paths and response shapes match backend (or agree on contract-first approach)
3. **Begin implementation**:
   ```
   task frontend FE-TASK-001   ← start here
   ```
4. After FE-TASK-001 completes, tracks A and B can proceed in parallel
5. Each task produces runnable, tested code — run `ng build` and `ng test` after each task before marking complete
