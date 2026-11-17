// Poklad faraona – 5×3, 243 cest, Hold & Win s mincemi a 4 jackpoty
const Game = (() => {
  const SM = typeof SlotMath !== 'undefined' ? SlotMath : require('./slotmath.js');
  const REELS = 5, ROWS = 3;
  const SYMS = [
    { id: 0, name: 'J', w: 14, pay: [0.10, 0.25, 0.50] },
    { id: 1, name: 'Q', w: 13, pay: [0.10, 0.25, 0.60] },
    { id: 2, name: 'K', w: 12, pay: [0.15, 0.30, 0.75] },
    { id: 3, name: 'A', w: 11, pay: [0.20, 0.40, 1.00] },
    { id: 4, name: 'Ankh', w: 8, pay: [0.30, 0.75, 1.50] },
    { id: 5, name: 'Horovo oko', w: 7, pay: [0.40, 1.00, 2.00] },
    { id: 6, name: 'Skarab', w: 6, pay: [0.50, 1.25, 2.50] },
    { id: 7, name: 'Kočka Bastet', w: 5, pay: [0.75, 2.00, 4.00] },
  ];
  const WILD = 8, COIN = 9;
  const COIN_V = [1, 2, 3, 4, 5, 8, 10, 15, 20, 25, 50, 'MINI', 'MINOR', 'MAJOR'];
  const COIN_W = [22, 20, 15, 12, 10, 7, 5, 3.5, 2.2, 1.5, 0.6, 1.2, 0.35, 0.08];
  const JPV = { MINI: 20, MINOR: 50, MAJOR: 200, GRAND: 1000 };
  const CFG = { wildP: 0.05, coinP: 0.122, respinP: 0.062, payScale: 2.15, buyX: 55 };
  const TRIG = 6;

  function coin(rnd) { return { s: COIN, v: SM.pickW(COIN_V, COIN_W, rnd) }; }
  function cell(r, rnd) {
    const x = rnd();
    if (x < CFG.coinP) return coin(rnd);
    if (r >= 1 && r <= 3 && x < CFG.coinP + CFG.wildP) return { s: WILD };
    return { s: SM.pickW(SYMS.map(s => s.id), SYMS.map(s => s.w), rnd) };
  }
  const filler = rnd => cell(Math.floor(rnd() * 5), rnd);
  function grid(rnd) { return Array.from({ length: REELS }, (_, r) => Array.from({ length: ROWS }, () => cell(r, rnd))); }
  const coinValue = v => typeof v === 'number' ? v : JPV[v];

  // základní spin
  function base(rnd) {
    const g = grid(rnd), ev = SM.ways(g, SYMS, WILD, CFG.payScale);
    const coins = SM.count(g, COIN);
    return { g, wins: ev.wins, total: ev.total, trigger: coins >= TRIG };
  }
  // Hold & Win: vrací seznam kroků (pro animaci) a celkovou výhru
  function holdAndWin(startGrid, rnd) {
    const locked = startGrid.map(col => col.map(x => x.s === COIN ? x : null));
    const steps = []; let respins = 3;
    const filled = () => locked.flat().filter(Boolean).length;
    while (respins > 0 && filled() < REELS * ROWS) {
      const news = [];
      for (let r = 0; r < REELS; r++) for (let y = 0; y < ROWS; y++)
        if (!locked[r][y] && rnd() < CFG.respinP) { locked[r][y] = coin(rnd); news.push([r, y, locked[r][y]]); }
      respins = news.length ? 3 : respins - 1;
      steps.push({ news, respins });
    }
    let total = 0; for (const col of locked) for (const x of col) if (x) total += coinValue(x.v);
    const grand = filled() === REELS * ROWS;
    if (grand) total += JPV.GRAND;
    return { steps, locked, total, grand };
  }
  function buyGrid(rnd) { // koupený bonus: 6 mincí na náhodných místech
    const g = grid(rnd).map(col => col.map(x => x.s === COIN ? { s: 0 } : x));
    const pos = []; for (let r = 0; r < REELS; r++) for (let y = 0; y < ROWS; y++) pos.push([r, y]);
    for (let i = pos.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pos[i], pos[j]] = [pos[j], pos[i]]; }
    pos.slice(0, TRIG).forEach(([r, y]) => g[r][y] = coin(rnd));
    return g;
  }
  return { REELS, ROWS, SYMS, WILD, COIN, JPV, CFG, TRIG, filler, base, holdAndWin, buyGrid, coinValue };
})();
if (typeof module !== 'undefined') module.exports = Game;
