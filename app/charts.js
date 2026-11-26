// StatAtlas charts: small hand-rolled canvas charts, no library, no network.
// Every chart draws axes, gridlines and value labels, and scales for the
// screen's pixel density so it stays sharp on a phone. Charts read their
// data from plain arrays; they never fetch anything.

const INK = '#0f2a4a';
const MUTED = '#5b6b7c';
const GRID = '#e3e8ee';
const TEAL = '#0e7c7b';
const NAVY = '#14406e';
const AMBER = '#d98a1f';
const ROSE = '#c2454e';
const PALETTE = ['#0e7c7b', '#14406e', '#d98a1f', '#c2454e', '#6a4fa3', '#2e7d32'];

function setup(canvas, heightCss) {
  const dpr = window.devicePixelRatio || 1;
  const widthCss = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
  canvas.width = Math.round(widthCss * dpr);
  canvas.height = Math.round(heightCss * dpr);
  canvas.style.height = `${heightCss}px`;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, widthCss, heightCss);
  return { ctx, w: widthCss, h: heightCss };
}

function niceMax(value) {
  if (value <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return nice * pow;
}

function niceMin(value) {
  if (value >= 0) return 0;
  const pow = Math.pow(10, Math.floor(Math.log10(-value)));
  const n = -value / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return -nice * pow;
}

function axes(ctx, box, yMin, yMax, ticks, formatY) {
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 1;
  for (let i = 0; i <= ticks; i += 1) {
    const v = yMin + ((yMax - yMin) * i) / ticks;
    const y = box.y + box.h - (box.h * i) / ticks;
    ctx.beginPath();
    ctx.moveTo(box.x, y);
    ctx.lineTo(box.x + box.w, y);
    ctx.stroke();
    ctx.fillText(formatY(v), box.x - 6, y);
  }
  ctx.strokeStyle = '#c9d2dc';
  ctx.beginPath();
  ctx.moveTo(box.x, box.y + box.h);
  ctx.lineTo(box.x + box.w, box.y + box.h);
  ctx.stroke();
}

// A line chart over years. series: [{label, color, values:[...]}].
// years: [2015, ...]. formatY formats the axis numbers.
export function lineChart(canvas, series, years, formatY) {
  const { ctx, w, h } = setup(canvas, 260);
  const padL = 58;
  const padR = 14;
  const padT = 14;
  const padB = 26;
  const box = { x: padL, y: padT, w: w - padL - padR, h: h - padT - padB };
  const all = series.flatMap((s) => s.values);
  const yMax = niceMax(Math.max(...all) * 1.05);
  const yMin = niceMin(Math.min(...all, 0) * 1.05);
  axes(ctx, box, yMin, yMax, 4, formatY);
  const xAt = (i) => box.x + (box.w * i) / (years.length - 1);
  const yAt = (v) => box.y + box.h - ((v - yMin) / (yMax - yMin)) * box.h;
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  years.forEach((y, i) => {
    if (i % 2 === 0 || i === years.length - 1) ctx.fillText(String(y), xAt(i), box.y + box.h + 8);
  });
  series.forEach((s) => {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    s.values.forEach((v, i) => {
      if (i === 0) ctx.moveTo(xAt(i), yAt(v));
      else ctx.lineTo(xAt(i), yAt(v));
    });
    ctx.stroke();
    ctx.fillStyle = s.color;
    s.values.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(v), 3, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  // Last value labels above the final points: kept inside the canvas and
  // pushed apart when two series end close together, so they never overlap.
  const labels = series.map((s) => {
    const v = s.values[s.values.length - 1];
    return { text: formatY(v), color: s.color, x: xAt(years.length - 1), y: yAt(v) - 8 };
  });
  labels.sort((a, b) => a.y - b.y);
  for (let i = 1; i < labels.length; i += 1) {
    if (labels[i].y - labels[i - 1].y < 14) labels[i].y = labels[i - 1].y + 14;
  }
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  labels.forEach((lb) => {
    const half = ctx.measureText(lb.text).width / 2 + 2;
    const cx = Math.min(Math.max(lb.x, padL + half), w - half - 2);
    ctx.fillStyle = lb.color;
    ctx.fillText(lb.text, cx, lb.y);
  });
}

// Vertical bars. labels: short names; values: numbers; formatY formats axis.
export function barChart(canvas, labels, values, formatY, color) {
  const { ctx, w, h } = setup(canvas, 260);
  const padL = 58;
  const padR = 10;
  const padT = 12;
  const padB = 44;
  const box = { x: padL, y: padT, w: w - padL - padR, h: h - padT - padB };
  const yMax = niceMax(Math.max(...values) * 1.08);
  axes(ctx, box, 0, yMax, 4, formatY);
  const slot = box.w / values.length;
  const barW = Math.min(46, slot * 0.62);
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  values.forEach((v, i) => {
    const bh = (box.h * v) / yMax;
    const x = box.x + slot * i + (slot - barW) / 2;
    const y = box.y + box.h - bh;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, barW, bh);
    ctx.fillStyle = INK;
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText(formatY(v), x + barW / 2, y - 6);
    ctx.fillStyle = MUTED;
    ctx.font = '11px system-ui, sans-serif';
    ctx.save();
    ctx.translate(x + barW / 2, box.y + box.h + 10);
    ctx.rotate(-0.5);
    ctx.textAlign = 'right';
    ctx.fillText(labels[i], 0, 0);
    ctx.restore();
  });
}

// Horizontal ranked bars, largest on top. rows: [{label, value, color}].
export function hbarChart(canvas, rows, formatValue, maxRows) {
  const shown = rows.slice(0, maxRows || rows.length);
  const rowH = 30;
  const { ctx, w, h } = setup(canvas, shown.length * rowH + 14);
  const max = Math.max(...shown.map((r) => r.value));
  const labelW = 118;
  const valueW = 64;
  const barX = labelW;
  const barW = w - labelW - valueW - 8;
  ctx.font = '12px system-ui, sans-serif';
  shown.forEach((r, i) => {
    const y = 8 + i * rowH;
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(r.label, labelW - 8, y + 11);
    const bw = Math.max(2, (barW * r.value) / max);
    ctx.fillStyle = r.color || TEAL;
    ctx.fillRect(barX, y, bw, 22);
    ctx.fillStyle = INK;
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(formatValue(r.value), barX + bw + 6, y + 11);
    ctx.font = '12px system-ui, sans-serif';
  });
}

// Grouped vertical bars for comparing countries on several indicators.
// groups: [{label, values:[one per country]}]; names: country names.
export function groupedBarChart(canvas, groups, names, formatY) {
  const { ctx, w, h } = setup(canvas, 280);
  const padL = 58;
  const padR = 10;
  const padT = 26;
  const padB = 30;
  const box = { x: padL, y: padT, w: w - padL - padR, h: h - padT - padB };
  const all = groups.flatMap((g) => g.values);
  const yMax = niceMax(Math.max(...all) * 1.1);
  axes(ctx, box, 0, yMax, 4, formatY);
  const groupW = box.w / groups.length;
  const barW = Math.min(30, (groupW / names.length) * 0.6);
  const gap = 3;
  groups.forEach((g, gi) => {
    g.values.forEach((v, ni) => {
      const bh = (box.h * v) / yMax;
      const totalW = names.length * barW + (names.length - 1) * gap;
      const x = box.x + groupW * gi + (groupW - totalW) / 2 + ni * (barW + gap);
      ctx.fillStyle = PALETTE[ni % PALETTE.length];
      ctx.fillRect(x, box.y + box.h - bh, barW, bh);
    });
  });
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  groups.forEach((g, gi) => {
    ctx.fillText(g.label, box.x + groupW * gi + groupW / 2, box.y + box.h + 8);
  });
  // Legend.
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  let lx = box.x;
  names.forEach((n, ni) => {
    ctx.fillStyle = PALETTE[ni % PALETTE.length];
    ctx.fillRect(lx, 4, 12, 12);
    ctx.fillStyle = INK;
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(n, lx + 16, 10);
    lx += 16 + ctx.measureText(n).width + 18;
  });
}

export const CHART_COLORS = { teal: TEAL, navy: NAVY, amber: AMBER, rose: ROSE, palette: PALETTE };
