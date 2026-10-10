/**
 * COVID-19 Global Data Explorer
 * Hierarchical COVID-19 Dataset & Analytical Metrics
 * Timeline: January 2020 -> December 2023 (48 months)
 */

import { WorldData, ContinentData, CountryData, StateData, TimelinePoint } from '../types/covid';

// Helper to generate realistic monthly timeline Jan 2020 - Dec 2023 (48 months)
export function generateTimeline(
  totalCases: number,
  totalDeaths: number,
  totalRecovered: number,
  totalVaccinated: number,
  seedFactor: number = 1
): TimelinePoint[] {
  const months = [
    '2020-01', '2020-02', '2020-03', '2020-04', '2020-05', '2020-06',
    '2020-07', '2020-08', '2020-09', '2020-10', '2020-11', '2020-12',
    '2021-01', '2021-02', '2021-03', '2021-04', '2021-05', '2021-06',
    '2021-07', '2021-08', '2021-09', '2021-10', '2021-11', '2021-12',
    '2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06',
    '2022-07', '2022-08', '2022-09', '2022-10', '2022-11', '2022-12',
    '2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06',
    '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12'
  ];

  const monthNames = [
    'Jan 2020', 'Feb 2020', 'Mar 2020', 'Apr 2020', 'May 2020', 'Jun 2020',
    'Jul 2020', 'Aug 2020', 'Sep 2020', 'Oct 2020', 'Nov 2020', 'Dec 2020',
    'Jan 2021', 'Feb 2021', 'Mar 2021', 'Apr 2021', 'May 2021', 'Jun 2021',
    'Jul 2021', 'Aug 2021', 'Sep 2021', 'Oct 2021', 'Nov 2021', 'Dec 2021',
    'Jan 2022', 'Feb 2022', 'Mar 2022', 'Apr 2022', 'May 2022', 'Jun 2022',
    'Jul 2022', 'Aug 2022', 'Sep 2022', 'Oct 2022', 'Nov 2022', 'Dec 2022',
    'Jan 2023', 'Feb 2023', 'Mar 2023', 'Apr 2023', 'May 2023', 'Jun 2023',
    'Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023'
  ];

  // Cumulative progression distribution over 48 months:
  // 2020: initial emergence & winter wave (~12% of total cases)
  // 2021: Alpha & Delta waves (~35% cumulative by end of 2021)
  // 2022: Omicron mega-surge (~88% cumulative by end of 2022)
  // 2023: endemic plateau reaching 100%
  const caseWeights = [
    0.0001, 0.0005, 0.002, 0.005, 0.010, 0.016, 0.024, 0.035, 0.048, 0.065, 0.090, 0.120, // 2020
    0.145, 0.165, 0.185, 0.220, 0.260, 0.290, 0.315, 0.340, 0.370, 0.400, 0.435, 0.480, // 2021
    0.570, 0.650, 0.720, 0.770, 0.805, 0.835, 0.860, 0.885, 0.905, 0.925, 0.940, 0.955, // 2022
    0.965, 0.972, 0.978, 0.984, 0.988, 0.991, 0.994, 0.996, 0.997, 0.998, 0.999, 1.000  // 2023
  ];

  // Vaccination starts in Dec 2020, ramps rapidly throughout 2021 & 2022
  const vaxWeights = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.001, // 2020
    0.01, 0.03, 0.07, 0.14, 0.23, 0.33, 0.44, 0.54, 0.62, 0.69, 0.75, 0.80, // 2021
    0.83, 0.86, 0.88, 0.90, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.985, // 2022
    0.988, 0.990, 0.992, 0.994, 0.995, 0.996, 0.997, 0.998, 0.999, 0.999, 1.0, 1.0 // 2023
  ];

  let prevCases = 0;
  let prevDeaths = 0;

  return months.map((m, idx) => {
    // slight seed variance for natural nuance
    const noise = 1 + (Math.sin(idx * 1.7 + seedFactor) * 0.03);
    const cFactor = Math.min(1, Math.max(0, caseWeights[idx] * noise));
    const vFactor = Math.min(1, Math.max(0, vaxWeights[idx]));

    const cumCases = Math.round(totalCases * cFactor);
    const cumDeaths = Math.round(totalDeaths * Math.pow(cFactor, 0.92)); // mortality higher early in pandemic
    const cumRecovered = Math.round(totalRecovered * Math.max(0, cFactor - 0.02));
    const cumVaccinated = Math.round(totalVaccinated * vFactor);

    const newCases = Math.max(0, cumCases - prevCases);
    const newDeaths = Math.max(0, cumDeaths - prevDeaths);

    prevCases = cumCases;
    prevDeaths = cumDeaths;

    return {
      date: m,
      label: monthNames[idx],
      cases: cumCases,
      newCases,
      deaths: cumDeaths,
      newDeaths,
      recovered: cumRecovered,
      vaccinated: cumVaccinated,
    };
  });
}

