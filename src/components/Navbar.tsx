import React from 'react';
import { Sun, Moon, Headphones, Bookmark } from 'lucide-react';

export type PageView = 'home' | 'cards' | 'stories' | 'article' | 'commute' | 'saved' | 'about';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
        <button
          onClick={() => onNavigate('home')}
          className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-950 dark:text-stone-50 hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap shrink-0 transition-colors"
        >
          The Dispatch
        </button>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav 
          aria-label="Main Navigation" 
          className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300"
        >
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-950 dark:hover:text-white transition-colors pb-0.5 ${
              currentView === 'home' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500' : ''
            }`}
          >
            Front Page
          </button>

          <button
            onClick={() => onNavigate('cards')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-950 dark:hover:text-white transition-colors pb-0.5 ${
              currentView === 'cards' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500' : ''
            }`}
          >
            60s Cards
          </button>

          <button
            onClick={() => onNavigate('stories')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-950 dark:hover:text-white transition-colors pb-0.5 ${
              currentView === 'stories' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500' : ''
            }`}
          >
            Data Stories
          </button>

          <button
            onClick={() => onNavigate('commute')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-950 dark:hover:text-white transition-colors pb-0.5 flex items-center gap-1.5 ${
              currentView === 'commute' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500' : ''
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Commute</span>
          </button>

          <button
            onClick={() => onNavigate('saved')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-950 dark:hover:text-white transition-colors pb-0.5 flex items-center gap-1.5 ${
              currentView === 'saved' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500' : ''
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved {savedCount > 0 && `(${savedCount})`}</span>
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-950 dark:hover:text-white transition-colors pb-0.5 ${
              currentView === 'about' ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500' : ''
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('cards')}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-950 dark:bg-stone-100 dark:text-stone-950 rounded-lg hover:bg-stone-800 dark:hover:bg-white transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Quick 60s Brief
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Strip */}
      <div className="md:hidden border-t border-stone-200 dark:border-stone-800 px-4 py-2 flex items-center justify-around text-xs font-medium text-stone-600 dark:text-stone-400 bg-white/90 dark:bg-stone-950/90">
        <button
          onClick={() => onNavigate('home')}
          className={`py-1 ${currentView === 'home' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('cards')}
          className={`py-1 ${currentView === 'cards' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
        >
          60s Cards
        </button>
        <button
          onClick={() => onNavigate('stories')}
          className={`py-1 ${currentView === 'stories' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
        >
          Stories
        </button>
        <button
          onClick={() => onNavigate('commute')}
          className={`py-1 ${currentView === 'commute' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
        >
          Commute
        </button>
        <button
          onClick={() => onNavigate('saved')}
          className={`py-1 ${currentView === 'saved' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
        >
          Saved ({savedCount})
        </button>
      </div>
    </header>
  );
};
