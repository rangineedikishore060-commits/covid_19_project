import React, { useState, useMemo } from 'react';
import { Table, Download, Search, ArrowUpDown, ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';
import { CovidStats, GeographicLevel } from '../types/covid';

interface SubEntityItem {
  id: string;
  name: string;
  population: number;
  cases: number;
  deaths: number;
  recovered: number;
  vaccinated: number;
  vaccinationRate: number;
  casesPer100k: number;
  targetLevel?: GeographicLevel;
  continentId?: string;
  countryId?: string;
  stateId?: string;
}

interface DataTableProps {
  stats: CovidStats;
  entityName: string;
  level: GeographicLevel;
  subEntities: SubEntityItem[];
  onSelectEntity: (nextLevel: GeographicLevel, continentId?: string, countryId?: string, stateId?: string) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  stats,
  entityName,
  level,
  subEntities,
  onSelectEntity,
}) => {
  const [activeTab, setActiveTab] = useState<'clinical' | 'breakdown'>('clinical');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof SubEntityItem>('cases');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const nonVaccinatedPop = Math.max(0, stats.population - stats.vaccinated);

  // Exact metrics required in prompt section 7
  const clinicalRows = [
    { entity: 'Total Population', number: stats.population, desc: 'Overall resident population', format: 'number' },
    { entity: 'COVID-19 Cases', number: stats.cases, desc: 'Cumulative lab-confirmed infections', format: 'number' },
    { entity: 'Active COVID-19 Cases', number: stats.active, desc: 'Current active epidemiological load', format: 'number' },
    { entity: 'Total Recovered', number: stats.recovered, desc: 'Patients clinically cleared / recovered', format: 'number' },
    { entity: 'Vaccinated People', number: stats.vaccinated, desc: 'At least one vaccine dose administered', format: 'number' },
    { entity: 'Fully Vaccinated People', number: stats.fullyVaccinated, desc: 'Completed primary vaccination protocol', format: 'number' },
    { entity: 'Non-Vaccinated People', number: nonVaccinatedPop, desc: 'Unvaccinated population cohort', format: 'number' },
    { entity: 'Deaths - Vaccinated', number: stats.deathsVaccinated, desc: 'Breakthrough fatalities in vaccinated individuals', format: 'number' },
    { entity: 'Alive - Vaccinated', number: stats.aliveVaccinated, desc: 'Vaccinated individuals surviving without fatality', format: 'number' },
    { entity: 'Deaths - Non-Vaccinated', number: stats.deathsNonVaccinated, desc: 'Fatalities occurring in unvaccinated population', format: 'number' },
    { entity: 'Alive - Non-Vaccinated', number: stats.aliveNonVaccinated, desc: 'Surviving unvaccinated population cohort', format: 'number' },
    { entity: 'Vaccination Coverage Rate', number: stats.vaccinationRate, desc: 'Percentage of population receiving vaccines', format: 'percentage' },
    { entity: 'Infection Rate per 100k', number: stats.casesPer100k, desc: 'Population-normalized infection metric', format: 'rate' },
    { entity: 'Case Fatality Rate (CFR)', number: stats.caseFatalityRate, desc: 'Ratio of deaths to confirmed cases', format: 'percentage' },
  ];

  // Filter and sort sub-entities
  const filteredSubEntities = useMemo(() => {
    return subEntities
      .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'desc' ? valB - valA : valA - valB;
        }
        return sortDirection === 'desc'
          ? String(valB).localeCompare(String(valA))
          : String(valA).localeCompare(String(valB));
      });
  }, [subEntities, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredSubEntities.length / pageSize) || 1;
  const paginatedSubEntities = filteredSubEntities.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof SubEntityItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (activeTab === 'clinical') {
      const headers = ['Entity', 'Number', 'Description'];
      const rows = clinicalRows.map(r => [`"${r.entity}"`, r.number, `"${r.desc}"`]);
      const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', uri);
      link.setAttribute('download', `${entityName.toLowerCase().replace(/\s+/g, '_')}_clinical_summary.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['Name', 'Population', 'Cases', 'Deaths', 'Recovered', 'Vaccinated', 'Vaccination %', 'Cases / 100k'];
      const rows = filteredSubEntities.map(s => [
        `"${s.name}"`,
        s.population,
        s.cases,
        s.deaths,
        s.recovered,
        s.vaccinated,
        s.vaccinationRate,
        s.casesPer100k
      ]);
      const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', uri);
      link.setAttribute('download', `${entityName.toLowerCase().replace(/\s+/g, '_')}_subregions.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm my-4">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-semibold text-white tracking-tight">
            Detailed COVID-19 Data Records ({entityName})
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* View Segmented Tabs */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setActiveTab('clinical')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'clinical'
                  ? 'bg-slate-800 text-teal-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Clinical Outcomes Summary
            </button>
            {subEntities.length > 0 && (
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeTab === 'breakdown'
                    ? 'bg-slate-800 text-teal-400 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sub-Regions Breakdown ({subEntities.length})
              </button>
            )}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors ml-auto sm:ml-0"
            title="Download table data as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Clinical Outcomes Summary Table (Section 7 in requirements) */}
      {activeTab === 'clinical' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-sans uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Entity</th>
                <th className="py-2.5 px-4 font-semibold text-right">Number</th>
                <th className="py-2.5 px-4 font-semibold hidden md:table-cell">Contextual Metric Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {clinicalRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200">
                    {row.entity}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums font-bold text-white">
                    {row.format === 'percentage'
                      ? `${row.number}%`
                      : row.format === 'rate'
                      ? `${row.number.toLocaleString()} / 100k`
                      : row.number.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 hidden md:table-cell font-sans text-[11px]">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* VIEW 2: Sub-Entities Breakdown Table with Search, Sort, Pagination */
        <div>
          {/* Search Sub-regions input */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter sub-regions..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Showing {filteredSubEntities.length} regions
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-sans uppercase tracking-wider text-[11px]">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className="py-2.5 px-4 font-semibold cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Name</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('population')}
                    className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Population</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('cases')}
                    className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Cases</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('deaths')}
                    className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Deaths</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('recovered')}
                    className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-white transition-colors hidden sm:table-cell"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Recovered</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('vaccinationRate')}
                    className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Vaccinated %</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {paginatedSubEntities.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 font-sans font-medium text-slate-200">
                      {sub.name}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">
                      {sub.population.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-bold text-cyan-300">
                      {sub.cases.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-rose-300">
                      {sub.deaths.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-emerald-300 hidden sm:table-cell">
                      {sub.recovered.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-teal-300 font-bold">
                      {sub.vaccinationRate}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      {sub.targetLevel && sub.targetLevel !== level ? (
                        <button
                          onClick={() => onSelectEntity(sub.targetLevel!, sub.continentId, sub.countryId, sub.stateId)}
                          className="px-2 py-1 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[11px] font-medium transition-colors"
                        >
                          Explore →
                        </button>
                      ) : (
                        <span className="text-slate-600 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-slate-500 font-mono">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
