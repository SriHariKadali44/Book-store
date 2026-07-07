import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ContentService } from '../../core/services/content.service';
import { NavLogoComponent } from '../nav-logo/nav-logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule, NavLogoComponent],
  template: `
    <footer style="background:var(--brand-primary);color:var(--text-inverse);margin-top:auto">
      <div class="container-xl px-3 px-lg-4 py-5">
        <div class="row g-4">

          <!-- Brand column -->
          <div class="col-12 col-md-4 col-lg-3">
            <app-nav-logo />
            <p class="mt-3 small opacity-75">{{ content.get('footer').tagline }}</p>
            <!-- Newsletter -->
            <p class="fw-semibold mb-2 mt-3">{{ content.get('footer').newsletterHeading }}</p>
            <div class="input-group input-group-sm">
              <input
                type="email"
                class="form-control"
                [placeholder]="content.get('footer').newsletterPlaceholder"
                [formControl]="emailControl"
                aria-label="Newsletter email"
              />
              <button type="button" class="btn btn-accent btn-sm" (click)="onSubscribe()">
                {{ content.get('footer').newsletterCta }}
              </button>
            </div>
          </div>

          <!-- Company -->
          <div class="col-6 col-md-2">
            <h6 class="fw-bold mb-3 opacity-90">{{ content.get('footer').companyHeading }}</h6>
            <ul class="list-unstyled small">
              @for (link of companyLinks; track link.label) {
                <li class="mb-2">
                  <a [routerLink]="link.path" class="text-decoration-none opacity-75" style="color:inherit">{{ link.label }}</a>
                </li>
              }
            </ul>
          </div>

          <!-- Help -->
          <div class="col-6 col-md-2">
            <h6 class="fw-bold mb-3 opacity-90">{{ content.get('footer').helpHeading }}</h6>
            <ul class="list-unstyled small">
              @for (link of helpLinks; track link.label) {
                <li class="mb-2">
                  <a [routerLink]="link.path" class="text-decoration-none opacity-75" style="color:inherit">{{ link.label }}</a>
                </li>
              }
            </ul>
          </div>

          <!-- Categories -->
          <div class="col-6 col-md-2">
            <h6 class="fw-bold mb-3 opacity-90">{{ content.get('footer').categoriesHeading }}</h6>
            <ul class="list-unstyled small">
              @for (cat of categories; track cat) {
                <li class="mb-2">
                  <a routerLink="/catalog" class="text-decoration-none opacity-75" style="color:inherit">{{ cat }}</a>
                </li>
              }
            </ul>
          </div>

          <!-- Social -->
          <div class="col-6 col-md-2">
            <h6 class="fw-bold mb-3 opacity-90">{{ content.get('footer').socialHeading }}</h6>
            <div class="d-flex flex-wrap gap-2">
              @for (s of socialLinks; track s.icon) {
                <a [href]="s.url" class="btn btn-sm border-0 p-1 opacity-75" [attr.aria-label]="s.label" style="color:inherit">
                  <span class="material-icons" style="font-size:22px">{{ s.icon }}</span>
                </a>
              }
            </div>
          </div>
        </div>

        <hr style="border-color:rgba(255,255,255,0.2);margin-top:2rem;margin-bottom:1rem">
        <p class="text-center small mb-0 opacity-60">{{ content.get('footer').copyright }}</p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly content = inject(ContentService);
  readonly emailControl = new FormControl('', { nonNullable: true });

  readonly companyLinks = [
    { label: 'About Us',  path: '/about' },
    { label: 'Careers',   path: '/careers' },
    { label: 'Blog',      path: '/blog' },
    { label: 'Press',     path: '/press' },
  ];

  readonly helpLinks = [
    { label: 'FAQ',             path: '/faq' },
    { label: 'Shipping Policy', path: '/shipping' },
    { label: 'Returns',         path: '/returns' },
    { label: 'Contact Us',      path: '/contact' },
  ];

  readonly categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Children'];

  readonly socialLinks = [
    { icon: 'facebook',  label: 'Facebook',  url: 'https://facebook.com' },
    { icon: 'diversity_1', label: 'Twitter', url: 'https://twitter.com' },
    { icon: 'photo_camera', label: 'Instagram', url: 'https://instagram.com' },
  ];

  onSubscribe(): void {
    this.emailControl.reset();
  }
}
