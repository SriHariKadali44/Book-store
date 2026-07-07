import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="d-flex flex-column align-items-center justify-content-center text-center py-5 px-3" style="min-height:60vh">
      <!-- SVG Illustration -->
      <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true" class="mb-4">
        <circle cx="90" cy="90" r="88" fill="var(--surface-muted)" stroke="var(--border-default)" stroke-width="2"/>
        <text x="90" y="105" font-size="72" font-weight="700" fill="var(--brand-primary)" text-anchor="middle" font-family="Playfair Display, serif">404</text>
        <path d="M40 130 Q90 150 140 130" stroke="var(--brand-accent)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="62" cy="112" r="6" fill="var(--brand-accent)" opacity="0.6"/>
        <circle cx="118" cy="112" r="6" fill="var(--brand-accent)" opacity="0.6"/>
      </svg>

      <h1 class="font-heading fw-bold mb-2" style="font-size:2rem;color:var(--text-heading)">
        Page Not Found
      </h1>
      <p class="text-muted mb-4" style="max-width:400px;font-size:1.05rem">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <a
        routerLink="/"
        class="btn btn-primary btn-lg px-5"
        style="background:var(--brand-primary);border-color:var(--brand-primary)"
      >
        <span class="material-icons align-middle me-2" style="font-size:20px">home</span>
        Back to Home
      </a>
    </div>
  `,
})
export class NotFoundComponent {}
