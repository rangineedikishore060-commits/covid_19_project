import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Syringe, ShieldAlert, HeartPulse } from 'lucide-react';
import { CovidStats } from '../types/covid';

interface VaccinationPieChartsProps {
  stats: CovidStats;
  entityName: string;
}

function formatCompact(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

export const VaccinationPieCharts: React.FC<VaccinationPieChartsProps> = ({ stats, entityName }) => {
  // Chart 1: Total Population -> Vaccinated vs Non-Vaccinated
  const nonVaccinatedPop = Math.max(0, stats.population - stats.vaccinated);
  const chart1Data = [
    { name: 'Vaccinated', value: stats.vaccinated, color: '#14b8a6', pct: stats.vaccinationRate },
    { name: 'Non-Vaccinated', value: nonVaccinatedPop, color: '#f59e0b', pct: stats.nonVaccinatedRate },
  ];

  // Chart 2: Vaccinated Population -> Alive vs Deaths
  const vaxAlivePct = stats.vaccinated > 0 ? Number(((stats.aliveVaccinated / stats.vaccinated) * 100).toFixed(2)) : 0;
  const vaxDeathPct = stats.vaccinated > 0 ? Number(((stats.deathsVaccinated / stats.vaccinated) * 100).toFixed(2)) : 0;
  const chart2Data = [
    { name: 'Alive (Protected)', value: stats.aliveVaccinated, color: '#10b981', pct: vaxAlivePct },
    { name: 'Breakthrough Deaths', value: stats.deathsVaccinated, color: '#f43f5e', pct: vaxDeathPct },
  ];

  // Chart 3: Non-Vaccinated Population -> Alive vs Deaths
  const nonVaxAlivePct = nonVaccinatedPop > 0 ? Number(((stats.aliveNonVaccinated / nonVaccinatedPop) * 100).toFixed(2)) : 0;
  const nonVaxDeathPct = nonVaccinatedPop > 0 ? Number(((stats.deathsNonVaccinated / nonVaccinatedPop) * 100).toFixed(2)) : 0;
  const chart3Data = [
    { name: 'Alive (Unvaccinated)', value: stats.aliveNonVaccinated, color: '#64748b', pct: nonVaxAlivePct },
    { name: 'Unvaccinated Deaths', value: stats.deathsNonVaccinated, color: '#991b1b', pct: nonVaxDeathPct },
  ];

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0];
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-xl shadow-xl text-xs font-mono">
        <div className="font-sans font-bold text-white mb-0.5">{item.name}</div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Total:</span>
          <span className="text-slate-100 font-bold">{item.value.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Proportion:</span>
          <span className="text-teal-400 font-bold">{item.payload.pct}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm my-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-1">
        <Syringe className="w-4 h-4 text-teal-400" />
        <h3 className="text-base font-semibold text-white tracking-tight">
          Vaccination Breakdown & Outcomes ({entityName})
        </h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Comparative mortality and survival analysis segmented by vaccination status
      </p>

      {/* Grid of 3 Donut Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Donut 1: Population Coverage */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center">
          <span className="text-xs font-medium text-slate-300 mb-1">Total Population Coverage</span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={renderCustomTooltip} />
                <Pie
                  data={chart1Data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chart1Data.map((entry, index) => (
                    <Cell key={`cell-1-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="w-full space-y-1 text-[11px] font-mono mt-1">
            <div className="flex items-center justify-between text-teal-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" /> Vaccinated
              </span>
              <span className="font-bold tabular-nums">{stats.vaccinationRate}% ({formatCompact(stats.vaccinated)})</span>
            </div>
            <div className="flex items-center justify-between text-amber-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Non-Vaccinated
              </span>
              <span className="font-bold tabular-nums">{stats.nonVaccinatedRate}% ({formatCompact(nonVaccinatedPop)})</span>
            </div>
          </div>
        </div>

        {/* Donut 2: Vaccinated Population Outcomes */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center">
          <span className="text-xs font-medium text-slate-300 mb-1">Vaccinated Population Outcomes</span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={renderCustomTooltip} />
                <Pie
                  data={chart2Data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chart2Data.map((entry, index) => (
                    <Cell key={`cell-2-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="w-full space-y-1 text-[11px] font-mono mt-1">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Alive (Protected)
              </span>
              <span className="font-bold tabular-nums">{vaxAlivePct}%</span>
            </div>
            <div className="flex items-center justify-between text-rose-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Breakthrough Deaths
              </span>
              <span className="font-bold tabular-nums">{vaxDeathPct}% ({formatCompact(stats.deathsVaccinated)})</span>
            </div>
          </div>
        </div>

        {/* Donut 3: Non-Vaccinated Population Outcomes */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center">
          <span className="text-xs font-medium text-slate-300 mb-1">Non-Vaccinated Outcomes</span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={renderCustomTooltip} />
                <Pie
                  data={chart3Data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chart3Data.map((entry, index) => (
                    <Cell key={`cell-3-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="w-full space-y-1 text-[11px] font-mono mt-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" /> Alive (Unvaccinated)
              </span>
              <span className="font-bold tabular-nums">{nonVaxAlivePct}%</span>
            </div>
            <div className="flex items-center justify-between text-rose-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-700" /> Unvaccinated Deaths
              </span>
              <span className="font-bold tabular-nums">{nonVaxDeathPct}% ({formatCompact(stats.deathsNonVaccinated)})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
