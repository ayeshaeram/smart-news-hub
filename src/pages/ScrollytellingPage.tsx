import React, { useState, useEffect, useRef } from 'react';
import { DATA_STORIES, DataStory, StoryStep } from '../data/stories';
import { DataStoryChart } from '../components/DataStoryChart';
import { useAudio } from '../context/AudioContext';
import { 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  Compass, 
  BarChart2, 
  TrendingUp, 
  Thermometer,
  Calendar,
  Clock,
  User,
  Share2,
  Check
} from 'lucide-react';

interface ScrollytellingPageProps {
  initialStoryId?: string;
  onNavigateHome: () => void;
  onNavigateToArticle?: (id: string) => void;
}

export const ScrollytellingPage: React.FC<ScrollytellingPageProps> = ({
  initialStoryId = 'story-inflation',
  onNavigateHome,
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>(initialStoryId);
  const currentStory: DataStory = DATA_STORIES.find((s) => s.id === selectedStoryId) || DATA_STORIES[0];
  
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const { playCustomText, isPlaying } = useAudio();
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Setup IntersectionObserver for narrative steps
  useEffect(() => {
    const handleObserver: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-step-index'));
          if (!isNaN(index)) {
            setActiveStepIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: [0.1, 0.5],
    });

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [selectedStoryId]);

  // Track overall scroll progress for top progress bar
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const element = containerRef.current;
      const totalHeight = element.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentScroll = window.scrollY - element.offsetTop;
        const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleListenStory = () => {
    const fullStoryNarration = `${currentStory.title}. ${currentStory.leadParagraph} ` +
      currentStory.steps.map(s => `${s.headline}. ${s.body} Key finding: ${s.dataCallout.label} is ${s.dataCallout.value}.`).join(' ');

    playCustomText({
      id: `story-${currentStory.id}`,
      title: currentStory.title,
      category: currentStory.category,
      textToRead: fullStoryNarration,
      source: 'Dispatch Data Story Desk',
      durationSeconds: currentStory.listenTimeSeconds,
    });
  };

  const handleCopyShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const scrollToStep = (index: number) => {
    const targetRef = stepRefs.current[index];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const currentStep = currentStory.steps[activeStepIndex] || currentStory.steps[0];

  return (
    <div ref={containerRef} className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-32">
      {/* Scroll Position Progress Bar */}
      <div 
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed top-0 left-0 right-0 h-1.5 bg-stone-200 dark:bg-stone-800 z-40"
      >
        <div 
          className="h-full bg-amber-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Subheader / Story Switcher Bar */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Newsroom
            </button>
            <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">|</span>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Visual Data Stories
            </span>
          </div>

          {/* Story Switcher Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
            {DATA_STORIES.map((story) => (
              <button
                key={story.id}
                onClick={() => {
                  setSelectedStoryId(story.id);
                  setActiveStepIndex(0);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  selectedStoryId === story.id
                    ? 'bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 shadow-sm font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {story.id === 'story-inflation' ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <Thermometer className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">
                  {story.id === 'story-inflation' ? '10-Yr Inflation' : 'Climate 1.5°C'}
                </span>
                <span className="sm:hidden">
                  {story.id === 'story-inflation' ? 'Inflation' : 'Climate'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Story Hero Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-10 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-3">
          <span>{currentStory.category}</span>
          <span aria-hidden="true">·</span>
          <span>Interactive Graphic Investigation</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight leading-tight max-w-3xl mx-auto">
          {currentStory.title}
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto">
          {currentStory.subtitle}
        </p>

        {/* Byline & Actions Ribbon */}
        <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{currentStory.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{currentStory.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentStory.readTime}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleListenStory}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen to Data Story ({Math.ceil(currentStory.listenTimeSeconds / 60)} min)</span>
            </button>
            <button
              onClick={handleCopyShare}
              className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              title="Copy share link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Lead Paragraph Card */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mb-12">
        <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
          <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:text-stone-900 dark:first-letter:text-stone-100">
            {currentStory.leadParagraph}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs font-mono text-stone-400 pt-3 border-t border-stone-100 dark:border-stone-800">
            <span>Scroll downward to animate the data model in real time</span>
            <span>Step {activeStepIndex + 1} of {currentStory.steps.length} active</span>
          </div>
        </div>
      </section>

      {/* Scrollytelling Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Narrative Steps Column (Left on desktop: 5 cols) */}
          <div className="lg:col-span-5 space-y-36 py-8">
            {currentStory.steps.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <div
                  key={step.id}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  data-step-index={idx}
                  className={`p-6 sm:p-8 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-white dark:bg-stone-900 border-amber-500/80 shadow-lg scale-[1.01]'
                      : 'bg-white/60 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/80 opacity-70 hover:opacity-90'
                  }`}
                >
                  {/* Step Index & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
                      Chapter {step.stepNumber} · {step.badge}
                    </span>
                    <span className="font-mono text-xs text-stone-400">
                      {idx + 1} / {currentStory.steps.length}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-950 dark:text-stone-50 leading-snug">
                    {step.headline}
                  </h3>

                  <p className="mt-3 text-stone-600 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
                    {step.body}
                  </p>

                  {/* Quantitative Callout */}
                  <div className="mt-5 p-4 rounded-lg bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {step.dataCallout.label}
                    </div>
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {step.dataCallout.value}
                    </div>
                    {step.dataCallout.change && (
                      <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
                        {step.dataCallout.change}
                      </div>
                    )}
                  </div>

                  {/* Step Jump Trigger */}
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <button
                      onClick={() => scrollToStep(idx)}
                      className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 font-mono underline"
                    >
                      Focus this metric step
                    </button>
                    {isActive && (
                      <span className="text-amber-600 dark:text-amber-400 font-mono font-medium flex items-center gap-1">
                        Active In Viewport
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Visual Panel Column (Right on desktop: 7 cols) */}
          <div className="lg:col-span-7 sticky top-16 pt-8 pb-8">
            <div className="space-y-4">
              {/* Step indicator pills */}
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-mono text-stone-500">
                  Interactive Visualization Anchor
                </span>
                <div className="flex items-center gap-1">
                  {currentStory.steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToStep(i)}
                      title={`Jump to Step ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        activeStepIndex === i
                          ? 'w-6 bg-amber-500'
                          : 'w-2 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* The Live Interactive Chart */}
              <DataStoryChart
                story={currentStory}
                currentStep={currentStep}
              />

              {/* Context Summary Footer under sticky chart */}
              <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">Methodology:</span> Continuous data telemetry aggregated from official public records.
                </div>
                <button
                  onClick={() => {
                    const next = selectedStoryId === 'story-inflation' ? 'story-climate' : 'story-inflation';
                    setSelectedStoryId(next);
                    setActiveStepIndex(0);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  Switch to next story <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
