/**
 * COVID-19 Global Data Explorer
 * Main Application Controller
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Breadcrumbs } from './components/Breadcrumbs';
import { StatisticsCards } from './components/StatisticsCards';
import { FilterToolbar } from './components/FilterToolbar';
import { InteractiveMap } from './components/InteractiveMap';
import { TimeSeriesChart } from './components/TimeSeriesChart';
import { ComparisonBarChart } from './components/ComparisonBarChart';
import { VaccinationPieCharts } from './components/VaccinationPieCharts';
import { DataTable } from './components/DataTable';
import { LoadingSkeleton, ErrorState } from './components/LoadingSkeleton';
import { DataSourcesModal } from './components/DataSourcesModal';
import { AboutModal } from './components/AboutModal';
import { GeographicLevel, CovidMetric, CovidStats, TimelinePoint } from './types/covid';
import { covidApi } from './services/covidApi';
import { worldData, continentsData } from './data/covidData';
import { ShieldCheck, Database, Calendar, Info } from 'lucide-react';

export default function App() {
  // Navigation State
  const [level, setLevel] = useState<GeographicLevel>('world');
  const [continentId, setContinentId] = useState<string | undefined>(undefined);
  const [countryId, setCountryId] = useState<string | undefined>(undefined);
  const [stateId, setStateId] = useState<string | undefined>(undefined);

  // Active filter metric for Map & Charts
  const [activeMetric, setActiveMetric] = useState<CovidMetric>('cases');

  // Dark/Light theme mode
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Modals
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'explorer' | 'sources' | 'about'>('explorer');

  // Loading & Error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Navigation history stack for accurate "Back" action
  const [navHistory, setNavHistory] = useState<Array<{
    level: GeographicLevel;
    continentId?: string;
    countryId?: string;
    stateId?: string;
  }>>([{ level: 'world' }]);

  // Synchronize browser URL paths with drill-down state
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/about') {
        setIsAboutOpen(true);
        setCurrentView('about');
        return;
      }
      if (path === '/data-sources') {
        setIsDataSourcesOpen(true);
        setCurrentView('sources');
        return;
      }
      if (path.startsWith('/state/')) {
        const parts = path.split('/').filter(Boolean);
        if (parts.length >= 3) {
          const cId = parts[1];
          const sId = parts[2];
          // Find continent
          let contId: string | undefined;
          for (const c of continentsData) {
            if (c.countries.some(country => country.id === cId)) {
              contId = c.id;
              break;
            }
          }
          setLevel('state');
          setContinentId(contId);
          setCountryId(cId);
          setStateId(sId);
        }
      } else if (path.startsWith('/country/')) {
        const parts = path.split('/').filter(Boolean);
        if (parts.length >= 2) {
          const cId = parts[1];
          let contId: string | undefined;
          for (const c of continentsData) {
            if (c.countries.some(country => country.id === cId)) {
              contId = c.id;
              break;
            }
          }
          setLevel('country');
          setContinentId(contId);
          setCountryId(cId);
          setStateId(undefined);
        }
      } else if (path.startsWith('/continent/')) {
        const parts = path.split('/').filter(Boolean);
        if (parts.length >= 2) {
          setLevel('continent');
          setContinentId(parts[1]);
          setCountryId(undefined);
          setStateId(undefined);
        }
      } else {
        setLevel('world');
        setContinentId(undefined);
        setCountryId(undefined);
        setStateId(undefined);
      }
      setCurrentView('explorer');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL on navigation
  const updateUrl = useCallback((
    targetLevel: GeographicLevel,
    targetCont?: string,
    targetCountry?: string,
    targetState?: string
  ) => {
    let url = '/';
    if (targetLevel === 'continent' && targetCont) {
      url = `/continent/${targetCont}`;
    } else if (targetLevel === 'country' && targetCountry) {
      url = `/country/${targetCountry}`;
    } else if (targetLevel === 'state' && targetCountry && targetState) {
      url = `/state/${targetCountry}/${targetState}`;
    }

    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
    }
  }, []);

  // Main navigation handler
  const handleNavigate = useCallback((
    targetLevel: GeographicLevel,
    targetContinentId?: string,
    targetCountryId?: string,
    targetStateId?: string
  ) => {
    setIsLoading(true);
    setError(null);

    // Save to history
    setNavHistory(prev => [
      ...prev,
      { level: targetLevel, continentId: targetContinentId, countryId: targetCountryId, stateId: targetStateId }
    ]);

    setLevel(targetLevel);
    setContinentId(targetContinentId);
    setCountryId(targetCountryId);
    setStateId(targetStateId);

    updateUrl(targetLevel, targetContinentId, targetCountryId, targetStateId);
    setCurrentView('explorer');

    // Simulate micro-deferral for smooth transition
    setTimeout(() => {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 120);
  }, [updateUrl]);

  // Back button handler
  const handleBack = useCallback(() => {
    if (level === 'state') {
      handleNavigate('country', continentId, countryId, undefined);
    } else if (level === 'country') {
      handleNavigate('continent', continentId, undefined, undefined);
    } else if (level === 'continent') {
      handleNavigate('world', undefined, undefined, undefined);
    }
  }, [level, continentId, countryId, handleNavigate]);

  // Resolve current active entity object based on navigation state
  const activeEntityData = useMemo(() => {
    if (level === 'world') {
      return {
        name: 'World',
        stats: worldData,
        timeline: worldData.timeline,
        subEntities: worldData.continents.map(c => ({
          id: c.id,
          name: c.name,
          population: c.population,
          cases: c.cases,
          deaths: c.deaths,
          recovered: c.recovered,
          vaccinated: c.vaccinated,
          vaccinationRate: c.vaccinationRate,
          casesPer100k: c.casesPer100k,
          targetLevel: 'continent' as GeographicLevel,
          continentId: c.id,
        })),
        barItems: worldData.continents.map(c => ({
          id: c.id,
          name: c.name,
          cases: c.cases,
          deaths: c.deaths,
          recovered: c.recovered,
          vaccinated: c.vaccinated,
          population: c.population,
          targetLevel: 'continent' as GeographicLevel,
          continentId: c.id,
        })),
      };
    }

    if (level === 'continent') {
      const cont = continentsData.find(c => c.id === continentId) || continentsData[0];
      return {
        name: cont.name,
        stats: cont,
        timeline: cont.timeline,
        subEntities: cont.countries.map(c => ({
          id: c.id,
          name: c.name,
          population: c.population,
          cases: c.cases,
          deaths: c.deaths,
          recovered: c.recovered,
          vaccinated: c.vaccinated,
          vaccinationRate: c.vaccinationRate,
          casesPer100k: c.casesPer100k,
          targetLevel: 'country' as GeographicLevel,
          continentId: cont.id,
          countryId: c.id,
        })),
        barItems: cont.countries.map(c => ({
          id: c.id,
          name: c.name,
          cases: c.cases,
          deaths: c.deaths,
          recovered: c.recovered,
          vaccinated: c.vaccinated,
          population: c.population,
          targetLevel: 'country' as GeographicLevel,
          continentId: cont.id,
          countryId: c.id,
        })),
      };
    }

    if (level === 'country') {
      let foundCountry: any = null;
      let contId = continentId;
      for (const cont of continentsData) {
        const c = cont.countries.find(item => item.id === countryId);
        if (c) {
          foundCountry = c;
          contId = cont.id;
          break;
        }
      }
      if (!foundCountry) foundCountry = continentsData[0].countries[0];

      return {
        name: foundCountry.name,
        stats: foundCountry,
        timeline: foundCountry.timeline,
        subEntities: (foundCountry.states || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          population: s.population,
          cases: s.cases,
          deaths: s.deaths,
          recovered: s.recovered,
          vaccinated: s.vaccinated,
          vaccinationRate: s.vaccinationRate,
          casesPer100k: s.casesPer100k,
          targetLevel: 'state' as GeographicLevel,
          continentId: contId,
          countryId: foundCountry.id,
          stateId: s.id,
        })),
        barItems: (foundCountry.states || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          cases: s.cases,
          deaths: s.deaths,
          recovered: s.recovered,
          vaccinated: s.vaccinated,
          population: s.population,
          targetLevel: 'state' as GeographicLevel,
          continentId: contId,
          countryId: foundCountry.id,
          stateId: s.id,
        })),
      };
    }

    if (level === 'state') {
      let foundState: any = null;
      let foundCountry: any = null;
      let contId = continentId;

      for (const cont of continentsData) {
        for (const c of cont.countries) {
          const s = c.states?.find((st: any) => st.id === stateId);
          if (s) {
            foundState = s;
            foundCountry = c;
            contId = cont.id;
            break;
          }
        }
      }

      if (!foundState) {
        foundCountry = continentsData[0].countries[0];
        foundState = foundCountry.states[0];
      }

      const districts = foundState.districts || [];

      return {
        name: `${foundState.name}, ${foundCountry?.name || ''}`,
        stats: foundState,
        timeline: foundState.timeline,
        subEntities: districts.map((d: any) => ({
          id: d.id,
          name: d.name,
          population: d.population,
          cases: d.cases,
          deaths: d.deaths,
          recovered: d.recovered,
          vaccinated: d.vaccinated,
          vaccinationRate: d.vaccinationRate,
          casesPer100k: d.casesPer100k,
        })),
        barItems: districts.length > 0
          ? districts.map((d: any) => ({
              id: d.id,
              name: d.name,
              cases: d.cases,
              deaths: d.deaths,
              recovered: d.recovered,
              vaccinated: d.vaccinated,
              population: d.population,
            }))
          : (foundCountry?.states || []).map((s: any) => ({
              id: s.id,
              name: s.name,
              cases: s.cases,
              deaths: s.deaths,
              recovered: s.recovered,
              vaccinated: s.vaccinated,
              population: s.population,
              targetLevel: 'state' as GeographicLevel,
              continentId: contId,
              countryId: foundCountry?.id,
              stateId: s.id,
            })),
      };
    }

    return {
      name: 'World',
      stats: worldData,
      timeline: worldData.timeline,
      subEntities: [],
      barItems: [],
    };
  }, [level, continentId, countryId, stateId]);

  // Names for breadcrumb
  const currentContinentName = useMemo(() => {
    if (!continentId) return undefined;
    return continentsData.find(c => c.id === continentId)?.name;
  }, [continentId]);

  const currentCountryName = useMemo(() => {
    if (!countryId) return undefined;
    for (const cont of continentsData) {
      const c = cont.countries.find(country => country.id === countryId);
      if (c) return c.name;
    }
    return undefined;
  }, [countryId]);

  const currentStateName = useMemo(() => {
    if (!stateId) return undefined;
    for (const cont of continentsData) {
      for (const country of cont.countries) {
        const s = country.states?.find(st => st.id === stateId);
        if (s) return s.name;
      }
    }
    return undefined;
  }, [stateId]);

  const sourceMeta = covidApi.getSourceMeta();

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900 light'}`}>
      {/* 1. Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onNavigate={handleNavigate}
        onOpenDataSources={() => setIsDataSourcesOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        currentView={currentView}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Notice Bar: Demo / Verified Data Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">COVID-19 Global Data Explorer</span>
            <span>·</span>
            <span>{sourceMeta.disclaimer}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline: Jan 2020 – Dec 2023</span>
          </div>
        </div>

        {/* 2. Hierarchical Breadcrumbs */}
        <Breadcrumbs
          level={level}
          continentName={currentContinentName}
          continentId={continentId}
          countryName={currentCountryName}
          countryId={countryId}
          stateName={currentStateName}
          stateId={stateId}
          onNavigate={handleNavigate}
          onBack={handleBack}
        />

        {/* Filter Toolbar (Choropleth & Metric Switcher) */}
        <FilterToolbar
          activeMetric={activeMetric}
          onChangeMetric={setActiveMetric}
          onResetFilters={() => setActiveMetric('cases')}
        />

        {/* Content View */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={() => handleNavigate('world')} />
        ) : (
          <div className="space-y-6">
            {/* 3. Statistics Cards */}
            <StatisticsCards
              stats={activeEntityData.stats}
              entityName={activeEntityData.name}
            />

            {/* 4. Interactive Geographic Map (World / Continent / Country / State) */}
            <section aria-label="Interactive Map View">
              <InteractiveMap
                level={level}
                continentId={continentId}
                countryId={countryId}
                stateId={stateId}
                activeMetric={activeMetric}
                darkMode={darkMode}
                onDrillDown={handleNavigate}
              />
            </section>

            {/* 5. Charts Grid: Line Chart & Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <TimeSeriesChart
                timeline={activeEntityData.timeline}
                entityName={activeEntityData.name}
              />
              <ComparisonBarChart
                level={level}
                parentName={activeEntityData.name}
                items={activeEntityData.barItems}
                onSelectEntity={handleNavigate}
              />
            </div>

            {/* 6. Vaccination Breakdown Pie / Donut Charts */}
            <VaccinationPieCharts
              stats={activeEntityData.stats}
              entityName={activeEntityData.name}
            />

            {/* 7. Comprehensive Data Records Table */}
            <DataTable
              stats={activeEntityData.stats}
              entityName={activeEntityData.name}
              level={level}
              subEntities={activeEntityData.subEntities}
              onSelectEntity={handleNavigate}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 py-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">COVID-19 Global Data Explorer</span>
            <span>·</span>
            <span>Hierarchical public health analytics</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDataSourcesOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Data Sources & Methodology
            </button>
            <span>·</span>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              About the Project
            </button>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <DataSourcesModal
        isOpen={isDataSourcesOpen}
        onClose={() => setIsDataSourcesOpen(false)}
      />
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
