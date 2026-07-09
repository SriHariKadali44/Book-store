import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <form
      class="d-flex align-items-center w-100"
      role="search"
      (submit)="onSubmit($event)"
    >
      <div class="input-group">
        <input
          type="search"
          class="form-control border-end-0"
          [formControl]="queryControl"
          [placeholder]="content.getKey('header', 'searchPlaceholder') || 'Search books…'"
          aria-label="Search books"
          style="border-radius:20px 0 0 20px;background:var(--surface-muted)"
          (keydown.enter)="onSubmit($event)"
        />
        <button
          type="submit"
          class="btn border border-start-0"
          style="border-radius:0 20px 20px 0;background:var(--surface-muted);border-color:#dee2e6"
          aria-label="Submit search"
        >
          <span class="material-icons" style="font-size:20px;color:var(--text-muted)">search</span>
        </button>
      </div>
    </form>
  `,
})
export class SearchBarComponent {
  private readonly router = inject(Router);
  readonly content = inject(ContentService);

  readonly queryControl = new FormControl('', { nonNullable: true });

  search = output<string>();

  onSubmit(event: Event): void {
    event.preventDefault();
    const q = this.queryControl.value.trim();
    if (!q) return;
    this.search.emit(q);
    this.router.navigate(['/catalog'], { queryParams: { q } });
  }
}
