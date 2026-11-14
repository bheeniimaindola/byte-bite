import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRemainingSeats,
  filterAndSortDrops,
  filterPopUpsByNight,
  filterReviews,
  formatCurrency,
  formatScore,
  validateDropAlertEmail,
  validateReservationInput,
  validateReviewInput,
} from './discovery';
import {
  CulinaryDrop,
  DishCategory,
  MicroReview,
  Reservation,
} from '../types/gastronomy';

const SAMPLE_DROPS: CulinaryDrop[] = [
  {
    id: 'drop-1',
    title: 'Kuroshio Smoke Counter',
    dishName: 'Binchotan Charred Octopus & Yuzu Tare',
    collective: 'Chef Kenji Sato',
    district: 'Arts District',
    address: '418 Mateo Alley, Rear Door',
    category: DishCategory.OPEN_FIRE,
    flavorTone: 'ember',
    flavorLabel: 'Ember & Char',
    dietaryTags: ['Gluten Free', 'Dairy Free', 'Late Night Cravings'],
    status: 'Tables Live',
    nightWindow: 'Tonight',
    hours: '20:00 – 01:30',
    price: 34,
    score: 9.6,
    breakdown: { execution: 9.8, balance: 9.5, vibe: 9.5 },
    totalSeats: 8,
    timeSlots: ['21:30', '22:45', '00:00'],
    mustOrder: 'Charred Octopus + Smoked Sansho Highball',
    chefNote: 'Three-hour kombu braise finished over white binchotan.',
    featuredHandle: '@mira.eats',
    featuredQuote: 'Blistered suckers snap cleanly into silky yuzu-slicked tenderness.',
    imageKey: 'octopus',
    isHero: true,
  },
  {
    id: 'drop-2',
    title: 'Nori & Tide Bar',
    dishName: 'Hokkaido Uni & Ikura Temaki',
    collective: 'Tide Collective',
    district: 'Silver Lake',
    address: '2912 Sunset Garage B',
    category: DishCategory.RAW_CRUDO,
    flavorTone: 'mint',
    flavorLabel: 'Acid & Brine',
    dietaryTags: ['Gluten Free', 'Dairy Free'],
    status: 'Open Now',
    nightWindow: 'Tonight',
    hours: '19:30 – 00:30',
    price: 26,
    score: 9.4,
    breakdown: { execution: 9.6, balance: 9.4, vibe: 9.2 },
    totalSeats: 6,
    timeSlots: ['20:30', '22:00'],
    mustOrder: 'Double Uni Handroll',
    chefNote: 'Warm akazu rice wrapped in toasted Ariake nori.',
    featuredHandle: '@devon.k',
    featuredQuote: 'Sea-sweet uni melts straight into warm vinegared rice and shatter-crisp nori.',
    imageKey: 'uni',
  },
  {
    id: 'drop-3',
    title: 'Lantern & Bone',
    dishName: 'Chili Oil Crab Biang-Biang',
    collective: 'Xiao Night Kitchen',
    district: 'Chinatown',
    address: '742 Bamboo Plaza',
    category: DishCategory.LATE_NOODLE,
    flavorTone: 'amber',
    flavorLabel: 'Umami & Heat',
    dietaryTags: ['Vegan Friendly', 'Late Night Cravings'],
    status: 'Waitlist',
    nightWindow: 'Fri Night',
    hours: '21:00 – 02:30',
    price: 22,
    score: 9.1,
    breakdown: { execution: 9.2, balance: 9.0, vibe: 9.1 },
    totalSeats: 4,
    timeSlots: ['22:30', '23:45'],
    mustOrder: 'Hand-Pulled Crab Noodles',
    chefNote: 'Fresh Dungeness crab folded into 48-hour roasted chili oil.',
    featuredHandle: '@noodle_club',
    featuredQuote: 'Chewy belt noodles hold pools of toasted garlic chili oil and sweet crab.',
    imageKey: 'noodle',
  },
];

const SAMPLE_REVIEWS: MicroReview[] = [
  {
    id: 'rev-1',
    dropId: 'drop-1',
    handle: '@mira.eats',
    initials: 'ME',
    avatarTone: 'ember',
    dishName: 'Binchotan Charred Octopus',
    venueName: 'Kuroshio Smoke Counter',
    district: 'Arts District',
    category: DishCategory.OPEN_FIRE,
    score: 9.6,
    quote: 'Blistered suckers snap cleanly into silky yuzu-slicked tenderness.',
    mustOrder: 'Charred Octopus',
    timestamp: '18m ago',
    helpfulCount: 24,
  },
  {
    id: 'rev-2',
    dropId: 'drop-3',
    handle: '@noodle_club',
    initials: 'NC',
    avatarTone: 'amber',
    dishName: 'Chili Oil Crab Biang-Biang',
    venueName: 'Lantern & Bone',
    district: 'Chinatown',
    category: DishCategory.LATE_NOODLE,
    score: 8.8,
    quote: 'Serious Sichuan peppercorn hum balanced by sweet lump crab.',
    mustOrder: 'Crab Biang-Biang',
    timestamp: '1h ago',
    helpfulCount: 11,
  },
];

