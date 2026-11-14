import {
  CulinaryDrop,
  DietaryTag,
  DishCategory,
  FlavorTone,
  MicroReview,
  NightWindow,
  Reservation,
  ReservationDraft,
  ReviewDraft,
  SortMode,
} from '../types/gastronomy';

export interface DropFilterOptions {
  query: string;
  category: DishCategory;
  flavor: FlavorTone | 'all';
  dietaryTags?: DietaryTag[];
  sortBy: SortMode;
}

export interface ReviewFilterOptions {
  query: string;
  category: DishCategory;
  minScore: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const LIVE_STATUS_RANK: Record<CulinaryDrop['status'], number> = {
  'Tables Live': 0,
  'Open Now': 1,
  'Batch Ready': 2,
  Waitlist: 3,
};

export function filterAndSortDrops(
  drops: CulinaryDrop[],
  options: DropFilterOptions,
): CulinaryDrop[] {
  const normalizedQuery = options.query.trim().toLowerCase();
  const activeDietary = options.dietaryTags ?? [];

  const filtered = drops.filter((drop) => {
    const matchesCategory =
      options.category === DishCategory.ALL || drop.category === options.category;
    const matchesFlavor = options.flavor === 'all' || drop.flavorTone === options.flavor;
    const matchesDietary =
      activeDietary.length === 0 ||
      activeDietary.every((tag) => drop.dietaryTags.includes(tag));

    if (!matchesCategory || !matchesFlavor || !matchesDietary) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      drop.title,
      drop.dishName,
      drop.collective,
      drop.district,
      drop.category,
      drop.mustOrder,
      drop.flavorLabel,
      drop.dietaryTags.join(' '),
      drop.featuredQuote,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  return [...filtered].sort((a, b) => {
    if (options.sortBy === 'top-rated') {
      return b.score - a.score;
    }
    if (options.sortBy === 'live-now') {
      const rankDiff = LIVE_STATUS_RANK[a.status] - LIVE_STATUS_RANK[b.status];
      return rankDiff !== 0 ? rankDiff : b.score - a.score;
    }
    return a.price - b.price;
  });
}

export function filterPopUpsByNight(
  drops: CulinaryDrop[],
  night: NightWindow,
): CulinaryDrop[] {
  if (night === 'All Nights') {
    return drops;
  }
  return drops.filter((drop) => drop.nightWindow === night);
}

export function filterReviews(
  reviews: MicroReview[],
  options: ReviewFilterOptions,
): MicroReview[] {
  const normalizedQuery = options.query.trim().toLowerCase();

  return reviews.filter((review) => {
    const matchesCategory =
      options.category === DishCategory.ALL || review.category === options.category;
    const matchesScore = review.score >= options.minScore;

    if (!matchesCategory || !matchesScore) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      review.dishName,
      review.venueName,
      review.district,
      review.quote,
      review.mustOrder,
      review.handle,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function calculateRemainingSeats(
  drop: Pick<CulinaryDrop, 'id' | 'totalSeats'>,
  reservations: Reservation[],
): number {
  const booked = reservations
    .filter((res) => res.dropId === drop.id)
    .reduce((sum, res) => sum + res.partySize, 0);
  return Math.max(0, drop.totalSeats - booked);
}

export function validateReviewInput(draft: ReviewDraft): ValidationResult {
  const errors: Record<string, string> = {};

  if (draft.dishName.trim().length < 2) {
    errors.dishName = 'Enter the specific dish name (at least 2 characters).';
  }
  if (draft.venueName.trim().length < 2) {
    errors.venueName = 'Enter the pop-up or kitchen name.';
  }
  if (draft.district.trim().length < 2) {
    errors.district = 'Enter the neighborhood or district.';
  }
  if (Number.isNaN(draft.score) || draft.score < 1 || draft.score > 10) {
    errors.score = 'Score must be between 1.0 and 10.0.';
  }
  if (draft.mustOrder.trim().length < 2) {
    errors.mustOrder = 'Add a must-order item or pairing note.';
  }
  if (draft.quote.trim().length < 12) {
    errors.quote = 'Write a crisp takeaway of at least 12 characters.';
  } else if (draft.quote.trim().length > 180) {
    errors.quote = 'Keep micro-reviews punchy (180 characters max).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateReservationInput(
  draft: ReservationDraft,
  availableSeats: number,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (draft.guestName.trim().length < 2) {
    errors.guestName = 'Enter a guest name for the counter list.';
  }
  if (!draft.timeSlot.trim()) {
    errors.timeSlot = 'Select a seating window.';
  }
  if (draft.partySize < 1 || draft.partySize > 4) {
    errors.partySize = 'Party size must be between 1 and 4 guests.';
  } else if (draft.partySize > availableSeats) {
    errors.partySize =
      availableSeats === 0
        ? 'This drop is currently full.'
        : `Only ${availableSeats} ${availableSeats === 1 ? 'seat' : 'seats'} remaining.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateDropAlertEmail(email: string): ValidationResult {
  const errors: Record<string, string> = {};
  const trimmed = email.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmed) {
    errors.email = 'Enter an email address for tonight’s drop alerts.';
  } else if (!emailPattern.test(trimmed)) {
    errors.email = 'Enter a valid email address (e.g. chef@nightbite.club).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function formatCurrency(amount: number): string {
  return `$${Math.round(amount)}`;
}
