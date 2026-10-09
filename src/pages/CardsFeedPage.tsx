import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Article, ARTICLES } from '../data/articles';
import { useAudio } from '../context/AudioContext';
import { 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Plus, 
  Check, 
  Clock, 
  FileText,
  Filter,
  Share2
} from 'lucide-react';

interface CardsFeedPageProps {
  onSelectArticle: (id: string) => void;
  onNavigateHome: () => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const CardsFeedPage: React.FC<CardsFeedPageProps> = ({
  onSelectArticle,
  onNavigateHome,
  savedIds,
  onToggleSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [addedQueueId, setAddedQueueId] = useState<string | null>(null);

  const { playArticleNow, addToQueue, playlist } = useAudio();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const categories = ['All', 'Business', 'Science', 'Tech', 'World', 'Sports'];

  const filteredArticles = selectedCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const activeArticle: Article | undefined = filteredArticles[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < filteredArticles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, filteredArticles.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchDeltaX(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    const threshold = 60; // 60px swipe threshold
    if (touchDeltaX < -threshold) {
      goNext();
    } else if (touchDeltaX > threshold) {
      goPrev();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  const handleAddQueue = (article: Article) => {
    addToQueue(article);
    setAddedQueueId(article.id);
    setTimeout(() => setAddedQueueId(null), 1800);
  };

  if (!activeArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-stone-500">
        No articles found for category {selectedCategory}.
      </div>
    );
  }

  const wordCount = activeArticle.summary.trim().split(/\s+/).length;
  const isSaved = savedIds.includes(activeArticle.id);
  const isInQueue = playlist.some((p) => p.articleId === activeArticle.id);

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-36 flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">|</span>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
              60-Word Briefs
            </span>
          </div>

          {/* Card counter */}
          <div className="text-xs font-mono text-stone-500 dark:text-stone-400">
            Card <span className="text-stone-900 dark:text-stone-100 font-bold">{currentIndex + 1}</span> of {filteredArticles.length}
          </div>
        </div>

        {/* Category Filters Ribbon */}
        <div className="max-w-4xl mx-auto px-4 pb-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-stone-400 mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
                  : 'bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Center Card Stage */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
        <div
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: touchDeltaX ? `translateX(${touchDeltaX * 0.4}px)` : 'none',
            transition: touchStartX ? 'none' : 'transform 0.2s ease-out',
          }}
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden flex flex-col transition-all duration-300"
        >
          {/* Card Image Slot */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950">
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* Top Tag & Reading Metas */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
              <span className="font-mono text-[11px] uppercase tracking-wider bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-white/20 text-amber-400">
                {activeArticle.category}
              </span>
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-white/20 font-mono text-[11px]">
                <Clock className="w-3 h-3 text-stone-300" />
                <span>{activeArticle.readTime}</span>
              </div>
            </div>

            {/* Bottom title overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-xs text-stone-300 font-mono mb-1 flex items-center gap-2">
                <span>{activeArticle.source}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.date}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                {activeArticle.title}
              </h2>
            </div>
          </div>

          {/* 60-Word Core Summary */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-3 pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  Distilled Brief
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  {wordCount} words · ~25 sec read
                </span>
              </div>

              <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                {activeArticle.summary}
              </p>
            </div>

            {/* Interactive Control Row */}
            <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
              {/* Listen button */}
              <button
                onClick={() => playArticleNow(activeArticle)}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen ({Math.ceil(activeArticle.listenTimeSeconds / 60)}m)</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Save bookmark */}
                <button
                  onClick={() => onToggleSave(activeArticle.id)}
                  title={isSaved ? 'Saved in reading list' : 'Save for later'}
                  aria-label={isSaved ? 'Remove from saved' : 'Save story'}
                  className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isSaved
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-transparent'
                      : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                {/* Add to Commute Queue */}
                <button
                  onClick={() => handleAddQueue(activeArticle)}
                  disabled={isInQueue}
                  title="Add to commute playlist"
                  aria-label="Add to commute queue"
                  className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {addedQueueId === activeArticle.id || isInQueue ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="hidden sm:inline">Queued</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">+Queue</span>
                    </>
                  )}
                </button>

                {/* Read Full Story button */}
                <button
                  onClick={() => onSelectArticle(activeArticle.id)}
                  className="px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Full Story</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Bar */}
        <div className="mt-6 flex items-center justify-between text-xs text-stone-500">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 disabled:opacity-30 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous Brief
          </button>

          <span className="font-mono text-[11px] hidden sm:inline">
            Use Left / Right arrow keys or swipe on mobile
          </span>

          <button
            onClick={goNext}
            disabled={currentIndex === filteredArticles.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 disabled:opacity-30 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            Next Brief <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
};
