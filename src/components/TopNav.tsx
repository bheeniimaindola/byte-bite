import { Bookmark, Compass, Flame, MessageSquareText, Plus } from 'lucide-react';
import { ScreenTab } from '../types/gastronomy';

interface TopNavProps {
  activeScreen: ScreenTab;
  onSelectScreen: (screen: ScreenTab) => void;
  onOpenPostReview: () => void;
  savedCount: number;
}

const NAV_ITEMS: Array<{ id: ScreenTab; label: string; mobileLabel: string }> = [
  { id: ScreenTab.DISCOVER, label: 'Discover', mobileLabel: 'Discover' },
  { id: ScreenTab.POPUPS, label: 'Pop-Ups', mobileLabel: 'Pop-Ups' },
  { id: ScreenTab.REVIEWS, label: 'Micro-Reviews', mobileLabel: 'Reviews' },
  { id: ScreenTab.SAVED, label: 'Saved', mobileLabel: 'Saved' },
];

export function TopNav({
  activeScreen,
  onSelectScreen,
  onOpenPostReview,
  savedCount,
}: TopNavProps) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#131313]/85 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-[1280px] items-center justify-between gap-8 px-4 sm:px-6 md:h-16 lg:px-8">
          <button
            type="button"
            onClick={() => onSelectScreen(ScreenTab.DISCOVER)}
            className="font-display text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-[#ffb4a2] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Nightbite
          </button>

          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectScreen(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${
                    isActive
                      ? 'text-white'
                      : 'text-[#a89f9c] hover:text-white'
                  }`}
                >
                  <span>
                    {item.label}
                    {item.id === ScreenTab.SAVED && savedCount > 0 ? ` (${savedCount})` : ''}
                  </span>
                  {isActive && (
                    <span
                      className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-gradient-to-r from-[#ff5e36] to-[#ff8a00]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenPostReview}
              className="inline-flex min-h-[36px] md:min-h-[40px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff5e36] to-[#ff8a00] px-3.5 py-1.5 md:px-4 md:py-2 text-xs font-bold text-white whitespace-nowrap shrink-0 shadow-[0_0_20px_-4px_rgba(255,94,54,0.45)] transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Post Bite</span>
            </button>
          </div>
        </div>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] bg-[#131313]/92 backdrop-blur-md md:hidden"
      >
        <div className="grid h-14 grid-cols-4 items-center">
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            const Icon =
              item.id === ScreenTab.DISCOVER
                ? Compass
                : item.id === ScreenTab.POPUPS
                  ? Flame
                  : item.id === ScreenTab.REVIEWS
                    ? MessageSquareText
                    : Bookmark;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectScreen(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex h-full min-h-[44px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
                  isActive ? 'text-[#ff5e36]' : 'text-[#a89f9c] hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="whitespace-nowrap">
                  {item.mobileLabel}
                  {item.id === ScreenTab.SAVED && savedCount > 0 ? ` (${savedCount})` : ''}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