function calculateClinicalStats(population: number, cases: number, deaths: number, recovered: number, vaccinated: number, fullyVaccinated: number) {
  const active = Math.max(0, cases - deaths - recovered);
  const vaccinationRate = Number(((vaccinated / population) * 100).toFixed(2));
  const nonVaccinatedRate = Number((100 - vaccinationRate).toFixed(2));
  const casesPer100k = Number(((cases / population) * 100000).toFixed(1));
  const deathsPer100k = Number(((deaths / population) * 100000).toFixed(1));
  const recoveryRate = cases > 0 ? Number(((recovered / cases) * 100).toFixed(2)) : 0;
  const caseFatalityRate = cases > 0 ? Number(((deaths / cases) * 100).toFixed(2)) : 0;

  // Unvaccinated individuals suffer disproportionately (~80% of COVID fatalities historically before booster era)
  const deathsNonVaccinated = Math.round(deaths * 0.81);
  const deathsVaccinated = Math.max(0, deaths - deathsNonVaccinated);
  
  const nonVaccinatedPop = Math.max(0, population - vaccinated);
  const aliveVaccinated = Math.max(0, vaccinated - deathsVaccinated);
  const aliveNonVaccinated = Math.max(0, nonVaccinatedPop - deathsNonVaccinated);

  return {
    population,
    cases,
    active,
    deaths,
    recovered,
    vaccinated,
    fullyVaccinated,
    deathsVaccinated,
    aliveVaccinated,
    deathsNonVaccinated,
    aliveNonVaccinated,
    vaccinationRate,
    nonVaccinatedRate,
    casesPer100k,
    deathsPer100k,
    recoveryRate,
    caseFatalityRate,
  };
}

// ==========================================
// DETAILED STATES DATA (e.g. India & USA)
// ==========================================

const indiaStates: StateData[] = [
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    countryId: 'india',
    countryName: 'India',
    coordinates: [15.9129, 79.74],
    ...calculateClinicalStats(53903393, 2340676, 14733, 2325943, 44250000, 41100000),
    districts: [
      { id: 'visakhapatnam', name: 'Visakhapatnam', coordinates: [17.6868, 83.2185], ...calculateClinicalStats(4290000, 248900, 1620, 247280, 3600000, 3350000) },
      { id: 'krishna', name: 'Krishna (Vijayawada)', coordinates: [16.1757, 81.134], ...calculateClinicalStats(4510000, 232400, 1580, 230820, 3800000, 3550000) },
      { id: 'guntur', name: 'Guntur', coordinates: [16.3067, 80.4365], ...calculateClinicalStats(4880000, 241500, 1490, 240010, 4100000, 3800000) },
      { id: 'chittoor', name: 'Chittoor (Tirupati)', coordinates: [13.2172, 79.1003], ...calculateClinicalStats(4170000, 218000, 1510, 216490, 3450000, 3200000) },
      { id: 'east-godavari', name: 'East Godavari', coordinates: [16.9891, 82.2475], ...calculateClinicalStats(5150000, 316000, 1890, 314110, 4300000, 4000000) },
      { id: 'west-godavari', name: 'West Godavari', coordinates: [16.7107, 81.0952], ...calculateClinicalStats(3930000, 204500, 1310, 203190, 3300000, 3050000) },
      { id: 'kurnool', name: 'Kurnool', coordinates: [15.8281, 78.0373], ...calculateClinicalStats(4050000, 145000, 980, 144020, 3350000, 3100000) },
      { id: 'anantapur', name: 'Anantapur', coordinates: [14.6819, 77.6006], ...calculateClinicalStats(4080000, 168000, 1140, 166860, 3400000, 3150000) },
      { id: 'nellore', name: 'SPSR Nellore', coordinates: [14.4426, 79.9865], ...calculateClinicalStats(2960000, 162000, 1120, 160880, 2500000, 2300000) },
      { id: 'prakasam', name: 'Prakasam', coordinates: [15.3471, 79.5222], ...calculateClinicalStats(3390000, 154000, 1080, 152920, 2800000, 2600000) },
    ],
    timeline: generateTimeline(2340676, 14733, 2325943, 44250000, 2.1),
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    countryId: 'india',
    countryName: 'India',
    coordinates: [19.7515, 75.7139],
    ...calculateClinicalStats(123144223, 8171048, 148560, 8022488, 93500000, 85000000),
    districts: [
      { id: 'mumbai', name: 'Mumbai', coordinates: [19.076, 72.8777], ...calculateClinicalStats(12440000, 1163000, 19700, 1143300, 10500000, 9800000) },
      { id: 'pune', name: 'Pune', coordinates: [18.5204, 73.8567], ...calculateClinicalStats(9420000, 1240000, 19800, 1220200, 8100000, 7500000) },
      { id: 'nagpur', name: 'Nagpur', coordinates: [21.1458, 79.0882], ...calculateClinicalStats(4650000, 580000, 10300, 569700, 3900000, 3600000) },
      { id: 'thane', name: 'Thane', coordinates: [19.2183, 72.9781], ...calculateClinicalStats(11060000, 820000, 12100, 807900, 8900000, 8100000) },
    ],
    timeline: generateTimeline(8171048, 148560, 8022488, 93500000, 3.4),
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    countryId: 'india',
    countryName: 'India',
    coordinates: [15.3173, 75.7139],
    ...calculateClinicalStats(67562686, 4088760, 40357, 4048403, 56000000, 52000000),
    timeline: generateTimeline(4088760, 40357, 4048403, 56000000, 4.2),
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    countryId: 'india',
    countryName: 'India',
    coordinates: [11.1271, 78.6569],
    ...calculateClinicalStats(77841267, 3610650, 38081, 3572569, 61000000, 56000000),
    timeline: generateTimeline(3610650, 38081, 3572569, 61000000, 5.1),
  },
  {
    id: 'kerala',
    name: 'Kerala',
    countryId: 'india',
    countryName: 'India',
    coordinates: [10.8505, 76.2711],
    ...calculateClinicalStats(35699443, 6907241, 72044, 6835197, 29500000, 27500000),
    timeline: generateTimeline(6907241, 72044, 6835197, 29500000, 6.0),
  },
  {
    id: 'delhi',
    name: 'Delhi',
    countryId: 'india',
    countryName: 'India',
    coordinates: [28.7041, 77.1025],
    ...calculateClinicalStats(21750000, 2040900, 26666, 2014234, 17800000, 16200000),
    timeline: generateTimeline(2040900, 26666, 2014234, 17800000, 7.3),
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    countryId: 'india',
    countryName: 'India',
    coordinates: [26.8467, 80.9462],
    ...calculateClinicalStats(241000000, 2145432, 23712, 2121720, 178000000, 160000000),
    timeline: generateTimeline(2145432, 23712, 2121720, 178000000, 8.2),
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    countryId: 'india',
    countryName: 'India',
    coordinates: [22.2587, 71.1924],
    ...calculateClinicalStats(70400000, 1291383, 11079, 1280304, 55000000, 51000000),
    timeline: generateTimeline(1291383, 11079, 1280304, 55000000, 9.1),
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    countryId: 'india',
    countryName: 'India',
    coordinates: [22.9868, 87.855],
    ...calculateClinicalStats(99000000, 2126284, 21554, 2104730, 74000000, 68000000),
    timeline: generateTimeline(2126284, 21554, 2104730, 74000000, 10.4),
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    countryId: 'india',
    countryName: 'India',
    coordinates: [27.0238, 74.2179],
    ...calculateClinicalStats(81000000, 1326462, 9736, 1316726, 61000000, 55000000),
    timeline: generateTimeline(1326462, 9736, 1316726, 61000000, 11.2),
  }
];

