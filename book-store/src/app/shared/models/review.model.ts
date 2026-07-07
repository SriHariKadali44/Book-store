export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;            // 1–5
  title: string;
  body: string;
  createdAt: string;         // ISO 8601
  verifiedPurchase: boolean;
}

/** Rating distribution keyed by star value 1–5. */
export type RatingDistribution = Record<1 | 2 | 3 | 4 | 5, number>;

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

/** DTO for submitting a new review. */
export interface CreateReviewDto {
  rating: number;
  title: string;
  body: string;
}
