import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { BookDetail } from '../../../../shared/models/book.model';

@Component({
  selector: 'app-book-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h2 class="h5 fw-bold mb-3" style="color:var(--text-heading)">About This Book</h2>
      <div
        class="text-body"
        style="line-height:1.75;font-size:1rem"
        [class.overflow-hidden]="!expanded()"
        [style.max-height]="expanded() ? 'none' : '160px'"
      >
        <p>{{ book().description }}</p>
      </div>
      @if (book().description.length > 300) {
        <button
          type="button"
          class="btn btn-link p-0 mt-1 small"
          style="color:var(--brand-primary)"
          (click)="toggleExpanded()"
        >
          {{ expanded() ? 'Show less' : 'Show more' }}
          <span class="material-icons align-middle ms-1" style="font-size:14px">
            {{ expanded() ? 'expand_less' : 'expand_more' }}
          </span>
        </button>
      }
    </div>
  `,
})
export class BookDescriptionComponent {
  book     = input.required<BookDetail>();
  expanded = signal(false);

  toggleExpanded(): void {
    this.expanded.update(v => !v);
  }
}
