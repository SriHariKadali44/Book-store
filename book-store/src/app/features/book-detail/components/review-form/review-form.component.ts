import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { CreateReviewDto } from '../../../../shared/models/review.model';
import { StarRatingComponent } from '../../../../shared/ui/star-rating/star-rating.component';

@Component({
  selector: 'app-review-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, StarRatingComponent],
  template: `
    <div class="border rounded-3 p-4 mb-4">
      <h3 class="h6 fw-bold mb-3" style="color:var(--text-heading)">Write a Review</h3>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <!-- Rating -->
        <div class="mb-3">
          <label class="form-label small fw-semibold">Your Rating</label>
          <app-star-rating
            [value]="form.controls.rating.value ?? 0"
            [interactive]="true"
            size="lg"
            (ratingChange)="form.controls.rating.setValue($event)"
          />
          @if (form.controls.rating.invalid && form.controls.rating.touched) {
            <div class="text-danger small mt-1">Please select a rating.</div>
          }
        </div>

        <!-- Title -->
        <div class="mb-3">
          <label class="form-label small fw-semibold" for="review-title">Review Title</label>
          <input
            id="review-title"
            type="text"
            class="form-control"
            formControlName="title"
            placeholder="Summarise your experience"
            [class.is-invalid]="form.controls.title.invalid && form.controls.title.touched"
          />
          @if (form.controls.title.invalid && form.controls.title.touched) {
            <div class="invalid-feedback">Title is required (max 100 chars).</div>
          }
        </div>

        <!-- Body -->
        <div class="mb-3">
          <label class="form-label small fw-semibold" for="review-body">Review</label>
          <textarea
            id="review-body"
            class="form-control"
            rows="4"
            formControlName="body"
            placeholder="Share your thoughts about this book…"
            [class.is-invalid]="form.controls.body.invalid && form.controls.body.touched"
          ></textarea>
          @if (form.controls.body.invalid && form.controls.body.touched) {
            <div class="invalid-feedback">Review must be between 10–1000 characters.</div>
          }
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          style="background:var(--brand-primary);border-color:var(--brand-primary)"
          [disabled]="submitting()"
        >
          {{ submitting() ? 'Submitting…' : 'Submit Review' }}
        </button>
      </form>
    </div>
  `,
})
export class ReviewFormComponent {
  private readonly fb = inject(FormBuilder);
  submitting = signal(false);
  submitReview = output<CreateReviewDto>();

  readonly form = this.fb.group({
    rating: this.fb.control<number>(0, [Validators.required, Validators.min(1)]),
    title:  this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(100)]),
    body:   this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const { rating, title, body } = this.form.getRawValue();
    this.submitReview.emit({ rating: rating!, title, body });
    this.form.reset({ rating: 0, title: '', body: '' });
    this.submitting.set(false);
  }
}
