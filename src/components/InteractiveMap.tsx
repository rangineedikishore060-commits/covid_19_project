import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Maximize2, Minimize2, RotateCcw, Layers, MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { GeographicLevel, CovidMetric } from '../types/covid';
import { continentsGeoJson, countriesGeoJson, statesGeoJson, districtsGeoJson, getOrCreateFeatureForEntity } from '../data/geoBoundaries';
import { worldData, continentsData } from '../data/covidData';
import { FeatureCollection, Feature, Geometry } from 'geojson';

interface InteractiveMapProps {
  level: GeographicLevel;
  continentId?: string;
  countryId?: string;
  stateId?: string;
  activeMetric: CovidMetric;
  darkMode: boolean;
  onDrillDown: (nextLevel: GeographicLevel, continentId?: string, countryId?: string, stateId?: string) => void;
}

// Color palettes for metrics
function getMetricColor(value: number, min: number, max: number, metric: CovidMetric): string {
  if (max === min) return '#38bdf8';
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));

  if (metric === 'deaths') {
    // Red / Crimson palette
    if (ratio > 0.8) return '#991b1b';
    if (ratio > 0.6) return '#dc2626';
    if (ratio > 0.4) return '#ef4444';
    if (ratio > 0.2) return '#f87171';
    return '#fca5a5';
  } else if (metric === 'recovered') {
    // Green palette
    if (ratio > 0.8) return '#065f46';
    if (ratio > 0.6) return '#059669';
    if (ratio > 0.4) return '#10b981';
    if (ratio > 0.2) return '#34d399';
    return '#6ee7b7';
  } else if (metric === 'vaccinationRate') {
    // Teal / Emerald palette
    if (ratio > 0.8) return '#0f766e';
    if (ratio > 0.6) return '#0d9488';
    if (ratio > 0.4) return '#14b8a6';
    if (ratio > 0.2) return '#2dd4bf';
    return '#5eead4';
  } else {
    // Cyan / Blue palette for cases, active, casesPer100k
    if (ratio > 0.8) return '#1e40af';
    if (ratio > 0.6) return '#2563eb';
    if (ratio > 0.4) return '#0284c7';
    if (ratio > 0.2) return '#38bdf8';
    return '#7dd3fc';
  }
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  level,
  continentId,
  countryId,
  stateId,
  activeMetric,
  darkMode,
  onDrillDown,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredEntity, setHoveredEntity] = useState<any | null>(null);

  // Determine current active GeoJSON dataset and entities to render
  const getCurrentGeoData = () => {
    let features: Feature[] = [];
    let itemsForRange: Array<{ id: string; name: string; value: number; raw: any }> = [];

    if (level === 'world') {
      // Show continents on world map
      features = continentsGeoJson.features.map(f => {
        const cont = continentsData.find(c => c.id === f.id || c.name.toLowerCase() === f.properties?.name.toLowerCase());
        const raw = cont || worldData;
        const val = (raw as any)[activeMetric] || 0;
        itemsForRange.push({ id: f.id as string, name: f.properties?.name, value: val, raw });
        return {
          ...f,
          properties: {
            ...f.properties,
            ...raw,
            val,
            targetLevel: 'continent',
            targetContinentId: f.id,
          }
        };
      });
    } else if (level === 'continent') {
      // Show countries in continent
      const cont = continentsData.find(c => c.id === continentId);
      if (cont) {
        features = cont.countries.map(country => {
          const feat = getOrCreateFeatureForEntity(country.id, country.name, 'country', country.coordinates, countriesGeoJson);
          const val = (country as any)[activeMetric] || 0;
          itemsForRange.push({ id: country.id, name: country.name, value: val, raw: country });
          return {
            ...feat,
            properties: {
              ...feat.properties,
              ...country,
              val,
              targetLevel: 'country',
              targetContinentId: cont.id,
              targetCountryId: country.id,
            }
          };
        });
      }
    } else if (level === 'country') {
      // Show states in country
      let foundCountry: any = null;
      for (const cont of continentsData) {
        const c = cont.countries.find(item => item.id === countryId);
        if (c) { foundCountry = c; break; }
      }
      if (foundCountry && foundCountry.states) {
        features = foundCountry.states.map((state: any) => {
          const feat = getOrCreateFeatureForEntity(state.id, state.name, 'state', state.coordinates, statesGeoJson);
          const val = (state as any)[activeMetric] || 0;
          itemsForRange.push({ id: state.id, name: state.name, value: val, raw: state });
          return {
            ...feat,
            properties: {
              ...feat.properties,
              ...state,
              val,
              targetLevel: 'state',
              targetContinentId: foundCountry.continentId,
              targetCountryId: foundCountry.id,
              targetStateId: state.id,
            }
          };
        });
      }
    } else if (level === 'state') {
      // Show state boundary & districts if available
      let foundState: any = null;
      for (const cont of continentsData) {
        for (const c of cont.countries) {
          const st = c.states?.find(s => s.id === stateId);
          if (st) { foundState = st; break; }
        }
      }
      if (foundState) {
        if (foundState.districts && foundState.districts.length > 0) {
          features = foundState.districts.map((dist: any) => {
            const feat = getOrCreateFeatureForEntity(dist.id, dist.name, 'district', dist.coordinates, districtsGeoJson);
            const val = (dist as any)[activeMetric] || 0;
            itemsForRange.push({ id: dist.id, name: dist.name, value: val, raw: dist });
            return {
              ...feat,
              properties: {
                ...feat.properties,
                ...dist,
                val,
                targetLevel: 'state', // stays on state view
                targetContinentId: continentId,
                targetCountryId: countryId,
                targetStateId: stateId,
              }
            };
          });
        } else {
          // Single state polygon
          const feat = getOrCreateFeatureForEntity(foundState.id, foundState.name, 'state', foundState.coordinates, statesGeoJson);
          const val = (foundState as any)[activeMetric] || 0;
          itemsForRange.push({ id: foundState.id, name: foundState.name, value: val, raw: foundState });
          features = [{
            ...feat,
            properties: {
              ...feat.properties,
              ...foundState,
              val,
              targetLevel: 'state',
              targetContinentId: continentId,
              targetCountryId: countryId,
              targetStateId: stateId,
            }
          }];
        }
      }
    }

    const values = itemsForRange.map(i => i.value);
    const minVal = values.length ? Math.min(...values) : 0;
    const maxVal = values.length ? Math.max(...values) : 1;

    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features,
    };

    return { collection, minVal, maxVal, itemsForRange };
  };

  // Initialize or update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Map
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 1,
        maxZoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Apply Carto base tiles (Dark or Light)
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl = darkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Remove existing GeoJSON layer
    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    const { collection, minVal, maxVal } = getCurrentGeoData();

    // Create GeoJSON layer
    const geoLayer = L.geoJSON(collection, {
      style: (feature) => {
        const val = feature?.properties?.val || 0;
        const fillColor = getMetricColor(val, minVal, maxVal, activeMetric);
        return {
          fillColor,
          weight: 1.5,
          opacity: 0.9,
          color: darkMode ? '#334155' : '#cbd5e1',
          fillOpacity: 0.65,
        };
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties;

        // Hover handlers
        layer.on({
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({
              weight: 2.5,
              color: '#38bdf8',
              fillOpacity: 0.85,
            });
            target.bringToFront();
            setHoveredEntity(props);
          },
          mouseout: (e) => {
            geoLayer.resetStyle(e.target);
            setHoveredEntity(null);
          },
          click: () => {
            if (props.targetLevel && props.targetLevel !== level) {
              onDrillDown(
                props.targetLevel,
                props.targetContinentId,
                props.targetCountryId,
                props.targetStateId
              );
            }
          },
        });

        // Rich popup tooltip
        const popupContent = `
          <div class="p-1 text-xs">
            <div class="font-bold text-sm text-cyan-400 mb-1">${props.name}</div>
            <div class="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
              <span class="text-slate-400">Population:</span>
              <span class="text-right text-slate-200">${(props.population || 0).toLocaleString()}</span>
              <span class="text-slate-400">COVID Cases:</span>
              <span class="text-right font-bold text-cyan-300">${(props.cases || 0).toLocaleString()}</span>
              <span class="text-slate-400">Deaths:</span>
              <span class="text-right text-rose-300">${(props.deaths || 0).toLocaleString()}</span>
              <span class="text-slate-400">Recovered:</span>
              <span class="text-right text-emerald-300">${(props.recovered || 0).toLocaleString()}</span>
              <span class="text-slate-400">Vaccinated %:</span>
              <span class="text-right font-bold text-teal-300">${props.vaccinationRate || 0}%</span>
            </div>
            ${props.targetLevel !== level ? `<div class="mt-2 text-[10px] text-teal-400 font-medium">Click region to drill down →</div>` : ''}
          </div>
        `;
        layer.bindTooltip(popupContent, {
          sticky: true,
          className: 'custom-leaflet-popup',
          direction: 'top',
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = geoLayer;

    // Fit map bounds smoothly
    try {
      const bounds = geoLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: level === 'world' ? 3 : 7 });
      } else {
        map.setView([20, 0], 2);
      }
    } catch (e) {
      map.setView([20, 0], 2);
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

  }, [level, continentId, countryId, stateId, activeMetric, darkMode]);

  // Handle reset view
  const handleResetView = () => {
    if (!mapInstanceRef.current || !geoJsonLayerRef.current) return;
    try {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
      } else {
        mapInstanceRef.current.setView([20, 0], 2);
      }
    } catch {
      mapInstanceRef.current.setView([20, 0], 2);
    }
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  };

  const { minVal, maxVal } = getCurrentGeoData();

  return (
    <div
      className={`relative w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'h-[440px] sm:h-[500px] lg:h-[560px] my-4'
      }`}
    >
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Header Banner on Map */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-lg text-xs pointer-events-auto">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive Geographic Boundaries</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {level === 'world'
              ? 'Click any continent to drill down'
              : level === 'continent'
              ? 'Click any country to explore states'
              : level === 'country'
              ? 'Click any state/province to see local metrics'
              : 'Detailed state boundary & districts'}
          </div>
        </div>
      </div>

      {/* Top Right Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg shadow-md transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg shadow-md transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg shadow-md transition-colors"
          title="Reset map view"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg shadow-md transition-colors"
          title={isFullscreen ? 'Exit full screen' : 'Full screen map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Floating Choropleth Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-2 rounded-xl shadow-lg max-w-[260px] text-xs">
        <div className="font-semibold text-slate-200 text-[11px] mb-1.5 flex items-center justify-between">
          <span>Choropleth Scale:</span>
          <span className="font-mono text-teal-400 capitalize">{activeMetric}</span>
        </div>
        <div className="flex items-center gap-1 h-2.5 rounded overflow-hidden">
          <div className="flex-1 h-full" style={{ backgroundColor: getMetricColor(minVal, minVal, maxVal, activeMetric) }} />
          <div className="flex-1 h-full" style={{ backgroundColor: getMetricColor(minVal + (maxVal - minVal) * 0.25, minVal, maxVal, activeMetric) }} />
          <div className="flex-1 h-full" style={{ backgroundColor: getMetricColor(minVal + (maxVal - minVal) * 0.5, minVal, maxVal, activeMetric) }} />
          <div className="flex-1 h-full" style={{ backgroundColor: getMetricColor(minVal + (maxVal - minVal) * 0.75, minVal, maxVal, activeMetric) }} />
          <div className="flex-1 h-full" style={{ backgroundColor: getMetricColor(maxVal, minVal, maxVal, activeMetric) }} />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 tabular-nums">
          <span>{minVal >= 1000 ? `${(minVal / 1000).toFixed(0)}K` : minVal.toLocaleString()}</span>
          <span>Higher →</span>
          <span>{maxVal >= 1000000 ? `${(maxVal / 1000000).toFixed(1)}M` : maxVal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
