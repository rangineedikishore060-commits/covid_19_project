/**
 * COVID-19 Global Data Explorer
 * Geographic Boundaries and GeoJSON FeatureCollections
 * Providing accurate spatial polygons for Continents, Countries, States, and Districts
 */

import { GeoJsonObject, FeatureCollection, Feature, Geometry } from 'geojson';

// Helper to generate an approximate boundary polygon around a center [lat, lng]
export function createBoundingBoxPolygon(
  center: [number, number],
  latDelta: number,
  lngDelta: number,
  points: number = 8
): number[][][] {
  const [cLat, cLng] = center;
  const coords: number[][] = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    // slight natural roughness
    const rVar = 1 + 0.15 * Math.sin(i * 3);
    const lat = cLat + Math.sin(angle) * latDelta * rVar;
    const lng = cLng + Math.cos(angle) * lngDelta * rVar;
    coords.push([Number(lng.toFixed(4)), Number(lat.toFixed(4))]);
  }
  return [coords];
}

// ==========================================
// CONTINENT BOUNDARIES (GeoJSON)
// ==========================================
export const continentsGeoJson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'asia',
      properties: {
        id: 'asia',
        name: 'Asia',
        level: 'continent',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [26.0, 42.0], [40.0, 37.0], [50.0, 26.0], [60.0, 22.0], [70.0, 18.0],
          [80.0, 7.0], [95.0, 5.0], [105.0, -10.0], [120.0, -10.0], [140.0, 5.0],
          [145.0, 35.0], [145.0, 55.0], [170.0, 65.0], [180.0, 72.0], [100.0, 77.0],
          [60.0, 70.0], [50.0, 55.0], [40.0, 45.0], [26.0, 42.0]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'europe',
      properties: {
        id: 'europe',
        name: 'Europe',
        level: 'continent',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-10.0, 36.0], [-10.0, 44.0], [-5.0, 50.0], [-10.0, 60.0], [15.0, 71.0],
          [32.0, 70.0], [50.0, 68.0], [55.0, 55.0], [40.0, 45.0], [28.0, 40.0],
          [24.0, 35.0], [-5.0, 36.0], [-10.0, 36.0]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'north-america',
      properties: {
        id: 'north-america',
        name: 'North America',
        level: 'continent',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-168.0, 66.0], [-140.0, 70.0], [-100.0, 75.0], [-60.0, 65.0], [-55.0, 45.0],
          [-75.0, 30.0], [-80.0, 25.0], [-77.0, 8.0], [-85.0, 14.0], [-105.0, 20.0],
          [-118.0, 33.0], [-125.0, 48.0], [-135.0, 55.0], [-168.0, 66.0]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'south-america',
      properties: {
        id: 'south-america',
        name: 'South America',
        level: 'continent',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-80.0, 9.0], [-60.0, 10.0], [-50.0, 5.0], [-35.0, -5.0], [-35.0, -10.0],
          [-40.0, -22.0], [-50.0, -32.0], [-65.0, -42.0], [-68.0, -55.0], [-75.0, -48.0],
          [-73.0, -35.0], [-71.0, -18.0], [-81.0, -5.0], [-80.0, 9.0]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'africa',
      properties: {
        id: 'africa',
        name: 'Africa',
        level: 'continent',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-17.0, 15.0], [-10.0, 28.0], [0.0, 36.0], [12.0, 37.0], [32.0, 32.0],
          [40.0, 22.0], [51.0, 12.0], [42.0, -5.0], [36.0, -20.0], [32.0, -28.0],
          [28.0, -34.0], [18.0, -34.0], [12.0, -15.0], [8.0, 4.0], [-5.0, 5.0],
          [-15.0, 11.0], [-17.0, 15.0]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'oceania',
      properties: {
        id: 'oceania',
        name: 'Oceania',
        level: 'continent',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [110.0, -22.0], [115.0, -35.0], [135.0, -36.0], [148.0, -43.0], [152.0, -30.0],
          [178.0, -35.0], [178.0, -47.0], [165.0, -46.0], [153.0, -20.0], [145.0, -10.0],
          [130.0, -12.0], [115.0, -15.0], [110.0, -22.0]
        ]]
      }
    }
  ]
};

