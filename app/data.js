// StatAtlas data: real national statistics for 20 countries, taken from the
// World Bank's World Development Indicators (WDI), retrieved 27 November 2026.
// Every figure below is the value the World Bank API returned for that
// indicator and year; nothing here is estimated or invented. The CO2 series
// (EN.ATM.CO2E.PC) is not included: the World Bank API reports that
// indicator as deleted/archived, so no value could be verified for it.
//
// Column order for each country row:
// [code, name, region, capital, population, gdpUsd, gdpPerCapitaUsd,
//  gdpPppUsd, lifeExpectancyYears, unemploymentPct, gdpGrowthPct,
//  populationGrowthPct, infantMortalityPer1000, urbanPct, internetPct,
//  landAreaSqKm, age65PlusPct, age0to14Pct]
// Latest values are for 2024 unless an indicator's own year says otherwise.

export const SOURCE_NAME = 'World Bank, World Development Indicators (WDI)';
export const SOURCE_URL_TEXT = 'data.worldbank.org/indicator';
export const RETRIEVED = '27 November 2026';
export const DATA_YEAR = 2024;
export const WORLD_POPULATION_2024 = 8140897523;
export const WORLD_GDP_2024 = 111669432109121;
export const SERIES_YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const INDICATORS = [
  { key: 'pop', name: 'Population, total', unit: 'people', code: 'SP.POP.TOTL', year: 2024, note: 'Mid-year population count.' },
  { key: 'gdp', name: 'GDP (current US$)', unit: 'US$', code: 'NY.GDP.MKTP.CD', year: 2024, note: 'Gross domestic product at market prices, current US dollars.' },
  { key: 'gdppc', name: 'GDP per capita (current US$)', unit: 'US$', code: 'NY.GDP.PCAP.CD', year: 2024, note: 'GDP divided by mid-year population.' },
  { key: 'gdppp', name: 'GDP, PPP (current int. $)', unit: 'int. $', code: 'NY.GDP.MKTP.PP.CD', year: 2024, note: 'GDP converted by purchasing power parity.' },
  { key: 'life', name: 'Life expectancy at birth', unit: 'years', code: 'SP.DYN.LE00.IN', year: 2024, note: 'Years a newborn would live if current mortality patterns stayed the same.' },
  { key: 'unem', name: 'Unemployment, total', unit: '% of labour force', code: 'SL.UEM.TOTL.ZS', year: 2024, note: 'Share of the labour force without work but available for and seeking employment.' },
  { key: 'growth', name: 'GDP growth (annual %)', unit: '%', code: 'NY.GDP.MKTP.KD.ZG', year: 2024, note: 'Annual percentage growth of GDP at constant prices.' },
  { key: 'popgr', name: 'Population growth (annual %)', unit: '%', code: 'SP.POP.GROW', year: 2024, note: 'Annual population growth rate.' },
  { key: 'mort', name: 'Mortality rate, infant', unit: 'per 1,000 live births', code: 'SH.DYN.MORT', year: 2024, note: 'Infants dying before age one per 1,000 live births.' },
  { key: 'urb', name: 'Urban population', unit: '% of total', code: 'SP.URB.TOTL.IN.ZS', year: 2024, note: 'Share of people living in urban areas.' },
  { key: 'net', name: 'Individuals using the Internet', unit: '% of population', code: 'IT.NET.USER.ZS', year: 2024, note: 'Share of people who used the Internet in the last three months.' },
  { key: 'land', name: 'Land area', unit: 'sq. km', code: 'AG.LND.TOTL.K2', year: 2024, note: 'Total land area excluding inland water bodies.' },
  { key: 'old', name: 'Population ages 65 and above', unit: '% of total', code: 'SP.POP.65UP.TO.ZS', year: 2024, note: 'Share of the population aged 65 and older.' },
  { key: 'young', name: 'Population ages 0–14', unit: '% of total', code: 'SP.POP.0014.TO.ZS', year: 2024, note: 'Share of the population aged 0 to 14.' },
];

export const REGIONS = ['Africa', 'Asia', 'Europe', 'North America', 'South America'];

