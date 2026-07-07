import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section
      class="position-relative overflow-hidden"
      style="background:linear-gradient(135deg,var(--brand-primary) 0%,#2d5986 60%,#1a4a7a 100%);min-height:420px"
      aria-label="Hero banner"
    >
      <!-- Decorative book shapes -->
      <div aria-hidden="true" class="position-absolute top-0 end-0 h-100 d-none d-lg-block" style="width:45%;opacity:0.08">
        <svg viewBox="0 0 500 420" width="100%" height="100%">
          <rect x="60"  y="40"  width="120" height="160" rx="6" fill="#fff" transform="rotate(-8,120,120)"/>
          <rect x="100" y="80"  width="110" height="150" rx="6" fill="#fff" transform="rotate(4,155,155)"/>
          <rect x="220" y="30"  width="100" height="140" rx="6" fill="#fff" transform="rotate(-5,270,100)"/>
          <rect x="300" y="60"  width="130" height="170" rx="6" fill="#fff" transform="rotate(6,365,145)"/>
          <rect x="150" y="200" width="90"  height="130" rx="6" fill="#fff" transform="rotate(-4,195,265)"/>
          <rect x="350" y="180" width="110" height="150" rx="6" fill="#fff" transform="rotate(3,405,255)"/>
        </svg>
      </div>

      <div class="container-xl px-3 px-lg-4 py-5 position-relative">
        <div class="row align-items-center" style="min-height:360px">
          <div class="col-12 col-lg-7 py-4">
            <span
              class="badge mb-3"
              style="background:var(--brand-accent);font-size:0.75rem;letter-spacing:0.08em;padding:6px 14px"
            >✦ SUMMER READING SALE — UP TO 40% OFF</span>

            <h1
              class="font-heading fw-bold text-white mb-3"
              style="font-size:clamp(2rem,5vw,3.5rem);line-height:1.15;letter-spacing:-0.02em"
            >
              Discover Your<br>Next Great Read
            </h1>
            <p
              class="text-white mb-4 opacity-75"
              style="font-size:1.15rem;max-width:500px;line-height:1.6"
            >
              Thousands of books across every genre, delivered to your door. Free shipping on orders over $35.
            </p>

            <div class="d-flex flex-wrap gap-3">
              <a
                routerLink="/catalog"
                class="btn btn-lg px-5 fw-semibold"
                style="background:var(--brand-accent);border:none;color:#fff;border-radius:8px"
              >
                <span class="material-icons align-middle me-2" style="font-size:18px">shopping_bag</span>
                Shop Now
              </a>
              <a
                routerLink="/catalog"
                [queryParams]="{ sortBy: 'newest' }"
                class="btn btn-lg btn-outline-light px-4"
                style="border-radius:8px"
              >
                New Arrivals
              </a>
            </div>

            <!-- Trust badges -->
            <div class="d-flex flex-wrap gap-4 mt-4 opacity-75">
              @for (badge of trustBadges; track badge.text) {
                <div class="d-flex align-items-center gap-2 text-white small">
                  <span class="material-icons" style="font-size:16px">{{ badge.icon }}</span>
                  {{ badge.text }}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroBannerComponent {
  readonly trustBadges = [
    { icon: 'local_shipping', text: 'Free shipping over $35' },
    { icon: 'autorenew',      text: '30-day returns' },
    { icon: 'verified',       text: '1M+ happy readers' },
  ];
}
