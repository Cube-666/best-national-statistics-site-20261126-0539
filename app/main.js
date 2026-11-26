// StatAtlas router: hash routes for every page, plus the controls that make
// each page work (search, filter, sort, compare picks, indicator picker).
// Charts are drawn right after each page lands, so a screenshot always
// catches the finished page. window.__shotReady tells a screenshot script
// the page is done rendering.
//
//   #/                     overview with world figures and top-10 charts
//   #/countries            searchable, filterable, sortable country table
//   #/country/<code>       one country's detail page with 2015–2024 charts
//   #/compare              up to three countries side by side
//   #/indicators?key=<key> one indicator ranked across all countries
//   #/about                sources, coverage and notes

import {
  COUNTRIES, F, GDP_SERIES, POP_SERIES, SERIES_YEARS,
  countryByCode, indicatorByKey,
} from './data.js';
import {
  aboutPage, comparePage, countriesList, countryDetail, fmtInt, fmtPop,
  fmtPct, fmtSigned, fmtUsd, fmtUsdShort, home, indicatorsPage, missing,
} from './views.js';
import { hbarChart, lineChart, CHART_COLORS } from './charts.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('header nav a')];

// Page state that survives a hash change within the session.
const listState = { q: '', region: 'All', sort: 'pop', dir: 'desc' };
let compareSelection = ['USA', 'CHN', 'IND'];
let indicatorKey = 'pop';

function formatIndicatorValue(ind, v) {
  if (ind.key === 'pop') return fmtInt(v);
  if (ind.key === 'gdp' || ind.key === 'gdppp') return fmtUsd(v);
  if (ind.key === 'gdppc') return `$${fmtInt(v)}`;
  if (ind.key === 'life') return `${v.toFixed(2)} yrs`;
  if (ind.key === 'land') return `${fmtInt(v)} km²`;
  return fmtPct(v, ind.key === 'growth' || ind.key === 'popgr' ? 2 : 1);
}

function topRows(key, n) {
  return [...COUNTRIES].sort((a, b) => b[F[key]] - a[F[key]]).slice(0, n);
}

function drawHome() {
  const popTop = topRows('pop', 10);
  const popCanvas = document.getElementById('home-pop');
  if (popCanvas) {
    hbarChart(popCanvas, popTop.map((c) => ({
      label: c[F.name], value: c[F.pop], color: CHART_COLORS.teal,
    })), (v) => fmtPop(v), 10);
  }
  const gdpTop = topRows('gdp', 10);
  const gdpCanvas = document.getElementById('home-gdp');
  if (gdpCanvas) {
    hbarChart(gdpCanvas, gdpTop.map((c) => ({
      label: c[F.name], value: c[F.gdp], color: CHART_COLORS.navy,
    })), (v) => fmtUsdShort(v), 10);
  }
}

function drawCountry(code) {
  const popCanvas = document.getElementById('country-pop');
  if (popCanvas) {
    lineChart(popCanvas, [{ label: 'Population', color: CHART_COLORS.teal, values: POP_SERIES[code] }], SERIES_YEARS, (v) => `${v}M`);
  }
  const gdpCanvas = document.getElementById('country-gdp');
  if (gdpCanvas) {
    lineChart(gdpCanvas, [{ label: 'GDP', color: CHART_COLORS.navy, values: GDP_SERIES[code] }], SERIES_YEARS, (v) => `$${v}B`);
  }
}

function drawCompare() {
  const chosen = compareSelection.map((code) => countryByCode(code)).filter(Boolean);
  const popCanvas = document.getElementById('compare-pop');
  if (popCanvas) {
    lineChart(popCanvas, chosen.map((c, i) => ({
      label: c[F.name], color: CHART_COLORS.palette[i % CHART_COLORS.palette.length], values: POP_SERIES[c[F.code]],
    })), SERIES_YEARS, (v) => `${v}M`);
  }
  const gdpCanvas = document.getElementById('compare-gdp');
  if (gdpCanvas) {
    lineChart(gdpCanvas, chosen.map((c, i) => ({
      label: c[F.name], color: CHART_COLORS.palette[i % CHART_COLORS.palette.length], values: GDP_SERIES[c[F.code]],
    })), SERIES_YEARS, (v) => `$${v}B`);
  }
}

function drawIndicators() {
  const ind = indicatorByKey(indicatorKey) || indicatorByKey('pop');
  const canvas = document.getElementById('ind-chart');
  if (!canvas) return;
  const ranked = [...COUNTRIES].sort((a, b) => b[F[ind.key]] - a[F[ind.key]]);
  hbarChart(canvas, ranked.map((c, i) => ({
    label: c[F.name], value: c[F[ind.key]], color: i === 0 ? CHART_COLORS.amber : CHART_COLORS.teal,
  })), (v) => formatIndicatorValue(ind, v), 20);
}