// ==========================================
// COUNTRIES BOUNDARIES (GeoJSON)
// ==========================================
export const countriesGeoJson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // INDIA
    {
      type: 'Feature',
      id: 'india',
      properties: { id: 'india', name: 'India', continentId: 'asia', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [74.0, 37.0], [78.0, 35.0], [81.0, 30.5], [88.5, 27.5], [92.0, 28.0],
          [97.0, 28.5], [95.0, 24.5], [92.5, 21.0], [88.5, 22.0], [85.0, 19.5],
          [80.0, 16.0], [80.0, 12.0], [77.5, 8.0], [76.0, 10.0], [73.5, 15.5],
          [72.5, 21.0], [68.5, 23.5], [71.0, 28.0], [74.0, 37.0]
        ]]
      }
    },
    // CHINA
    {
      type: 'Feature',
      id: 'china',
      properties: { id: 'china', name: 'China', continentId: 'asia', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [74.0, 39.5], [87.0, 49.0], [105.0, 42.0], [120.0, 53.0], [134.0, 48.0],
          [130.0, 42.0], [122.0, 38.0], [122.0, 30.0], [118.0, 24.0], [110.0, 20.5],
          [106.0, 22.0], [98.0, 21.5], [97.0, 28.5], [88.0, 28.0], [79.0, 33.0],
          [74.0, 39.5]
        ]]
      }
    },
    // JAPAN
    {
      type: 'Feature',
      id: 'japan',
      properties: { id: 'japan', name: 'Japan', continentId: 'asia', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [130.0, 31.0], [131.0, 34.0], [136.0, 35.0], [140.0, 36.0], [141.5, 41.5],
          [145.0, 44.0], [141.0, 45.5], [139.0, 41.0], [136.0, 37.0], [132.0, 33.0],
          [130.0, 31.0]
        ]]
      }
    },
    // SOUTH KOREA
    {
      type: 'Feature',
      id: 'south-korea',
      properties: { id: 'south-korea', name: 'South Korea', continentId: 'asia', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [126.0, 38.0], [128.5, 38.5], [129.5, 36.0], [129.0, 35.0], [127.5, 34.5],
          [126.0, 34.5], [126.0, 38.0]
        ]]
      }
    },
    // INDONESIA
    {
      type: 'Feature',
      id: 'indonesia',
      properties: { id: 'indonesia', name: 'Indonesia', continentId: 'asia', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [95.0, 5.5], [105.0, -6.0], [115.0, -8.5], [125.0, -9.0], [141.0, -2.5],
          [141.0, -8.0], [125.0, 1.0], [118.0, 4.0], [108.0, 2.0], [98.0, 3.0],
          [95.0, 5.5]
        ]]
      }
    },
    // UNITED STATES
    {
      type: 'Feature',
      id: 'united-states',
      properties: { id: 'united-states', name: 'United States', continentId: 'north-america', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-124.7, 48.4], [-117.0, 49.0], [-95.0, 49.0], [-82.0, 45.0], [-67.0, 45.0],
          [-71.0, 42.0], [-75.0, 39.0], [-80.0, 32.0], [-80.5, 25.0], [-88.0, 30.0],
          [-97.0, 26.0], [-106.0, 31.8], [-117.0, 32.5], [-124.5, 40.0], [-124.7, 48.4]
        ]]
      }
    },
    // CANADA
    {
      type: 'Feature',
      id: 'canada',
      properties: { id: 'canada', name: 'Canada', continentId: 'north-america', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-141.0, 69.5], [-120.0, 74.0], [-90.0, 75.0], [-60.0, 60.0], [-55.0, 48.0],
          [-67.0, 45.0], [-82.0, 45.0], [-95.0, 49.0], [-117.0, 49.0], [-124.7, 48.4],
          [-135.0, 58.0], [-141.0, 69.5]
        ]]
      }
    },
    // MEXICO
    {
      type: 'Feature',
      id: 'mexico',
      properties: { id: 'mexico', name: 'Mexico', continentId: 'north-america', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-117.0, 32.5], [-106.0, 31.8], [-97.0, 26.0], [-97.5, 20.0], [-90.0, 21.5],
          [-87.0, 21.0], [-88.0, 18.0], [-92.0, 15.0], [-97.0, 16.0], [-105.0, 20.0],
          [-110.0, 24.0], [-115.0, 30.0], [-117.0, 32.5]
        ]]
      }
    },
    // GERMANY
    {
      type: 'Feature',
      id: 'germany',
      properties: { id: 'germany', name: 'Germany', continentId: 'europe', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [6.0, 51.0], [7.0, 53.5], [9.0, 54.8], [12.0, 54.3], [14.4, 53.5],
          [15.0, 51.0], [13.0, 48.5], [10.0, 47.5], [7.5, 47.7], [6.0, 49.5],
          [6.0, 51.0]
        ]]
      }
    },
    // UNITED KINGDOM
    {
      type: 'Feature',
      id: 'united-kingdom',
      properties: { id: 'united-kingdom', name: 'United Kingdom', continentId: 'europe', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-5.5, 50.0], [-1.0, 50.5], [1.5, 52.0], [0.0, 54.0], [-2.0, 57.0],
          [-4.0, 58.5], [-6.0, 57.0], [-5.0, 54.5], [-4.5, 51.5], [-5.5, 50.0]
        ]]
      }
    },
    // FRANCE
    {
      type: 'Feature',
      id: 'france',
      properties: { id: 'france', name: 'France', continentId: 'europe', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-4.5, 48.5], [2.0, 51.0], [8.0, 49.0], [7.5, 46.0], [7.0, 43.5],
          [3.0, 42.5], [-1.5, 43.5], [-1.5, 46.0], [-4.5, 48.5]
        ]]
      }
    },
    // ITALY
    {
      type: 'Feature',
      id: 'italy',
      properties: { id: 'italy', name: 'Italy', continentId: 'europe', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [7.0, 45.5], [11.0, 46.5], [13.5, 46.0], [12.5, 44.0], [16.0, 41.0],
          [18.5, 40.0], [16.0, 38.0], [15.0, 37.0], [13.0, 38.0], [11.0, 43.0],
          [8.0, 44.0], [7.0, 45.5]
        ]]
      }
    },
    // BRAZIL
    {
      type: 'Feature',
      id: 'brazil',
      properties: { id: 'brazil', name: 'Brazil', continentId: 'south-america', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-73.0, -7.0], [-68.0, -10.0], [-60.0, -12.0], [-58.0, -18.0], [-55.0, -28.0],
          [-52.0, -32.0], [-48.0, -25.0], [-40.0, -20.0], [-35.0, -10.0], [-35.0, -5.0],
          [-45.0, -2.0], [-52.0, 2.0], [-60.0, 4.0], [-67.0, 1.0], [-73.0, -7.0]
        ]]
      }
    },
    // AUSTRALIA
    {
      type: 'Feature',
      id: 'australia',
      properties: { id: 'australia', name: 'Australia', continentId: 'oceania', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [115.0, -35.0], [120.0, -34.0], [135.0, -36.0], [148.0, -39.0], [153.0, -28.0],
          [145.0, -15.0], [142.0, -11.0], [136.0, -12.0], [130.0, -12.0], [122.0, -17.0],
          [114.0, -22.0], [115.0, -35.0]
        ]]
      }
    },
    // SOUTH AFRICA
    {
      type: 'Feature',
      id: 'south-africa',
      properties: { id: 'south-africa', name: 'South Africa', continentId: 'africa', level: 'country' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [16.5, -28.5], [20.0, -25.0], [27.0, -22.0], [31.5, -22.5], [32.8, -27.0],
          [31.0, -30.0], [28.0, -33.0], [20.0, -34.5], [18.0, -34.0], [17.5, -30.0],
          [16.5, -28.5]
        ]]
      }
    }
  ]
};

