/**
 * COVID-19 Global Data Explorer
 * Type Definitions for Hierarchical COVID-19 Datasets
 */

export type GeographicLevel = 'world' | 'continent' | 'country' | 'state';

export type CovidMetric = 
  | 'cases'
  | 'active'
  | 'deaths'
  | 'recovered'
  | 'vaccinated'
  | 'fullyVaccinated'
  | 'vaccinationRate'
  | 'casesPer100k'
  | 'deathRate';

export interface TimelinePoint {
  date: string;       // YYYY-MM
  label: string;      // e.g. "Jan 2020"
  cases: number;      // Cumulative cases
  newCases: number;   // Monthly / daily new cases
  deaths: number;     // Cumulative deaths
  newDeaths: number;  // New deaths
  recovered: number;  // Cumulative recovered
  vaccinated: number; // Cumulative vaccinated
}

export interface CovidStats {
  population: number;
  cases: number;
  active: number;
  deaths: number;
  recovered: number;
  vaccinated: number;
  fullyVaccinated: number;
  // Specific clinical outcomes requested:
  deathsVaccinated: number;
  aliveVaccinated: number;
  deathsNonVaccinated: number;
  aliveNonVaccinated: number;
  // Derived analytical metrics
  vaccinationRate: number;      // Percentage of population (0-100)
  nonVaccinatedRate: number;    // Percentage of population (0-100)
  casesPer100k: number;
  deathsPer100k: number;
  recoveryRate: number;         // Percentage of cases (0-100)
  caseFatalityRate: number;     // Percentage of cases (0-100)
}

export interface DistrictData extends CovidStats {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
}

export interface StateData extends CovidStats {
  id: string;
  name: string;
  countryId: string;
  countryName: string;
  coordinates: [number, number]; // [lat, lng]
  districts?: DistrictData[];
  timeline: TimelinePoint[];
}

export interface CountryData extends CovidStats {
  id: string;
  name: string;
  code: string; // ISO 2 or 3
  continentId: string;
  continentName: string;
  coordinates: [number, number]; // [lat, lng]
  states: StateData[];
  timeline: TimelinePoint[];
}

export interface ContinentData extends CovidStats {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number]; // [lat, lng]
  zoomLevel: number;
  countries: CountryData[];
  timeline: TimelinePoint[];
}

export interface WorldData extends CovidStats {
  id: 'world';
  name: 'World';
  continents: ContinentData[];
  timeline: TimelinePoint[];
}

export interface SearchResultItem {
  id: string;
  name: string;
  level: GeographicLevel;
  continentId?: string;
  countryId?: string;
  stateId?: string;
  parentName?: string;
  population: number;
  cases: number;
}

export interface MapFeatureProperties {
  id: string;
  name: string;
  level: GeographicLevel;
  continentId?: string;
  countryId?: string;
  stateId?: string;
  cases: number;
  deaths: number;
  recovered: number;
  vaccinated: number;
  population: number;
  vaccinationRate: number;
  casesPer100k: number;
}