const usaStates: StateData[] = [
  {
    id: 'california',
    name: 'California',
    countryId: 'united-states',
    countryName: 'United States',
    coordinates: [36.7783, -119.4179],
    ...calculateClinicalStats(39240000, 12560000, 104500, 12455500, 32800000, 29200000),
    districts: [
      { id: 'los-angeles', name: 'Los Angeles County', coordinates: [34.0522, -118.2437], ...calculateClinicalStats(9830000, 3720000, 35900, 3684100, 8300000, 7400000) },
      { id: 'san-diego', name: 'San Diego County', coordinates: [32.7157, -117.1611], ...calculateClinicalStats(3280000, 1020000, 5800, 1014200, 2800000, 2500000) },
      { id: 'orange', name: 'Orange County', coordinates: [33.7175, -117.8311], ...calculateClinicalStats(3150000, 810000, 7900, 802100, 2600000, 2350000) },
      { id: 'riverside', name: 'Riverside County', coordinates: [33.9533, -117.3962], ...calculateClinicalStats(2420000, 780000, 6800, 773200, 1750000, 1550000) },
      { id: 'san-francisco', name: 'San Francisco', coordinates: [37.7749, -122.4194], ...calculateClinicalStats(874000, 198000, 1240, 196760, 790000, 740000) },
    ],
    timeline: generateTimeline(12560000, 104500, 12455500, 32800000, 1.4),
  },
  {
    id: 'texas',
    name: 'Texas',
    countryId: 'united-states',
    countryName: 'United States',
    coordinates: [31.9686, -99.9018],
    ...calculateClinicalStats(29530000, 8920000, 94200, 8825800, 19800000, 17200000),
    timeline: generateTimeline(8920000, 94200, 8825800, 19800000, 2.3),
  },
  {
    id: 'florida',
    name: 'Florida',
    countryId: 'united-states',
    countryName: 'United States',
    coordinates: [27.6648, -81.5158],
    ...calculateClinicalStats(21780000, 7810000, 90200, 7719800, 15500000, 13700000),
    timeline: generateTimeline(7810000, 90200, 7719800, 15500000, 3.1),
  },
  {
    id: 'new-york',
    name: 'New York',
    countryId: 'united-states',
    countryName: 'United States',
    coordinates: [40.7128, -74.006],
    ...calculateClinicalStats(19840000, 7250000, 80400, 7169600, 17600000, 15600000),
    timeline: generateTimeline(7250000, 80400, 7169600, 17600000, 4.5),
  },
  {
    id: 'illinois',
    name: 'Illinois',
    countryId: 'united-states',
    countryName: 'United States',
    coordinates: [40.6331, -89.3985],
    ...calculateClinicalStats(12670000, 4180000, 42100, 4137900, 9800000, 8800000),
    timeline: generateTimeline(4180000, 42100, 4137900, 9800000, 5.2),
  },
  {
    id: 'pennsylvania',
    name: 'Pennsylvania',
    countryId: 'united-states',
    countryName: 'United States',
    coordinates: [41.2033, -77.1945],
    ...calculateClinicalStats(12970000, 3580000, 51300, 3528700, 9900000, 8900000),
    timeline: generateTimeline(3580000, 51300, 3528700, 9900000, 6.1),
  },
  {
    id: 'ohio',
    name: 'Ohio',
    countryId: 'united-states',
    countryName: 'United States',
    coordinates: [40.4173, -82.9071],
    ...calculateClinicalStats(11780000, 3470000, 42500, 3427500, 7500000, 6800000),
    timeline: generateTimeline(3470000, 42500, 3427500, 7500000, 7.0),
  },
  {
    id: 'georgia',
    name: 'Georgia',
    countryId: 'united-states',
    countryName: 'United States',
    coordinates: [32.1656, -82.9001],
    ...calculateClinicalStats(10710000, 3120000, 42800, 3077200, 6400000, 5700000),
    timeline: generateTimeline(3120000, 42800, 3077200, 6400000, 8.4),
  },
  {
    id: 'washington',
    name: 'Washington',
    countryId: 'united-states',
    countryName: 'United States',
    coordinates: [47.7511, -120.7401],
    ...calculateClinicalStats(7700000, 1980000, 16200, 1963800, 6200000, 5600000),
    timeline: generateTimeline(1980000, 16200, 1963800, 6200000, 9.2),
  }
];

