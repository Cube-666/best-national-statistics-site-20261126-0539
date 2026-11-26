// StatAtlas views: HTML for each page, built from the data in data.js.
// Every figure shown carries its year and its source; nothing is invented.
// Charts are drawn by charts.js after the HTML lands in the page.

import {
  COUNTRIES, F, INDICATORS, REGIONS, RETRIEVED, SOURCE_NAME,
  WORLD_POPULATION_2024, WORLD_GDP_2024, countryByCode, indicatorByKey,
} from './data.js';

export const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function fmtInt(n) {
  return Number(n).toLocaleString('en-US');
}

export function fmtPop(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`;
  return `${(n / 1e6).toFixed(1)} million`;
}

export function fmtUsd(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)} trillion`;
  return `$${(n / 1e9).toFixed(1)} billion`;
}

export function fmtUsdShort(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${Math.round(n / 1e9)}B`;
  return `$${Math.round(n / 1e6)}M`;
}

export function fmtPct(v, decimals) {
  return `${Number(v).toFixed(decimals === undefined ? 1 : decimals)}%`;
}

export function fmtSigned(v) {
  return `${v > 0 ? '+' : ''}${Number(v).toFixed(2)}%`;
}

function sourceLine() {
  return `<p class="source">Source: ${escape(SOURCE_NAME)}, retrieved ${escape(RETRIEVED)}. Latest values are for 2024 unless a figure says otherwise.</p>`;
}

function statCard(label, value, sub) {
  return `<div class="stat"><span class="stat-label">${escape(label)}</span><strong class="stat-value">${value}</strong><span class="stat-sub">${sub}</span></div>`;
}

function topList(title, rows, link) {
  const items = rows.map(([code, value]) => {
    const c = countryByCode(code);
    return `<li><a href="#/country/${c[F.code]}">${escape(c[F.name])}</a><span>${value}</span></li>`;
  }).join('');
  return `<section class="card"><h2>${escape(title)}</h2><ol class="toplist">${items}</ol><p class="card-link"><a href="${link}">See all countries &rarr;</a></p></section>`;
}

export function home() {
  const byPop = [...COUNTRIES].sort((a, b) => b[F.pop] - a[F.pop]).slice(0, 5);
  const byGdp = [...COUNTRIES].sort((a, b) => b[F.gdp] - a[F.gdp]).slice(0, 5);
  const byGrowth = [...COUNTRIES].sort((a, b) => b[F.growth] - a[F.growth]).slice(0, 5);
  const byLife = [...COUNTRIES].sort((a, b) => b[F.life] - a[F.life]).slice(0, 5);
  const cards = COUNTRIES.map((c) => `<a class="country-chip" href="#/country/${c[F.code]}"><strong>${escape(c[F.name])}</strong><span>${fmtPop(c[F.pop])} · ${fmtUsd(c[F.gdp])}</span></a>`).join('');
  return `
<section class="hero">
  <p class="eyebrow">National statistics · 20 countries · 2024</p>
  <h1>National statistics,<br>clearly presented.</h1>
  <p class="lede">Population, economy, health and society for twenty of the world&rsquo;s countries, with every figure sourced and dated. Pick a country, compare countries, or explore one indicator at a time.</p>
  <div class="hero-stats">
    ${statCard('World population, 2024', fmtPop(WORLD_POPULATION_2024), 'World Bank WDI')}
    ${statCard('World GDP, 2024', fmtUsd(WORLD_GDP_2024), 'World Bank WDI, current US$')}
    ${statCard('Countries covered', '20', '5 regions')}
    ${statCard('Indicators', String(INDICATORS.length), '2015–2024 series')}
  </div>
  <p class="hero-actions"><a class="btn" href="#/countries">Browse all countries</a> <a class="btn btn-ghost" href="#/compare">Compare countries</a></p>
</section>
<section class="chart-grid">
  <div class="card"><h2>Largest populations, 2024</h2><canvas id="home-pop" aria-label="Bar chart of the ten largest populations in 2024"></canvas>${sourceLine()}</div>
  <div class="card"><h2>Largest economies, 2024</h2><canvas id="home-gdp" aria-label="Bar chart of the ten largest economies in 2024"></canvas>${sourceLine()}</div>
</section>
<section class="list-grid">
  ${topList('Fastest-growing economies, 2024', byGrowth.map((c) => [c[F.code], fmtSigned(c[F.growth])]), '#/indicators?key=growth')}
  ${topList('Longest lives, 2024', byLife.map((c) => [c[F.code], `${c[F.life].toFixed(2)} years`]), '#/indicators?key=life')}
</section>
<section>
  <h2>All countries</h2>
  <div class="chip-grid">${cards}</div>
  ${sourceLine()}
</section>`;
}

const SORTS = [
  { key: 'name', label: 'Country' },
  { key: 'pop', label: 'Population' },
  { key: 'gdp', label: 'GDP' },
  { key: 'gdppc', label: 'GDP per capita' },
  { key: 'life', label: 'Life expectancy' },
  { key: 'growth', label: 'GDP growth' },
  { key: 'unem', label: 'Unemployment' },
];

export function countriesList(state) {
  const q = state.q.trim().toLowerCase();
  let rows = COUNTRIES.filter((c) => {
    const hitQ = !q || c[F.name].toLowerCase().includes(q) || c[F.code].toLowerCase().includes(q) || c[F.capital].toLowerCase().includes(q);
    const hitR = state.region === 'All' || c[F.region] === state.region;
    return hitQ && hitR;
  });
  const dir = state.dir === 'asc' ? 1 : -1;
  rows = [...rows].sort((a, b) => {
    const k = state.sort;
    if (k === 'name') return dir * a[F.name].localeCompare(b[F.name]);
    return dir * (a[F[k]] - b[F[k]]);
  });
  const regionOptions = ['All', ...REGIONS].map((r) => `<option value="${escape(r)}" ${r === state.region ? 'selected' : ''}>${escape(r)}</option>`).join('');
  const head = SORTS.map((s) => {
    const arrow = state.sort === s.key ? (state.dir === 'asc' ? ' ▲' : ' ▼') : '';
    return `<th><button class="sort-btn" data-sort="${s.key}">${escape(s.label)}${arrow}</button></th>`;
  }).join('');
  const body = rows.map((c) => `<tr>
    <td><a href="#/country/${c[F.code]}">${escape(c[F.name])}</a><span class="sub">${escape(c[F.region])} · capital ${escape(c[F.capital])}</span></td>
    <td class="num">${fmtInt(c[F.pop])}</td>
    <td class="num">${fmtUsd(c[F.gdp])}</td>
    <td class="num">${fmtUsdShort(c[F.gdppc])}</td>
    <td class="num">${c[F.life].toFixed(1)} yrs</td>
    <td class="num">${fmtSigned(c[F.growth])}</td>
    <td class="num">${fmtPct(c[F.unem])}</td>
  </tr>`).join('');
  return `
<h1>Countries</h1>
<p class="lede">Twenty countries, 2024 figures. Search by name, capital or code, filter by region, and sort any column by tapping its heading.</p>
<div class="controls">
  <label>Search <input id="q" type="search" value="${escape(state.q)}" placeholder="e.g. Indonesia, Japan, BRA" autocomplete="off"></label>
  <label>Region <select id="region">${regionOptions}</select></label>
  <span class="count" id="row-count">${rows.length} of ${COUNTRIES.length} countries</span>
</div>
<div class="table-wrap"><table class="data-table">
  <thead><tr>${head}</tr></thead>
  <tbody>${body || '<tr><td colspan="7">No country matches that search. Try another name.</td></tr>'}</tbody>
</table></div>
${sourceLine()}`;
}

export function countryDetail(c, series) {
  const idx = COUNTRIES.findIndex((x) => x[F.code] === c[F.code]);
  const prev = COUNTRIES[(idx - 1 + COUNTRIES.length) % COUNTRIES.length];
  const next = COUNTRIES[(idx + 1) % COUNTRIES.length];
  const popChange = ((c[F.pop] - series.pop[0] * 1e6) / (series.pop[0] * 1e6)) * 100;
  const gdpChange = ((c[F.gdp] / 1e9 - series.gdp[0]) / series.gdp[0]) * 100;
  return `
<p class="crumb"><a href="#/countries">&larr; All countries</a> · <a href="#/compare">Compare ${escape(c[F.name])}</a></p>
<h1>${escape(c[F.name])}</h1>
<p class="lede">${escape(c[F.region])} · Capital: ${escape(c[F.capital])} · Land area: ${fmtInt(c[F.land])} sq. km · All figures 2024, ${escape(SOURCE_NAME)}.</p>
<div class="stat-grid">
  ${statCard('Population', fmtPop(c[F.pop]), `${fmtInt(c[F.pop])} people`)}
  ${statCard('GDP', fmtUsd(c[F.gdp]), `$${fmtInt(c[F.gdppc])} per person`)}
  ${statCard('GDP per capita', `$${fmtInt(c[F.gdppc])}`, `PPP: ${fmtUsdShort(c[F.gdppp])}`)}
  ${statCard('Life expectancy', `${c[F.life].toFixed(2)} years`, 'at birth')}
  ${statCard('Unemployment', fmtPct(c[F.unem]), 'of the labour force')}
  ${statCard('GDP growth', fmtSigned(c[F.growth]), 'annual, 2024')}
</div>
<section class="chart-grid">
  <div class="card"><h2>Population, 2015–2024</h2><canvas id="country-pop" aria-label="Line chart of population 2015 to 2024"></canvas><p class="card-note">${fmtSigned(popChange)} since 2015. ${sourceLine()}</p></div>
  <div class="card"><h2>GDP, 2015–2024</h2><canvas id="country-gdp" aria-label="Line chart of GDP 2015 to 2024"></canvas><p class="card-note">${fmtSigned(gdpChange)} since 2015, current US$. ${sourceLine()}</p></div>
</section>
<section class="card"><h2>People &amp; society</h2>
  <dl class="facts">
    <div><dt>Urban population</dt><dd>${fmtPct(c[F.urb])} of all people live in urban areas</dd></div>
    <div><dt>Internet use</dt><dd>${fmtPct(c[F.net])} of people used the Internet</dd></div>
    <div><dt>Age 65 and above</dt><dd>${fmtPct(c[F.old])} of the population</dd></div>
    <div><dt>Age 0–14</dt><dd>${fmtPct(c[F.young])} of the population</dd></div>
    <div><dt>Population growth</dt><dd>${fmtSigned(c[F.popgr])} a year</dd></div>
    <div><dt>Infant mortality</dt><dd>${c[F.mort]} deaths per 1,000 live births</dd></div>
  </dl>
  ${sourceLine()}
</section>
<nav class="pager"><a href="#/country/${prev[F.code]}">&larr; ${escape(prev[F.name])}</a><a href="#/country/${next[F.code]}">${escape(next[F.name])} &rarr;</a></nav>`;
}

export function comparePage(selected, allCodes) {
  const chosen = selected.map((code) => countryByCode(code)).filter(Boolean);
  const selects = [0, 1, 2].map((i) => {
    const options = allCodes.map((code) => {
      const c = countryByCode(code);
      return `<option value="${c[F.code]}" ${c[F.code] === selected[i] ? 'selected' : ''}>${escape(c[F.name])}</option>`;
    }).join('');
    return `<label>Country ${i + 1} <select class="compare-select" data-slot="${i}">${options}</select></label>`;
  }).join('');
  const rows = INDICATORS.map((ind) => {
    const cells = chosen.map((c) => {
      const v = c[F[ind.key]];
      let text;
      if (ind.key === 'pop') text = fmtInt(v);
      else if (ind.key === 'gdp' || ind.key === 'gdppp') text = fmtUsd(v);
      else if (ind.key === 'gdppc') text = `$${fmtInt(v)}`;
      else if (ind.key === 'life') text = `${v.toFixed(2)} years`;
      else if (ind.key === 'land') text = `${fmtInt(v)} sq. km`;
      else text = fmtPct(v, ind.key === 'growth' || ind.key === 'popgr' ? 2 : 1);
      const best = ind.key === 'mort' || ind.key === 'unem'
        ? Math.min(...chosen.map((x) => x[F[ind.key]]))
        : Math.max(...chosen.map((x) => x[F[ind.key]]));
      const cls = v === best ? ' class="best"' : '';
      return `<td${cls}>${text}</td>`;
    }).join('');
    return `<tr><th scope="row">${escape(ind.name)}<span class="sub">${escape(ind.unit)} · ${ind.year}</span></th>${cells}</tr>`;
  }).join('');
  const head = chosen.map((c) => `<th><a href="#/country/${c[F.code]}">${escape(c[F.name])}</a></th>`).join('');
  return `
<h1>Compare countries</h1>
<p class="lede">Pick up to three countries. The highlighted value in each row is the best of the three — lowest for unemployment and infant mortality, highest for the rest.</p>
<div class="controls">${selects}</div>
<section class="chart-grid">
  <div class="card"><h2>Population, 2015–2024</h2><canvas id="compare-pop" aria-label="Line chart comparing population 2015 to 2024"></canvas>${sourceLine()}</div>
  <div class="card"><h2>GDP, 2015–2024</h2><canvas id="compare-gdp" aria-label="Line chart comparing GDP 2015 to 2024"></canvas>${sourceLine()}</div>
</section>
<div class="table-wrap"><table class="data-table compare-table">
  <thead><tr><th>Indicator</th>${head}</tr></thead>
  <tbody>${rows}</tbody>
</table></div>
${sourceLine()}`;
}

export function indicatorsPage(key) {
  const ind = indicatorByKey(key) || indicatorByKey('pop');
  const options = INDICATORS.map((i) => `<option value="${i.key}" ${i.key === ind.key ? 'selected' : ''}>${escape(i.name)} (${escape(i.unit)})</option>`).join('');
  const ranked = [...COUNTRIES].sort((a, b) => b[F[ind.key]] - a[F[ind.key]]);
  const rows = ranked.map((c, i) => {
    const v = c[F[ind.key]];
    let text;
    if (ind.key === 'pop') text = fmtInt(v);
    else if (ind.key === 'gdp' || ind.key === 'gdppp') text = fmtUsd(v);
    else if (ind.key === 'gdppc') text = `$${fmtInt(v)}`;
    else if (ind.key === 'life') text = `${v.toFixed(2)} years`;
    else if (ind.key === 'land') text = `${fmtInt(v)} sq. km`;
    else text = fmtPct(v, ind.key === 'growth' || ind.key === 'popgr' ? 2 : 1);
    return `<tr><td class="num">${i + 1}</td><td><a href="#/country/${c[F.code]}">${escape(c[F.name])}</a></td><td class="num">${text}</td><td class="num">${ind.year}</td></tr>`;
  }).join('');
  return `
<h1>Indicators</h1>
<p class="lede">One indicator, all twenty countries, ranked. ${escape(ind.note)}</p>
<div class="controls"><label>Indicator <select id="indicator">${options}</select></label><span class="count">Code: ${escape(ind.code)} · ${ind.year}</span></div>
<section class="card"><h2>${escape(ind.name)} — ranked, ${ind.year}</h2><canvas id="ind-chart" aria-label="Ranked bar chart"></canvas>${sourceLine()}</section>
<div class="table-wrap"><table class="data-table">
  <thead><tr><th>#</th><th>Country</th><th>Value</th><th>Year</th></tr></thead>
  <tbody>${rows}</tbody>
</table></div>
${sourceLine()}`;
}

export function aboutPage() {
  return `
<h1>About StatAtlas</h1>
<p class="lede">StatAtlas is an independent statistics explorer. It puts the headline figures for twenty countries in one place, with every number sourced and dated, and works entirely offline: the data is part of the site itself.</p>
<section class="card"><h2>Sources</h2>
  <p>All figures come from the ${escape(SOURCE_NAME)}, retrieved ${escape(RETRIEVED)}. The World Bank's indicator database was last updated on 11 November 2026. Each indicator page names its World Bank indicator code, so any figure can be checked against the source.</p>
  <p>Latest values are for 2024. The ten-year series on each country page cover 2015–2024.</p>
</section>
<section class="card"><h2>What is covered</h2>
  <ul>
    <li><strong>20 countries</strong> across 5 regions: the world&rsquo;s largest by population and economy, plus a spread of regions and income levels.</li>
    <li><strong>14 indicators</strong>: population, GDP, GDP per capita, GDP (PPP), life expectancy, unemployment, GDP growth, population growth, infant mortality, urban share, Internet use, land area, and the shares aged 65+ and 0–14.</li>
    <li><strong>Ten-year series</strong> for population and GDP, 2015–2024.</li>
  </ul>
</section>
<section class="card"><h2>Notes on the figures</h2>
  <ul>
    <li>GDP is in current US dollars, as the World Bank publishes it; GDP (PPP) uses purchasing power parity conversion.</li>
    <li>Unemployment follows the International Labour Organization definition used by the World Bank.</li>
    <li>Nigeria&rsquo;s GDP series shows a sharp fall in 2024 in current US dollars, driven by the naira&rsquo;s depreciation; the underlying series is as published.</li>
    <li>The World Bank&rsquo;s CO2 emissions per capita indicator is reported as deleted/archived, so it is not shown here rather than shown with an unverified number.</li>
    <li>Figures are as published by the source. For the latest revisions, check the World Bank&rsquo;s indicator pages directly.</li>
  </ul>
</section>
<section class="card"><h2>How to use this site</h2>
  <ul>
    <li><a href="#/countries">Countries</a> — search, filter and sort the full table.</li>
    <li><a href="#/compare">Compare</a> — put up to three countries side by side.</li>
    <li><a href="#/indicators">Indicators</a> — rank all twenty countries on one measure.</li>
    <li>Every country name links to its detail page, with charts for 2015–2024.</li>
  </ul>
</section>`;
}

export function missing() {
  return `<h1>Not found</h1><p>There is no page at this address. <a href="#/">Back to the overview</a>.</p>`;
}
