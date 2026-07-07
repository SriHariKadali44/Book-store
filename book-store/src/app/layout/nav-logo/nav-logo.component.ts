import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="text-decoration-none d-flex align-items-center gap-2" aria-label="BookStore home">
      <span class="material-icons" style="color:var(--brand-accent);font-size:28px">menu_book</span>
      <span class="fw-bold font-heading" style="font-size:1.35rem;color:var(--brand-primary);letter-spacing:-0.02em">BookStore</span>
    </a>
  `,
})
export class NavLogoComponent {}
