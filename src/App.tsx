import React, { useState, useEffect } from 'react';
import { AudioProvider } from './context/AudioContext';
import { AudioPlayer } from './components/AudioPlayer';
import { Navbar, PageView } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CardsFeedPage } from './pages/CardsFeedPage';
import { ScrollytellingPage } from './pages/ScrollytellingPage';
import { ArticlePage } from './pages/ArticlePage';
import { CommutePlaylistPage } from './pages/CommutePlaylistPage';
import { SavedPage } from './pages/SavedPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('art-1');
  const [selectedStoryId, setSelectedStoryId] = useState<string>('story-inflation');

  // Dark Mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('dispatch_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Saved Bookmarks state
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dispatch_saved_articles');
      return saved ? JSON.parse(saved) : ['art-1', 'art-3'];
    } catch {
      return ['art-1', 'art-3'];
    }
  });

  // Sync dark mode class
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('dispatch_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('dispatch_dark_mode', 'false');
      }
    } catch (e) {
      console.warn('Could not sync dark mode', e);
    }
  }, [darkMode]);

  // Sync saved bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('dispatch_saved_articles', JSON.stringify(savedIds));
    } catch (e) {
      console.warn('Could not sync saved articles', e);
    }
  }, [savedIds]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const toggleSaveArticle = (id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const clearAllSaved = () => {
    setSavedIds([]);
  };

  const navigateToArticle = (id: string) => {
    setSelectedArticleId(id);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStory = (storyId: string = 'story-inflation') => {
    setSelectedStoryId(storyId);
    setCurrentView('stories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
        {/* Universal Top Bar */}
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          savedCount={savedIds.length}
        />

        {/* Dynamic Multi-Page Router */}
        <div className="flex-1">
          {currentView === 'home' && (
            <HomePage
              onNavigateToCards={() => handleNavigate('cards')}
              onNavigateToStories={(storyId) => navigateToStory(storyId)}
              onNavigateToCommute={() => handleNavigate('commute')}
              onNavigateToArticle={navigateToArticle}
              onNavigateToAbout={() => handleNavigate('about')}
              savedIds={savedIds}
              onToggleSave={toggleSaveArticle}
            />
          )}

          {currentView === 'cards' && (
            <CardsFeedPage
              onSelectArticle={navigateToArticle}
              onNavigateHome={() => handleNavigate('home')}
              savedIds={savedIds}
              onToggleSave={toggleSaveArticle}
            />
          )}

          {currentView === 'stories' && (
            <ScrollytellingPage
              initialStoryId={selectedStoryId}
              onNavigateHome={() => handleNavigate('home')}
              onNavigateToArticle={navigateToArticle}
            />
          )}

          {currentView === 'article' && (
            <ArticlePage
              articleId={selectedArticleId}
              onNavigateHome={() => handleNavigate('home')}
              onNavigateToStory={navigateToStory}
              savedIds={savedIds}
              onToggleSave={toggleSaveArticle}
            />
          )}

          {currentView === 'commute' && (
            <CommutePlaylistPage
              onNavigateHome={() => handleNavigate('home')}
              onNavigateToCards={() => handleNavigate('cards')}
              onSelectArticle={navigateToArticle}
            />
          )}

          {currentView === 'saved' && (
            <SavedPage
              savedIds={savedIds}
              onToggleSave={toggleSaveArticle}
              onClearAllSaved={clearAllSaved}
              onSelectArticle={navigateToArticle}
              onNavigateHome={() => handleNavigate('home')}
              onNavigateToCards={() => handleNavigate('cards')}
            />
          )}

          {currentView === 'about' && (
            <AboutPage
              onNavigateHome={() => handleNavigate('home')}
              onNavigateToCards={() => handleNavigate('cards')}
              onNavigateToStories={() => handleNavigate('stories')}
              onNavigateToCommute={() => handleNavigate('commute')}
            />
          )}
        </div>

        {/* Persistent Bottom Audio Player */}
        <AudioPlayer onNavigateToCommute={() => handleNavigate('commute')} />
      </div>
    </AudioProvider>
  );
}