const germanyStates: StateData[] = [
  {
    id: 'bavaria',
    name: 'Bavaria (Bayern)',
    countryId: 'germany',
    countryName: 'Germany',
    coordinates: [48.7904, 11.4979],
    ...calculateClinicalStats(13140000, 6150000, 28100, 6121900, 10200000, 9700000),
    timeline: generateTimeline(6150000, 28100, 6121900, 10200000, 1.2),
  },
  {
    id: 'north-rhine-westphalia',
    name: 'North Rhine-Westphalia',
    countryId: 'germany',
    countryName: 'Germany',
    coordinates: [51.4332, 7.6616],
    ...calculateClinicalStats(17930000, 8320000, 34200, 8285800, 14400000, 13700000),
    timeline: generateTimeline(8320000, 34200, 8285800, 14400000, 2.4),
  },
  {
    id: 'baden-wurttemberg',
    name: 'Baden-Württemberg',
    countryId: 'germany',
    countryName: 'Germany',
    coordinates: [48.6616, 9.3501],
    ...calculateClinicalStats(11100000, 5100000, 20300, 5079700, 8700000, 8200000),
    timeline: generateTimeline(5100000, 20300, 5079700, 8700000, 3.1),
  },
  {
    id: 'berlin',
    name: 'Berlin',
    countryId: 'germany',
    countryName: 'Germany',
    coordinates: [52.52, 13.405],
    ...calculateClinicalStats(3670000, 1720000, 5600, 1714400, 2900000, 2750000),
    timeline: generateTimeline(1720000, 5600, 1714400, 2900000, 4.3),
  }
];

const brazilStates: StateData[] = [
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    countryId: 'brazil',
    countryName: 'Brazil',
    coordinates: [-23.5505, -46.6333],
    ...calculateClinicalStats(46600000, 6580000, 181000, 6399000, 41200000, 38500000),
    timeline: generateTimeline(6580000, 181000, 6399000, 41200000, 1.5),
  },
  {
    id: 'rio-de-janeiro',
    name: 'Rio de Janeiro',
    countryId: 'brazil',
    countryName: 'Brazil',
    coordinates: [-22.9068, -43.1729],
    ...calculateClinicalStats(17400000, 2810000, 77500, 2732500, 14200000, 13100000),
    timeline: generateTimeline(2810000, 77500, 2732500, 14200000, 2.7),
  },
  {
    id: 'minas-gerais',
    name: 'Minas Gerais',
    countryId: 'brazil',
    countryName: 'Brazil',
    coordinates: [-18.5122, -44.555],
    ...calculateClinicalStats(21400000, 4150000, 65400, 4084600, 18100000, 16800000),
    timeline: generateTimeline(4150000, 65400, 4084600, 18100000, 3.8),
  }
];

const australiaStates: StateData[] = [
  {
    id: 'new-south-wales',
    name: 'New South Wales',
    countryId: 'australia',
    countryName: 'Australia',
    coordinates: [-31.8402, 145.6128],
    ...calculateClinicalStats(8160000, 4120000, 6900, 4113100, 7400000, 7150000),
    timeline: generateTimeline(4120000, 6900, 4113100, 7400000, 1.7),
  },
  {
    id: 'victoria',
    name: 'Victoria',
    countryId: 'australia',
    countryName: 'Australia',
    coordinates: [-37.4713, 144.7852],
    ...calculateClinicalStats(6680000, 3210000, 8100, 3201900, 6100000, 5900000),
    timeline: generateTimeline(3210000, 8100, 3201900, 6100000, 2.5),
  },
  {
    id: 'queensland',
    name: 'Queensland',
    countryId: 'australia',
    countryName: 'Australia',
    coordinates: [-20.9176, 142.7028],
    ...calculateClinicalStats(5250000, 1980000, 3400, 1976600, 4600000, 4420000),
    timeline: generateTimeline(1980000, 3400, 1976600, 4600000, 3.4),
  }
];

// ==========================================
// COUNTRIES DATA BY CONTINENT
// ==========================================

