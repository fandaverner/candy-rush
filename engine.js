// Herní logika – čistá, bez DOM (sdílená pro simulaci i hru)
const COLS = 8, ROWS = 8;
const SYMS = [
  // id, emoji, váha, výplata (× sázka) pro shluk 5,6,7,8,9,10-11,12-14,15+
  { id: 0, e: '🍬', name: 'Bonbon',    w: 22, pay: [0.2, 0.3, 0.4, 0.5, 0.7, 1, 2, 5] },
  { id: 1, e: '🍪', name: 'Sušenka',   w: 21, pay: [0.25, 0.35, 0.5, 0.6, 0.8, 1.2, 2.5, 6] },
  { id: 2, e: '🍇', name: 'Hroznové želé', w: 19, pay: [0.3, 0.4, 0.6, 0.8, 1, 1.5, 3, 8] },
  { id: 3, e: '🍓', name: 'Jahodový drops', w: 17, pay: [0.4, 0.5, 0.8, 1, 1.5, 2, 4, 10] },
  { id: 4, e: '🍩', name: 'Donut',     w: 14, pay: [0.5, 0.8, 1, 1.5, 2, 3, 6, 15] },
  { id: 5, e: '🧁', name: 'Cupcake',   w: 11, pay: [0.8, 1, 1.5, 2, 3, 5, 10, 25] },
  { id: 6, e: '🍫', name: 'Čokoláda',  w: 8,  pay: [1, 1.5, 2, 3, 5, 8, 20, 50] },
];
const SCATTER = 7, MULTI = 8;
const MULTI_VALUES = [2,2,2,3,3,3,4,5,5,6,8,10,10,12,15,20,25,50,100];
const MULTI_VALUES_BONUS = [2,2,2,3,3,3,4,4,5,5,6,8,10,10,15,20,25,50];
const FREE_SPINS = { 3: 10, 4: 12, 5: 15 };
// startovní celkový násobek bonusu podle počtu scatterů
const START_MULTI = { 3: 0, 4: 10, 5: 100 };
const RETRIGGER = 5;
const SCATTER_PAY = { 3: 3, 4: 5, 5: 10, 6: 25, 7: 100 };
const CFG = {
  scatterP: 0.0055, scatterPBonus: 0.0042,
  multiP: 0.0032, multiPBonus: 0.013,
  payScale: 0.33, bonusPayScale: 0.55,
};
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
  let x = rnd() * TOTAL_W;
  for (const s of SYMS) { if ((x -= s.w) < 0) return { s: s.id }; }
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
    if (cells.length >= 5) out.push({ s, cells, win: SYMS[s].pay[sizeIdx(cells.length)] * sc });
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
  let g = fillGrid(bonus, rnd), win = 0;
  for (;;) {
    const cl = findClusters(g, bonus);
    if (!cl.length) break;
    win += cl.reduce((a, x) => a + x.win, 0);
    g = tumble(g, cl.flatMap(x => x.cells), bonus, rnd);
  }
  const sc = countSym(g, SCATTER);
  const ms = multis(g).reduce((a, x) => a + x.m, 0);
  if (bonus) {
    state.meter += ms;
    if (win > 0 && state.meter > 0) win *= state.meter;
  } else if (win > 0 && ms > 0) win *= ms;
  if (sc >= 3) win += SCATTER_PAY[Math.min(sc, 7)];
  return { win, sc };
}

function playBonus(spins, rnd, start = 0) {
  const st = { meter: start }; let total = 0, left = spins;
  while (left > 0) {
    left--;
    const r = playSpin(true, rnd, st);
    total += r.win;
    if (r.sc >= 3) left += RETRIGGER;
  }
  return total;
}

if (typeof module !== 'undefined') module.exports = { COLS, ROWS, SYMS, SCATTER, MULTI, CFG, FREE_SPINS, START_MULTI, RETRIGGER, SCATTER_PAY, fillGrid, findClusters, tumble, countSym, multis, playSpin, playBonus, newCell };