export const COUNTRIES = [
  ['USA', 'United States', 'North America', 'Washington, D.C.', 340003797, 29298013000000, 86170, 29298013000000, 78.89, 4.02, 2.79, 0.96, 6.5, 80.12, 94.69, 9147420, 17.93, 17.32],
  ['CHN', 'China', 'Asia', 'Beijing', 1408975000, 18729668435848, 13293, 38238902604244, 78.02, 4.59, 4.96, -0.12, 5.7, 65.89, 92, 9388210, 14.67, 16.01],
  ['IND', 'India', 'Asia', 'New Delhi', 1450935791, 3760813470501, 2592, 15551990799136, 72.23, 4.17, 7.1, 0.89, 26.6, 35.38, 64.94, 2973190, 7.15, 24.62],
  ['IDN', 'Indonesia', 'Asia', 'Jakarta', 283487931, 1396301788462, 4925, 4669750008876, 71.29, 3.3, 5.03, 0.81, 17.7, 58.75, 72.78, 1892410, 7.29, 24.6],
  ['BRA', 'Brazil', 'South America', 'Brasília', 211998573, 2185821610689, 10311, 4742602740468, 76.02, 6.8, 3.42, 0.41, 14.2, 87.9, 84.46, 8358140, 11.05, 19.67],
  ['NGA', 'Nigeria', 'Africa', 'Abuja', 232679478, 252261880140, 1084, 2117352870850, 54.63, 3.04, 4.07, 2.08, 115.6, 62.98, 41.21, 910770, 3.05, 41.01],
  ['PAK', 'Pakistan', 'Asia', 'Islamabad', 251269164, 371747087751, 1479, 1573745745234, 67.8, 5.49, 3.08, 1.51, 56, 39.17, 57.25, 770880, 4.28, 36.68],
  ['BGD', 'Bangladesh', 'Asia', 'Dhaka', 173562364, 450119432069, 2593, 1676747750351, 74.93, 3.63, 4.22, 1.21, 30.5, 32.68, 53.42, 130170, 6.5, 27.99],
  ['RUS', 'Russia', 'Europe', 'Moscow', 143669648, 2186462268813, 14962, 6968620322318, 73.44, 2.43, 4.92, -0.11, 5.2, 75.11, 94.36, 16376870, 17.18, 17.28],
  ['MEX', 'Mexico', 'North America', 'Mexico City', 130861007, 1830489311089, 13988, 3378877367983, 75.26, 2.68, 1.35, 0.86, 13.1, 79.75, 83.12, 1943950, 8.25, 24.51],
  ['JPN', 'Japan', 'Asia', 'Tokyo', 123975371, 4190008188359, 33797, 6714043512608, 84.04, 2.5, -0.24, -0.44, 2.4, 92.19, 85.54, 364500, 29.78, 11.44],
  ['DEU', 'Germany', 'Europe', 'Berlin', 83516593, 4685592577805, 56104, 6176636770149, 80.79, 3.4, -0.5, 0.27, 3.7, 82.02, 93.5, 349430, 23.2, 13.91],
  ['GBR', 'United Kingdom', 'Europe', 'London', 69281000, 3695539513534, 53341, 4353581177831, 81.39, 4.36, 1.08, 1.1, 4.7, 83.24, 95.47, 241930, 19.5, 17.19],
  ['FRA', 'France', 'Europe', 'Paris', 68551653, 3160442622465, 46103, 4286160804064, 82.98, 7.4, 1.19, 0.26, 4.3, 78.8, 88.65, 538950, 22.15, 16.51],
  ['ETH', 'Ethiopia', 'Africa', 'Addis Ababa', 132059767, 149740297952, 1134, 434781603500, 67.6, 3.36, 7.61, 2.58, 44.5, 23.62, 21.94, 1122135, 3.23, 39.06],
  ['EGY', 'Egypt', 'Africa', 'Cairo', 116538258, 389059910593, 3338, 2228429994810, 71.81, 6.82, 2.4, 1.73, 22.4, 42.8, 74.65, 995450, 5.12, 31.99],
  ['VNM', 'Vietnam', 'Asia', 'Hanoi', 100987686, 476324572784, 4717, 1654976987628, 74.74, 1.6, 7.04, 0.63, 17.3, 38.49, 84.15, 313429, 9.05, 23.22],
  ['PHL', 'Philippines', 'Asia', 'Manila', 115843670, 461671157905, 3985, 1368554635188, 69.95, 2.2, 5.71, 0.83, 26.5, 55.45, 67.26, 298170, 5.49, 27.87],
  ['TUR', 'Türkiye', 'Asia', 'Ankara', 85518661, 1359123768774, 15893, 3858852700980, 77.42, 8.8, 3.33, 0.23, 9.6, 89.34, 87.31, 769630, 10.28, 21.45],
  ['THA', 'Thailand', 'Asia', 'Bangkok', 71668011, 529385520942, 7387, 1785194726242, 76.56, 0.78, 2.95, -0.05, 9, 61.87, 90.87, 510890, 15.36, 14.75],
];