const asiaCountries: CountryData[] = [
  {
    id: 'india',
    name: 'India',
    code: 'IN',
    continentId: 'asia',
    continentName: 'Asia',
    coordinates: [20.5937, 78.9629],
    ...calculateClinicalStats(1428627663, 44998534, 531930, 44466604, 1027000000, 952000000),
    states: indiaStates,
    timeline: generateTimeline(44998534, 531930, 44466604, 1027000000, 1.1),
  },
  {
    id: 'china',
    name: 'China',
    code: 'CN',
    continentId: 'asia',
    continentName: 'Asia',
    coordinates: [35.8617, 104.1954],
    ...calculateClinicalStats(1425671352, 99341000, 121800, 99219200, 1310000000, 1280000000),
    states: [
      { id: 'guangdong', name: 'Guangdong', countryId: 'china', countryName: 'China', coordinates: [23.379, 113.7633], ...calculateClinicalStats(126000000, 8900000, 7200, 8892800, 118000000, 115000000), timeline: generateTimeline(8900000, 7200, 8892800, 118000000, 1) },
      { id: 'shandong', name: 'Shandong', countryId: 'china', countryName: 'China', coordinates: [36.3427, 118.1498], ...calculateClinicalStats(101500000, 6800000, 5400, 6794600, 95000000, 92000000), timeline: generateTimeline(6800000, 5400, 6794600, 95000000, 2) },
      { id: 'hubei', name: 'Hubei (Wuhan)', countryId: 'china', countryName: 'China', coordinates: [30.5928, 114.3055], ...calculateClinicalStats(57750000, 5200000, 4512, 5195488, 54000000, 52500000), timeline: generateTimeline(5200000, 4512, 5195488, 54000000, 3) },
    ],
    timeline: generateTimeline(99341000, 121800, 99219200, 1310000000, 2.2),
  },
  {
    id: 'japan',
    name: 'Japan',
    code: 'JP',
    continentId: 'asia',
    continentName: 'Asia',
    coordinates: [36.2048, 138.2529],
    ...calculateClinicalStats(123951692, 33803572, 74694, 33728878, 104700000, 102400000),
    states: [
      { id: 'tokyo', name: 'Tokyo Prefecture', countryId: 'japan', countryName: 'Japan', coordinates: [35.6762, 139.6503], ...calculateClinicalStats(14000000, 4400000, 8200, 4391800, 11900000, 11600000), timeline: generateTimeline(4400000, 8200, 4391800, 11900000, 1) },
      { id: 'osaka', name: 'Osaka Prefecture', countryId: 'japan', countryName: 'Japan', coordinates: [34.6937, 135.5023], ...calculateClinicalStats(8830000, 2900000, 6900, 2893100, 7400000, 7200000), timeline: generateTimeline(2900000, 6900, 2893100, 7400000, 2) },
    ],
    timeline: generateTimeline(33803572, 74694, 33728878, 104700000, 3.3),
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    code: 'KR',
    continentId: 'asia',
    continentName: 'Asia',
    coordinates: [35.9078, 127.7669],
    ...calculateClinicalStats(51784059, 34571873, 35934, 34535939, 44800000, 44400000),
    states: [
      { id: 'seoul', name: 'Seoul Capital Area', countryId: 'south-korea', countryName: 'South Korea', coordinates: [37.5665, 126.978], ...calculateClinicalStats(9700000, 8100000, 6400, 8093600, 8400000, 8300000), timeline: generateTimeline(8100000, 6400, 8093600, 8400000, 1) },
      { id: 'gyeonggi', name: 'Gyeonggi Province', countryId: 'south-korea', countryName: 'South Korea', coordinates: [37.4138, 127.5183], ...calculateClinicalStats(13500000, 9900000, 8500, 9891500, 11700000, 11600000), timeline: generateTimeline(9900000, 8500, 9891500, 11700000, 2) },
    ],
    timeline: generateTimeline(34571873, 35934, 34535939, 44800000, 4.4),
  },
  {
    id: 'indonesia',
    name: 'Indonesia',
    code: 'ID',
    continentId: 'asia',
    continentName: 'Asia',
    coordinates: [-0.7893, 113.9213],
    ...calculateClinicalStats(277534122, 6813429, 161918, 6646000, 204000000, 175000000),
    states: [
      { id: 'jakarta', name: 'DKI Jakarta', countryId: 'indonesia', countryName: 'Indonesia', coordinates: [-6.2088, 106.8456], ...calculateClinicalStats(10560000, 1540000, 15900, 1524100, 9900000, 8900000), timeline: generateTimeline(1540000, 15900, 1524100, 9900000, 1) },
      { id: 'west-java', name: 'West Java', countryId: 'indonesia', countryName: 'Indonesia', coordinates: [-6.9175, 107.6191], ...calculateClinicalStats(49900000, 1230000, 16200, 1213800, 37000000, 31500000), timeline: generateTimeline(1230000, 16200, 1213800, 37000000, 2) },
    ],
    timeline: generateTimeline(6813429, 161918, 6646000, 204000000, 5.5),
  },
  {
    id: 'philippines',
    name: 'Philippines',
    code: 'PH',
    continentId: 'asia',
    continentName: 'Asia',
    coordinates: [12.8797, 121.774],
    ...calculateClinicalStats(117337368, 4140383, 66864, 4068000, 78500000, 74000000),
    states: [
      { id: 'metro-manila', name: 'National Capital Region (NCR)', countryId: 'philippines', countryName: 'Philippines', coordinates: [14.5995, 120.9842], ...calculateClinicalStats(13480000, 1310000, 14200, 1295800, 11500000, 10900000), timeline: generateTimeline(1310000, 14200, 1295800, 11500000, 1) },
    ],
    timeline: generateTimeline(4140383, 66864, 4068000, 78500000, 6.6),
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    code: 'VN',
    continentId: 'asia',
    continentName: 'Asia',
    coordinates: [14.0583, 108.2772],
    ...calculateClinicalStats(98858915, 11624000, 43206, 11578000, 90500000, 86000000),
    states: [
      { id: 'ho-chi-minh', name: 'Ho Chi Minh City', countryId: 'vietnam', countryName: 'Vietnam', coordinates: [10.8231, 106.6297], ...calculateClinicalStats(9300000, 2800000, 20100, 2779900, 8900000, 8500000), timeline: generateTimeline(2800000, 20100, 2779900, 8900000, 1) },
      { id: 'hanoi', name: 'Hanoi', countryId: 'vietnam', countryName: 'Vietnam', coordinates: [21.0285, 105.8542], ...calculateClinicalStats(8400000, 1650000, 1500, 1648500, 8100000, 7800000), timeline: generateTimeline(1650000, 1500, 1648500, 8100000, 2) },
    ],
    timeline: generateTimeline(11624000, 43206, 11578000, 90500000, 7.7),
  }
];

