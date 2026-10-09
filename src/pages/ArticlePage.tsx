import React, { useState } from 'react';
import { Article, getArticleById } from '../data/articles';
import { useAudio } from '../context/AudioContext';
import { 
  ArrowLeft, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Plus, 
  Check, 
  Clock, 
  Share2, 
  TrendingUp, 
  Thermometer,
  Calendar,
  Sparkles
} from 'lucide-react';

interface ArticlePageProps {
  articleId: string;
  onNavigateHome: () => void;
  onNavigateToStory: (storyId: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  articleId,
  onNavigateHome,
  onNavigateToStory,
  savedIds,
  onToggleSave,
}) => {
  const article = getArticleById(articleId);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedQueue, setAddedQueue] = useState(false);

  const { playArticleNow, addToQueue, playlist } = useAudio();

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-stone-500">
        <p>Article not found.</p>
        <button
          onClick={onNavigateHome}
          className="mt-4 px-4 py-2 bg-stone-900 text-white rounded text-xs"
        >
          Return to Newsroom
        </button>
      </div>
    );
  }

  const isSaved = savedIds.includes(article.id);
  const isInQueue = playlist.some((p) => p.articleId === article.id);

  const handleListen = () => {
    playArticleNow(article);
  };

  const handleQueue = () => {
    addToQueue(article);
    setAddedQueue(true);
    setTimeout(() => setAddedQueue(false), 2000);
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const paragraphs = article.fullText.split('\n\n');

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-36">
      {/* Navigation Subheader */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onNavigateHome}
            className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Newsroom
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleListen}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen ({Math.ceil(article.listenTimeSeconds / 60)}m)</span>
            </button>

            <button
              onClick={() => onToggleSave(article.id)}
              className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
              title={isSaved ? 'Remove bookmark' : 'Save article'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-500" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        {/* Article Meta */}
        <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">
          <span className="text-amber-600 dark:text-amber-400 font-semibold">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{article.source}</span>
          <span aria-hidden="true">·</span>
          <span>{article.date}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-950 dark:text-stone-50 leading-tight">
          {article.title}
        </h1>

        {/* Distilled 60-Word Executive Brief Box */}
        <div className="mt-6 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-500/5">
          <div className="flex items-center justify-between text-xs font-mono text-amber-800 dark:text-amber-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">60-Second Executive Summary</span>
            <span>{article.readTime}</span>
          </div>
          <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
            {article.summary}
          </p>
        </div>

        {/* Action strip */}
        <div className="mt-6 py-3 border-y border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 text-stone-500 dark:text-stone-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" /> ~{Math.ceil(article.listenTimeSeconds / 60)} min audio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQueue}
              disabled={isInQueue}
              className="px-3 py-1.5 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {addedQueue || isInQueue ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>In Commute Queue</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Commute Queue</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
              title="Share article"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Feature Hero Image */}
        <div className="my-8 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900">
          <img
            src={article.image}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full aspect-[16/9] object-cover"
          />
          <div className="p-3 bg-stone-100 dark:bg-stone-900 text-xs text-stone-500 dark:text-stone-400 font-serif italic text-center border-t border-stone-200 dark:border-stone-800">
            Archival photojournalism documented by Dispatch Verified News Wire.
          </div>
        </div>

        {/* Linked Data Story Gateway */}
        {article.dataStoryId && (
          <div className="mb-8 p-5 rounded-xl bg-stone-900 text-stone-100 border border-stone-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                {article.dataStoryId === 'inflation' ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <Thermometer className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-amber-400 block">
                  Companion Scrollytelling Graphic
                </span>
                <h4 className="text-sm font-semibold text-white mt-0.5">
                  {article.dataStoryId === 'inflation'
                    ? 'The Decade That Shrank the Dollar: 2016–2026'
                    : 'Breaching 1.5°C: The Anatomy of Planetary Heat'}
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Explore animated charts, multi-variable indicators, and step-by-step narrative.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToStory(`story-${article.dataStoryId}`)}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs whitespace-nowrap self-start sm:self-auto transition-colors"
            >
              Open Interactive Data Story →
            </button>
          </div>
        )}

        {/* Full Long-Form Narrative Body with Drop Cap */}
        <article className="prose prose-stone dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 text-lg leading-relaxed space-y-6">
          {paragraphs.map((p, idx) => {
            if (idx === 0) {
              return (
                <p
                  key={idx}
                  className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-950 dark:first-letter:text-stone-50"
                >
                  {p}
                </p>
              );
            }

            if (idx === 1) {
              return (
                <React.Fragment key={idx}>
                  <p>{p}</p>
                  {/* Subtle Editorial Pullquote */}
                  <blockquote className="my-8 py-4 px-6 border-y border-stone-200 dark:border-stone-800 text-xl font-serif italic text-stone-900 dark:text-stone-100 text-center">
                    "When metrics are isolated without compound context, the public loses grasp of systemic trajectory."
                  </blockquote>
                </React.Fragment>
              );
            }

            return <p key={idx}>{p}</p>;
          })}
        </article>

        {/* Footer Notes */}
        <div className="mt-12 pt-6 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-4">
          <div>
            Verified by Dispatch Editorial Board · Strict Independence Standard
          </div>
          <button
            onClick={onNavigateHome}
            className="text-stone-700 dark:text-stone-300 hover:underline font-mono"
          >
            ← Back to Front Page
          </button>
        </div>
      </main>
    </div>
  );
};
