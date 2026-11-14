import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { CulinaryDrop, DishCategory, ReviewDraft } from '../types/gastronomy';
import { formatScore, validateReviewInput } from '../utils/discovery';

interface PostReviewModalProps {
  isOpen: boolean;
  prefillDrop: CulinaryDrop | null;
  onClose: () => void;
  onSubmit: (draft: ReviewDraft, dropId?: string) => void;
}

const REVIEW_CATEGORIES = [
  DishCategory.OPEN_FIRE,
  DishCategory.RAW_CRUDO,
  DishCategory.LATE_NOODLE,
  DishCategory.NATURAL_WINE,
  DishCategory.PASTRY_DROPS,
];

export function PostReviewModal({
  isOpen,
  prefillDrop,
  onClose,
  onSubmit,
}: PostReviewModalProps) {
  const [dishName, setDishName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState<Exclude<DishCategory, DishCategory.ALL>>(
    DishCategory.OPEN_FIRE,
  );
  const [score, setScore] = useState(9.2);
  const [mustOrder, setMustOrder] = useState('');
  const [quote, setQuote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    setDishName(prefillDrop ? prefillDrop.dishName : '');
    setVenueName(prefillDrop ? prefillDrop.title : '');
    setDistrict(prefillDrop ? prefillDrop.district : '');
    setCategory(prefillDrop ? prefillDrop.category : DishCategory.OPEN_FIRE);
    setScore(9.2);
    setMustOrder(prefillDrop ? prefillDrop.mustOrder : '');
    setQuote('');
    setErrors({});
  }, [isOpen, prefillDrop]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const draft: ReviewDraft = {
      dishName,
      venueName,
      district,
      category,
      score,
      mustOrder,
      quote,
    };
    const validation = validateReviewInput(draft);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    onSubmit(draft, prefillDrop?.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-review-title"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-white/[0.1] bg-[#1c1b1b] p-6 shadow-[0_12px_40px_-4px_rgba(0,0,0,0.75)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#ff8a00]">Dish-Level Micro-Review</p>
            <h2 id="post-review-title" className="mt-1 font-display text-xl font-bold text-white">
              Post a Bite Note
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close post review modal"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#2a2a2a] text-white hover:border-[#ff5e36]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="review-dish-name" className="block text-xs font-semibold text-[#e5e2e1]">
                Dish Name
              </label>
              <input
                id="review-dish-name"
                type="text"
                value={dishName}
                onChange={(e) => {
                  setDishName(e.target.value);
                  if (errors.dishName) setErrors((prev) => ({ ...prev, dishName: '' }));
                }}
                placeholder="e.g. Charred Cabbage & Bone Marrow"
                className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#141414] px-3.5 text-sm text-white placeholder:text-white/40 focus:border-[#ff5e36] focus:outline-none focus:ring-3 focus:ring-[#ff5e36]/20"
              />
              {errors.dishName && (
                <p className="mt-1 text-xs font-medium text-[#ffb4ab]" role="alert">
                  {errors.dishName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="review-venue-name" className="block text-xs font-semibold text-[#e5e2e1]">
                Pop-Up / Counter
              </label>
              <input
                id="review-venue-name"
                type="text"
                value={venueName}
                onChange={(e) => {
                  setVenueName(e.target.value);
                  if (errors.venueName) setErrors((prev) => ({ ...prev, venueName: '' }));
                }}
                placeholder="e.g. Kuroshio Smoke Counter"
                className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#141414] px-3.5 text-sm text-white placeholder:text-white/40 focus:border-[#ff5e36] focus:outline-none focus:ring-3 focus:ring-[#ff5e36]/20"
              />
              {errors.venueName && (
                <p className="mt-1 text-xs font-medium text-[#ffb4ab]" role="alert">
                  {errors.venueName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="review-district" className="block text-xs font-semibold text-[#e5e2e1]">
                District
              </label>
              <input
                id="review-district"
                type="text"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  if (errors.district) setErrors((prev) => ({ ...prev, district: '' }));
                }}
                placeholder="e.g. Arts District"
                className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#141414] px-3.5 text-sm text-white placeholder:text-white/40 focus:border-[#ff5e36] focus:outline-none focus:ring-3 focus:ring-[#ff5e36]/20"
              />
              {errors.district && (
                <p className="mt-1 text-xs font-medium text-[#ffb4ab]" role="alert">
                  {errors.district}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="review-category" className="block text-xs font-semibold text-[#e5e2e1]">
                Category
              </label>
              <select
                id="review-category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Exclude<DishCategory, DishCategory.ALL>)
                }
                className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#141414] px-3.5 text-sm text-white focus:border-[#ff5e36] focus:outline-none focus:ring-3 focus:ring-[#ff5e36]/20"
              >
                {REVIEW_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-[#201f1f] p-4">
            <div className="flex items-center justify-between">
              <label htmlFor="review-score" className="text-xs font-semibold text-[#e5e2e1]">
                Bite Score
              </label>
              <span className="font-mono text-lg font-bold text-[#ff8a00] tabular-nums">
                {formatScore(score)} / 10
              </span>
            </div>
            <input
              id="review-score"
              type="range"
              min="5"
              max="10"
              step="0.1"
              value={score}
              onChange={(e) => setScore(parseFloat(e.target.value))}
              className="mt-2 w-full accent-[#ff5e36]"
            />
          </div>

          <div>
            <label htmlFor="review-must-order" className="block text-xs font-semibold text-[#e5e2e1]">
              Must Order Highlight
            </label>
            <input
              id="review-must-order"
              type="text"
              value={mustOrder}
              onChange={(e) => {
                setMustOrder(e.target.value);
                if (errors.mustOrder) setErrors((prev) => ({ ...prev, mustOrder: '' }));
              }}
              placeholder="e.g. Charred Octopus + Yuzu Tare"
              className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#141414] px-3.5 text-sm text-white placeholder:text-white/40 focus:border-[#ff5e36] focus:outline-none focus:ring-3 focus:ring-[#ff5e36]/20"
            />
            {errors.mustOrder && (
              <p className="mt-1 text-xs font-medium text-[#ffb4ab]" role="alert">
                {errors.mustOrder}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="review-quote" className="block text-xs font-semibold text-[#e5e2e1]">
                Single-Sentence Critique
              </label>
              <span className="font-mono text-[11px] text-[#a89f9c] tabular-nums">
                {quote.length}/180
              </span>
            </div>
            <textarea
              id="review-quote"
              rows={3}
              maxLength={180}
              value={quote}
              onChange={(e) => {
                setQuote(e.target.value);
                if (errors.quote) setErrors((prev) => ({ ...prev, quote: '' }));
              }}
              placeholder="Crisp texture, seasoning balance, and heat in one sharp line."
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141414] p-3.5 text-sm text-white placeholder:text-white/40 focus:border-[#ff5e36] focus:outline-none focus:ring-3 focus:ring-[#ff5e36]/20"
            />
            {errors.quote && (
              <p className="mt-1 text-xs font-medium text-[#ffb4ab]" role="alert">
                {errors.quote}
              </p>
            )}
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
              className="min-h-[44px] rounded-xl bg-gradient-to-r from-[#ff5e36] to-[#ff8a00] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_-4px_rgba(255,94,54,0.45)] transition-all hover:brightness-110"
            >
              Publish Bite Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
