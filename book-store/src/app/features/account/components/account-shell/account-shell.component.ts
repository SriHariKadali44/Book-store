import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-account-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="container-xl px-3 px-lg-4 py-4">
      <h1 class="font-heading fw-bold mb-4" style="font-size:1.75rem;color:var(--text-heading)">My Account</h1>

      <div class="row g-4">
        <!-- Sidebar -->
        <div class="col-12 col-lg-3">
          <nav aria-label="Account navigation" class="bg-surface-card border rounded-3 overflow-hidden">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="active fw-semibold"
                class="d-flex align-items-center gap-2 px-3 py-3 text-decoration-none border-bottom account-nav-link"
                style="color:var(--text-body);transition:background 0.15s"
              >
                <span class="material-icons" style="font-size:20px;color:var(--brand-primary)">{{ link.icon }}</span>
                {{ link.label }}
              </a>
            }
          </nav>
        </div>

        <!-- Content -->
        <div class="col-12 col-lg-9">
          <div class="bg-surface-card border rounded-3 p-4">
            <router-outlet />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-nav-link:hover { background: var(--surface-muted); }
    .account-nav-link.active { background: var(--surface-muted); color: var(--brand-primary) !important; }
  `],
})
export class AccountShellComponent {
  readonly navLinks = [
    { label: 'Profile',          path: 'profile',   icon: 'person'        },
    { label: 'Order History',    path: 'orders',    icon: 'receipt_long'  },
    { label: 'Wishlist',         path: 'wishlist',  icon: 'favorite'      },
    { label: 'Saved Addresses',  path: 'addresses', icon: 'location_on'   },
  ];
}
