import { BookSummary } from '../../../shared/models/book.model';
import { Category } from '../../../shared/models/category.model';

export interface PromoInfo {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaRoute: string;
  backgroundColor: string;
}