test('filterAndSortDrops filters by query, category, and flavor and sorts accurately', () => {
  const byQuery = filterAndSortDrops(SAMPLE_DROPS, {
    query: 'octopus',
    category: DishCategory.ALL,
    flavor: 'all',
    sortBy: 'top-rated',
  });
  assert.equal(byQuery.length, 1);
  assert.equal(byQuery[0].id, 'drop-1');

  const byFlavor = filterAndSortDrops(SAMPLE_DROPS, {
    query: '',
    category: DishCategory.ALL,
    flavor: 'mint',
    sortBy: 'top-rated',
  });
  assert.equal(byFlavor.length, 1);
  assert.equal(byFlavor[0].id, 'drop-2');

  const byPriceLow = filterAndSortDrops(SAMPLE_DROPS, {
    query: '',
    category: DishCategory.ALL,
    flavor: 'all',
    sortBy: 'price-low',
  });
  assert.deepEqual(
    byPriceLow.map((d) => d.id),
    ['drop-3', 'drop-2', 'drop-1'],
  );

  const bySingleDietary = filterAndSortDrops(SAMPLE_DROPS, {
    query: '',
    category: DishCategory.ALL,
    flavor: 'all',
    dietaryTags: ['Vegan Friendly'],
    sortBy: 'top-rated',
  });
  assert.deepEqual(
    bySingleDietary.map((d) => d.id),
    ['drop-3'],
  );

  const byMultiDietary = filterAndSortDrops(SAMPLE_DROPS, {
    query: '',
    category: DishCategory.ALL,
    flavor: 'all',
    dietaryTags: ['Gluten Free', 'Late Night Cravings'],
    sortBy: 'top-rated',
  });
  assert.deepEqual(
    byMultiDietary.map((d) => d.id),
    ['drop-1'],
  );
});

test('filterPopUpsByNight returns matching night window', () => {
  const tonight = filterPopUpsByNight(SAMPLE_DROPS, 'Tonight');
  assert.equal(tonight.length, 2);
  const all = filterPopUpsByNight(SAMPLE_DROPS, 'All Nights');
  assert.equal(all.length, 3);
});

test('filterReviews respects score threshold and query', () => {
  const highOnly = filterReviews(SAMPLE_REVIEWS, {
    query: '',
    category: DishCategory.ALL,
    minScore: 9.0,
  });
  assert.equal(highOnly.length, 1);
  assert.equal(highOnly[0].id, 'rev-1');
});

test('calculateRemainingSeats subtracts reservations accurately and floors at zero', () => {
  const reservations: Reservation[] = [
    {
      id: 'res-1',
      dropId: 'drop-1',
      venueTitle: 'Kuroshio Smoke Counter',
      dishName: 'Binchotan Charred Octopus & Yuzu Tare',
      district: 'Arts District',
      nightWindow: 'Tonight',
      timeSlot: '21:30',
      partySize: 3,
      guestName: 'Alex',
      dietaryNote: '',
      createdAt: '2026-11-14T20:00:00Z',
    },
    {
      id: 'res-2',
      dropId: 'drop-1',
      venueTitle: 'Kuroshio Smoke Counter',
      dishName: 'Binchotan Charred Octopus & Yuzu Tare',
      district: 'Arts District',
      nightWindow: 'Tonight',
      timeSlot: '22:45',
      partySize: 2,
      guestName: 'Sam',
      dietaryNote: '',
      createdAt: '2026-11-14T20:10:00Z',
    },
  ];
  assert.equal(calculateRemainingSeats(SAMPLE_DROPS[0], reservations), 3);
  assert.equal(calculateRemainingSeats(SAMPLE_DROPS[1], reservations), 6);
});

test('validateReviewInput rejects empty or out-of-range fields and accepts valid input', () => {
  const invalid = validateReviewInput({
    dishName: '',
    venueName: 'A',
    district: '',
    category: DishCategory.OPEN_FIRE,
    score: 11,
    mustOrder: '',
    quote: 'Too short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.dishName);
  assert.ok(invalid.errors.score);
  assert.ok(invalid.errors.quote);

  const valid = validateReviewInput({
    dishName: 'Charred Cabbage',
    venueName: 'Ember Alley',
    district: 'Echo Park',
    category: DishCategory.OPEN_FIRE,
    score: 9.3,
    mustOrder: 'Smoked Bone Marrow Butter',
    quote: 'Deeply caramelized leaves with crisp edges and bright fermented chili.',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('validateReservationInput blocks overbooking and empty guest names', () => {
  const overbooked = validateReservationInput(
    {
      guestName: 'Maya Lin',
      partySize: 4,
      timeSlot: '21:30',
      dietaryNote: '',
    },
    2,
  );
  assert.equal(overbooked.valid, false);
  assert.match(overbooked.errors.partySize, /Only 2 seats remaining/);

  const valid = validateReservationInput(
    {
      guestName: 'Maya Lin',
      partySize: 2,
      timeSlot: '21:30',
      dietaryNote: 'No shellfish',
    },
    2,
  );
  assert.equal(valid.valid, true);
});

test('validateDropAlertEmail and formatters work accurately', () => {
  assert.equal(validateDropAlertEmail('').valid, false);
  assert.equal(validateDropAlertEmail('bad-email').valid, false);
  assert.equal(validateDropAlertEmail('chef@nightbite.club').valid, true);
  assert.equal(formatScore(9.56), '9.6');
  assert.equal(formatCurrency(34.2), '$34');
});
