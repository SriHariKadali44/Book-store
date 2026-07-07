import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @if (auth.isAuthenticated()) {
      <!-- Authenticated: avatar + dropdown -->
      <div class="dropdown">
        <button
          type="button"
          class="btn btn-sm border-0 d-flex align-items-center gap-2 p-1"
          id="userMenuBtn"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          [attr.aria-label]="content.get('header').myAccount"
        >
          <span class="material-icons rounded-circle bg-surface-muted p-1" style="font-size:20px">account_circle</span>
          <span class="d-none d-lg-inline small fw-semibold" style="color:var(--text-body)">
            {{ auth.currentUser()?.firstName }}
          </span>
          <span class="material-icons" style="font-size:16px;color:var(--text-muted)">expand_more</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userMenuBtn">
          <li>
            <a class="dropdown-item d-flex align-items-center gap-2" routerLink="/account/profile">
              <span class="material-icons" style="font-size:18px">person</span>
              {{ content.get('header').myAccount }}
            </a>
          </li>
          <li>
            <a class="dropdown-item d-flex align-items-center gap-2" routerLink="/account/orders">
              <span class="material-icons" style="font-size:18px">receipt_long</span>
              {{ content.get('account').orders }}
            </a>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <button type="button" class="dropdown-item d-flex align-items-center gap-2 text-danger" (click)="logout()">
              <span class="material-icons" style="font-size:18px">logout</span>
              {{ content.get('header').logout }}
            </button>
          </li>
        </ul>
      </div>
    } @else {
      <!-- Guest: Sign In + Register links -->
      <div class="d-flex align-items-center gap-2">
        <a routerLink="/auth/login" class="btn btn-sm btn-outline-secondary">
          {{ content.get('header').signIn }}
        </a>
        <a routerLink="/auth/register" class="btn btn-sm btn-primary d-none d-md-inline-flex">
          {{ content.get('header').register }}
        </a>
      </div>
    }
  `,
})
export class UserMenuComponent {
  readonly auth = inject(AuthService);
  readonly content = inject(ContentService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
