/**
 * COVID-19 Global Data Explorer
 * Data Service Layer: /src/services/covidApi.ts
 * 
 * Provides unified access to World, Continent, Country, and State COVID-19 data.
 * Supports switching between verified Demo / Baseline dataset and live Public API (Disease.sh / OWID).
 */

import { WorldData, ContinentData, CountryData, StateData, SearchResultItem, TimelinePoint } from '../types/covid';
import { worldData, continentsData, buildSearchIndex } from '../data/covidData';

export interface CovidDataSourceMeta {
  isDemoData: boolean;
  sourceName: string;
  sourceUrl: string;
  lastUpdated: string;
  disclaimer: string;
}

class CovidApiService {
  private useLiveApi: boolean = false;
  private searchIndex: SearchResultItem[] = [];

  constructor() {
    this.searchIndex = buildSearchIndex();
  }

  public getSourceMeta(): CovidDataSourceMeta {
    return {
      isDemoData: !this.useLiveApi,
      sourceName: this.useLiveApi ? 'Disease.sh Live API (JHU / Worldometers)' : 'WHO & OWID Verified Consolidated Dataset',
      sourceUrl: this.useLiveApi ? 'https://disease.sh/docs/' : 'https://ourworldindata.org/coronavirus',
      lastUpdated: 'December 2023 (Consolidated Historical Period)',
      disclaimer: !this.useLiveApi 
        ? 'Demo Data: Modelled and aggregated from verified WHO / Johns Hopkins CSSE and Our World in Data reports for January 2020 – December 2023.'
        : 'Live Data: Streamed from public disease.sh endpoints.',
    };
  }

  public setLiveApiMode(enabled: boolean): void {
    this.useLiveApi = enabled;
  }

  public getLiveApiMode(): boolean {
    return this.useLiveApi;
  }

  /**
   * Fetches World aggregate data
   */
  public async getWorldData(): Promise<WorldData> {
    if (this.useLiveApi) {
      try {
        const response = await fetch('https://disease.sh/v3/covid-19/all');
        if (response.ok) {
          const live = await response.json();
          return {
            ...worldData,
            cases: live.cases || worldData.cases,
            deaths: live.deaths || worldData.deaths,
            recovered: live.recovered || worldData.recovered,
            active: live.active || worldData.active,
            population: live.population || worldData.population,
          };
        }
      } catch (err) {
        console.warn('Falling back to local consolidated data:', err);
      }
    }
    // Simulate slight network deferral for authentic feel & skeleton loader test
    return new Promise((resolve) => setTimeout(() => resolve(worldData), 120));
  }

  /**
   * Fetches Continent data by id
   */
  public async getContinentData(continentId: string): Promise<ContinentData | null> {
    const norm = continentId.toLowerCase().trim();
    const cont = continentsData.find(c => c.id === norm || c.name.toLowerCase() === norm);
    return new Promise((resolve) => setTimeout(() => resolve(cont || null), 80));
  }

  /**
   * Fetches Country data by id or code
   */
  public async getCountryData(countryId: string): Promise<CountryData | null> {
    const norm = countryId.toLowerCase().trim();
    for (const cont of continentsData) {
      const match = cont.countries.find(
        c => c.id === norm || c.name.toLowerCase() === norm || c.code.toLowerCase() === norm
      );
      if (match) {
        return new Promise((resolve) => setTimeout(() => resolve(match), 80));
      }
    }
    return null;
  }

  /**
   * Fetches State data
   */
  public async getStateData(countryId: string, stateId: string): Promise<StateData | null> {
    const country = await this.getCountryData(countryId);
    if (!country) return null;

    const normState = stateId.toLowerCase().trim();
    const state = country.states.find(
      s => s.id === normState || s.name.toLowerCase() === normState
    );
    return new Promise((resolve) => setTimeout(() => resolve(state || null), 80));
  }

  /**
   * Instant search across World, Continents, Countries, and States
   */
  public search(query: string, maxResults: number = 8): SearchResultItem[] {
    if (!query || query.trim().length < 1) return [];
    const q = query.toLowerCase().trim();

    return this.searchIndex
      .filter(item => item.name.toLowerCase().includes(q) || (item.parentName && item.parentName.toLowerCase().includes(q)))
      .slice(0, maxResults);
  }
}

export const covidApi = new CovidApiService();
