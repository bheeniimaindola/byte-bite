import { useState } from 'react';
import { Flame, Plus, Search, ThumbsUp } from 'lucide-react';
import { DishCategory, MicroReview } from '../types/gastronomy';
import { filterReviews, formatScore } from '../utils/discovery';

interface ReviewsScreenProps {
  reviews: MicroReview[];
  helpfulReviewIds: string[];
  onToggleHelpful: (reviewId: string) => void;
  onOpenPostReview: () => void;
}

const CATEGORIES = [
  DishCategory.ALL,
  DishCategory.OPEN_FIRE,
  DishCategory.RAW_CRUDO,
  DishCategory.LATE_NOODLE,
  DishCategory.NATURAL_WINE,
  DishCategory.PASTRY_DROPS,
];

const AVATAR_STYLES: Record<MicroReview['avatarTone'], string> = {
  ember: 'bg-[#ff5e36]/20 text-[#ffb4a2] border-[#ff5e36]/40',
  mint: 'bg-[#06d6a0]/20 text-[#40efb7] border-[#06d6a0]/40',
  amber: 'bg-[#ff8a00]/20 text-[#ffb77f] border-[#ff8a00]/40',
  coral: 'bg-[#ffb4a2]/20 text-[#ffdad2] border-[#ffb4a2]/40',
};

export function ReviewsScreen({
  reviews,
  helpfulReviewIds,
  onToggleHelpful,
  onOpenPostReview,
}: ReviewsScreenProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<DishCategory>(DishCategory.ALL);
  const [highScoreOnly, setHighScoreOnly] = useState(false);

  const visibleReviews = filterReviews(reviews, {
    query,
    category,
    minScore: highScoreOnly ? 9.3 : 0,
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-wide text-[#ffb77f]">
            Dish-Level Critique
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Micro-Reviews
          </h1>
          <p className="max-w-2xl text-sm text-[#a89f9c]">
            Single-sentence dish takeaways from tonight’s counters. Zero filler—just texture,
            balance, and what to order.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPostReview}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff5e36] to-[#ff8a00] px-5 py-2.5 text-sm font-bold text-white whitespace-nowrap shrink-0 shadow-[0_0_20px_-4px_rgba(255,94,54,0.45)] transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Write Bite Note</span>
        </button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            aria-hidden="true"
          />
          <label htmlFor="reviews-search" className="sr-only">
            Search micro-reviews
          </label>
          <input
            id="reviews-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dish, handle, or must-order..."
            className="h-11 w-full rounded-xl border border-white/10 bg-[#141414] pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[#ff5e36] focus:outline-none focus:ring-3 focus:ring-[#ff5e36]/20"
          />
        </div>

        <button
          type="button"
          aria-pressed={highScoreOnly}
          onClick={() => setHighScoreOnly((prev) => !prev)}
          className={`inline-flex min-h-[40px] items-center gap-2 self-start rounded-xl border px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors lg:self-auto ${
            highScoreOnly
              ? 'border-[#ff8a00] bg-[#ff8a00]/15 text-[#ffb77f]'
              : 'border-white/10 bg-[#1c1b1b] text-[#a89f9c] hover:text-white'
          }`}
        >
          <Flame className="h-3.5 w-3.5" aria-hidden="true" />
          <span>9.3+ Standouts Only</span>
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Filter micro-reviews by category"
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(cat)}
              className={`min-h-[40px] rounded-xl border px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'border-[#ff5e36] bg-[#ff5e36]/15 text-white'
                  : 'border-white/[0.08] bg-[#1c1b1b] text-[#a89f9c] hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {visibleReviews.length === 0 ? (
        <div className="rounded-3xl border border-white/[0.08] bg-[#1c1b1b] p-12 text-center">
          <p className="font-display text-lg font-bold text-white">No matching bite notes</p>
          <p className="mt-1 text-sm text-[#a89f9c]">
            Adjust the score filter or be the first to log this dish.
          </p>
        </div>
      ) : (
        <div
          data-testid="reviews-grid"
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {visibleReviews.map((review) => {
            const upvoted = helpfulReviewIds.includes(review.id);
            const count = review.helpfulCount + (upvoted ? 1 : 0);

            return (
              <article
                key={review.id}
                className="flex flex-col justify-between gap-4 rounded-3xl border border-white/[0.08] bg-[#1c1b1b] p-5"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-bold ${
                          AVATAR_STYLES[review.avatarTone]
                        }`}
                        aria-hidden="true"
                      >
                        {review.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{review.handle}</p>
                        <p className="text-[11px] text-[#a89f9c]">
                          {review.district} · {review.timestamp}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#201f1f] px-2.5 py-1">
                      <Flame className="h-3.5 w-3.5 text-[#ff5e36]" aria-hidden="true" />
                      <span className="font-mono text-xs font-bold text-white tabular-nums">
                        {formatScore(review.score)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-display text-base font-bold text-white">
                      {review.dishName}
                    </h2>
                    <p className="text-xs text-[#a89f9c]">
                      {review.venueName} · {review.category}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-[#e5e2e1]">“{review.quote}”</p>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] pt-3.5">
                  <span className="truncate text-xs font-semibold text-[#ffb4a2]">
                    Must Order: {review.mustOrder}
                  </span>

                  <button
                    type="button"
                    onClick={() => onToggleHelpful(review.id)}
                    aria-pressed={upvoted}
                    aria-label={`Mark review of ${review.dishName} helpful (${count})`}
                    className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      upvoted
                        ? 'border-[#06d6a0] bg-[#06d6a0]/15 text-[#40efb7]'
                        : 'border-white/10 bg-[#201f1f] text-[#a89f9c] hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="font-mono tabular-nums">{count}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
