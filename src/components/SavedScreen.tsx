import { Bookmark, CalendarCheck2, Compass, Trash2 } from 'lucide-react';
import { CulinaryDrop, MicroReview, Reservation, ScreenTab } from '../types/gastronomy';
import { DISH_IMAGES } from '../data/media';
import { DishImage } from './DishImage';
import { formatCurrency, formatScore } from '../utils/discovery';

interface SavedScreenProps {
  drops: CulinaryDrop[];
  savedIds: string[];
  reservations: Reservation[];
  userReviews: MicroReview[];
  onToggleSave: (dropId: string) => void;
  onCancelReservation: (reservationId: string) => void;
  onSelectDrop: (drop: CulinaryDrop) => void;
  onNavigate: (screen: ScreenTab) => void;
}

export function SavedScreen({
  drops,
  savedIds,
  reservations,
  userReviews,
  onToggleSave,
  onCancelReservation,
  onSelectDrop,
  onNavigate,
}: SavedScreenProps) {
  const savedDrops = drops.filter((drop) => savedIds.includes(drop.id));

  return (
    <div className="space-y-10 pb-12">
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <p className="text-xs font-bold tracking-wide text-[#ffb4a2]">
          Personal Lineup
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Saved Dishes &amp; Seat Reservations
        </h1>
        <p className="max-w-2xl text-sm text-[#a89f9c]">
          Your bookmarked counters, confirmed seat drops, and published bite notes stay synced in
          this browser.
        </p>
      </div>

      <section aria-label="Confirmed seat reservations" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-white">
            Confirmed Reservations ({reservations.length})
          </h2>
          <button
            type="button"
            onClick={() => onNavigate(ScreenTab.POPUPS)}
            className="text-xs font-semibold text-[#06d6a0] hover:underline"
          >
            Browse Pop-Ups
          </button>
        </div>

        {reservations.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-[#1c1b1b] p-8 text-center">
            <CalendarCheck2 className="mx-auto h-7 w-7 text-[#a89f9c]" aria-hidden="true" />
            <p className="mt-3 font-display text-base font-bold text-white">
              No active counter reservations
            </p>
            <p className="mt-1 text-xs text-[#a89f9c]">
              Claim a seat from tonight’s underground pop-up drops.
            </p>
          </div>
        ) : (
          <div data-testid="reservations-list" className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="flex flex-col justify-between gap-4 rounded-3xl border border-[#06d6a0]/30 bg-[#1c1b1b] p-5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#06d6a0]">Confirmed Seat Drop</span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {res.nightWindow} · {res.timeSlot}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{res.venueTitle}</h3>
                  <p className="text-sm text-[#e5e2e1]">{res.dishName}</p>
                  <p className="text-xs text-[#a89f9c]">
                    {res.district} · Guest: {res.guestName} · Party of {res.partySize}
                    {res.dietaryNote ? ` · ${res.dietaryNote}` : ''}
                  </p>
                </div>

                <div className="flex justify-end border-t border-white/[0.08] pt-3">
                  <button
                    type="button"
                    onClick={() => onCancelReservation(res.id)}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/10 bg-[#201f1f] px-3.5 py-1.5 text-xs font-semibold text-[#ffb4ab] hover:border-[#ffb4ab]/50 hover:bg-[#2a2a2a]"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section aria-label="Saved dishes" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-white">
            Bookmarked Drops ({savedDrops.length})
          </h2>
          <button
            type="button"
            onClick={() => onNavigate(ScreenTab.DISCOVER)}
            className="text-xs font-semibold text-[#ff8a00] hover:underline"
          >
            Back to Discover
          </button>
        </div>

        {savedDrops.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-[#1c1b1b] p-10 text-center">
            <Compass className="mx-auto h-7 w-7 text-[#ff5e36]" aria-hidden="true" />
            <p className="mt-3 font-display text-base font-bold text-white">
              Your bookmark list is empty
            </p>
            <p className="mt-1 text-xs text-[#a89f9c]">
              Tap the bookmark icon on any dish in Discover to save it for later tonight.
            </p>
            <button
              type="button"
              onClick={() => onNavigate(ScreenTab.DISCOVER)}
              className="mt-4 min-h-[40px] rounded-xl bg-gradient-to-r from-[#ff5e36] to-[#ff8a00] px-4 py-2 text-xs font-bold text-white"
            >
              Explore Drops
            </button>
          </div>
        ) : (
          <div
            data-testid="saved-drops-list"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {savedDrops.map((drop) => (
              <article
                key={drop.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#1c1b1b]"
              >
                <button
                  type="button"
                  onClick={() => onSelectDrop(drop)}
                  className="relative aspect-[16/10] w-full text-left"
                >
                  <DishImage
                    src={DISH_IMAGES[drop.imageKey]}
                    alt={drop.dishName}
                    className="h-full w-full"
                  />
                </button>
                <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#a89f9c]">
                      <span>
                        {drop.title} · {drop.district}
                      </span>
                      <span className="font-mono font-bold text-[#ff8a00] tabular-nums">
                        {formatScore(drop.score)}
                      </span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-white">
                      {drop.dishName}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-[#a89f9c] tabular-nums">
                      {drop.hours} · {formatCurrency(drop.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
                    <button
                      type="button"
                      onClick={() => onSelectDrop(drop)}
                      className="min-h-[38px] rounded-xl border border-white/10 bg-[#201f1f] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2a2a2a]"
                    >
                      Open Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleSave(drop.id)}
                      aria-label={`Remove ${drop.dishName} from saved`}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#ff5e36]/40 bg-[#ff5e36]/15 px-3 py-1.5 text-xs font-semibold text-[#ffb4a2] hover:bg-[#ff5e36]/25"
                    >
                      <Bookmark className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {userReviews.length > 0 && (
        <section aria-label="Your published bite notes" className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white">
            Your Bite Notes ({userReviews.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {userReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-white/[0.08] bg-[#1c1b1b] p-5"
              >
                <div className="flex items-center justify-between text-xs text-[#a89f9c]">
                  <span>
                    {review.venueName} · {review.district}
                  </span>
                  <span className="font-mono font-bold text-[#ff8a00] tabular-nums">
                    {formatScore(review.score)}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-base font-bold text-white">
                  {review.dishName}
                </h3>
                <p className="mt-2 text-sm text-[#e5e2e1]">“{review.quote}”</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
