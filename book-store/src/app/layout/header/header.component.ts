import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../features/cart/services/cart.service';
import { ContentService } from '../../core/services/content.service';
import { NavLogoComponent } from '../nav-logo/nav-logo.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NavLogoComponent, SearchBarComponent, UserMenuComponent],
  template: `
    <!-- Sticky header -->
    <header
      class="sticky-top bg-surface-card shadow-sm"
      style="z-index:1030;border-bottom:1px solid var(--border-default)"
    >
      <div class="container-xl px-3 px-lg-4">
        <div class="d-flex align-items-center gap-3 py-2">

          <!-- Logo -->
          <app-nav-logo class="flex-shrink-0" />

          <!-- Search — hidden on xs, shown md+ -->
          <div class="flex-grow-1 d-none d-md-block">
            <app-search-bar />
          </div>

          <!-- Right controls -->
          <div class="d-flex align-items-center gap-2 ms-auto ms-md-0 flex-shrink-0">

            <!-- Cart icon -->
            <a
              routerLink="/cart"
              class="btn btn-sm border-0 position-relative p-1"
              [attr.aria-label]="content.get('header').cartAriaLabel"
            >
              <span class="material-icons" style="font-size:24px;color:var(--text-body)">shopping_cart</span>
              @if (cartService.itemCount() > 0) {
                <span
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-brand-accent"
                  style="font-size:10px"
                  aria-live="polite"
                >{{ cartService.itemCount() }}</span>
              }
            </a>

            <!-- User menu -->
            <app-user-menu />

            <!-- Hamburger (mobile) -->
            <button
              type="button"
              class="btn btn-sm border-0 d-lg-none p-1"
              aria-label="Open navigation menu"
              (click)="toggleDrawer()"
            >
              <span class="material-icons" style="font-size:24px">menu</span>
            </button>
          </div>
        </div>

        <!-- Search row on mobile -->
        <div class="d-md-none pb-2">
          <app-search-bar />
        </div>
      </div>
    </header>

    <!-- Mobile nav drawer overlay -->
    @if (drawerOpen()) {
      <div
        class="position-fixed top-0 start-0 w-100 h-100"
        style="z-index:1040"
        (click)="closeDrawer()"
      >
        <!-- backdrop -->
        <div class="w-100 h-100" style="background:rgba(0,0,0,0.45)"></div>
      </div>

      <nav
        class="position-fixed top-0 start-0 h-100 bg-surface-card shadow"
        style="z-index:1050;width:280px;overflow-y:auto"
        aria-label="Mobile navigation"
        (click)="$event.stopPropagation()"
      >
        <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
          <app-nav-logo />
          <button type="button" class="btn btn-sm border-0 p-1" aria-label="Close menu" (click)="closeDrawer()">
            <span class="material-icons">close</span>
          </button>
        </div>
        <ul class="list-unstyled p-3 mb-0">
          @for (link of navLinks; track link.label) {
            <li>
              <a
                [routerLink]="link.path"
                class="d-flex align-items-center gap-2 py-2 px-1 text-decoration-none rounded"
                style="color:var(--text-body);font-size:1.05rem"
                (click)="closeDrawer()"
              >
                <span class="material-icons" style="font-size:20px">{{ link.icon }}</span>
                {{ link.label }}
              </a>
            </li>
          }
        </ul>
      </nav>
    }
  `,
})
export class HeaderComponent {
  readonly cartService = inject(CartService);
  readonly content = inject(ContentService);

  readonly drawerOpen = signal(false);

  readonly navLinks = [
    { label: 'Home',         path: '/',        icon: 'home' },
    { label: 'Browse Books', path: '/catalog', icon: 'menu_book' },
    { label: 'My Account',   path: '/account', icon: 'person' },
    { label: 'Cart',         path: '/cart',    icon: 'shopping_cart' },
  ];

  toggleDrawer(): void { this.drawerOpen.update(v => !v); }
  closeDrawer(): void  { this.drawerOpen.set(false); }
}