// ==========================================
// STATES & PROVINCES BOUNDARIES (GeoJSON)
// ==========================================
export const statesGeoJson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // ANDHRA PRADESH (India) - Detailed boundary
    {
      type: 'Feature',
      id: 'andhra-pradesh',
      properties: {
        id: 'andhra-pradesh',
        name: 'Andhra Pradesh',
        countryId: 'india',
        level: 'state',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.8, 14.5], [77.3, 13.8], [78.5, 13.0], [80.1, 13.4], [80.3, 15.8],
          [81.8, 16.5], [83.3, 17.7], [84.7, 19.1], [83.5, 18.5], [81.5, 17.8],
          [80.0, 16.8], [79.2, 16.0], [78.2, 15.8], [77.2, 15.2], [76.8, 14.5]
        ]]
      }
    },
    // MAHARASHTRA (India)
    {
      type: 'Feature',
      id: 'maharashtra',
      properties: { id: 'maharashtra', name: 'Maharashtra', countryId: 'india', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [72.6, 18.8], [72.8, 20.0], [74.5, 21.8], [78.5, 21.6], [80.8, 20.8],
          [80.4, 18.8], [77.5, 18.2], [75.8, 17.5], [73.8, 15.8], [73.2, 16.5],
          [72.6, 18.8]
        ]]
      }
    },
    // KARNATAKA (India)
    {
      type: 'Feature',
      id: 'karnataka',
      properties: { id: 'karnataka', name: 'Karnataka', countryId: 'india', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [74.0, 14.8], [74.8, 17.5], [77.5, 18.2], [77.2, 15.2], [78.2, 13.5],
          [77.0, 12.0], [75.5, 12.0], [74.5, 13.2], [74.0, 14.8]
        ]]
      }
    },
    // TAMIL NADU (India)
    {
      type: 'Feature',
      id: 'tamil-nadu',
      properties: { id: 'tamil-nadu', name: 'Tamil Nadu', countryId: 'india', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.2, 11.5], [77.8, 12.8], [80.3, 13.4], [79.8, 11.0], [79.0, 9.2],
          [77.5, 8.1], [77.0, 9.5], [76.5, 10.5], [76.2, 11.5]
        ]]
      }
    },
    // KERALA (India)
    {
      type: 'Feature',
      id: 'kerala',
      properties: { id: 'kerala', name: 'Kerala', countryId: 'india', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [74.9, 12.8], [76.0, 12.0], [76.8, 10.2], [77.5, 8.3], [77.0, 8.2],
          [76.2, 9.5], [75.6, 11.2], [74.9, 12.8]
        ]]
      }
    },
    // DELHI (India)
    {
      type: 'Feature',
      id: 'delhi',
      properties: { id: 'delhi', name: 'Delhi', countryId: 'india', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.8, 28.4], [77.3, 28.9], [77.4, 28.5], [77.1, 28.4], [76.8, 28.4]
        ]]
      }
    },
    // UTTAR PRADESH (India)
    {
      type: 'Feature',
      id: 'uttar-pradesh',
      properties: { id: 'uttar-pradesh', name: 'Uttar Pradesh', countryId: 'india', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.3, 29.8], [80.2, 29.0], [82.5, 27.5], [84.5, 26.5], [83.5, 24.5],
          [81.5, 24.5], [78.5, 25.5], [77.5, 27.5], [77.3, 29.8]
        ]]
      }
    },
    // GUJARAT (India)
    {
      type: 'Feature',
      id: 'gujarat',
      properties: { id: 'gujarat', name: 'Gujarat', countryId: 'india', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [68.2, 23.5], [71.0, 24.5], [73.5, 24.0], [74.0, 21.5], [72.8, 20.8],
          [71.5, 21.0], [70.0, 21.0], [69.0, 22.2], [68.2, 23.5]
        ]]
      }
    },
    // WEST BENGAL (India)
    {
      type: 'Feature',
      id: 'west-bengal',
      properties: { id: 'west-bengal', name: 'West Bengal', countryId: 'india', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [87.0, 21.8], [88.5, 21.8], [89.0, 23.5], [88.5, 26.5], [88.2, 27.2],
          [87.5, 26.5], [87.0, 24.0], [86.5, 22.5], [87.0, 21.8]
        ]]
      }
    },
    // RAJASTHAN (India)
    {
      type: 'Feature',
      id: 'rajasthan',
      properties: { id: 'rajasthan', name: 'Rajasthan', countryId: 'india', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [69.5, 27.0], [73.0, 30.0], [76.5, 28.5], [77.5, 27.0], [75.5, 24.5],
          [73.5, 24.0], [71.0, 24.8], [69.5, 27.0]
        ]]
      }
    },
    // CALIFORNIA (USA)
    {
      type: 'Feature',
      id: 'california',
      properties: { id: 'california', name: 'California', countryId: 'united-states', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-124.4, 42.0], [-120.0, 42.0], [-120.0, 39.0], [-114.6, 35.0], [-114.6, 32.7],
          [-117.2, 32.5], [-120.5, 34.5], [-122.5, 37.8], [-124.0, 40.0], [-124.4, 42.0]
        ]]
      }
    },
    // TEXAS (USA)
    {
      type: 'Feature',
      id: 'texas',
      properties: { id: 'texas', name: 'Texas', countryId: 'united-states', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-106.6, 31.8], [-103.0, 32.0], [-103.0, 36.5], [-100.0, 36.5], [-100.0, 34.5],
          [-94.0, 33.5], [-93.8, 30.0], [-97.0, 26.0], [-99.0, 26.5], [-104.0, 29.5],
          [-106.6, 31.8]
        ]]
      }
    },
    // FLORIDA (USA)
    {
      type: 'Feature',
      id: 'florida',
      properties: { id: 'florida', name: 'Florida', countryId: 'united-states', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-87.5, 31.0], [-85.0, 31.0], [-81.5, 30.8], [-80.0, 27.0], [-80.5, 25.0],
          [-82.0, 25.0], [-82.5, 28.0], [-84.5, 30.0], [-87.5, 30.5], [-87.5, 31.0]
        ]]
      }
    },
    // NEW YORK (USA)
    {
      type: 'Feature',
      id: 'new-york',
      properties: { id: 'new-york', name: 'New York', countryId: 'united-states', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-79.8, 42.0], [-79.0, 43.5], [-76.0, 44.0], [-73.5, 45.0], [-73.2, 42.0],
          [-72.0, 41.0], [-74.0, 40.5], [-75.0, 41.5], [-79.8, 42.0]
        ]]
      }
    },
    // ILLINOIS (USA)
    {
      type: 'Feature',
      id: 'illinois',
      properties: { id: 'illinois', name: 'Illinois', countryId: 'united-states', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-91.5, 42.5], [-87.5, 42.5], [-87.5, 39.5], [-87.5, 37.5], [-89.0, 37.0],
          [-91.5, 39.0], [-91.5, 42.5]
        ]]
      }
    },
    // BAVARIA (Germany)
    {
      type: 'Feature',
      id: 'bavaria',
      properties: { id: 'bavaria', name: 'Bavaria (Bayern)', countryId: 'germany', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [9.5, 50.5], [12.0, 50.3], [13.0, 49.0], [13.0, 47.8], [11.0, 47.3],
          [9.8, 47.6], [9.5, 49.0], [9.5, 50.5]
        ]]
      }
    },
    // NORTH RHINE-WESTPHALIA (Germany)
    {
      type: 'Feature',
      id: 'north-rhine-westphalia',
      properties: { id: 'north-rhine-westphalia', name: 'North Rhine-Westphalia', countryId: 'germany', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [6.0, 51.8], [7.5, 52.5], [9.0, 51.8], [8.5, 50.5], [6.5, 50.5], [6.0, 51.8]
        ]]
      }
    },
    // SÃO PAULO (Brazil)
    {
      type: 'Feature',
      id: 'sao-paulo',
      properties: { id: 'sao-paulo', name: 'São Paulo', countryId: 'brazil', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-52.5, -22.5], [-50.0, -20.0], [-47.0, -20.5], [-44.5, -23.0], [-46.0, -24.0],
          [-48.0, -25.0], [-52.5, -22.5]
        ]]
      }
    },
    // NEW SOUTH WALES (Australia)
    {
      type: 'Feature',
      id: 'new-south-wales',
      properties: { id: 'new-south-wales', name: 'New South Wales', countryId: 'australia', level: 'state' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [141.0, -29.0], [150.0, -29.0], [153.5, -28.5], [151.0, -34.0], [150.0, -37.5],
          [141.0, -34.0], [141.0, -29.0]
        ]]
      }
    }
  ]
};

