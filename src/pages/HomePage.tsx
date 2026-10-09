import React, { useState } from 'react';
import { ARTICLES, Article } from '../data/articles';
import { DATA_STORIES } from '../data/stories';
import { useAudio } from '../context/AudioContext';
import { 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  TrendingUp, 
  Thermometer, 
  ArrowRight, 
  Clock, 
  Headphones, 
  FileText, 
  BarChart2, 
  Sparkles,
  ExternalLink,
  Plus,
  Check
} from 'lucide-react';

interface HomePageProps {
  onNavigateToCards: () => void;
  onNavigateToStories: (storyId?: string) => void;
  onNavigateToCommute: () => void;
  onNavigateToArticle: (id: string) => void;
  onNavigateToAbout: () => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToCards,
  onNavigateToStories,
  onNavigateToCommute,
  onNavigateToArticle,
  onNavigateToAbout,
  savedIds,
  onToggleSave,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [addedQueueId, setAddedQueueId] = useState<string | null>(null);

  const { playArticleNow, addToQueue, playlist } = useAudio();

  const categories = ['All', 'Business', 'Science', 'Tech', 'World', 'Sports'];

  const leadStory = ARTICLES[0];
  const secondaryStories = ARTICLES.slice(1, 4);
  const remainingArticles = ARTICLES.slice(4);

  const filteredFeed = activeCategory === 'All'
    ? remainingArticles
    : ARTICLES.filter((a) => a.category.toLowerCase() === activeCategory.toLowerCase());

  const handleAddQueue = (article: Article) => {
    addToQueue(article);
    setAddedQueueId(article.id);
    setTimeout(() => setAddedQueueId(null), 1800);
  };

