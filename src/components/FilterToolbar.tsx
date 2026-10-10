import React from 'react';
import { Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { CovidMetric } from '../types/covid';

interface FilterToolbarProps {
  activeMetric: CovidMetric;
  onChangeMetric: (metric: CovidMetric) => void;
  onResetFilters: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  activeMetric,
  onChangeMetric,
  onResetFilters,
}) => {
  const metricOptions: Array<{ id: CovidMetric; label: string; color: string }> = [
    { id: 'cases', label: 'Total Cases', color: 'text-cyan-400' },
    { id: 'active', label: 'Active Cases', color: 'text-blue-400' },
    { id: 'deaths', label: 'Deaths', color: 'text-rose-400' },
    { id: 'recovered', label: 'Recovered', color: 'text-emerald-400' },
    { id: 'vaccinationRate', label: 'Vaccination Rate %', color: 'text-teal-400' },
    { id: 'casesPer100k', label: 'Cases / 100k', color: 'text-indigo-400' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl mb-4 text-xs">
      <div className="flex items-center gap-2 text-slate-400 shrink-0">
        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-medium text-slate-300">Map & Chart Metric:</span>
      </div>

      {/* Segmented Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
        {metricOptions.map((opt) => {
          const isActive = activeMetric === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChangeMetric(opt.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className={isActive ? opt.color : ''}>{opt.label}</span>
            </button>
          );
        })}

        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800 hover:bg-slate-800/50 transition-colors ml-auto sm:ml-2"
          title="Reset to Total Cases"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
