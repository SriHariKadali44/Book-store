import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="d-flex" style="min-height:calc(100vh - 120px)">
      <!-- Sidebar -->
      <aside
        class="d-none d-lg-flex flex-column bg-surface-card border-end"
        style="width:220px;flex-shrink:0;position:sticky;top:60px;height:calc(100vh - 60px);overflow-y:auto"
        aria-label="Admin navigation"
      >
        <div class="p-3 border-bottom">
          <span class="fw-bold small text-uppercase" style="color:var(--text-muted);letter-spacing:0.08em">Admin</span>
        </div>
        <nav class="p-2 flex-grow-1">
          @for (link of navLinks; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="active"
              class="d-flex align-items-center gap-2 px-2 py-2 rounded text-decoration-none mb-1 admin-nav-link"
              style="color:var(--text-body);font-size:0.9rem;transition:background 0.15s"
            >
              <span class="material-icons" style="font-size:18px">{{ link.icon }}</span>
              {{ link.label }}
            </a>
          }
        </nav>
      </aside>

      <!-- Main -->
      <div class="flex-grow-1 p-3 p-lg-4 overflow-hidden">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`
    .admin-nav-link:hover { background: var(--surface-muted); }
    .admin-nav-link.active { background: var(--surface-muted); color: var(--brand-primary) !important; font-weight: 600; }
  `],
})
export class AdminShellComponent {
  readonly navLinks = [
    { label: 'Books',      path: '/admin/books',      icon: 'menu_book'     },
    { label: 'Categories', path: '/admin/categories', icon: 'category'      },
    { label: 'Orders',     path: '/admin/orders',     icon: 'receipt_long'  },
    { label: 'Inventory',  path: '/admin/inventory',  icon: 'inventory_2'   },
  ];
}
