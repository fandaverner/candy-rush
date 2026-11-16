// Herní logika – čistá, bez DOM (sdílená pro simulaci i hru)
const COLS = 8, ROWS = 8;
const SYMS = [
  // id, emoji, váha, výplata (× sázka) pro shluk 5,6,7,8,9,10-11,12-14,15+
  { id: 0, e: '🍬', name: 'Bonbon',    w: 22, pay: [0.2, 0.3, 0.4, 0.5, 0.7, 1, 2, 5], base: [1,1,1,1,2,2,3,8] },
  { id: 1, e: '🍪', name: 'Sušenka',   w: 21, pay: [0.25, 0.35, 0.5, 0.6, 0.8, 1.2, 2.5, 6], base: [1,1,1,1,2,2,4,10] },
  { id: 2, e: '🍇', name: 'Hroznové želé', w: 19, pay: [0.3, 0.4, 0.6, 0.8, 1, 1.5, 3, 8], base: [1,1,1,2,2,3,5,13] },
  { id: 3, e: '🍓', name: 'Jahodový drops', w: 17, pay: [0.4, 0.5, 0.8, 1, 1.5, 2, 4, 10], base: [1,1,2,2,3,3,7,17] },
  { id: 4, e: '🍩', name: 'Donut',     w: 14, pay: [0.5, 0.8, 1, 1.5, 2, 3, 6, 15], base: [1,2,2,3,3,5,10,25] },
  { id: 5, e: '🧁', name: 'Cupcake',   w: 11, pay: [0.8, 1, 1.5, 2, 3, 5, 10, 25], base: [2,2,3,3,5,8,17,40] },
  { id: 6, e: '🍫', name: 'Čokoláda',  w: 8,  pay: [1, 1.5, 2, 3, 5, 8, 20, 50], base: [2,3,4,5,8,13,33,80] },
];
const SCATTER = 7, MULTI = 8;
const MULTI_VALUES = [2,2,2,3,3,3,4,5,5,6,8,10,10,12,15,20,25,50,100];
const MULTI_VALUES_BONUS = [2,2,2,3,3,3,4,4,5,5,6,8,10,10,15,20,25,50];
const FREE_SPINS = { 3: 10, 4: 12, 5: 15 };
// startovní celkový násobek bonusu podle počtu scatterů
const START_MULTI = { 3: 0, 4: 10, 5: 100 };
// lízátka ve free spinech: 2 = +2, 3 = +5, 4 = +8, 5+ = +10 spinů
const RETRIGGER = { 2: 2, 3: 5, 4: 8, 5: 10 };
const retrigger = sc => sc >= 2 ? RETRIGGER[Math.min(sc, 5)] : 0;
const SCATTER_PAY = { 3: 3, 4: 5, 5: 10, 6: 25, 7: 100 };
const CFG = {
  scatterP: 0.0053, scatterPBonus: 0.0042,
  multiP: 0, multiPBonus: 0.013,
  payScale: 0.17, baseScale: 1, bonusPayScale: 0.54,
};
// základní hra má „hustší“ váhy (víc propojení), bonus původní
const W_BASE = [21, 20, 19, 17, 13, 7, 3];
CFG.wBase = W_BASE;
const TOTAL_W = SYMS.reduce((a, s) => a + s.w, 0);

function sizeIdx(n) {
  if (n >= 15) return 7; if (n >= 12) return 6; if (n >= 10) return 5;
  return n - 5;
}
function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }

function newCell(bonus, rnd) {
  const r = rnd();
  const sp = bonus ? CFG.scatterPBonus : CFG.scatterP;
  const mp = bonus ? CFG.multiPBonus : CFG.multiP;
  if (r < sp) return { s: SCATTER };
  if (r < sp + mp) return { s: MULTI, m: pick(bonus ? MULTI_VALUES_BONUS : MULTI_VALUES, rnd) };
  const W = bonus ? SYMS.map(s => s.w) : CFG.wBase;
  let x = rnd() * W.reduce((a, b) => a + b, 0);
  for (let i = 0; i < W.length; i++) { if ((x -= W[i]) < 0) return { s: i }; }
  return { s: 0 };
}

