import React from 'react';
import { Globe2, Layers, Cpu, Compass, X } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">About the Explorer</h3>
              <p className="text-xs text-slate-400">Hierarchical COVID-19 Analytics Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          <p className="leading-relaxed text-slate-300">
            <strong>COVID-19 Global Data Explorer</strong> is an interactive web platform engineered for public health analysts, researchers, and citizens to analyze the pandemic trajectory across four distinct spatial tiers:
          </p>

          <div className="grid grid-cols-2 gap-2 text-center my-2">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-cyan-400 font-semibold">
              1. WORLD
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-cyan-400 font-semibold">
              2. CONTINENT
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-cyan-400 font-semibold">
              3. COUNTRY
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-cyan-400 font-semibold">
              4. STATE / PROVINCE
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white">Vector Map Boundaries & Choropleths:</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  High-performance polygon boundary mapping powered by Leaflet and OpenStreetMap tiles with custom choropleth color scales.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white">Comprehensive Time-Series Tracking:</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  48-month continuous timelines covering January 2020 through December 2023 with monthly aggregations and multi-metric comparisons.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white">Clinical & Vaccination Outcomes:</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Detailed stratification of vaccinated vs unvaccinated cohorts, mortality differences, breakthrough metrics, and CSV downloads.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
