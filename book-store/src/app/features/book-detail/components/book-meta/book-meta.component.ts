import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { BookDetail } from '../../../../shared/models/book.model';

@Component({
  selector: 'app-book-meta',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="table table-sm table-borderless mb-0" style="font-size:0.9rem">
      <tbody>
        <tr>
          <td class="text-muted pe-3" style="width:40%;white-space:nowrap">Publisher</td>
          <td class="fw-medium">{{ book().publisher }}</td>
        </tr>
        <tr>
          <td class="text-muted pe-3">ISBN</td>
          <td class="fw-medium">{{ book().isbn }}</td>
        </tr>
        <tr>
          <td class="text-muted pe-3">Published</td>
          <td class="fw-medium">{{ book().publishedDate }}</td>
        </tr>
        <tr>
          <td class="text-muted pe-3">Pages</td>
          <td class="fw-medium">{{ book().pageCount }}</td>
        </tr>
        <tr>
          <td class="text-muted pe-3">Language</td>
          <td class="fw-medium">{{ book().language }}</td>
        </tr>
        <tr>
          <td class="text-muted pe-3">Format</td>
          <td class="fw-medium text-capitalize">{{ book().format }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class BookMetaComponent {
  book = input.required<BookDetail>();
}
