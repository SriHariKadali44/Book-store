import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a number as a currency string using the browser's Intl.NumberFormat.
 *
 * Usage:  {{ book.price | appCurrency }}
 *         {{ book.price | appCurrency:'EUR':'de-DE' }}
 */
@Pipe({
  name: 'appCurrency',
  standalone: true,
  pure: true,
})
export class CurrencyPipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    currencyCode = 'USD',
    locale = 'en-US'
  ): string {
    if (value == null) {
      return '';
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
