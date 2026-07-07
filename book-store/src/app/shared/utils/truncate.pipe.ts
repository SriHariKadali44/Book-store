import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncates a string to a given character limit and appends an ellipsis.
 *
 * Usage:  {{ book.description | truncate:120 }}
 *         {{ book.description | truncate:80:'...' }}
 */
@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 100, ellipsis = '…'): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    // Break on a word boundary where possible
    const truncated = value.substring(0, limit);
    const lastSpace = truncated.lastIndexOf(' ');
    const cut = lastSpace > limit * 0.8 ? lastSpace : limit;

    return truncated.substring(0, cut) + ellipsis;
  }
}