// grid[c][r], r=0 nahoře
function fillGrid(bonus, rnd) {
  const g = [];
  for (let c = 0; c < COLS; c++) { g.push([]); for (let r = 0; r < ROWS; r++) g[c].push(newCell(bonus, rnd)); }
  return g;
}

function findClusters(g, bonus) {
  const sc = bonus ? CFG.bonusPayScale : CFG.payScale;
  const seen = Array.from({ length: COLS }, () => Array(ROWS).fill(false));
  const out = [];
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    if (seen[c][r]) continue;
    const s = g[c][r].s;
    if (s >= SCATTER) { seen[c][r] = true; continue; }
    const stack = [[c, r]], cells = []; seen[c][r] = true;
    while (stack.length) {
      const [x, y] = stack.pop(); cells.push([x, y]);
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || seen[nx][ny]) continue;
        if (g[nx][ny].s === s) { seen[nx][ny] = true; stack.push([nx, ny]); }
      }
    }
    // základní hra: celočíselná tabulka pro sázku 10 (base / 10 × sázka), bonus: pay × bonusPayScale
    if (cells.length >= 5) out.push({ s, cells, win: bonus ? SYMS[s].pay[sizeIdx(cells.length)] * sc : SYMS[s].base[sizeIdx(cells.length)] * CFG.baseScale / 10 });
  }
  return out;
}

// Odstraní buňky, propadne, doplní. Vrací {grid, newMask}
function tumble(g, cells, bonus, rnd) {
  const rm = new Set(cells.map(([c, r]) => c * 100 + r));
  const ng = [], fresh = [];
  for (let c = 0; c < COLS; c++) {
    const keep = [];
    for (let r = 0; r < ROWS; r++) if (!rm.has(c * 100 + r)) keep.push({ ...g[c][r], from: r });
    const n = ROWS - keep.length;
    const add = [];
    for (let i = 0; i < n; i++) add.push({ ...newCell(bonus, rnd), from: i - n });
    ng.push([...add, ...keep]);
  }
  return ng;
}

function countSym(g, s) { let n = 0; for (const col of g) for (const x of col) if (x.s === s) n++; return n; }
function multis(g) { const a = []; g.forEach((col, c) => col.forEach((x, r) => { if (x.s === MULTI) a.push({ c, r, m: x.m }); })); return a; }

// Kompletní spin bez animace (pro simulaci); vrací výhru v násobcích sázky
function playSpin(bonus, rnd, state) {
  let g = fillGrid(bonus, rnd), win = 0, step = 0;
  for (;;) {
    const cl = findClusters(g, bonus);
    if (!cl.length) break;
    // každý výherní shluk (symbol) se počítá jako samostatné propojení
    for (const k of cl) { step++; win += k.win; }
    g = tumble(g, cl.flatMap(x => x.cells), bonus, rnd);
  }
  const sc = countSym(g, SCATTER);
  const ms = multis(g).reduce((a, x) => a + x.m, 0);
  // základní hra: celá výhra kola se na konci vynásobí dosaženým násobkem propojení
  if (!bonus && win > 0) win *= cascadeMulti(step);
  if (bonus) {
    state.meter += ms;
    if (win > 0 && state.meter > 0) win *= state.meter;
  }
  state.steps = step;
  if (sc >= 3) win += SCATTER_PAY[Math.min(sc, 7)];
  return { win, sc };
}

// základní hra: každý výherní shluk = propojení; po konci kola se výhra násobí: 1 propojení ×1, 2 ×2, 3 ×4, 4 ×6 …
function cascadeMulti(step) { return step <= 1 ? 1 : 2 * (step - 1); }

function playBonus(spins, rnd, start = 0) {
  const st = { meter: start }; let total = 0, left = spins;
  while (left > 0) {
    left--;
    const r = playSpin(true, rnd, st);
    total += r.win;
    left += retrigger(r.sc);
  }
  return total;
}

if (typeof module !== 'undefined') module.exports = { COLS, ROWS, SYMS, SCATTER, MULTI, CFG, FREE_SPINS, START_MULTI, RETRIGGER, retrigger, SCATTER_PAY, cascadeMulti, fillGrid, findClusters, tumble, countSym, multis, playSpin, playBonus, newCell };
