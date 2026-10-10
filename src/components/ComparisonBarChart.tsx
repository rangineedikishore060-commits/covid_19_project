import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { BarChart3, ArrowDownUp } from 'lucide-react';
import { GeographicLevel } from '../types/covid';

interface BarItem {
  id: string;
  name: string;
  cases: number;
  deaths: number;
  recovered: number;
  vaccinated: number;
  population: number;
  targetLevel?: GeographicLevel;
  continentId?: string;
  countryId?: string;
  stateId?: string;
}

interface ComparisonBarChartProps {
  level: GeographicLevel;
  parentName: string;
  items: BarItem[];
  onSelectEntity: (nextLevel: GeographicLevel, continentId?: string, countryId?: string, stateId?: string) => void;
}

type BarMetric = 'cases' | 'deaths' | 'recovered' | 'vaccinated';

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  level,
  parentName,
  items,
  onSelectEntity,
}) => {
  const [metric, setMetric] = useState<BarMetric>('cases');
  const [sortDesc, setSortDesc] = useState(true);

  const metricColors: Record<BarMetric, { bar: string; label: string }> = {
    cases: { bar: '#0284c7', label: 'COVID-19 Cases' },
    deaths: { bar: '#e11d48', label: 'COVID-19 Deaths' },
    recovered: { bar: '#059669', label: 'Recovered Patients' },
    vaccinated: { bar: '#6366f1', label: 'Vaccinated Population' },
  };

  const sortedData = [...items].sort((a, b) => {
    return sortDesc ? b[metric] - a[metric] : a[metric] - b[metric];
  });

  const formatYAxis = (val: number): string => {
    if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
    return val.toString();
  };

  const getSubEntityLabel = () => {
    if (level === 'world') return 'Continents';
    if (level === 'continent') return 'Countries';
    if (level === 'country') return 'States / Provinces';
    return 'Districts / Regions';
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              {getSubEntityLabel()} Comparison ({parentName})
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any bar to drill down directly
          </p>
        </div>

        {/* Metric Selector & Sort */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 text-xs">
            {(['cases', 'deaths', 'recovered', 'vaccinated'] as BarMetric[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                  metric === m
                    ? 'bg-slate-800 text-teal-300 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title="Toggle sort order"
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-[280px] sm:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={40}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              cursor={{ fill: 'rgba(51, 65, 85, 0.2)' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as BarItem;
                return (
                  <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs font-mono">
                    <div className="font-sans font-bold text-white mb-1.5 text-sm">{d.name}</div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between gap-4 text-slate-400">
                        <span>Population:</span>
                        <span>{d.population.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-cyan-400">
                        <span>Cases:</span>
                        <span className="font-bold">{d.cases.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-rose-400">
                        <span>Deaths:</span>
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
                    {d.targetLevel && d.targetLevel !== level && (
                      <div className="mt-2 text-[10px] text-teal-400 font-sans font-medium">
                        Click bar to drill down →
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Bar
              dataKey={metric}
              fill={metricColors[metric].bar}
              radius={[4, 4, 0, 0]}
              onClick={(data: any) => {
                const item = (data?.payload || data) as BarItem;
                if (item?.targetLevel && item.targetLevel !== level) {
                  onSelectEntity(item.targetLevel, item.continentId, item.countryId, item.stateId);
                }
              }}
              className="cursor-pointer"
            >
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={metricColors[metric].bar}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
