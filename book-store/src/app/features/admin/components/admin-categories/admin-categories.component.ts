import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Category } from '../../../../shared/models/category.model';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ConfirmDialogComponent],
  template: `
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="h5 fw-bold mb-0" style="color:var(--text-heading)">Manage Categories</h1>
    </div>

    <div class="table-responsive mb-4">
      <table class="table table-hover align-middle" style="font-size:0.9rem">
        <thead>
          <tr class="text-muted border-bottom">
            <th>Name</th>
            <th>Slug</th>
            <th>Books</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (cat of categories(); track cat.id) {
            <tr>
              <td class="fw-medium">{{ cat.name }}</td>
              <td class="text-muted small font-monospace">{{ cat.slug }}</td>
              <td>{{ cat.bookCount }}</td>
              <td>
                <button type="button" class="btn btn-sm btn-outline-danger border-0 px-2"
                  (click)="confirmId.set(cat.id)" aria-label="Delete category">
                  <span class="material-icons" style="font-size:14px">delete_outline</span>
                </button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Add category -->
    <div class="border rounded-3 p-3" style="max-width:360px">
      <h3 class="h6 fw-bold mb-3" style="color:var(--text-heading)">Add Category</h3>
      <div class="input-group input-group-sm">
        <input type="text" class="form-control" [(ngModel)]="newName" placeholder="Category name" />
        <button type="button" class="btn btn-primary"
          style="background:var(--brand-primary);border-color:var(--brand-primary)"
          (click)="onCreate()" [disabled]="!newName.trim()">
          Add
        </button>
      </div>
    </div>

    @if (confirmId()) {
      <app-confirm-dialog
        title="Delete category?"
        message="This category will be permanently deleted."
        confirmLabel="Delete"
        [destructive]="true"
        (confirmed)="onDelete()"
        (cancelled)="confirmId.set(null)"
      />
    }
  `,
})
export class AdminCategoriesComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);

  readonly categories = signal<Category[]>([]);
  readonly confirmId  = signal<string | null>(null);
  newName = '';

  ngOnInit(): void {
    this.adminService.getCategories().subscribe(c => this.categories.set(c));
  }

  onCreate(): void {
    const name = this.newName.trim();
    if (!name) return;
    this.adminService.createCategory({ name }).subscribe(cat => {
      this.categories.update(c => [...c, cat]);
      this.newName = '';
      this.toastService.show(`"${cat.name}" added.`, 'success');
    });
  }

  onDelete(): void {
    const id = this.confirmId()!;
    this.adminService.deleteCategory(id).subscribe(() => {
      this.categories.update(c => c.filter(cat => cat.id !== id));
      this.confirmId.set(null);
      this.toastService.show('Category deleted.', 'info');
    });
  }
}
