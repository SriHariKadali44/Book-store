import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PromoInfo } from '../../models/home.model';

@Component({
  selector: 'app-promos-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="py-4 px-0" aria-label="Promotions">
      <div class="container-xl px-3 px-lg-4">
        <div class="row g-3">
          @for (promo of promos(); track promo.id) {
            <div class="col-12 col-md-6">
              <div
                class="rounded-3 p-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3"
                [style.background]="promo.backgroundColor"
              >
                <div>
                  <h3 class="fw-bold text-white mb-1" style="font-size:1.15rem">{{ promo.title }}</h3>
                  <p class="text-white opacity-75 small mb-0">{{ promo.subtitle }}</p>
                </div>
                <a
                  [routerLink]="promo.ctaRoute"
                  class="btn btn-light btn-sm flex-shrink-0 fw-semibold px-4"
                  style="white-space:nowrap"
                >{{ promo.ctaLabel }}</a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class PromosBannerComponent {
  promos = input.required<PromoInfo[]>();
}
