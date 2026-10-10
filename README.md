# COVID-19 Global Data Explorer

An interactive, responsive web application for visualizing COVID-19 cases, deaths, recoveries, vaccination statistics, and related epidemiological trends across multiple spatial granularities.

## Hierarchical Drill-Down Architecture

The application implements a 4-tier spatial drill-down:

```
WORLD  -->  CONTINENT  -->  COUNTRY  -->  STATE / PROVINCE
```

- **World Level**: Global totals, continent choropleths, comparison bars across continents, global monthly trends (2020–2023), and world vaccination outcome donuts.
- **Continent Level**: Aggregated continent statistics, country boundaries, country-level comparative distributions, and continent-specific time-series.
- **Country Level**: Country dashboard (e.g., India, United States, Germany, Brazil, Australia), state/provincial boundaries, state-level comparative bars, and clinical mortality rates.
- **State / Province Level**: In-depth state dashboard (e.g., Andhra Pradesh, California, Bavaria, São Paulo), district/county metrics, local timelines, and stratified clinical outcome tables.

---

## Key Features

1. **Interactive Geographic Maps**:
   - Leaflet + OpenStreetMap/Carto basemaps (with dark and light theme styles).
   - GeoJSON choropleth layers with dynamic color scales for Cases, Deaths, Recoveries, Active Cases, Vaccination Rates, and Cases per 100k.
   - Hover tooltips displaying entity name, population, cases, deaths, recoveries, and vaccination percentages.
   - Click-to-drill-down navigation directly from map polygons.
   - Zoom, Pan, Reset View, and Fullscreen map mode.

2. **Time-Series Analysis (Jan 2020 – Dec 2023)**:
   - 48-month continuous timeline with monthly aggregations.
   - Toggles for Cumulative Cases, Monthly New Cases, Cumulative Deaths, Monthly New Deaths, Recoveries, and Vaccinated Population.
   - Year range filters (2020, 2021, 2022, 2023, or All).
   - Export timeline data to CSV.

3. **Sub-Region Comparative Bar Charts**:
   - Automatic adaptation to current level:
     - World: Continents
     - Continent: Countries
     - Country: States/Provinces
     - State: Districts/Counties
   - Metric toggles (Cases / Deaths / Recovered / Vaccinated) and ascending/descending sorting.
   - Interactive bar click drill-down.

4. **Vaccination Breakdown & Clinical Outcomes**:
   - Donut chart 1: Population Coverage (Vaccinated vs Non-Vaccinated).
   - Donut chart 2: Vaccinated Population Outcomes (Alive vs Breakthrough Deaths).
   - Donut chart 3: Non-Vaccinated Population Outcomes (Alive vs Unvaccinated Deaths).

5. **Dual-View Data Records Table**:
   - **Clinical Outcomes Summary**: Table with exact required metrics (Total Population, COVID-19 Cases, Vaccinated People, Non-Vaccinated People, Deaths - Vaccinated, Alive - Vaccinated, Deaths - Non-Vaccinated, Alive - Non-Vaccinated, etc.).
   - **Sub-Regions Table**: Interactive sorting on any column, live text filtering, pagination, and one-click "Download CSV".

6. **Hierarchical Breadcrumbs & Global Search**:
   - Clickable breadcrumbs (`🌍 World → Asia → India → Andhra Pradesh`) with a dedicated "Back" button.
   - Real-time global search input with autocomplete suggestions across continents, countries, and states.

---

## Project Structure

```
├── /src
│   ├── /components
│   │   ├── Header.tsx             # 3-Zone top navigation bar with search & toggles
│   │   ├── Breadcrumbs.tsx        # Clickable drilldown breadcrumb with Back button
│   │   ├── StatisticsCards.tsx    # Responsive grid of 8 key COVID metrics
│   │   ├── FilterToolbar.tsx      # Metric selector and reset controls
│   │   ├── InteractiveMap.tsx     # Leaflet map with GeoJSON choropleth layers
│   │   ├── TimeSeriesChart.tsx    # Recharts 48-month line graph with CSV export
│   │   ├── ComparisonBarChart.tsx # Recharts comparative bar chart with drilldown
│   │   ├── VaccinationPieCharts.tsx # 3 Donut charts for vaccination cohorts
│   │   ├── DataTable.tsx          # Summary & Sub-region tables with pagination & CSV
│   │   ├── DataSourcesModal.tsx   # Sources & API replacement documentation
│   │   ├── AboutModal.tsx         # Platform methodology overview
│   │   └── LoadingSkeleton.tsx    # Skeleton loaders & error states
│   ├── /data
│   │   ├── covidData.ts           # Hierarchical dataset & 2020-2023 timeline engine
│   │   └── geoBoundaries.ts       # GeoJSON boundary coordinates & polygons
│   ├── /services
│   │   └── covidApi.ts            # Decoupled data provider & public API adapter
│   ├── /types
│   │   └── covid.ts               # TypeScript interfaces
│   ├── App.tsx                    # Main application controller
│   └── index.css                  # Tailwind styles and Leaflet customization
```

---

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

---

## Replacing the Mock Dataset with Real COVID-19 API Data

The application is architected around a decoupled service layer located at:

```
src/services/covidApi.ts
```

All UI components interact exclusively with `covidApi.getWorldData()`, `covidApi.getCountryData()`, and `covidApi.getStateData()`.

To connect external REST or GraphQL APIs (such as Disease.sh, WHO, or custom health data pipelines):

1. Open `src/services/covidApi.ts`.
2. Toggle `this.useLiveApi = true` or implement direct fetch requests inside the getter methods:
   - **World**: Query `https://disease.sh/v3/covid-19/all`
   - **Countries**: Query `https://disease.sh/v3/covid-19/countries/{country}`
   - **States**: Query `https://disease.sh/v3/covid-19/states/{state}` or Johns Hopkins CSSE endpoints.
3. Map the response payload to the `CovidStats` and `TimelinePoint` interfaces declared in `src/types/covid.ts`.