// Re-render only the countries table body and count, so typing in the
// search box never loses focus or the caret.
function refreshListTable() {
  const q = listState.q.trim().toLowerCase();
  let rows = COUNTRIES.filter((c) => {
    const hitQ = !q || c[F.name].toLowerCase().includes(q) || c[F.code].toLowerCase().includes(q) || c[F.capital].toLowerCase().includes(q);
    const hitR = listState.region === 'All' || c[F.region] === listState.region;
    return hitQ && hitR;
  });
  const dir = listState.dir === 'asc' ? 1 : -1;
  rows = [...rows].sort((a, b) => {
    const k = listState.sort;
    if (k === 'name') return dir * a[F.name].localeCompare(b[F.name]);
    return dir * (a[F[k]] - b[F[k]]);
  });
  const tbody = document.querySelector('.data-table tbody');
  if (tbody) {
    tbody.innerHTML = rows.map((c) => `<tr>
      <td><a href="#/country/${c[F.code]}">${c[F.name]}</a><span class="sub">${c[F.region]} · capital ${c[F.capital]}</span></td>
      <td class="num">${fmtInt(c[F.pop])}</td>
      <td class="num">${fmtUsd(c[F.gdp])}</td>
      <td class="num">${fmtUsdShort(c[F.gdppc])}</td>
      <td class="num">${c[F.life].toFixed(1)} yrs</td>
      <td class="num">${fmtSigned(c[F.growth])}</td>
      <td class="num">${fmtPct(c[F.unem])}</td>
    </tr>`).join('') || '<tr><td colspan="7">No country matches that search. Try another name.</td></tr>';
  }
  const count = document.getElementById('row-count');
  if (count) count.textContent = `${rows.length} of ${COUNTRIES.length} countries`;
  document.querySelectorAll('.sort-btn').forEach((btn) => {
    const base = btn.textContent.replace(/ [▲▼]$/, '');
    btn.textContent = base + (btn.dataset.sort === listState.sort ? (listState.dir === 'asc' ? ' ▲' : ' ▼') : '');
  });
}

function wireList() {
  const q = document.getElementById('q');
  if (q) {
    q.addEventListener('input', () => {
      listState.q = q.value;
      refreshListTable();
    });
  }
  const region = document.getElementById('region');
  if (region) {
    region.addEventListener('change', () => {
      listState.region = region.value;
      refreshListTable();
    });
  }
  document.querySelectorAll('.sort-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      if (listState.sort === key) {
        listState.dir = listState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        listState.sort = key;
        listState.dir = key === 'name' ? 'asc' : 'desc';
      }
      refreshListTable();
    });
  });
}

function wireCompare() {
  document.querySelectorAll('.compare-select').forEach((sel) => {
    sel.addEventListener('change', () => {
      compareSelection[Number(sel.dataset.slot)] = sel.value;
      render();
    });
  });
}

function wireIndicators() {
  const sel = document.getElementById('indicator');
  if (sel) {
    sel.addEventListener('change', () => {
      indicatorKey = sel.value;
      location.hash = `#/indicators?key=${encodeURIComponent(indicatorKey)}`;
    });
  }
}

function setActiveNav(route) {
  navLinks.forEach((a) => {
    const target = a.getAttribute('href');
    const on = route === target || (route.startsWith('#/country') && target === '#/countries');
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function render() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const [path, query] = hash.split('?');
  const params = new URLSearchParams(query || '');
  let title = 'StatAtlas — National Statistics Explorer';
  if (path === '#/' || path === '' || path === '#') {
    document.title = title;
    app.innerHTML = home();
    setActiveNav('#/');
    drawHome();
  } else if (path === '#/countries') {
    document.title = 'Countries | StatAtlas';
    app.innerHTML = countriesList(listState);
    setActiveNav('#/countries');
    wireList();
  } else if (path.startsWith('#/country/')) {
    const code = decodeURIComponent(path.slice('#/country/'.length)).toUpperCase();
    const c = countryByCode(code);
    if (c) {
      document.title = `${c[F.name]} | StatAtlas`;
      app.innerHTML = countryDetail(c, { pop: POP_SERIES[code], gdp: GDP_SERIES[code] });
      setActiveNav('#/countries');
      drawCountry(code);
    } else {
      document.title = 'Not found | StatAtlas';
      app.innerHTML = missing();
      setActiveNav('#/');
    }
  } else if (path === '#/compare') {
    document.title = 'Compare countries | StatAtlas';
    app.innerHTML = comparePage(compareSelection, COUNTRIES.map((c) => c[F.code]));
    setActiveNav('#/compare');
    wireCompare();
    drawCompare();
  } else if (path === '#/indicators') {
    const key = params.get('key');
    if (key && indicatorByKey(key)) indicatorKey = key;
    document.title = 'Indicators | StatAtlas';
    app.innerHTML = indicatorsPage(indicatorKey);
    setActiveNav('#/indicators');
    wireIndicators();
    drawIndicators();
  } else if (path === '#/about') {
    document.title = 'About | StatAtlas';
    app.innerHTML = aboutPage();
    setActiveNav('#/about');
  } else {
    document.title = 'Not found | StatAtlas';
    app.innerHTML = missing();
    setActiveNav('#/');
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
