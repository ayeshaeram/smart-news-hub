import React from 'react';
import { ARTICLES, Article } from '../data/articles';
import { useAudio } from '../context/AudioContext';
import { 
  Bookmark, 
  Trash2, 
  Volume2, 
  ArrowLeft, 
  ExternalLink, 
  Plus, 
  Check, 
  Clock 
} from 'lucide-react';

interface SavedPageProps {
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onClearAllSaved: () => void;
  onSelectArticle: (id: string) => void;
  onNavigateHome: () => void;
  onNavigateToCards: () => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({
  savedIds,
  onToggleSave,
  onClearAllSaved,
  onSelectArticle,
  onNavigateHome,
  onNavigateToCards,
}) => {
  const { playArticleNow, addToQueue, playlist } = useAudio();

  const savedArticles = ARTICLES.filter((a) => savedIds.includes(a.id));

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-36">
      {/* Top Header Bar */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Newsroom
            </button>
            <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">|</span>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
              Personal Reading Shelf
            </span>
          </div>

          {savedArticles.length > 0 && (
            <button
              onClick={onClearAllSaved}
              className="text-xs text-stone-400 hover:text-red-500 font-mono transition-colors"
            >
              Clear All Saved
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 mb-1">
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>Stored in Local Browser Memory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Saved Briefs & Investigations ({savedArticles.length})
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Articles saved for offline reference, audio commute, or deep analysis.
          </p>
        </div>

        {savedArticles.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-800 rounded-2xl">
            <Bookmark className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
              No saved stories yet
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Tap the bookmark icon on any 60-word brief or full investigation to store it here.
            </p>
            <button
              onClick={onNavigateToCards}
              className="mt-5 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
            >
              Discover 60-Word Briefs →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedArticles.map((article) => {
              const isInQueue = playlist.some((p) => p.articleId === article.id);

              return (
                <div
                  key={article.id}
                  className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm hover:border-stone-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-400 mb-1">
                      <span className="uppercase text-amber-600 dark:text-amber-400 font-semibold">
                        {article.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{article.source}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      {article.title}
                    </h3>

                    <p className="mt-1.5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2">
                      {article.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Listen now */}
                    <button
                      onClick={() => playArticleNow(article)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>

                    {/* Add to commute */}
                    <button
                      onClick={() => addToQueue(article)}
                      disabled={isInQueue}
                      className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs transition-colors disabled:opacity-40"
                      title="Add to Commute Queue"
                    >
                      {isInQueue ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>

                    {/* Read full */}
                    <button
                      onClick={() => onSelectArticle(article.id)}
                      className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs transition-colors"
                      title="Read Full Story"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => onToggleSave(article.id)}
                      className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
