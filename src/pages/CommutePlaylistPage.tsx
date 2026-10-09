import React from 'react';
import { useAudio } from '../context/AudioContext';
import { ARTICLES, Article } from '../data/articles';
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  Headphones, 
  Plus, 
  Sparkles,
  Volume2,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CommutePlaylistPageProps {
  onNavigateHome: () => void;
  onNavigateToCards: () => void;
  onSelectArticle: (id: string) => void;
}

export const CommutePlaylistPage: React.FC<CommutePlaylistPageProps> = ({
  onNavigateHome,
  onNavigateToCards,
  onSelectArticle,
}) => {
  const {
    playlist,
    currentIndex,
    isPlaying,
    isPaused,
    playbackRate,
    setPlaybackRate,
    togglePlayPause,
    playQueueFromIndex,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    addToQueue,
  } = useAudio();

  // Preset packs
  const loadMorningBrief = () => {
    clearQueue();
    // 3 articles from Business, Science, Tech (~6 min)
    const preset = [ARTICLES[0], ARTICLES[1], ARTICLES[2]];
    preset.forEach((art) => addToQueue(art));
  };

  const loadTechDeepDive = () => {
    clearQueue();
    const preset = ARTICLES.filter((a) => a.category === 'Tech').slice(0, 4);
    preset.forEach((art) => addToQueue(art));
  };

  const loadFullRoundup = () => {
    clearQueue();
    ARTICLES.slice(0, 6).forEach((art) => addToQueue(art));
  };

  const totalSeconds = playlist.reduce((acc, curr) => acc + curr.durationSeconds, 0);
  const totalMinutes = Math.ceil(totalSeconds / 60);

  const availableArticlesToAdd = ARTICLES.filter(
    (a) => !playlist.some((p) => p.articleId === a.id)
  );

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
              Hands-Free Commute
            </span>
          </div>

          {playlist.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs text-stone-400 hover:text-red-500 font-mono transition-colors"
            >
              Clear Queue
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hub Banner */}
        <div className="bg-stone-900 text-stone-100 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">
              <Headphones className="w-4 h-4" />
              <span>Audio-First Journalism</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Your Commute Playlist
            </h1>

            <p className="mt-2 text-sm sm:text-base text-stone-300 max-w-xl leading-relaxed">
              Queue your morning or evening briefing. Speech synthesis reads each ~60-word summary automatically in continuous sequence—zero screen interaction required.
            </p>

            {/* Total Duration & Master Transport */}
            <div className="mt-6 pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-stone-400 block text-[11px]">Total Stories</span>
                  <span className="text-lg font-bold text-white">{playlist.length}</span>
                </div>
                <div className="border-l border-stone-800 pl-4">
                  <span className="text-stone-400 block text-[11px]">Estimated Listen Time</span>
                  <span className="text-lg font-bold text-amber-400">~{totalMinutes} mins</span>
                </div>
                <div className="border-l border-stone-800 pl-4">
                  <span className="text-stone-400 block text-[11px]">Speed</span>
                  <span className="text-lg font-bold text-stone-200">{playbackRate}x</span>
                </div>
              </div>

              {playlist.length > 0 && (
                <button
                  onClick={togglePlayPause}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-lg"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" /> Pause Playback
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" /> Start Continuous Play
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick-Start Presets Strip */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Curated Quick Packs
            </span>
            <span className="text-xs text-stone-400">1-click playlist setup</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={loadMorningBrief}
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-left hover:border-amber-500/80 transition-all group"
            >
              <div className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase font-semibold">
                Morning Brief
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">
                3 Key Stories (~6 min)
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Top global macro, climate & technology breakthroughs.
              </p>
            </button>

            <button
              onClick={loadTechDeepDive}
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-left hover:border-amber-500/80 transition-all group"
            >
              <div className="text-xs font-mono text-sky-600 dark:text-sky-400 uppercase font-semibold">
                Tech & Frontier
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">
                Silicon & Energy (~8 min)
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Photonics, supergrids, quantum coherence & AI.
              </p>
            </button>

            <button
              onClick={loadFullRoundup}
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-left hover:border-amber-500/80 transition-all group"
            >
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase font-semibold">
                Comprehensive Mix
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">
                6 Stories (~12 min)
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Full-spectrum commute across business, science & world.
              </p>
            </button>
          </div>
        </div>

        {/* Current Active Queue Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
              Active Queue ({playlist.length})
            </h2>
            <span className="text-xs font-mono text-stone-400">
              Reorder with arrows to change listening sequence
            </span>
          </div>

          {playlist.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-800 rounded-xl">
              <Headphones className="w-8 h-8 text-stone-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                Your commute queue is currently empty
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Select one of the curated packs above, or add stories from the cards feed below.
              </p>
              <button
                onClick={onNavigateToCards}
                className="mt-4 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                Browse 60-Word Story Cards →
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {playlist.map((item, idx) => {
                const isCurrentlyPlaying = idx === currentIndex && (isPlaying || isPaused);

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                      isCurrentlyPlaying
                        ? 'bg-amber-500/10 border-amber-500/80 shadow-md'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => playQueueFromIndex(idx)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isCurrentlyPlaying
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        {isCurrentlyPlaying && isPlaying ? (
                          <Volume2 className="w-4 h-4 animate-pulse" />
                        ) : (
                          <span className="font-mono text-xs">{idx + 1}</span>
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono uppercase text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                            {item.category}
                          </span>
                          <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>
                          <span className="text-stone-500 truncate">{item.source}</span>
                          <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>
                          <span className="font-mono text-stone-400 text-[11px]">
                            ~{Math.ceil(item.durationSeconds / 60)} min
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate mt-0.5">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => reorderQueue(idx, idx - 1)}
                        disabled={idx === 0}
                        title="Move Up"
                        aria-label="Move up in playlist"
                        className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 disabled:opacity-20 transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reorderQueue(idx, idx + 1)}
                        disabled={idx === playlist.length - 1}
                        title="Move Down"
                        aria-label="Move down in playlist"
                        className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 disabled:opacity-20 transition-colors"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromQueue(idx)}
                        title="Remove from queue"
                        aria-label="Remove from playlist"
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Available Stories to Add */}
        {availableArticlesToAdd.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
              <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                Add More Stories to Commute
              </h2>
              <span className="text-xs font-mono text-stone-400">
                {availableArticlesToAdd.length} unqueued stories
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableArticlesToAdd.slice(0, 6).map((art) => (
                <div
                  key={art.id}
                  className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 hover:border-stone-300 transition-all"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-stone-400">
                      {art.category} · ~{Math.ceil(art.listenTimeSeconds / 60)}m
                    </span>
                    <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate mt-0.5">
                      {art.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => addToQueue(art)}
                    className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-500 hover:text-stone-950 font-medium text-xs flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Queue</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
