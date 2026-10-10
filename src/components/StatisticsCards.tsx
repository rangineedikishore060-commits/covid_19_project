import React from 'react';
import { Users, Activity, HeartHandshake, Skull, Syringe, ShieldCheck, PieChart, AlertCircle } from 'lucide-react';
import { CovidStats } from '../types/covid';

interface StatisticsCardsProps {
  stats: CovidStats;
  entityName: string;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats, entityName }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-4">
      {/* 1. Total Population */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-slate-700 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium text-slate-400">Total Population</span>
          <Users className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-lg sm:text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
          {formatNumber(stats.population)}
        </div>
        <div className="text-[11px] text-slate-500 font-mono mt-1 tabular-nums truncate">
          {stats.population.toLocaleString()} citizens
        </div>
      </div>

      {/* 2. Total COVID-19 Cases */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-cyan-500/40 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium text-cyan-400">Total COVID-19 Cases</span>
          <Activity className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-lg sm:text-2xl font-bold font-mono tracking-tight text-cyan-100 tabular-nums">
          {formatNumber(stats.cases)}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/80 font-mono mt-1 tabular-nums">
          <span>{stats.casesPer100k.toLocaleString()} / 100k</span>
          <span>·</span>
          <span>{formatNumber(stats.active)} active</span>
        </div>
      </div>

      {/* 3. Total Recovered */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-emerald-500/40 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium text-emerald-400">Total Recovered</span>
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-lg sm:text-2xl font-bold font-mono tracking-tight text-emerald-100 tabular-nums">
          {formatNumber(stats.recovered)}
        </div>
        <div className="text-[11px] text-emerald-400/80 font-mono mt-1 tabular-nums">
          {stats.recoveryRate}% Recovery Rate
        </div>
      </div>

      {/* 4. Total Deaths (strictly using red here) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-rose-500/40 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium text-rose-400">Total Deaths</span>
          <Skull className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-lg sm:text-2xl font-bold font-mono tracking-tight text-rose-200 tabular-nums">
          {formatNumber(stats.deaths)}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-rose-400/80 font-mono mt-1 tabular-nums">
          <span>{stats.caseFatalityRate}% Fatality Rate</span>
          <span>·</span>
          <span>{stats.deathsPer100k} / 100k</span>
        </div>
      </div>

      {/* 5. Total Vaccinated */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-indigo-500/40 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium text-indigo-400">Total Vaccinated</span>
          <Syringe className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-lg sm:text-2xl font-bold font-mono tracking-tight text-indigo-100 tabular-nums">
          {formatNumber(stats.vaccinated)}
        </div>
        <div className="text-[11px] text-indigo-400/80 font-mono mt-1 tabular-nums">
          At least 1 dose received
        </div>
      </div>

      {/* 6. Fully Vaccinated */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-purple-500/40 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium text-purple-400">Total Fully Vaccinated</span>
          <ShieldCheck className="w-4 h-4 text-purple-400" />
        </div>
        <div className="text-lg sm:text-2xl font-bold font-mono tracking-tight text-purple-100 tabular-nums">
          {formatNumber(stats.fullyVaccinated)}
        </div>
        <div className="text-[11px] text-purple-400/80 font-mono mt-1 tabular-nums">
          Complete primary regimen
        </div>
      </div>

      {/* 7. Vaccinated Population % */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-teal-500/40 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium text-teal-400">Vaccinated Population %</span>
          <PieChart className="w-4 h-4 text-teal-400" />
        </div>
        <div className="text-lg sm:text-2xl font-bold font-mono tracking-tight text-teal-200 tabular-nums">
          {stats.vaccinationRate}%
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="bg-teal-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, stats.vaccinationRate)}%` }}
          />
        </div>
      </div>

      {/* 8. Non-Vaccinated Population % */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 hover:border-amber-500/40 transition-colors shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-xs font-medium text-amber-400">Non-Vaccinated Population %</span>
          <AlertCircle className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-lg sm:text-2xl font-bold font-mono tracking-tight text-amber-200 tabular-nums">
          {stats.nonVaccinatedRate}%
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, stats.nonVaccinatedRate)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
