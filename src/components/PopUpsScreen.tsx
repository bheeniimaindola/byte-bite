import { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Users } from 'lucide-react';
import { CulinaryDrop, NightWindow, Reservation } from '../types/gastronomy';
import { DISH_IMAGES } from '../data/media';
import { DishImage } from './DishImage';
import {
  calculateRemainingSeats,
  filterPopUpsByNight,
  formatCurrency,
  formatScore,
} from '../utils/discovery';

interface PopUpsScreenProps {
  drops: CulinaryDrop[];
  reservations: Reservation[];
  onSelectDrop: (drop: CulinaryDrop) => void;
  onReserveDrop: (drop: CulinaryDrop) => void;
}

const NIGHT_WINDOWS: NightWindow[] = ['All Nights', 'Tonight', 'Fri Night', 'Sat Late', 'Sunday'];

export function PopUpsScreen({
  drops,
  reservations,
  onSelectDrop,
  onReserveDrop,
}: PopUpsScreenProps) {
  const [selectedNight, setSelectedNight] = useState<NightWindow>('All Nights');

  const visiblePopUps = filterPopUpsByNight(drops, selectedNight);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-wide text-[#06d6a0]">
            Live Seat Drops
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Underground Pop-Ups &amp; Counter Seats
          </h1>
          <p className="max-w-2xl text-sm text-[#a89f9c]">
            Small-batch chef counters releasing seats nightly. Reserve a window before service
            closes.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter pop-ups by night"
          className="flex items-center gap-2 overflow-x-auto pb-1"
        >
          {NIGHT_WINDOWS.map((night) => {
            const active = selectedNight === night;
            return (
              <button
                key={night}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedNight(night)}
                className={`min-h-[40px] rounded-xl border px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'border-[#06d6a0] bg-[#06d6a0]/15 text-[#40efb7]'
                    : 'border-white/[0.08] bg-[#1c1b1b] text-[#a89f9c] hover:border-white/20 hover:text-white'
                }`}
              >
                {night}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {visiblePopUps.map((drop) => {
          const seatsLeft = calculateRemainingSeats(drop, reservations);
          const isOpen = seatsLeft > 0;

          return (
            <article
              key={drop.id}
              data-testid={`popup-card-${drop.id}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#1c1b1b] sm:flex-row"
            >
              <button
                type="button"
                onClick={() => onSelectDrop(drop)}
                aria-label={`View details for ${drop.title}`}
                className="relative aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:w-48 lg:w-56"
              >
                <DishImage
                  src={DISH_IMAGES[drop.imageKey]}
                  alt={drop.dishName}
                  className="h-full w-full"
                  scrimClassName="bg-gradient-to-t from-[#1c1b1b]/80 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#1c1b1b]/60"
                />
              </button>

              <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        isOpen ? 'text-[#06d6a0]' : 'text-[#ffb77f]'
                      }`}
                    >
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      {isOpen ? drop.status : 'Counter Full'}
                    </span>
                    <span className="font-mono font-bold text-[#ff8a00] tabular-nums">
                      Score {formatScore(drop.score)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectDrop(drop)}
                    className="block text-left"
                  >
                    <h2 className="font-display text-lg font-bold text-white group-hover:text-[#ffb4a2]">
                      {drop.title}
                    </h2>
                  </button>
                  <p className="text-sm font-medium text-[#e5e2e1]">{drop.dishName}</p>

                  <div className="space-y-1 pt-1 text-xs text-[#a89f9c]">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>
                        {drop.district} · {drop.address}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>
                        {drop.nightWindow} · {drop.hours}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Seatings: {drop.timeSlots.join(' / ')}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] pt-3.5">
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="h-3.5 w-3.5 text-[#40efb7]" aria-hidden="true" />
                    <span className="font-mono font-bold text-white tabular-nums">
                      {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
                    </span>
                    <span className="text-[#a89f9c]" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-mono text-[#e5e2e1] tabular-nums">
                      {formatCurrency(drop.price)}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={!isOpen}
                    onClick={() => onReserveDrop(drop)}
                    className="min-h-[40px] rounded-xl bg-gradient-to-r from-[#ff5e36] to-[#ff8a00] px-4 py-2 text-xs font-bold text-white whitespace-nowrap transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isOpen ? 'Reserve Seat' : 'Sold Out'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
