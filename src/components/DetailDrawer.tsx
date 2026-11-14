import { useEffect } from 'react';
import { Bookmark, Clock, MapPin, MessageSquarePlus, Sparkles, X } from 'lucide-react';
import { CulinaryDrop } from '../types/gastronomy';
import { DISH_IMAGES } from '../data/media';
import { DishImage } from './DishImage';
import { formatCurrency, formatScore } from '../utils/discovery';

interface DetailDrawerProps {
  drop: CulinaryDrop | null;
  remainingSeats: number;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (dropId: string) => void;
  onReserve: (drop: CulinaryDrop) => void;
  onWriteReview: (drop: CulinaryDrop) => void;
}

export function DetailDrawer({
  drop,
  remainingSeats,
  isSaved,
  onClose,
  onToggleSave,
  onReserve,
  onWriteReview,
}: DetailDrawerProps) {
  useEffect(() => {
    if (!drop) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drop, onClose]);

  if (!drop) return null;

  const isLive = drop.status === 'Tables Live' || drop.status === 'Open Now' || drop.status === 'Batch Ready';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-drawer-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/[0.1] bg-[#1c1b1b] shadow-[0_12px_40px_-4px_rgba(0,0,0,0.75)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/9] w-full sm:aspect-auto sm:h-[280px]">
          <DishImage
            src={DISH_IMAGES[drop.imageKey]}
            alt={drop.dishName}
            className="h-full w-full"
            scrimClassName="bg-gradient-to-t from-[#1c1b1b] via-[#1c1b1b]/30 to-black/30"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dish details"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#131313]/80 text-white backdrop-blur-md transition-colors hover:border-[#ff5e36] hover:bg-[#2a2a2a]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#ffb4a2]">
                {drop.title} · {drop.collective}
              </p>
              <h2
                id="detail-drawer-title"
                className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                {drop.dishName}
              </h2>
            </div>
            <div className="shrink-0 rounded-2xl border border-white/15 bg-[#131313]/85 px-3.5 py-2 text-right backdrop-blur-md">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#a89f9c]">
                Bite Score
              </span>
              <span className="font-mono text-xl font-bold text-[#ff8a00] tabular-nums">
                {formatScore(drop.score)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#a89f9c]">
            <span
              className={`inline-flex items-center gap-1.5 font-semibold ${
                isLive ? 'text-[#06d6a0]' : 'text-[#ffb77f]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {drop.status}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5 text-[#e5e2e1]">
              <MapPin className="h-3.5 w-3.5 text-[#a89f9c]" aria-hidden="true" />
              {drop.district} ({drop.address})
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#a89f9c]" aria-hidden="true" />
              {drop.nightWindow} · {drop.hours}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-bold text-white tabular-nums">
              {formatCurrency(drop.price)}
            </span>
          </div>

          <p className="text-[15px] leading-relaxed text-[#e5e2e1]/90">{drop.chefNote}</p>

          <p className="text-xs font-semibold text-[#40efb7]">
            Dietary &amp; Mood: {drop.dietaryTags.join(' · ')}
          </p>

          <div className="grid grid-cols-3 gap-4 border-y border-white/[0.08] py-4">
            {[
              { label: 'Execution', value: drop.breakdown.execution, color: 'bg-[#ff5e36]' },
              { label: 'Balance', value: drop.breakdown.balance, color: 'bg-[#06d6a0]' },
              { label: 'Counter Vibe', value: drop.breakdown.vibe, color: 'bg-[#ffb77f]' },
            ].map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-[#a89f9c]">{metric.label}</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {formatScore(metric.value)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
                  <div
                    className={`h-full rounded-full ${metric.color}`}
                    style={{ width: `${Math.min(100, metric.value * 10)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 rounded-2xl bg-[#201f1f] p-4">
            <div className="flex items-center justify-between text-xs text-[#a89f9c]">
              <span className="font-semibold text-white">{drop.featuredHandle}</span>
              <span>Must Order: {drop.mustOrder}</span>
            </div>
            <p className="text-sm leading-relaxed text-[#e5e2e1]">“{drop.featuredQuote}”</p>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onToggleSave(drop.id)}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  isSaved
                    ? 'border-[#ff5e36] bg-[#ff5e36]/15 text-[#ffb4a2]'
                    : 'border-white/[0.12] bg-[#201f1f] text-[#e5e2e1] hover:border-[#ff5e36]'
                }`}
              >
                <Bookmark className="h-4 w-4" aria-hidden="true" />
                <span>{isSaved ? 'Saved' : 'Save Dish'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onWriteReview(drop);
                }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/[0.12] bg-[#201f1f] px-4 py-2 text-sm font-semibold text-[#e5e2e1] whitespace-nowrap transition-colors hover:border-white/30 hover:bg-[#2a2a2a]"
              >
                <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                <span>Add Bite Note</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onReserve(drop);
              }}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-[#ff5e36] to-[#ff8a00] px-5 py-2.5 text-sm font-bold text-white whitespace-nowrap shadow-[0_0_20px_-4px_rgba(255,94,54,0.45)] transition-all hover:brightness-110 active:scale-[0.98]"
            >
              {remainingSeats > 0
                ? `Reserve Seat (${remainingSeats} left)`
                : 'Counter Full'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
