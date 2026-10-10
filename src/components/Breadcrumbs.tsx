import React from 'react';
import { ArrowLeft, ChevronRight, Globe, Compass, Flag, MapPin } from 'lucide-react';
import { GeographicLevel } from '../types/covid';

interface BreadcrumbsProps {
  level: GeographicLevel;
  continentName?: string;
  continentId?: string;
  countryName?: string;
  countryId?: string;
  stateName?: string;
  stateId?: string;
  onNavigate: (level: GeographicLevel, continentId?: string, countryId?: string, stateId?: string) => void;
  onBack: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  level,
  continentName,
  continentId,
  countryName,
  countryId,
  stateName,
  stateId,
  onNavigate,
  onBack,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 bg-slate-900/60 border border-slate-800/80 rounded-xl my-4 text-xs sm:text-sm">
      <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        {/* Back Button (only when not on World) */}
        {level !== 'world' && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-2.5 py-1 mr-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Go back one level"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-medium">Back</span>
          </button>
        )}

        {/* 1. World */}
        <button
          onClick={() => onNavigate('world')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
            level === 'world'
              ? 'text-teal-400 font-semibold bg-teal-500/10 border border-teal-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>World</span>
        </button>

        {/* 2. Continent */}
        {continentName && continentId && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <button
              onClick={() => onNavigate('continent', continentId)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                level === 'continent'
                  ? 'text-teal-400 font-semibold bg-teal-500/10 border border-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{continentName}</span>
            </button>
          </>
        )}

        {/* 3. Country */}
        {countryName && countryId && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <button
              onClick={() => onNavigate('country', continentId, countryId)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                level === 'country'
                  ? 'text-teal-400 font-semibold bg-teal-500/10 border border-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{countryName}</span>
            </button>
          </>
        )}

        {/* 4. State / Province */}
        {stateName && stateId && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-teal-400 font-semibold bg-teal-500/10 border border-teal-500/20">
              <MapPin className="w-3.5 h-3.5" />
              <span>{stateName}</span>
            </div>
          </>
        )}
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
        <span>Current Scope:</span>
        <span className="font-mono uppercase font-semibold text-slate-400">
          {level === 'world' ? 'Global' : level}
        </span>
      </div>
    </div>
  );
};