const northAmericaCountries: CountryData[] = [
  {
    id: 'united-states',
    name: 'United States',
    code: 'US',
    continentId: 'north-america',
    continentName: 'North America',
    coordinates: [37.0902, -95.7129],
    ...calculateClinicalStats(339996563, 103436829, 1127152, 102000000, 270227181, 230637348),
    states: usaStates,
    timeline: generateTimeline(103436829, 1127152, 102000000, 270227181, 1.3),
  },
  {
    id: 'mexico',
    name: 'Mexico',
    code: 'MX',
    continentId: 'north-america',
    continentName: 'North America',
    coordinates: [23.6345, -102.5528],
    ...calculateClinicalStats(128455567, 7702809, 334958, 7360000, 97100000, 81500000),
    states: [
      { id: 'cdmx', name: 'Mexico City (CDMX)', countryId: 'mexico', countryName: 'Mexico', coordinates: [19.4326, -99.1332], ...calculateClinicalStats(9200000, 1850000, 58000, 1785000, 8100000, 7300000), timeline: generateTimeline(1850000, 58000, 1785000, 8100000, 1) },
      { id: 'jalisco', name: 'Jalisco', countryId: 'mexico', countryName: 'Mexico', coordinates: [20.6597, -103.3496], ...calculateClinicalStats(8350000, 720000, 20100, 698000, 6100000, 5200000), timeline: generateTimeline(720000, 20100, 698000, 6100000, 2) },
    ],
    timeline: generateTimeline(7702809, 334958, 7360000, 97100000, 2.4),
  },
  {
    id: 'canada',
    name: 'Canada',
    code: 'CA',
    continentId: 'north-america',
    continentName: 'North America',
    coordinates: [56.1304, -106.3468],
    ...calculateClinicalStats(38781291, 4697506, 53147, 4635000, 34500000, 32100000),
    states: [
      { id: 'ontario', name: 'Ontario', countryId: 'canada', countryName: 'Canada', coordinates: [51.2538, -85.3232], ...calculateClinicalStats(14800000, 1680000, 16500, 1660000, 13100000, 12400000), timeline: generateTimeline(1680000, 16500, 1660000, 13100000, 1) },
      { id: 'quebec', name: 'Quebec', countryId: 'canada', countryName: 'Canada', coordinates: [52.9399, -73.5491], ...calculateClinicalStats(8600000, 1350000, 18400, 1330000, 7600000, 7200000), timeline: generateTimeline(1350000, 18400, 1330000, 7600000, 2) },
    ],
    timeline: generateTimeline(4697506, 53147, 4635000, 34500000, 3.5),
  }
];

const europeCountries: CountryData[] = [
  {
    id: 'germany',
    name: 'Germany',
    code: 'DE',
    continentId: 'europe',
    continentName: 'Europe',
    coordinates: [51.1657, 10.4515],
    ...calculateClinicalStats(83294633, 38437729, 174979, 38240000, 64800000, 63500000),
    states: germanyStates,
    timeline: generateTimeline(38437729, 174979, 38240000, 64800000, 1.8),
  },
  {
    id: 'france',
    name: 'France',
    code: 'FR',
    continentId: 'europe',
    continentName: 'Europe',
    coordinates: [46.2276, 2.2137],
    ...calculateClinicalStats(67750000, 40138560, 167642, 39950000, 54600000, 53200000),
    states: [
      { id: 'ile-de-france', name: 'Île-de-France (Paris)', countryId: 'france', countryName: 'France', coordinates: [48.8499, 2.637], ...calculateClinicalStats(12300000, 7800000, 31000, 7765000, 10100000, 9800000), timeline: generateTimeline(7800000, 31000, 7765000, 10100000, 1) },
    ],
    timeline: generateTimeline(40138560, 167642, 39950000, 54600000, 2.9),
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    code: 'GB',
    continentId: 'europe',
    continentName: 'Europe',
    coordinates: [55.3781, -3.436],
    ...calculateClinicalStats(67081000, 24658705, 228811, 24400000, 53800000, 50600000),
    states: [
      { id: 'england', name: 'England', countryId: 'united-kingdom', countryName: 'United Kingdom', coordinates: [52.3555, -1.1743], ...calculateClinicalStats(56500000, 20800000, 192000, 20580000, 45200000, 42600000), timeline: generateTimeline(20800000, 192000, 20580000, 45200000, 1) },
      { id: 'scotland', name: 'Scotland', countryId: 'united-kingdom', countryName: 'United Kingdom', coordinates: [56.4907, -4.2026], ...calculateClinicalStats(5460000, 2100000, 19100, 2078000, 4450000, 4200000), timeline: generateTimeline(2100000, 19100, 2078000, 4450000, 2) },
    ],
    timeline: generateTimeline(24658705, 228811, 24400000, 53800000, 3.2),
  },
  {
    id: 'italy',
    name: 'Italy',
    code: 'IT',
    continentId: 'europe',
    continentName: 'Europe',
    coordinates: [41.8719, 12.5674],
    ...calculateClinicalStats(58940000, 26723249, 196497, 26480000, 50800000, 48300000),
    states: [
      { id: 'lombardy', name: 'Lombardy (Milan)', countryId: 'italy', countryName: 'Italy', coordinates: [45.4642, 9.19], ...calculateClinicalStats(10060000, 4400000, 46000, 4350000, 8900000, 8500000), timeline: generateTimeline(4400000, 46000, 4350000, 8900000, 1) },
    ],
    timeline: generateTimeline(26723249, 196497, 26480000, 50800000, 4.3),
  },
  {
    id: 'spain',
    name: 'Spain',
    code: 'ES',
    continentId: 'europe',
    continentName: 'Europe',
    coordinates: [40.4637, -3.7492],
    ...calculateClinicalStats(47780000, 13914811, 121760, 13780000, 41300000, 39200000),
    states: [
      { id: 'madrid', name: 'Community of Madrid', countryId: 'spain', countryName: 'Spain', coordinates: [40.4168, -3.7038], ...calculateClinicalStats(6750000, 2150000, 20500, 2128000, 5900000, 5600000), timeline: generateTimeline(2150000, 20500, 2128000, 5900000, 1) },
    ],
    timeline: generateTimeline(13914811, 121760, 13780000, 41300000, 5.4),
  }
];

