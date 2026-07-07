import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-admin-book-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h1 class="h5 fw-bold mb-0" style="color:var(--text-heading)">
        {{ id() ? 'Edit Book' : 'New Book' }}
      </h1>
      <a routerLink="/admin/books" class="btn btn-sm btn-outline-secondary">
        <span class="material-icons align-middle me-1" style="font-size:14px">arrow_back</span>
        Back
      </a>
    </div>

    <form [formGroup]="form" (ngSubmit)="onSave()" class="row g-3" style="max-width:640px">
      <div class="col-12">
        <label class="form-label small fw-semibold">Title *</label>
        <input type="text" class="form-control" formControlName="title"
          [class.is-invalid]="f['title'].invalid && f['title'].touched" />
        <div class="invalid-feedback">Required.</div>
      </div>
      <div class="col-12 col-sm-6">
        <label class="form-label small fw-semibold">Author *</label>
        <input type="text" class="form-control" formControlName="author"
          [class.is-invalid]="f['author'].invalid && f['author'].touched" />
        <div class="invalid-feedback">Required.</div>
      </div>
      <div class="col-12 col-sm-6">
        <label class="form-label small fw-semibold">Price *</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input type="number" class="form-control" formControlName="price" min="0" step="0.01" />
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <label class="form-label small fw-semibold">Discount Price</label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input type="number" class="form-control" formControlName="discountPrice" min="0" step="0.01" />
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <label class="form-label small fw-semibold">Format</label>
        <select class="form-select" formControlName="format">
          <option value="paperback">Paperback</option>
          <option value="hardcover">Hardcover</option>
          <option value="ebook">eBook</option>
          <option value="audiobook">Audiobook</option>
        </select>
      </div>
      <div class="col-12 col-sm-6">
        <label class="form-label small fw-semibold">ISBN</label>
        <input type="text" class="form-control" formControlName="isbn" />
      </div>
      <div class="col-12 col-sm-6">
        <label class="form-label small fw-semibold">Published Date (yyyy-MM-dd)</label>
        <input type="date" class="form-control" formControlName="publishedDate" />
      </div>
      <div class="col-12">
        <label class="form-label small fw-semibold">Description</label>
        <textarea class="form-control" rows="4" formControlName="description"></textarea>
      </div>

      <div class="col-12 d-flex gap-2 mt-2">
        <button type="submit" class="btn btn-primary" [disabled]="saving()"
          style="background:var(--brand-primary);border-color:var(--brand-primary)">
          {{ saving() ? 'Saving…' : 'Save Book' }}
        </button>
        <a routerLink="/admin/books" class="btn btn-outline-secondary">Cancel</a>
      </div>
    </form>
  `,
})
export class AdminBookFormComponent {
  id = input<string>('');

  private readonly fb           = inject(FormBuilder);
  private readonly router       = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly saving = signal(false);

  readonly form = this.fb.group({
    title:         this.fb.nonNullable.control('', Validators.required),
    author:        this.fb.nonNullable.control('', Validators.required),
    price:         this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    discountPrice: this.fb.control<number | null>(null),
    format:        this.fb.nonNullable.control('paperback'),
    isbn:          this.fb.nonNullable.control(''),
    publishedDate: this.fb.nonNullable.control(''),
    description:   this.fb.nonNullable.control(''),
  });

  get f() { return this.form.controls; }

  onSave(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    // Mock save: just navigate back after 600ms
    setTimeout(() => {
      this.saving.set(false);
      this.toastService.show('Book saved successfully.', 'success');
      this.router.navigate(['/admin/books']);
    }, 600);
  }
}
