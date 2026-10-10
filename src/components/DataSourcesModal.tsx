import React from 'react';
import { Database, ExternalLink, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { covidApi } from '../services/covidApi';

interface DataSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSourcesModal: React.FC<DataSourcesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const meta = covidApi.getSourceMeta();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Data Sources & Methodology</h3>
              <p className="text-xs text-slate-400">COVID-19 Global Data Explorer Architecture</p>
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
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Current Status Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Active Source Pipeline:</span>
              <span className="font-mono text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                {meta.sourceName}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {meta.disclaimer}
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-1">
              Last Updated: {meta.lastUpdated}
            </div>
          </div>

          {/* Primary Reference Datasets */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2.5">Primary Epidemiological Sources</h4>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-200">World Health Organization (WHO) COVID-19 Dashboard</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Official global infection notifications, hospitalizations, variant surveillances, and mortality statistics.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-200">Johns Hopkins University (CSSE)</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Historical geographic drilldown data (country and state-level time series 2020 through 2023).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-200">Our World in Data (OWID) Vaccination Tracker</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Manufacturer dose rollouts, single-dose vs full regimens, and population-normalized inoculation fractions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* API Replacement Instructions */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="text-sm font-semibold text-teal-400 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Connecting Live API Endpoints</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
              The application is structured with a decoupled service layer located at:
            </p>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 mb-2">
              src/services/covidApi.ts
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              To connect custom backend REST or GraphQL microservices, update the <code className="text-cyan-300">getWorldData()</code>, <code className="text-cyan-300">getCountryData()</code>, and <code className="text-cyan-300">getStateData()</code> methods to query your production endpoints.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
