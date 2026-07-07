/**
 * Formats a Date (or ISO date string) to 'yyyy-MM-dd' for API request payloads.
 *
 * Usage:
 *   formatDateForApi(new Date())          // '2026-07-07'
 *   formatDateForApi('2026-07-07T10:00Z') // '2026-07-07'
 *   formatDateForApi(null)                // ''
 */
export function formatDateForApi(value: Date | string | null | undefined): string {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Parses a 'yyyy-MM-dd' string into a Date object (local timezone midnight).
 * Returns null for empty or invalid input.
 */
export function parseDateFromApi(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}
