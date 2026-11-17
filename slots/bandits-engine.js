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
  const MULTS = [2, 3, 5], MW = [60, 30, 10];
  const MULTS_FS = [1, 2, 3], MW_FS = [70, 25, 5];
  const FREE_SPINS = { 3: 10, 4: 12, 5: 15 }, MAX_WIN = 5000;
  const RETRIGGER = { 2: 2, 3: 5, 4: 8, 5: 10 }; // hvězdy ve free spinech přidají spiny
  const retrigger = sc => sc >= 2 ? RETRIGGER[Math.min(sc, 5)] : 0;
  const CFG = { wildP: 0.045, wildPFS: 0.03, scatterP: 0.017, payScale: 0.355, fsScale: 0.54, buyX: 61 };

  function cell(r, rnd, fs) {
    const x = rnd(), wp = fs ? CFG.wildPFS : CFG.wildP;
    if (x < CFG.scatterP) return { s: SCATTER };
    if (r >= 1 && r <= 3 && x < CFG.scatterP + wp) return { s: WILD, m: fs ? SM.pickW(MULTS_FS, MW_FS, rnd) : SM.pickW(MULTS, MW, rnd) };
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
  // každý bonus začíná se dvěma lepivými bandity (různé válce): koupený bez násobku, chycený ve hře jeden z nich ×2
  function startSticky(st, rnd, natural) {
    const reels = [1, 2, 3].sort(() => rnd() - .5).slice(0, 2), out = [];
    reels.forEach((r, i) => { const y = Math.floor(rnd() * ROWS); st[r][y] = { s: WILD, m: natural && i === 0 ? 2 : 1 }; out.push([r, y]); });
    return out;
  }
  function freeSpins(n, rnd, natural = false) {
    const st = emptySticky(); let left = n, tot = 0;
    startSticky(st, rnd, natural);
    while (left > 0) { left--; const r = spin(rnd, true, st); addSticky(st, r.g); tot += r.total; left += retrigger(r.sc); if (tot >= MAX_WIN) { tot = MAX_WIN; break; } }
    return tot;
  }
  return { REELS, ROWS, SYMS, WILD, SCATTER, FREE_SPINS, RETRIGGER, retrigger, MAX_WIN, CFG, filler, spin, emptySticky, addSticky, freeSpins, startSticky };
})();
if (typeof module !== 'undefined') module.exports = Game;