const southAmericaCountries: CountryData[] = [
  {
    id: 'brazil',
    name: 'Brazil',
    code: 'BR',
    continentId: 'south-america',
    continentName: 'South America',
    coordinates: [-14.235, -51.9253],
    ...calculateClinicalStats(215313498, 38743918, 712340, 37900000, 190000000, 176000000),
    states: brazilStates,
    timeline: generateTimeline(38743918, 712340, 37900000, 190000000, 1.4),
  },
  {
    id: 'argentina',
    name: 'Argentina',
    code: 'AR',
    continentId: 'south-america',
    continentName: 'South America',
    coordinates: [-38.4161, -63.6167],
    ...calculateClinicalStats(45808747, 10044957, 130472, 9910000, 41500000, 38100000),
    states: [
      { id: 'buenos-aires', name: 'Buenos Aires Province', countryId: 'argentina', countryName: 'Argentina', coordinates: [-35.5, -60.0], ...calculateClinicalStats(17500000, 3950000, 60800, 3885000, 16100000, 14900000), timeline: generateTimeline(3950000, 60800, 3885000, 16100000, 1) },
    ],
    timeline: generateTimeline(10044957, 130472, 9910000, 41500000, 2.5),
  },
  {
    id: 'colombia',
    name: 'Colombia',
    code: 'CO',
    continentId: 'south-america',
    continentName: 'South America',
    coordinates: [4.5709, -74.2973],
    ...calculateClinicalStats(51874024, 6384891, 142727, 6235000, 42800000, 37100000),
    states: [
      { id: 'bogota', name: 'Bogotá Capital District', countryId: 'colombia', countryName: 'Colombia', coordinates: [4.711, -74.0721], ...calculateClinicalStats(7900000, 1890000, 30200, 1858000, 6800000, 6200000), timeline: generateTimeline(1890000, 30200, 1858000, 6800000, 1) },
    ],
    timeline: generateTimeline(6384891, 142727, 6235000, 42800000, 3.6),
  }
];

const africaCountries: CountryData[] = [
  {
    id: 'south-africa',
    name: 'South Africa',
    code: 'ZA',
    continentId: 'africa',
    continentName: 'Africa',
    coordinates: [-30.5595, 22.9375],
    ...calculateClinicalStats(59893885, 4072681, 102595, 3965000, 24000000, 21000000),
    states: [
      { id: 'gauteng', name: 'Gauteng (Johannesburg)', countryId: 'south-africa', countryName: 'South Africa', coordinates: [-26.2041, 28.0473], ...calculateClinicalStats(15800000, 1360000, 21200, 1338000, 6800000, 5900000), timeline: generateTimeline(1360000, 21200, 1338000, 6800000, 1) },
      { id: 'western-cape', name: 'Western Cape (Cape Town)', countryId: 'south-africa', countryName: 'South Africa', coordinates: [-33.9249, 18.4241], ...calculateClinicalStats(7200000, 710000, 22500, 687000, 3600000, 3200000), timeline: generateTimeline(710000, 22500, 687000, 3600000, 2) },
    ],
    timeline: generateTimeline(4072681, 102595, 3965000, 24000000, 1.2),
  },
  {
    id: 'egypt',
    name: 'Egypt',
    code: 'EG',
    continentId: 'africa',
    continentName: 'Africa',
    coordinates: [26.8206, 30.8025],
    ...calculateClinicalStats(110990103, 516023, 24830, 490000, 56000000, 41000000),
    states: [
      { id: 'cairo', name: 'Cairo Governorate', countryId: 'egypt', countryName: 'Egypt', coordinates: [30.0444, 31.2357], ...calculateClinicalStats(10200000, 142000, 6200, 135000, 5800000, 4300000), timeline: generateTimeline(142000, 6200, 135000, 5800000, 1) },
    ],
    timeline: generateTimeline(516023, 24830, 490000, 56000000, 2.3),
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    code: 'NG',
    continentId: 'africa',
    continentName: 'Africa',
    coordinates: [9.082, 8.6753],
    ...calculateClinicalStats(218541212, 267188, 3155, 260000, 81000000, 73000000),
    states: [
      { id: 'lagos', name: 'Lagos State', countryId: 'nigeria', countryName: 'Nigeria', coordinates: [6.5244, 3.3792], ...calculateClinicalStats(15300000, 105000, 820, 103500, 7100000, 6400000), timeline: generateTimeline(105000, 820, 103500, 7100000, 1) },
    ],
    timeline: generateTimeline(267188, 3155, 260000, 81000000, 3.4),
  }
];

