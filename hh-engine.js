// Halo & Horns – herní logika (bez DOM), sdílená pro simulaci i hru
const HH = (() => {
  const REELS = 5, ROWS = 6;
  // výplaty × sázka za JEDNU cestu pro 3 / 4 / 5 stejných
  const SYMS = [
    { id: 0,  key: '9',       w: 11, pay: [0.10, 0.20, 0.40] },
    { id: 1,  key: '10',      w: 11, pay: [0.10, 0.20, 0.50] },
    { id: 2,  key: 'J',       w: 10, pay: [0.15, 0.25, 0.60] },
    { id: 3,  key: 'Q',       w: 10, pay: [0.15, 0.30, 0.70] },
    { id: 4,  key: 'K',       w: 9,  pay: [0.20, 0.40, 0.80] },
    { id: 5,  key: 'A',       w: 9,  pay: [0.25, 0.50, 1.00] },
    { id: 6,  key: 'flame',   w: 8,  pay: [0.40, 0.80, 1.60] },
    { id: 7,  key: 'trident', w: 8,  pay: [0.50, 1.00, 2.00] },
    { id: 8,  key: 'horns',   w: 7,  pay: [0.60, 1.50, 3.00] },
    { id: 9,  key: 'halo',    w: 7,  pay: [0.80, 2.00, 4.00] },
    { id: 10, key: 'wings',   w: 6,  pay: [1.00, 3.00, 6.00] },
  ];
  const SCATTER = 11, JACKPOT = 12, EXPAND = 13; // EXPAND = symbol Duel, po dopadu roztáhne válec
  const MULTS = [2, 4, 6, 8, 10, 25, 50, 100];
  const MULT_W = [40, 26, 14, 9, 6, 3, 1.5, 0.5];
  const MULT_W_BONUS = [30, 30, 20, 10, 7, 2.5, 0.4, 0.1];
  const FREE_SPINS = { 3: 10, 4: 12, 5: 15 };
  const RETRIGGER = { 2: 2, 3: 5, 4: 8, 5: 10 }; // scattery ve free spinech přidají spiny
  const retrigger = sc => sc >= 2 ? RETRIGGER[Math.min(sc, 5)] : 0;
  const JP = [ // MINI, MAJOR, GRAND – hodnoty v násobcích sázky
    { name: 'MINI', seed: 20, grow: 0.010 },
    { name: 'MAJOR', seed: 100, grow: 0.004 },
    { name: 'GRAND', seed: 1000, grow: 0.0015 },
  ];
  const CFG = {
    scatterP: 0.0118, jackpotP: 0.0078,
    featureP: 0.1,          // šance na rozšířený válec v základní hře
    bonusReels: [0.75, 0.22, 0.03], // 1 / 2 / 3 válce ve free spinech
    payScale: 0.215, bonusPayScale: 0.33,
  };
  const TOTW = SYMS.reduce((a, s) => a + s.w, 0);

  function pickW(arr, w, rnd) { let x = rnd() * w.reduce((a, b) => a + b, 0); for (let i = 0; i < arr.length; i++) if ((x -= w[i]) < 0) return arr[i]; return arr[0]; }
  function cell(rnd) {
    const r = rnd();
    if (r < CFG.scatterP) return SCATTER;
    if (r < CFG.scatterP + CFG.jackpotP) return JACKPOT;
    let x = rnd() * TOTW;
    for (const s of SYMS) if ((x -= s.w) < 0) return s.id;
    return 0;
  }
  // grid[reel][row]
  function spinGrid(rnd) {
    const g = [];
    for (let r = 0; r < REELS; r++) { g.push([]); for (let y = 0; y < ROWS; y++) g[r].push(cell(rnd)); }
    return g;
  }
  // rozšířené válce: [{reel, mult}]
  function rollFeature(bonus, rnd, minN = 0) {
    let n = 0;
    if (bonus) { const x = rnd(); n = x < CFG.bonusReels[0] ? 1 : x < CFG.bonusReels[0] + CFG.bonusReels[1] ? 2 : 3; }
    else if (rnd() < CFG.featureP) n = 1;
    n = Math.max(n, minN);
    const reels = [0, 1, 2, 3, 4];
    for (let i = reels.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [reels[i], reels[j]] = [reels[j], reels[i]]; }
    // nahoře a dole dva RŮZNÉ násobky, náhodně se vybere jeden z nich
    const W = bonus ? MULT_W_BONUS : MULT_W;
    return reels.slice(0, n).sort((a, b) => a - b).map(reel => {
      const top = pickW(MULTS, W, rnd);
      let bot; do { bot = pickW(MULTS, W, rnd); } while (bot === top);
      const side = rnd() < 0.5 ? 'top' : 'bot';
      return { reel, row: Math.floor(rnd() * ROWS), top, bot, side, mult: side === 'top' ? top : bot };
    });
  }
  // výpočet výher „ways“ (zleva doprava, sousední válce, všech 6^5 = 7776 cest)
  function evaluate(g, feat, bonus) {
    const wild = new Map(feat.map(f => [f.reel, f.mult]));
    const wins = [];
    const scale = bonus ? CFG.bonusPayScale : CFG.payScale;
    for (const s of SYMS) {
      let ways = 1, len = 0, real = false; const cells = [];
      for (let r = 0; r < REELS; r++) {
        if (wild.has(r)) { len++; // rozšířený válec = WILD, spojí cestu (počítá se jako jedna pozice)
 cells.push(...Array.from({ length: ROWS }, (_, y) => [r, y])); continue; }
        let c = 0; for (let y = 0; y < ROWS; y++) if (g[r][y] === s.id) { c++; cells.push([r, y]); }
        if (!c) break;
        ways *= c; len++; real = true;
      }
      if (len >= 3 && real) {
        let m = 0; for (let r = 0; r < len; r++) if (wild.has(r)) m += wild.get(r);
        const mult = m || 1;
        const win = s.pay[len - 3] * ways * mult * scale;
        wins.push({ s: s.id, len, ways, mult, win, cells: cells.filter(([r]) => r < len) });
      }
    }
    let sc = 0, jp = 0;
    for (let r = 0; r < REELS; r++) if (!wild.has(r)) for (let y = 0; y < ROWS; y++) { if (g[r][y] === SCATTER) sc++; if (g[r][y] === JACKPOT) jp++; }
    return { wins, total: wins.reduce((a, w) => a + w.win, 0), sc, jp };
  }
  // vloží symbol Duel na válce, které se roztáhnou
  function placeExpanders(g, feat) { for (const f of feat) g[f.reel][f.row] = EXPAND; return g; }
  const jackpotLevel = n => n >= 5 ? 2 : n === 4 ? 1 : n === 3 ? 0 : -1;

  return { REELS, ROWS, SYMS, SCATTER, JACKPOT, EXPAND, placeExpanders, MULTS, FREE_SPINS, RETRIGGER, retrigger, JP, CFG, spinGrid, rollFeature, evaluate, jackpotLevel };
})();
if (typeof module !== 'undefined') module.exports = HH;
