import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4 animate-pulse py-4">
      {/* Breadcrumb Skeleton */}
      <div className="h-10 bg-slate-900 border border-slate-800 rounded-xl w-72" />

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-900 border border-slate-800 rounded-xl p-3" />
        ))}
      </div>

      {/* Map Skeleton */}
      <div className="h-[460px] bg-slate-900 border border-slate-800 rounded-2xl w-full" />

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-80 bg-slate-900 border border-slate-800 rounded-2xl" />
        <div className="h-80 bg-slate-900 border border-slate-800 rounded-2xl" />
      </div>
    </div>
  );
};

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to load COVID-19 data. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 my-8">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">Data Retrieval Issue</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-4">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-lg border border-slate-700 text-xs font-medium transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