// Population 2015–2024, millions, one decimal. World Bank WDI SP.POP.TOTL.
export const POP_SERIES = {
  USA: [321.8, 324.4, 326.6, 328.5, 330.2, 331.6, 332.1, 334, 336.8, 340],
  CHN: [1379.9, 1387.8, 1396.2, 1402.8, 1407.7, 1411.1, 1412.4, 1412.2, 1410.7, 1409],
  IND: [1328, 1343.9, 1359.7, 1374.7, 1389, 1402.6, 1414.2, 1425.4, 1438.1, 1450.9],
  IDN: [261.8, 264.6, 267.3, 270, 272.5, 274.8, 276.8, 278.8, 281.2, 283.5],
  BRA: [201.7, 203.2, 204.7, 206.1, 207.5, 208.7, 209.6, 210.3, 211.1, 212],
  NGA: [190.7, 195.4, 200.3, 204.9, 209.5, 214, 218.5, 223.2, 227.9, 232.7],
  PAK: [217.3, 220.1, 223.3, 226.9, 230.8, 235, 239.5, 243.7, 247.5, 251.3],
  BGD: [159.4, 160.8, 162.2, 163.5, 164.9, 166.3, 167.7, 169.4, 171.5, 173.6],
  RUS: [144.6, 145, 145.3, 145.4, 145.5, 145.2, 144.7, 144.2, 143.8, 143.7],
  MEX: [121.1, 122.3, 123.4, 124.6, 125.8, 126.8, 127.6, 128.6, 129.7, 130.9],
  JPN: [127.1, 127.1, 127, 126.8, 126.6, 126.3, 125.7, 125.1, 124.5, 124],
  DEU: [81.7, 82.3, 82.7, 82.9, 83.1, 83.2, 83.2, 83.2, 83.3, 83.5],
  GBR: [65.1, 65.6, 66, 66.3, 66.6, 66.7, 67, 67.6, 68.5, 69.3],
  FRA: [66.5, 66.7, 66.9, 67.2, 67.4, 67.6, 67.8, 68.2, 68.4, 68.6],
  ETH: [103.9, 106.7, 109.7, 112.7, 115.7, 118.9, 122.1, 125.4, 128.7, 132.1],
  EGY: [99.6, 101.6, 103.7, 105.7, 107.6, 109.3, 111, 112.6, 114.5, 116.5],
  VNM: [92.8, 94, 95.2, 96.2, 97.2, 98.1, 98.9, 99.7, 100.4, 101],
  PHL: [105.3, 106.7, 108.1, 109.5, 110.8, 112.1, 113.1, 114, 114.9, 115.8],
  TUR: [78.2, 79.3, 80.3, 81.4, 82.6, 83.4, 84.1, 85, 85.3, 85.5],
  THA: [70.5, 70.9, 71.2, 71.4, 71.5, 71.6, 71.7, 71.7, 71.7, 71.7],
};

// GDP 2015–2024, billions of current US dollars. World Bank WDI NY.GDP.MKTP.CD.
export const GDP_SERIES = {
  USA: [18295, 18805, 19612, 20657, 21540, 21375, 23726, 26055, 27812, 29298],
  CHN: [11281, 11456, 12538, 14148, 14560, 14996, 18202, 18317, 18270, 18730],
  IND: [2104, 2295, 2651, 2703, 2836, 2675, 3167, 3250, 3501, 3761],
  IDN: [861, 932, 1016, 1042, 1119, 1059, 1187, 1319, 1371, 1396],
  BRA: [1802, 1796, 2064, 1917, 1873, 1476, 1671, 1952, 2191, 2186],
  NGA: [493, 405, 376, 422, 668, 599, 609, 647, 487, 252],
  PAK: [300, 314, 339, 356, 321, 300, 349, 375, 337, 372],
  BGD: [195, 265, 294, 321, 351, 374, 416, 460, 437, 450],
  RUS: [1363, 1277, 1574, 1657, 1693, 1493, 1829, 2292, 2046, 2186],
  MEX: [1213, 1112, 1191, 1256, 1304, 1121, 1317, 1467, 1794, 1830],
  JPN: [4534, 5110, 5038, 5154, 5246, 5189, 5226, 4448, 4385, 4190],
  DEU: [3425, 3537, 3765, 4055, 3960, 3941, 4355, 4201, 4562, 4686],
  GBR: [2946, 2707, 2699, 2897, 2876, 2724, 3195, 3181, 3421, 3696],
  FRA: [2442, 2470, 2589, 2782, 2723, 2648, 2966, 2795, 3056, 3160],
  ETH: [62, 68, 76, 83, 92, 99, 109, 123, 136, 150],
  EGY: [329, 332, 248, 263, 319, 384, 425, 477, 396, 389],
  VNM: [239, 257, 281, 310, 334, 347, 366, 413, 434, 476],
  PHL: [306, 319, 328, 347, 377, 362, 394, 404, 437, 462],
  TUR: [865, 871, 864, 788, 776, 734, 840, 926, 1141, 1359],
  THA: [401, 413, 456, 507, 544, 500, 506, 496, 517, 529],
};

// Field positions in a country row, so views read rows by name.
export const F = {
  code: 0, name: 1, region: 2, capital: 3, pop: 4, gdp: 5, gdppc: 6, gdppp: 7,
  life: 8, unem: 9, growth: 10, popgr: 11, mort: 12, urb: 13, net: 14,
  land: 15, old: 16, young: 17,
};

export function countryByCode(code) {
  return COUNTRIES.find((c) => c[F.code] === code) || null;
}

export function indicatorByKey(key) {
  return INDICATORS.find((i) => i.key === key) || null;
}
