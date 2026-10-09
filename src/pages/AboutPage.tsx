import React from 'react';
import { 
  ArrowLeft, 
  BarChart2, 
  Headphones, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateToCards: () => void;
  onNavigateToStories: () => void;
  onNavigateToCommute: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateHome,
  onNavigateToCards,
  onNavigateToStories,
  onNavigateToCommute,
}) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-36">
      {/* Top Header Bar */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onNavigateHome}
            className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Newsroom
          </button>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
            Editorial Manifesto
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-400 block mb-2">
            The Philosophy of The Dispatch
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight">
            Fixing Digital Journalism
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl mx-auto">
            Traditional news websites are broken by ad incentives, cognitive fatigue, and unreadable walls of text. We built The Dispatch around three core remedies.
          </p>
        </div>

        {/* 3 Pillars Matrix */}
        <div className="space-y-8 mb-16">
          {/* Problem 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-red-500 font-semibold">
                  Problem 01 · Text-Heavy Data Failure
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                  Visual Scrollytelling Architecture
                </h3>
              </div>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Complex macro-indicators—like a decade of cumulative inflation or multi-layer ocean warming anomalies—cannot be adequately grasped through five paragraphs of prose alone. Our scrollytelling engine synchronizes step-by-step narrative beats with animated, interactive vector charting, letting readers see the inflection points in real time.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={onNavigateToStories}
                className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Experience Visual Scrollytelling →
              </button>
            </div>
          </div>

          {/* Problem 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-red-500 font-semibold">
                  Problem 02 · Busy Readers With Zero Time
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                  Strict 60-Word Executive Briefs
                </h3>
              </div>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Most breaking news articles pad 800 words with boilerplate filler to maximize search rankings. Our editors enforce a strict ~60-word card protocol: state the core event, the verified empirical metric, and the tangible second-order impact. Swipe through fifteen major global developments in under four minutes.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={onNavigateToCards}
                className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Open 60-Word Card Stream →
              </button>
            </div>
          </div>

          {/* Problem 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-red-500 font-semibold">
                  Problem 03 · Cluttered Media & Screen Fatigue
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                  Audio-First Commute Playlist
                </h3>
              </div>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              When your eyes are on the road or train platform, you shouldn't have to squint at cramped mobile typography. Utilizing the high-performance browser SpeechSynthesis API, every story converts into spoken narration. Assemble a personal queue, pocket your phone, and listen continuously without touching the screen.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={onNavigateToCommute}
                className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Launch Commute Playlist →
              </button>
            </div>
          </div>
        </div>

        {/* Technical Standards Card */}
        <div className="p-6 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800">
          <h3 className="text-base font-serif font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Engineering & Accessibility Standards
          </h3>
          <ul className="space-y-2 text-xs text-stone-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Zero Fluff & Zero Tracking:</strong> No promotional popups, modal interstitials, telemetry trackers, or sponsored clickbait grids.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Accessible Typography:</strong> WCAG AA contrast, optical line lengths (65–75ch), and strict <code>prefers-reduced-motion</code> compliance.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Persistent Web Speech Synthesis:</strong> Audio queues continue playing seamlessly across all view navigations without reloading interruption.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Local Persistence:</strong> Bookmarks and commute queues persist privately in your browser's <code>localStorage</code>.</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};
