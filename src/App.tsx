import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import {
  CulinaryDrop,
  MicroReview,
  Reservation,
  ReservationDraft,
  ReviewDraft,
  ScreenTab,
} from './types/gastronomy';
import {
  INITIAL_DROPS,
  INITIAL_RESERVATIONS,
  INITIAL_REVIEWS,
  INITIAL_SAVED_IDS,
} from './data/seedData';
import { calculateRemainingSeats } from './utils/discovery';
import { TopNav } from './components/TopNav';
import { DiscoverScreen } from './components/DiscoverScreen';
import { PopUpsScreen } from './components/PopUpsScreen';
import { ReviewsScreen } from './components/ReviewsScreen';
import { SavedScreen } from './components/SavedScreen';
import { DetailDrawer } from './components/DetailDrawer';
import { ReservationModal } from './components/ReservationModal';
import { PostReviewModal } from './components/PostReviewModal';

const STORAGE_KEYS = {
  saved: 'nightbite_saved_ids_v1',
  reservations: 'nightbite_reservations_v1',
  reviews: 'nightbite_reviews_v1',
  helpful: 'nightbite_helpful_ids_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenTab>(ScreenTab.DISCOVER);
  const [drops] = useState<CulinaryDrop[]>(INITIAL_DROPS);

  const [savedIds, setSavedIds] = useState<string[]>(() =>
    readStorage(STORAGE_KEYS.saved, INITIAL_SAVED_IDS),
  );
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    readStorage(STORAGE_KEYS.reservations, INITIAL_RESERVATIONS),
  );
  const [reviews, setReviews] = useState<MicroReview[]>(() =>
    readStorage(STORAGE_KEYS.reviews, INITIAL_REVIEWS),
  );
  const [helpfulReviewIds, setHelpfulReviewIds] = useState<string[]>(() =>
    readStorage(STORAGE_KEYS.helpful, []),
  );

  const [selectedDrop, setSelectedDrop] = useState<CulinaryDrop | null>(null);
  const [reserveTarget, setReserveTarget] = useState<CulinaryDrop | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewPrefillDrop, setReviewPrefillDrop] = useState<CulinaryDrop | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(savedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.reservations, JSON.stringify(reservations));
    } catch {
      // Ignore storage quota errors
    }
  }, [reservations]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews));
    } catch {
      // Ignore storage quota errors
    }
  }, [reviews]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.helpful, JSON.stringify(helpfulReviewIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [helpfulReviewIds]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleToggleSave = (dropId: string) => {
    setSavedIds((prev) =>
      prev.includes(dropId) ? prev.filter((id) => id !== dropId) : [...prev, dropId],
    );
  };

  const handleConfirmReservation = (drop: CulinaryDrop, draft: ReservationDraft) => {
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      dropId: drop.id,
      venueTitle: drop.title,
      dishName: drop.dishName,
      district: drop.district,
      nightWindow: drop.nightWindow,
      timeSlot: draft.timeSlot,
      partySize: draft.partySize,
      guestName: draft.guestName.trim(),
      dietaryNote: draft.dietaryNote.trim(),
      createdAt: new Date().toISOString(),
    };

    setReservations((prev) => [newReservation, ...prev]);
    setToastMessage(
      `Confirmed ${draft.partySize} ${draft.partySize === 1 ? 'seat' : 'seats'} at ${drop.title} (${draft.timeSlot})`,
    );
  };

  const handleCancelReservation = (reservationId: string) => {
    setReservations((prev) => prev.filter((item) => item.id !== reservationId));
    setToastMessage('Reservation cancelled and seats released.');
  };

  const handleToggleHelpful = (reviewId: string) => {
    setHelpfulReviewIds((prev) =>
      prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId],
    );
  };

  const handleOpenPostReview = (prefill: CulinaryDrop | null = null) => {
    setReviewPrefillDrop(prefill);
    setReviewModalOpen(true);
  };

  const handlePublishReview = (draft: ReviewDraft, dropId?: string) => {
    const newReview: MicroReview = {
      id: `rev-${Date.now()}`,
      dropId,
      handle: '@you.tonight',
      initials: 'YT',
      avatarTone: 'ember',
      dishName: draft.dishName.trim(),
      venueName: draft.venueName.trim(),
      district: draft.district.trim(),
      category: draft.category,
      score: draft.score,
      quote: draft.quote.trim(),
      mustOrder: draft.mustOrder.trim(),
      timestamp: 'Just now',
      helpfulCount: 0,
      isUserPost: true,
    };

    setReviews((prev) => [newReview, ...prev]);
    setActiveScreen(ScreenTab.REVIEWS);
    setToastMessage(`Published bite note for ${newReview.dishName}`);
  };

  const userReviews = reviews.filter((r) => r.isUserPost);
  const totalSavedCount = savedIds.length + reservations.length;

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      <TopNav
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        onOpenPostReview={() => handleOpenPostReview(null)}
        savedCount={totalSavedCount}
      />

      <main className="mx-auto max-w-[1280px] px-4 pb-20 pt-6 sm:px-6 md:pb-12 md:pt-8 lg:px-8">
        {activeScreen === ScreenTab.DISCOVER && (
          <DiscoverScreen
            drops={drops}
            reservations={reservations}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectDrop={setSelectedDrop}
            onReserveDrop={setReserveTarget}
          />
        )}

        {activeScreen === ScreenTab.POPUPS && (
          <PopUpsScreen
            drops={drops}
            reservations={reservations}
            onSelectDrop={setSelectedDrop}
            onReserveDrop={setReserveTarget}
          />
        )}

        {activeScreen === ScreenTab.REVIEWS && (
          <ReviewsScreen
            reviews={reviews}
            helpfulReviewIds={helpfulReviewIds}
            onToggleHelpful={handleToggleHelpful}
            onOpenPostReview={() => handleOpenPostReview(null)}
          />
        )}

        {activeScreen === ScreenTab.SAVED && (
          <SavedScreen
            drops={drops}
            savedIds={savedIds}
            reservations={reservations}
            userReviews={userReviews}
            onToggleSave={handleToggleSave}
            onCancelReservation={handleCancelReservation}
            onSelectDrop={setSelectedDrop}
            onNavigate={setActiveScreen}
          />
        )}
      </main>

      <footer className="hidden border-t border-white/[0.08] py-8 md:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 text-xs text-[#a89f9c] lg:px-8">
          <span>Nightbite · Late-Night Culinary Discovery &amp; Micro-Reviews</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveScreen(ScreenTab.DISCOVER)}
              className="hover:text-white"
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen(ScreenTab.POPUPS)}
              className="hover:text-white"
            >
              Pop-Ups
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen(ScreenTab.REVIEWS)}
              className="hover:text-white"
            >
              Micro-Reviews
            </button>
          </div>
        </div>
      </footer>

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-4 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-[#06d6a0]/40 bg-[#1c1b1b]/95 px-4 py-3 text-xs font-semibold text-white shadow-[0_12px_32px_-4px_rgba(0,0,0,0.7)] backdrop-blur-md md:bottom-6 md:right-6"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#06d6a0]" aria-hidden="true" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="ml-1 text-[#a89f9c] hover:text-white"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <DetailDrawer
        drop={selectedDrop}
        remainingSeats={
          selectedDrop ? calculateRemainingSeats(selectedDrop, reservations) : 0
        }
        isSaved={selectedDrop ? savedIds.includes(selectedDrop.id) : false}
        onClose={() => setSelectedDrop(null)}
        onToggleSave={handleToggleSave}
        onReserve={(drop) => setReserveTarget(drop)}
        onWriteReview={(drop) => handleOpenPostReview(drop)}
      />

      <ReservationModal
        drop={reserveTarget}
        availableSeats={
          reserveTarget ? calculateRemainingSeats(reserveTarget, reservations) : 0
        }
        onClose={() => setReserveTarget(null)}
        onConfirm={handleConfirmReservation}
      />

      <PostReviewModal
        isOpen={reviewModalOpen}
        prefillDrop={reviewPrefillDrop}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handlePublishReview}
      />
    </div>
  );
}
