import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  ListMusic, 
  ChevronUp, 
  ChevronDown, 
  X,
  Gauge,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Trash2
} from 'lucide-react';

interface AudioPlayerProps {
  onNavigateToCommute?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ onNavigateToCommute }) => {
  const {
    playlist,
    currentIndex,
    currentTrack,
    isPlaying,
    isPaused,
    playbackRate,
    voices,
    selectedVoice,
    progressPercent,
    togglePlayPause,
    nextTrack,
    prevTrack,
    setPlaybackRate,
    setSelectedVoice,
    stopPlayback,
    removeFromQueue,
    reorderQueue,
    playQueueFromIndex,
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showVoicePicker, setShowVoicePicker] = useState(false);

  if (!currentTrack && playlist.length === 0) {
    return null;
  }

  const activeTrack = currentTrack || playlist[0];
  const rateOptions = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <aside 
      aria-label="Continuous Audio News Player"
      className="fixed bottom-0 left-0 right-0 z-50 bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-800 text-stone-100 shadow-2xl transition-all duration-300"
    >
      {/* Top Hairline Progress Bar */}
      <div 
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1 w-full bg-stone-800 cursor-pointer overflow-hidden"
      >
        <div 
          className="h-full bg-amber-500 transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Player Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded bg-stone-800 flex items-center justify-center shrink-0 border border-stone-700/60">
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-amber-400 animate-pulse' : 'text-stone-400'}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span className="font-mono text-amber-400 uppercase tracking-wider text-[11px]">{activeTrack.category}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{activeTrack.source}</span>
              {playlist.length > 1 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-stone-400">
                    {currentIndex + 1}/{playlist.length} in Queue
                  </span>
                </>
              )}
            </div>
            <p className="text-sm font-medium text-stone-100 truncate hover:text-amber-200 cursor-default">
              {activeTrack.title}
            </p>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={prevTrack}
            disabled={currentIndex <= 0}
            aria-label="Previous story"
            className="p-2 text-stone-400 hover:text-stone-100 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause audio narration' : 'Play audio narration'}
            className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold flex items-center justify-center transition-transform active:scale-95 shadow-md"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={nextTrack}
            disabled={currentIndex >= playlist.length - 1}
            aria-label="Next story"
            className="p-2 text-stone-400 hover:text-stone-100 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Options & Queue Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Speed Selector */}
          <div className="relative hidden sm:flex items-center">
            <span className="text-xs font-mono text-stone-400 mr-1.5 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
            </span>
            <div className="flex items-center bg-stone-800/80 rounded border border-stone-700/60 p-0.5 text-xs">
              {rateOptions.map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    playbackRate === rate
                      ? 'bg-amber-500 text-stone-950 font-semibold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selector Toggle */}
          {voices.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowVoicePicker(!showVoicePicker)}
                title="Change AI Speech Voice"
                aria-label="Select voice"
                className="p-2 text-stone-400 hover:text-stone-200 rounded hover:bg-stone-800/80 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {showVoicePicker && (
                <div className="absolute bottom-12 right-0 w-64 bg-stone-900 border border-stone-700 rounded-lg shadow-xl p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
                    <span className="font-semibold text-stone-200">Narration Voice</span>
                    <button 
                      onClick={() => setShowVoicePicker(false)}
                      className="text-stone-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {voices.map((v, i) => (
                      <button
                        key={`${v.name}-${i}`}
                        onClick={() => {
                          setSelectedVoice(v);
                          setShowVoicePicker(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded truncate transition-colors ${
                          selectedVoice?.name === v.name
                            ? 'bg-amber-500/20 text-amber-300 font-medium'
                            : 'text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        {v.name} ({v.lang})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Queue Drawer Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Toggle playlist drawer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-300 hover:text-white bg-stone-800/70 hover:bg-stone-800 rounded border border-stone-700/60 transition-colors"
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-mono">Queue ({playlist.length})</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* Stop / Close Player */}
          <button
            onClick={stopPlayback}
            aria-label="Close audio player"
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Playlist Drawer */}
      {isExpanded && (
        <div className="border-t border-stone-800 bg-stone-900/98 px-4 sm:px-6 py-4 max-h-72 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-800 text-xs">
              <span className="font-semibold text-stone-300 uppercase tracking-wider font-mono text-[11px]">
                Commute Queue ({playlist.length} stories)
              </span>
              {onNavigateToCommute && (
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onNavigateToCommute();
                  }}
                  className="text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  Open Full Commute Workspace →
                </button>
              )}
            </div>

            <div className="space-y-2">
              {playlist.map((item, idx) => {
                const isItemActive = idx === currentIndex;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-3 p-2.5 rounded text-xs transition-colors ${
                      isItemActive
                        ? 'bg-stone-800/90 border border-amber-500/40 text-stone-100'
                        : 'bg-stone-950/60 border border-stone-800/70 text-stone-300 hover:bg-stone-800/50'
                    }`}
                  >
                    <button
                      onClick={() => playQueueFromIndex(idx)}
                      className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                    >
                      <span className="font-mono text-stone-500 w-4 text-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <span className="font-semibold text-stone-200 truncate block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {item.category} · ~{Math.ceil(item.durationSeconds / 60)} min listen
                        </span>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => reorderQueue(idx, idx - 1)}
                        disabled={idx === 0}
                        title="Move Up"
                        aria-label="Move story up"
                        className="p-1 text-stone-400 hover:text-stone-200 disabled:opacity-20"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => reorderQueue(idx, idx + 1)}
                        disabled={idx === playlist.length - 1}
                        title="Move Down"
                        aria-label="Move story down"
                        className="p-1 text-stone-400 hover:text-stone-200 disabled:opacity-20"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeFromQueue(idx)}
                        title="Remove from queue"
                        aria-label="Remove from queue"
                        className="p-1 text-stone-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