const oceaniaCountries: CountryData[] = [
  {
    id: 'australia',
    name: 'Australia',
    code: 'AU',
    continentId: 'oceania',
    continentName: 'Oceania',
    coordinates: [-25.2744, 133.7751],
    ...calculateClinicalStats(26177413, 11765000, 24414, 11720000, 22200000, 21400000),
    states: australiaStates,
    timeline: generateTimeline(11765000, 24414, 11720000, 22200000, 1.6),
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    code: 'NZ',
    continentId: 'oceania',
    continentName: 'Oceania',
    coordinates: [-40.9006, 174.886],
    ...calculateClinicalStats(5124100, 2580000, 5630, 2570000, 4400000, 4250000),
    states: [
      { id: 'auckland', name: 'Auckland Region', countryId: 'new-zealand', countryName: 'New Zealand', coordinates: [-36.8485, 174.7633], ...calculateClinicalStats(1720000, 920000, 1920, 917000, 1530000, 1490000), timeline: generateTimeline(920000, 1920, 917000, 1530000, 1) },
    ],
    timeline: generateTimeline(2580000, 5630, 2570000, 4400000, 2.7),
  }
];

// ==========================================
// CONTINENTS DATA
// ==========================================

function aggregateContinent(
  id: string,
  name: string,
  code: string,
  coordinates: [number, number],
  zoomLevel: number,
  countries: CountryData[],
  totalPopulation: number
): ContinentData {
  const cases = countries.reduce((acc, c) => acc + c.cases, 0);
  const deaths = countries.reduce((acc, c) => acc + c.deaths, 0);
  const recovered = countries.reduce((acc, c) => acc + c.recovered, 0);
  const vaccinated = countries.reduce((acc, c) => acc + c.vaccinated, 0);
  const fullyVaccinated = countries.reduce((acc, c) => acc + c.fullyVaccinated, 0);

  return {
    id,
    name,
    code,
    coordinates,
    zoomLevel,
    countries,
    ...calculateClinicalStats(totalPopulation, cases, deaths, recovered, vaccinated, fullyVaccinated),
    timeline: generateTimeline(cases, deaths, recovered, vaccinated, 1.5),
  };
}

export const continentsData: ContinentData[] = [
  aggregateContinent('asia', 'Asia', 'AS', [34.0479, 100.6197], 3, asiaCountries, 4753000000),
  aggregateContinent('europe', 'Europe', 'EU', [54.526, 15.2551], 4, europeCountries, 746000000),
  aggregateContinent('north-america', 'North America', 'NA', [54.526, -105.2551], 3, northAmericaCountries, 596000000),
  aggregateContinent('south-america', 'South America', 'SA', [-8.7832, -55.4915], 3, southAmericaCountries, 434000000),
  aggregateContinent('africa', 'Africa', 'AF', [-0.228, 20.7323], 3, africaCountries, 1427000000),
  aggregateContinent('oceania', 'Oceania', 'OC', [-22.7359, 140.0188], 4, oceaniaCountries, 45000000),
];

// ==========================================
// WORLD DATA
// ==========================================

const totalWorldPop = 8001000000;
const totalWorldCases = continentsData.reduce((acc, c) => acc + c.cases, 0);
const totalWorldDeaths = continentsData.reduce((acc, c) => acc + c.deaths, 0);
const totalWorldRecovered = continentsData.reduce((acc, c) => acc + c.recovered, 0);
const totalWorldVaccinated = continentsData.reduce((acc, c) => acc + c.vaccinated, 0);
const totalWorldFullyVaccinated = continentsData.reduce((acc, c) => acc + c.fullyVaccinated, 0);

export const worldData: WorldData = {
  id: 'world',
  name: 'World',
  continents: continentsData,
  ...calculateClinicalStats(totalWorldPop, totalWorldCases, totalWorldDeaths, totalWorldRecovered, totalWorldVaccinated, totalWorldFullyVaccinated),
  timeline: generateTimeline(totalWorldCases, totalWorldDeaths, totalWorldRecovered, totalWorldVaccinated, 1.0),
};

// ==========================================
// SEARCH INDEX GENERATION
// ==========================================

export function buildSearchIndex() {
  const items: Array<{
    id: string;
    name: string;
    level: 'world' | 'continent' | 'country' | 'state';
    continentId?: string;
    countryId?: string;
    stateId?: string;
    parentName?: string;
    population: number;
    cases: number;
  }> = [
    {
      id: 'world',
      name: 'World (Global Overview)',
      level: 'world',
      population: worldData.population,
      cases: worldData.cases,
    }
  ];

  for (const cont of continentsData) {
    items.push({
      id: cont.id,
      name: cont.name,
      level: 'continent',
      continentId: cont.id,
      population: cont.population,
      cases: cont.cases,
      parentName: 'World',
    });

    for (const country of cont.countries) {
      items.push({
        id: country.id,
        name: country.name,
        level: 'country',
        continentId: cont.id,
        countryId: country.id,
        parentName: cont.name,
        population: country.population,
        cases: country.cases,
      });

      for (const st of country.states) {
        items.push({
          id: st.id,
          name: st.name,
          level: 'state',
          continentId: cont.id,
          countryId: country.id,
          stateId: st.id,
          parentName: `${country.name}, ${cont.name}`,
          population: st.population,
          cases: st.cases,
        });
      }
    }
  }

  return items;
}
