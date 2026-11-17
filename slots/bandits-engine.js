// Divoký západ – 5×4, 1024 cest, wildy s násobky (v cestě se násobí), ve free spinech lepivé
const Game = (() => {
  const SM = typeof SlotMath !== 'undefined' ? SlotMath : require('./slotmath.js');
  const REELS = 5, ROWS = 4;
  const SYMS = [
    { id: 0, name: 'J', w: 14, pay: [0.05, 0.10, 0.25] },
    { id: 1, name: 'Q', w: 13, pay: [0.05, 0.10, 0.30] },
    { id: 2, name: 'K', w: 12, pay: [0.05, 0.15, 0.35] },
    { id: 3, name: 'A', w: 11, pay: [0.10, 0.20, 0.40] },
    { id: 4, name: 'Podkova', w: 8, pay: [0.15, 0.30, 0.75] },
    { id: 5, name: 'Klobouk', w: 7, pay: [0.20, 0.40, 1.00] },
    { id: 6, name: 'Revolver', w: 6, pay: [0.25, 0.60, 1.50] },
    { id: 7, name: 'Měšec zlata', w: 5, pay: [0.40, 1.00, 2.50] },
  ];
  const WILD = 8, SCATTER = 9;
  const MULTS = [2, 3, 5], MW = [60, 30, 10], MW_FS = [70, 24, 6];
  const FREE_SPINS = { 3: 10, 4: 12, 5: 15 }, RETRIGGER = 5, MAX_WIN = 5000;
  const CFG = { wildP: 0.045, wildPFS: 0.034, scatterP: 0.017, payScale: 0.37, fsScale: 0.33, buyX: 80 };

  function cell(r, rnd, fs) {
    const x = rnd(), wp = fs ? CFG.wildPFS : CFG.wildP;
    if (x < CFG.scatterP) return { s: SCATTER };
    if (r >= 1 && r <= 3 && x < CFG.scatterP + wp) return { s: WILD, m: SM.pickW(MULTS, fs ? MW_FS : MW, rnd) };
    return { s: SM.pickW(SYMS.map(s => s.id), SYMS.map(s => s.w), rnd) };
  }
  const filler = rnd => cell(0, rnd);
  function grid(rnd, fs, sticky) {
    return Array.from({ length: REELS }, (_, r) => Array.from({ length: ROWS }, (_, y) => sticky && sticky[r][y] ? sticky[r][y] : cell(r, rnd, fs)));
  }
  function spin(rnd, fs = false, sticky = null) {
    const g = grid(rnd, fs, sticky);
    const ev = SM.ways(g, SYMS, WILD, fs ? CFG.fsScale : CFG.payScale);
    const sc = SM.count(g, SCATTER);
    return { g, wins: ev.wins, total: ev.total, sc };
  }
  const emptySticky = () => Array.from({ length: REELS }, () => Array(ROWS).fill(null));
  function addSticky(sticky, g) { const news = []; g.forEach((col, r) => col.forEach((x, y) => { if (x.s === WILD && !sticky[r][y]) { sticky[r][y] = x; news.push([r, y]); } })); return news; }
  // celé free spiny bez animace (pro simulaci)
  function freeSpins(n, rnd) {
    const st = emptySticky(); let left = n, tot = 0;
    while (left > 0) { left--; const r = spin(rnd, true, st); addSticky(st, r.g); tot += r.total; if (r.sc >= 3) left += RETRIGGER; if (tot >= MAX_WIN) { tot = MAX_WIN; break; } }
    return tot;
  }
  return { REELS, ROWS, SYMS, WILD, SCATTER, FREE_SPINS, RETRIGGER, MAX_WIN, CFG, filler, spin, emptySticky, addSticky, freeSpins };
})();
if (typeof module !== 'undefined') module.exports = Game;
