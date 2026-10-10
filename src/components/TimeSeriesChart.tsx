import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import { TimelinePoint } from '../types/covid';

interface TimeSeriesChartProps {
  timeline: TimelinePoint[];
  entityName: string;
}

type TimelineMetric = 'cases' | 'newCases' | 'deaths' | 'newDeaths' | 'recovered' | 'vaccinated';

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ timeline, entityName }) => {
  const [activeMetric, setActiveMetric] = useState<TimelineMetric>('cases');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const filteredData = useMemo(() => {
    if (selectedYear === 'all') return timeline;
    return timeline.filter((item) => item.date.startsWith(selectedYear));
  }, [timeline, selectedYear]);

  const metricConfig: Record<TimelineMetric, { label: string; stroke: string; unit: string }> = {
    cases: { label: 'Cumulative Cases', stroke: '#06b6d4', unit: 'cases' },
    newCases: { label: 'New Monthly Cases', stroke: '#38bdf8', unit: 'cases' },
    deaths: { label: 'Cumulative Deaths', stroke: '#f43f5e', unit: 'deaths' },
    newDeaths: { label: 'New Monthly Deaths', stroke: '#fb7185', unit: 'deaths' },
    recovered: { label: 'Recovered Patients', stroke: '#10b981', unit: 'recovered' },
    vaccinated: { label: 'Vaccinated Population', stroke: '#818cf8', unit: 'doses' },
  };

  const formatYAxis = (val: number): string => {
    if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
    return val.toString();
  };

  const handleExportCSV = () => {
    const headers = ['Month', 'Date', 'Cumulative Cases', 'New Cases', 'Cumulative Deaths', 'Recovered', 'Vaccinated'];
    const rows = filteredData.map(d => [
      `"${d.label}"`,
      `"${d.date}"`,
      d.cases,
      d.newCases,
      d.deaths,
      d.recovered,
      d.vaccinated
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${entityName.toLowerCase().replace(/\s+/g, '_')}_covid_timeline_2020_2023.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              COVID-19 Cases & Trends Over Time ({entityName})
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            January 2020 – December 2023 (Monthly Aggregation)
          </p>
        </div>

        {/* Actions & Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Year selector */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 text-xs">
            {['all', '2020', '2021', '2022', '2023'].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2 py-1 rounded-md font-mono transition-colors ${
                  selectedYear === yr
                    ? 'bg-slate-800 text-teal-400 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {yr === 'all' ? '2020-23' : yr}
              </button>
            ))}
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors ml-auto sm:ml-0"
            title="Download timeline data as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-xs">
        {(Object.keys(metricConfig) as TimelineMetric[]).map((key) => {
          const cfg = metricConfig[key];
          const isSelected = activeMetric === key;
          return (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap font-medium ${
                isSelected
                  ? 'bg-slate-800 border border-slate-600 text-white'
                  : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span style={{ color: isSelected ? cfg.stroke : undefined }}>
                {cfg.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Recharts Line Chart */}
      <div className="h-[280px] sm:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval={selectedYear === 'all' ? 3 : 1}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as TimelinePoint;
                return (
                  <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs font-mono">
                    <div className="font-sans font-bold text-white mb-1.5 text-sm">{label}</div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between gap-4 text-cyan-400">
                        <span>Total Cases:</span>
                        <span className="font-bold">{d.cases.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-sky-300">
                        <span>Monthly New:</span>
                        <span>+{d.newCases.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-rose-400">
                        <span>Cumulative Deaths:</span>
                        <span className="font-bold">{d.deaths.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-emerald-400">
                        <span>Recovered:</span>
                        <span>{d.recovered.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-indigo-400">
                        <span>Vaccinated:</span>
                        <span>{d.vaccinated.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey={activeMetric}
              stroke={metricConfig[activeMetric].stroke}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: metricConfig[activeMetric].stroke, stroke: '#0f172a', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
