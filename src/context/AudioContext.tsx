import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Article } from '../data/articles';

export interface PlaylistItem {
  id: string;
  title: string;
  category: string;
  textToRead: string;
  source: string;
  durationSeconds: number;
  articleId?: string;
}

interface AudioContextType {
  playlist: PlaylistItem[];
  currentIndex: number;
  currentTrack: PlaylistItem | null;
  isPlaying: boolean;
  isPaused: boolean;
  playbackRate: number;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  progressPercent: number;
  totalTimeRemaining: number;
  addToQueue: (article: Article) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  playArticleNow: (article: Article) => void;
  playCustomText: (item: PlaylistItem) => void;
  playQueueFromIndex: (index: number) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setPlaybackRate: (rate: number) => void;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  stopPlayback: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>(() => {
    try {
      const saved = localStorage.getItem('dispatch_commute_playlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackRate, setPlaybackRateState] = useState<number>(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // References for speech synthesis chunks and timers
  const sentencesRef = useRef<string[]>([]);
  const sentenceIndexRef = useRef<number>(0);
  const isCancelledRef = useRef<boolean>(false);
  const progressTimerRef = useRef<number | null>(null);
  const elapsedSecondsRef = useRef<number>(0);

  // Load voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        // Prefer natural English voices
        const preferred =
          available.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Samantha') || v.name.includes('Google'))) ||
          available.find((v) => v.lang.startsWith('en')) ||
          available[0];
        setSelectedVoice((prev) => prev || preferred || null);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Sync playlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dispatch_commute_playlist', JSON.stringify(playlist));
    } catch (e) {
      console.warn('Could not save playlist to localStorage', e);
    }
  }, [playlist]);

  const currentTrack = currentIndex >= 0 && currentIndex < playlist.length ? playlist[currentIndex] : null;

  // Clean utterance playback loop by splitting into clean sentences to avoid browser 15s timeout
  const speakCurrentSentence = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (isCancelledRef.current) return;

    if (sentenceIndexRef.current >= sentencesRef.current.length) {
      // Finished current track! Advance to next if in playlist
      setIsPlaying(false);
      setProgressPercent(100);
      if (currentIndex + 1 < playlist.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
      }
      return;
    }

    const textToSpeak = sentencesRef.current[sentenceIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (isCancelledRef.current) return;
      sentenceIndexRef.current += 1;
      const progress = Math.min(
        100,
        Math.round((sentenceIndexRef.current / Math.max(1, sentencesRef.current.length)) * 100)
      );
      setProgressPercent(progress);
      speakCurrentSentence();
    };

    utterance.onerror = (e) => {
      // Interrupted by cancel is normal
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      console.warn('SpeechSynthesis error:', e);
      sentenceIndexRef.current += 1;
      speakCurrentSentence();
    };

    window.speechSynthesis.speak(utterance);
  }, [currentIndex, playlist.length, playbackRate, selectedVoice]);

  // Start playing a track
  const startTrack = useCallback(
    (track: PlaylistItem) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      isCancelledRef.current = false;

      // Prepare text sentences
      const cleanText = `${track.title}. ${track.textToRead}`
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Split into digestible clauses/sentences (roughly 15-25 words each)
      const matches = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
      sentencesRef.current = matches ? matches.map((s) => s.trim()).filter(Boolean) : [cleanText];
      sentenceIndexRef.current = 0;
      setProgressPercent(0);
      elapsedSecondsRef.current = 0;

      setIsPlaying(true);
      setIsPaused(false);

      speakCurrentSentence();
    },
    [speakCurrentSentence]
  );

  // Trigger track playback when currentIndex changes
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < playlist.length) {
      startTrack(playlist[currentIndex]);
    }
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const addToQueue = (article: Article) => {
    const item: PlaylistItem = {
      id: `queue-${article.id}-${Date.now()}`,
      title: article.title,
      category: article.category,
      textToRead: article.summary,
      source: article.source,
      durationSeconds: article.listenTimeSeconds,
      articleId: article.id,
    };
    setPlaylist((prev) => {
      const exists = prev.some((p) => p.articleId === article.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromQueue = (index: number) => {
    setPlaylist((prev) => prev.filter((_, i) => i !== index));
    if (currentIndex === index) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentIndex(-1);
    } else if (currentIndex > index) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const reorderQueue = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= playlist.length) return;
    setPlaylist((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
    if (currentIndex === fromIndex) {
      setCurrentIndex(toIndex);
    }
  };

  const clearQueue = () => {
    window.speechSynthesis?.cancel();
    setPlaylist([]);
    setCurrentIndex(-1);
    setIsPlaying(false);
    setIsPaused(false);
    setProgressPercent(0);
  };

  const playArticleNow = (article: Article) => {
    const item: PlaylistItem = {
      id: `queue-${article.id}-${Date.now()}`,
      title: article.title,
      category: article.category,
      textToRead: article.summary,
      source: article.source,
      durationSeconds: article.listenTimeSeconds,
      articleId: article.id,
    };

    setPlaylist((prev) => {
      const existingIdx = prev.findIndex((p) => p.articleId === article.id);
      if (existingIdx !== -1) {
        setCurrentIndex(existingIdx);
        return prev;
      }
      const updated = [item, ...prev];
      setCurrentIndex(0);
      return updated;
    });
  };

  const playCustomText = (item: PlaylistItem) => {
    setPlaylist((prev) => [item, ...prev.filter((p) => p.id !== item.id)]);
    setCurrentIndex(0);
  };

  const playQueueFromIndex = (index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentIndex(index);
    }
  };

  const togglePlayPause = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else if (currentTrack) {
      startTrack(currentTrack);
    } else if (playlist.length > 0) {
      setCurrentIndex(0);
    }
  };

  const nextTrack = () => {
    if (currentIndex + 1 < playlist.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      stopPlayback();
    }
  };

  const prevTrack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (currentTrack) {
      startTrack(currentTrack);
    }
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    // Restart current sentence with new rate if playing
    if (isPlaying && currentTrack) {
      window.speechSynthesis?.cancel();
      speakCurrentSentence();
    }
  };

  const stopPlayback = () => {
    isCancelledRef.current = true;
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgressPercent(0);
  };

  // Calculate total duration of remaining queue
  const totalTimeRemaining = playlist.reduce((acc, curr, idx) => {
    if (idx >= currentIndex) return acc + curr.durationSeconds;
    return acc;
  }, 0);

  return (
    <AudioContext.Provider
      value={{
        playlist,
        currentIndex,
        currentTrack,
        isPlaying,
        isPaused,
        playbackRate,
        voices,
        selectedVoice,
        progressPercent,
        totalTimeRemaining,
        addToQueue,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        playArticleNow,
        playCustomText,
        playQueueFromIndex,
        togglePlayPause,
        nextTrack,
        prevTrack,
        setPlaybackRate,
        setSelectedVoice,
        stopPlayback,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};
