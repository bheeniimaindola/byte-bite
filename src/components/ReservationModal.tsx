import { useEffect, useState, type FormEvent } from 'react';
import { CalendarClock, Users, X } from 'lucide-react';
import { CulinaryDrop, ReservationDraft } from '../types/gastronomy';
import { formatCurrency, validateReservationInput } from '../utils/discovery';

interface ReservationModalProps {
  drop: CulinaryDrop | null;
  availableSeats: number;
  onClose: () => void;
  onConfirm: (drop: CulinaryDrop, draft: ReservationDraft) => void;
}

export function ReservationModal({
  drop,
  availableSeats,
  onClose,
  onConfirm,
}: ReservationModalProps) {
  const [guestName, setGuestName] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [timeSlot, setTimeSlot] = useState('');
  const [dietaryNote, setDietaryNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (drop) {
      setGuestName('');
      setPartySize(Math.min(2, Math.max(1, availableSeats || 1)));
      setTimeSlot(drop.timeSlots[0] ?? '');
      setDietaryNote('');
      setErrors({});
    }
  }, [drop, availableSeats]);

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const draft: ReservationDraft = {
      guestName,
      partySize,
      timeSlot,
      dietaryNote,
    };
    const validation = validateReservationInput(draft, availableSeats);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    onConfirm(drop, draft);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl border border-white/[0.1] bg-[#1c1b1b] p-6 shadow-[0_12px_40px_-4px_rgba(0,0,0,0.75)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#06d6a0]">
              {drop.nightWindow} · {availableSeats} {availableSeats === 1 ? 'seat' : 'seats'} left
            </p>
            <h2
              id="reservation-modal-title"
              className="mt-1 font-display text-xl font-bold text-white"
            >
              Reserve Counter Seats — {drop.title}
            </h2>
            <p className="mt-0.5 text-xs text-[#a89f9c]">
              {drop.dishName} · {formatCurrency(drop.price)} tasting pour
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reservation modal"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#2a2a2a] text-white hover:border-[#ff5e36]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="reservation-guest-name"
              className="block text-xs font-semibold text-[#e5e2e1]"
            >
              Guest Name
            </label>
            <input
              id="reservation-guest-name"
              type="text"
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                if (errors.guestName) setErrors((prev) => ({ ...prev, guestName: '' }));
              }}
              placeholder="e.g. Jordan Park"
              className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#141414] px-3.5 text-sm text-white placeholder:text-white/40 focus:border-[#ff5e36] focus:outline-none focus:ring-3 focus:ring-[#ff5e36]/20"
            />
            {errors.guestName && (
              <p className="mt-1.5 text-xs font-medium text-[#ffb4ab]" role="alert">
                {errors.guestName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#e5e2e1]">
                <Users className="h-3.5 w-3.5 text-[#ff8a00]" aria-hidden="true" />
                Party Size
              </span>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((count) => {
                  const active = partySize === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => {
                        setPartySize(count);
                        if (errors.partySize) setErrors((prev) => ({ ...prev, partySize: '' }));
                      }}
                      className={`min-h-[44px] rounded-xl border font-mono text-sm font-bold tabular-nums transition-colors ${
                        active
                          ? 'border-[#ff5e36] bg-[#ff5e36]/20 text-white'
                          : 'border-white/10 bg-[#141414] text-[#a89f9c] hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>
              {errors.partySize && (
                <p className="mt-1.5 text-xs font-medium text-[#ffb4ab]" role="alert">
                  {errors.partySize}
                </p>
              )}
            </div>

            <div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#e5e2e1]">
                <CalendarClock className="h-3.5 w-3.5 text-[#06d6a0]" aria-hidden="true" />
                Seating Window
              </span>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {drop.timeSlots.map((slot) => {
                  const active = timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setTimeSlot(slot);
                        if (errors.timeSlot) setErrors((prev) => ({ ...prev, timeSlot: '' }));
                      }}
                      className={`min-h-[44px] rounded-xl border font-mono text-xs font-bold tabular-nums transition-colors ${
                        active
                          ? 'border-[#06d6a0] bg-[#06d6a0]/15 text-[#40efb7]'
                          : 'border-white/10 bg-[#141414] text-[#a89f9c] hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.timeSlot && (
                <p className="mt-1.5 text-xs font-medium text-[#ffb4ab]" role="alert">
                  {errors.timeSlot}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="reservation-dietary-note"
              className="block text-xs font-semibold text-[#e5e2e1]"
            >
              Counter / Dietary Note (Optional)
            </label>
            <input
              id="reservation-dietary-note"
              type="text"
              value={dietaryNote}
              onChange={(e) => setDietaryNote(e.target.value)}
              placeholder="e.g. Shellfish allergy, counter seats preferred"
              className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#141414] px-3.5 text-sm text-white placeholder:text-white/40 focus:border-[#ff5e36] focus:outline-none focus:ring-3 focus:ring-[#ff5e36]/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-xl border border-white/12 bg-[#201f1f] px-4 py-2 text-sm font-semibold text-[#e5e2e1] hover:bg-[#2a2a2a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={availableSeats === 0}
              className="min-h-[44px] rounded-xl bg-gradient-to-r from-[#ff5e36] to-[#ff8a00] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_-4px_rgba(255,94,54,0.45)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