// ==========================================
// DISTRICT BOUNDARIES (for Andhra Pradesh & California)
// ==========================================
export const districtsGeoJson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Andhra Pradesh Districts
    {
      type: 'Feature',
      id: 'visakhapatnam',
      properties: { id: 'visakhapatnam', name: 'Visakhapatnam', stateId: 'andhra-pradesh', level: 'district' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [82.9, 17.5], [83.4, 17.6], [83.6, 18.0], [83.1, 18.2], [82.6, 17.8], [82.9, 17.5]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'krishna',
      properties: { id: 'krishna', name: 'Krishna (Vijayawada)', stateId: 'andhra-pradesh', level: 'district' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [80.5, 16.0], [81.3, 16.2], [81.5, 16.7], [80.6, 16.9], [80.2, 16.4], [80.5, 16.0]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'guntur',
      properties: { id: 'guntur', name: 'Guntur', stateId: 'andhra-pradesh', level: 'district' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.8, 15.8], [80.6, 16.0], [80.5, 16.6], [79.9, 16.6], [79.4, 16.1], [79.8, 15.8]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'chittoor',
      properties: { id: 'chittoor', name: 'Chittoor (Tirupati)', stateId: 'andhra-pradesh', level: 'district' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [78.4, 13.0], [79.8, 13.1], [79.8, 13.8], [78.6, 13.7], [78.4, 13.0]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'east-godavari',
      properties: { id: 'east-godavari', name: 'East Godavari', stateId: 'andhra-pradesh', level: 'district' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [81.6, 16.8], [82.5, 17.1], [82.6, 17.7], [81.8, 17.6], [81.6, 16.8]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'kurnool',
      properties: { id: 'kurnool', name: 'Kurnool', stateId: 'andhra-pradesh', level: 'district' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.0, 15.2], [78.8, 15.3], [78.8, 16.1], [77.3, 16.0], [77.0, 15.2]
        ]]
      }
    },
    // California Counties
    {
      type: 'Feature',
      id: 'los-angeles',
      properties: { id: 'los-angeles', name: 'Los Angeles County', stateId: 'california', level: 'district' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.8, 34.0], [-117.8, 34.0], [-117.8, 34.8], [-118.8, 34.8], [-118.8, 34.0]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'san-diego',
      properties: { id: 'san-diego', name: 'San Diego County', stateId: 'california', level: 'district' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-117.4, 32.5], [-116.2, 32.5], [-116.2, 33.4], [-117.4, 33.4], [-117.4, 32.5]
        ]]
      }
    }
  ]
};

// Dynamic helper to ensure any item with coordinates has a polygon if not explicitly declared
export function getOrCreateFeatureForEntity(
  id: string,
  name: string,
  level: 'continent' | 'country' | 'state' | 'district',
  coordinates: [number, number],
  parentGeoJson?: FeatureCollection
): Feature {
  if (parentGeoJson) {
    const existing = parentGeoJson.features.find(f => f.properties?.id === id || f.id === id);
    if (existing) return existing;
  }

  // Generate bounded smooth circular polygon around coordinates
  const scale = level === 'continent' ? 12 : level === 'country' ? 3.5 : level === 'state' ? 1.4 : 0.4;
  return {
    type: 'Feature',
    id,
    properties: { id, name, level },
    geometry: {
      type: 'Polygon',
      coordinates: createBoundingBoxPolygon(coordinates, scale * 0.8, scale * 1.1)
    }
  };
}
