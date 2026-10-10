import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Database, Info, Globe2, ChevronRight, X } from 'lucide-react';
import { covidApi } from '../services/covidApi';
import { SearchResultItem, GeographicLevel } from '../types/covid';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (level: GeographicLevel, continentId?: string, countryId?: string, stateId?: string) => void;
  onOpenDataSources: () => void;
  onOpenAbout: () => void;
  currentView: 'explorer' | 'sources' | 'about';
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onNavigate,
  onOpenDataSources,
  onOpenAbout,
  currentView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [useLiveApi, setUseLiveApi] = useState(covidApi.getLiveApiMode());
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      const results = covidApi.search(val);
      setSearchResults(results);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handleSelectResult = (item: SearchResultItem) => {
    onNavigate(item.level, item.continentId, item.countryId, item.stateId);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const toggleApiMode = () => {
    const next = !useLiveApi;
    covidApi.setLiveApiMode(next);
    setUseLiveApi(next);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b transition-colors backdrop-blur-md bg-slate-950/90 border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('world')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            title="Return to World Dashboard"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:border-teal-400 transition-colors">
              <Globe2 className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
              COVID-19 Global Data Explorer
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('world')}
            className={`transition-colors hover:text-white ${currentView === 'explorer' ? 'text-teal-400 font-semibold' : ''}`}
          >
            Explorer
          </button>
          <button
            onClick={onOpenDataSources}
            className={`transition-colors hover:text-white ${currentView === 'sources' ? 'text-teal-400 font-semibold' : ''}`}
          >
            Data Sources
          </button>
          <button
            onClick={onOpenAbout}
            className={`transition-colors hover:text-white ${currentView === 'about' ? 'text-teal-400 font-semibold' : ''}`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: Search, API Toggle & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Global Search Input */}
          <div className="relative" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search country, continent or state..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                className="w-44 sm:w-64 md:w-72 pl-9 pr-8 py-1.5 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                  className="absolute right-2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute right-0 mt-1.5 w-72 sm:w-80 max-h-80 overflow-y-auto bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Search Results ({searchResults.length})
                </div>
                {searchResults.map((item) => (
                  <button
                    key={`${item.level}-${item.id}`}
                    onClick={() => handleSelectResult(item)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800/80 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-teal-300">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.parentName ? item.parentName : `${item.level.toUpperCase()}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.level}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mode Switcher */}
          <button
            onClick={toggleApiMode}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              useLiveApi
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
            title={useLiveApi ? 'Click to switch to consolidated Demo Data' : 'Click to test Live Disease.sh API'}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="tabular-nums">{useLiveApi ? 'Live API' : 'Demo Data'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};
