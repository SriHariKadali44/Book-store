import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { ToastService } from '../../../../core/services/toast.service';
import { BookSummary } from '../../../../shared/models/book.model';
import { PagedResult } from '../../../../shared/models/pagination.model';
import { PaginationComponent } from '../../../../shared/ui/pagination/pagination.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-books',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormsModule, PaginationComponent, ConfirmDialogComponent],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="h5 fw-bold mb-0" style="color:var(--text-heading)">Manage Books</h1>
      <a routerLink="/admin/books/new" class="btn btn-sm btn-primary"
        style="background:var(--brand-primary);border-color:var(--brand-primary)">
        <span class="material-icons align-middle me-1" style="font-size:16px">add</span>
        New Book
      </a>
    </div>

    <!-- Search -->
    <div class="mb-3">
      <input type="text" class="form-control form-control-sm" placeholder="Search by title…"
        [(ngModel)]="searchQuery" (input)="onSearch()" style="max-width:300px" />
    </div>

    @if (loading()) {
      <p class="text-muted small">Loading…</p>
    } @else {
      <div class="table-responsive">
        <table class="table table-hover align-middle" style="font-size:0.88rem">
          <thead>
            <tr class="text-muted border-bottom">
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Format</th>
              <th>Bestseller</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (book of result()?.data; track book.id) {
              <tr>
                <td class="fw-medium" style="max-width:180px" class="text-truncate">{{ book.title }}</td>
                <td class="text-muted">{{ book.author }}</td>
                <td class="text-muted small">{{ book.categoryId }}</td>
                <td>\${{ book.price.toFixed(2) }}</td>
                <td class="text-capitalize small">{{ book.format }}</td>
                <td>
                  <span class="material-icons" style="font-size:16px;color:{{ book.isBestseller ? 'var(--brand-accent)' : 'var(--border-default)' }}">
                    star
                  </span>
                </td>
                <td>
                  <div class="d-flex gap-1">
                    <a [routerLink]="['/admin/books', book.id, 'edit']" class="btn btn-sm btn-outline-secondary px-2">
                      <span class="material-icons" style="font-size:14px">edit</span>
                    </a>
                    <button type="button" class="btn btn-sm btn-outline-danger px-2 border-0"
                      (click)="confirmDeleteId.set(book.id)" aria-label="Delete">
                      <span class="material-icons" style="font-size:14px">delete_outline</span>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if ((result()?.meta?.totalPages ?? 0) > 1) {
        <app-pagination [meta]="result()!.meta" (pageChange)="loadBooks($event)" />
      }
    }

    @if (confirmDeleteId()) {
      <app-confirm-dialog
        title="Delete book?"
        message="This book will be permanently deleted."
        confirmLabel="Delete"
        [destructive]="true"
        (confirmed)="onDelete()"
        (cancelled)="confirmDeleteId.set(null)"
      />
    }
  `,
})
export class AdminBooksComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);

  readonly loading         = signal(true);
  readonly result          = signal<PagedResult<BookSummary> | null>(null);
  readonly confirmDeleteId = signal<string | null>(null);
  searchQuery = '';

  ngOnInit(): void { this.loadBooks(1); }

  loadBooks(page: number): void {
    this.loading.set(true);
    this.adminService.getBooks(page, 20, this.searchQuery).subscribe(r => {
      this.result.set(r);
      this.loading.set(false);
    });
  }

  onSearch(): void { this.loadBooks(1); }

  onDelete(): void {
    const id = this.confirmDeleteId()!;
    this.adminService.deleteBook(id).subscribe(() => {
      this.confirmDeleteId.set(null);
      this.toastService.show('Book deleted.', 'info');
      this.loadBooks(1);
    });
  }
}
