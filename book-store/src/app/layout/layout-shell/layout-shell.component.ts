import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastNotificationComponent } from '../../shared/ui/toast-notification/toast-notification.component';

/**
 * Root layout shell: header → router-outlet → footer + global toasts.
 * All feature routes are children of this shell.
 */
@Component({
  selector: 'app-layout-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastNotificationComponent],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-header />
      <main class="flex-grow-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>

    <!-- Global toast notifications -->
    <app-toast-notification />
  `,
})
export class LayoutShellComponent {}