  return (
    <div className="pb-36">
      {/* Editorial Hero Statement & Mode Switcher Gateway */}
      <section className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              Vol. IX · Independent News Protocol
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight leading-tight">
              Journalism distilled to signal, data, and voice.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
              We fix the three breakdowns of modern news: text-heavy articles that fail to explain complex data, busy readers with zero time, and cluttered platforms full of fluff.
            </p>
          </div>

          {/* Mode Switcher Gateway Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mode 1: 60-Word Cards */}
            <div 
              onClick={onNavigateToCards}
              className="p-5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-amber-500/80 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FileText className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono text-stone-400">Mode 01</span>
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                60-Word Story Cards
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Swipeable executive summaries. Read 15 global events in under 4 minutes.
              </p>
              <div className="mt-4 text-xs font-mono font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Cards Stream <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Mode 2: Visual Scrollytelling */}
            <div 
              onClick={() => onNavigateToStories()}
              className="p-5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-amber-500/80 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <BarChart2 className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono text-stone-400">Mode 02</span>
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Visual Scrollytelling
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Step-by-step data narratives where charts animate smoothly as you scroll.
              </p>
              <div className="mt-4 text-xs font-mono font-medium text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Data Stories <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Mode 3: Commute Playlist */}
            <div 
              onClick={onNavigateToCommute}
              className="p-5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-amber-500/80 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Headphones className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono text-stone-400">Mode 03</span>
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Commute Audio Queue
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Hands-free continuous text-to-speech. Zero screen taps on the road.
              </p>
              <div className="mt-4 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Hands-Free Player <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Broadsheet Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* Tier 1: Dominant Lead Story */}
        <section className="mb-14">
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-stone-200 dark:border-stone-800 text-xs font-mono uppercase tracking-wider text-stone-400">
            <span>Lead Investigation</span>
            <span>Edition 2026.10</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            {/* Visual Cover */}
            <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-full bg-stone-950">
              <img
                src={leadStory.image}
                alt={leadStory.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 font-mono text-xs uppercase tracking-wider bg-black/70 backdrop-blur text-amber-400 px-2.5 py-1 rounded border border-white/20">
                {leadStory.category}
              </div>
            </div>

            {/* Editorial Lead Prose */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-stone-400 mb-2">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{leadStory.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadStory.source}</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadStory.readTime}</span>
                </div>

                <h2 
                  onClick={() => onNavigateToArticle(leadStory.id)}
                  className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 dark:text-stone-50 leading-tight hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                >
                  {leadStory.title}
                </h2>

                <p className="mt-4 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                  {leadStory.summary}
                </p>

                {/* Scrollytelling Link Pill */}
                {leadStory.dataStoryId && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
                    <span className="font-medium">Accompanied by 10-year interactive chart</span>
                    <button
                      onClick={() => onNavigateToStories('story-inflation')}
                      className="font-mono font-semibold hover:underline"
                    >
                      View Data Story →
                    </button>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playArticleNow(leadStory)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen ({Math.ceil(leadStory.listenTimeSeconds / 60)}m)</span>
                  </button>

                  <button
                    onClick={() => onNavigateToArticle(leadStory.id)}
                    className="px-3.5 py-2 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg transition-colors"
                  >
                    Full Analysis
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAddQueue(leadStory)}
                    title="Queue for commute"
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    {addedQueueId === leadStory.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onToggleSave(leadStory.id)}
                    title="Save bookmark"
                    className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    {savedIds.includes(leadStory.id) ? (
                      <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tier 2: Two Interactive Visual Scrollytelling Showcases */}
        <section className="mb-14">
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-stone-200 dark:border-stone-800 text-xs font-mono uppercase tracking-wider text-stone-400">
            <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
              <BarChart2 className="w-4 h-4 text-amber-500" />
              Interactive Data Investigations
            </span>
            <button
              onClick={() => onNavigateToStories()}
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              Browse Both Stories <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DATA_STORIES.map((story) => (
              <div
                key={story.id}
                onClick={() => onNavigateToStories(story.id)}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden hover:border-amber-500/80 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 text-[11px] font-mono uppercase tracking-wider bg-black/60 text-amber-400 px-2 py-0.5 rounded border border-white/20">
                      {story.category}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[11px] font-mono text-stone-300 mb-0.5">
                        {story.steps.length} Scrollytelling Steps · {story.readTime}
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                        {story.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {story.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-mono text-amber-600 dark:text-amber-400 font-medium">
                  <span>Open Animated Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tier 3: Curated Front Page Feed with Category Filters */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-6 border-b border-stone-200 dark:border-stone-800 gap-3">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Distilled News Stream
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Every report strictly constrained to empirical findings.
              </p>
            </div>

            {/* Category Segmented Control */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/70 p-1 rounded-lg overflow-x-auto self-start sm:self-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeed.map((art) => {
              const isSaved = savedIds.includes(art.id);
              const isInQueue = playlist.some((p) => p.articleId === art.id);

              return (
                <article
                  key={art.id}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] w-full bg-stone-950 overflow-hidden">
                      <img
                        src={art.image}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 text-[10px] font-mono uppercase tracking-wider bg-black/70 text-amber-400 px-2 py-0.5 rounded border border-white/20">
                        {art.category}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs font-mono text-stone-400 mb-1.5">
                        <span>{art.source}</span>
                        <span aria-hidden="true">·</span>
                        <span>{art.readTime}</span>
                      </div>

                      <h3 
                        onClick={() => onNavigateToArticle(art.id)}
                        className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                      >
                        {art.title}
                      </h3>

                      <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Strip */}
                  <div className="px-5 pb-4 pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => playArticleNow(art)}
                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded flex items-center gap-1 transition-colors"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAddQueue(art)}
                        disabled={isInQueue}
                        title="Add to commute queue"
                        className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-40"
                      >
                        {addedQueueId === art.id || isInQueue ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => onToggleSave(art.id)}
                        title={isSaved ? 'Saved' : 'Save bookmark'}
                        className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => onNavigateToArticle(art.id)}
                        title="Read full story"
                        className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Footer Manifesto Ribbon */}
        <section className="p-8 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
              Zero Fluff Newsroom Pledge
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              Why We Never Run Ads, Popups, or Clickbait
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-lg">
              Read our full manifesto on how data stories, 60-word cards, and speech synthesis restore sanity to daily information consumption.
            </p>
          </div>

          <button
            onClick={onNavigateToAbout}
            className="px-5 py-2.5 rounded-lg bg-white text-stone-950 hover:bg-stone-200 font-semibold text-xs whitespace-nowrap transition-colors"
          >
            Read About The Dispatch →
          </button>
        </section>
      </main>
    </div>
  );
};
