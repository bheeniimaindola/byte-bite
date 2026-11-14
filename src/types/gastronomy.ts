export enum ScreenTab {
  DISCOVER = 'discover',
  POPUPS = 'popups',
  REVIEWS = 'reviews',
  SAVED = 'saved',
}

export enum DishCategory {
  ALL = 'All Drops',
  OPEN_FIRE = 'Open Fire',
  RAW_CRUDO = 'Raw & Crudo',
  LATE_NOODLE = 'Late Noodle',
  NATURAL_WINE = 'Natural Wine',
  PASTRY_DROPS = 'Pastry Drops',
}

export type FlavorTone = 'ember' | 'mint' | 'amber' | 'coral';

export type DietaryTag =
  | 'Vegan Friendly'
  | 'Gluten Free'
  | 'Late Night Cravings'
  | 'Dairy Free';

export type DropStatus = 'Tables Live' | 'Batch Ready' | 'Open Now' | 'Waitlist';

export type NightWindow = 'All Nights' | 'Tonight' | 'Fri Night' | 'Sat Late' | 'Sunday';

export type SortMode = 'top-rated' | 'live-now' | 'price-low';

export interface ScoreBreakdown {
  execution: number;
  balance: number;
  vibe: number;
}

export interface CulinaryDrop {
  id: string;
  title: string;
  dishName: string;
  collective: string;
  district: string;
  address: string;
  category: Exclude<DishCategory, DishCategory.ALL>;
  flavorTone: FlavorTone;
  flavorLabel: string;
  dietaryTags: DietaryTag[];
  status: DropStatus;
  nightWindow: Exclude<NightWindow, 'All Nights'>;
  hours: string;
  price: number;
  score: number;
  breakdown: ScoreBreakdown;
  totalSeats: number;
  timeSlots: string[];
  mustOrder: string;
  chefNote: string;
  featuredHandle: string;
  featuredQuote: string;
  imageKey: 'octopus' | 'uni' | 'duck' | 'noodle' | 'mille' | 'crudo';
  isHero?: boolean;
}

export interface MicroReview {
  id: string;
  dropId?: string;
  handle: string;
  initials: string;
  avatarTone: FlavorTone;
  dishName: string;
  venueName: string;
  district: string;
  category: Exclude<DishCategory, DishCategory.ALL>;
  score: number;
  quote: string;
  mustOrder: string;
  timestamp: string;
  helpfulCount: number;
  isUserPost?: boolean;
}

export interface Reservation {
  id: string;
  dropId: string;
  venueTitle: string;
  dishName: string;
  district: string;
  nightWindow: Exclude<NightWindow, 'All Nights'>;
  timeSlot: string;
  partySize: number;
  guestName: string;
  dietaryNote: string;
  createdAt: string;
}

export interface ReviewDraft {
  dishName: string;
  venueName: string;
  district: string;
  category: Exclude<DishCategory, DishCategory.ALL>;
  score: number;
  mustOrder: string;
  quote: string;
}

export interface ReservationDraft {
  guestName: string;
  partySize: number;
  timeSlot: string;
  dietaryNote: string;
}
