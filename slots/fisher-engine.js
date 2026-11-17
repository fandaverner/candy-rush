// Zlatý úlovek – 5×3, 243 cest; ve free spinech rybář (wild) sbírá hodnoty ryb, každý 4. rybář = +10 spinů a vyšší násobek
const Game = (() => {
  const SM = typeof SlotMath !== 'undefined' ? SlotMath : require('./slotmath.js');
  const REELS = 5, ROWS = 3;
  const SYMS = [
    { id: 0, name: 'J', w: 14, pay: [0.10, 0.25, 0.50] },
    { id: 1, name: 'Q', w: 13, pay: [0.10, 0.25, 0.60] },
    { id: 2, name: 'K', w: 12, pay: [0.15, 0.30, 0.75] },
    { id: 3, name: 'A', w: 11, pay: [0.20, 0.40, 1.00] },
    { id: 4, name: 'Splávek', w: 8, pay: [0.30, 0.75, 1.50] },
    { id: 5, name: 'Vážka', w: 7, pay: [0.40, 1.00, 2.00] },
    { id: 6, name: 'Rybářský prut', w: 6, pay: [0.50, 1.25, 2.50] },
    { id: 7, name: 'Krabička s návnadou', w: 5, pay: [0.75, 2.00, 4.00] },
    { id: 9, name: 'Ryba', w: 7, pay: [0.30, 0.75, 1.50] },
  ];
  const WILD = 8, FISH = 9, SCATTER = 10;
  const FISH_V = [2, 3, 5, 10, 15, 20, 25, 50, 100, 250, 1000];
  const FISH_W = [34, 26, 18, 10, 5, 2.5, 1.8, 0.8, 0.25, 0.05, 0.005];
  const FREE_SPINS = { 3: 10, 4: 15, 5: 20 };
  const LEVELS = [1, 2, 3, 10]; // násobek sběru po každých 4 rybářích
  const CFG = { scatterP: 0.0235, fishPFS: 0.078, wildPFS: 0.0155, payScale: 4.2, fsPayScale: 4.2, collectScale: 1, buyX: 75 };

  const fish = rnd => ({ s: FISH, v: SM.pickW(FISH_V, FISH_W, rnd) });
  function cell(r, rnd, fs) {
    const x = rnd();
    if (x < CFG.scatterP && !fs) return { s: SCATTER };
    if (fs) {
      if (x < CFG.fishPFS) return fish(rnd);
      if (x < CFG.fishPFS + CFG.wildPFS) return { s: WILD };
      if (x < CFG.fishPFS + CFG.wildPFS + CFG.scatterP * 0.6) return { s: SCATTER };
    }
    const id = SM.pickW(SYMS.map(s => s.id), SYMS.map(s => s.w), rnd);
    return id === FISH ? fish(rnd) : { s: id };
  }
  const filler = rnd => cell(0, rnd, false);
  function spin(rnd, fs = false) {
    const g = Array.from({ length: REELS }, (_, r) => Array.from({ length: ROWS }, () => cell(r, rnd, fs)));
    const ev = SM.ways(g, SYMS, WILD, fs ? CFG.fsPayScale : CFG.payScale);
    let fishSum = 0; for (const col of g) for (const x of col) if (x.s === FISH) fishSum += x.v;
    return { g, wins: ev.wins, total: ev.total, sc: SM.count(g, SCATTER), fishermen: SM.count(g, WILD), fishSum };
  }
  // stav free spinů
  function fsState(n) { return { left: n, collected: 0, level: 0, total: 0 }; }
  // vyhodnotí sběr ve free spinu; vrací {collect, retrig}
  function fsCollect(st, r) {
    let collect = 0;
    if (r.fishermen && r.fishSum) collect = r.fishSum * r.fishermen * LEVELS[st.level] * CFG.collectScale;
    let retrig = 0;
    const before = Math.floor(st.collected / 4);
    st.collected += r.fishermen;
    const after = Math.min(3, Math.floor(st.collected / 4));
    if (after > before && st.level < 3) { retrig = (after - Math.min(before, 3)) * 10; st.level = after; }
    if (r.sc >= 3) retrig += 5;
    return { collect, retrig };
  }
  function freeSpins(n, rnd) {
    const st = fsState(n);
    while (st.left > 0) { st.left--; const r = spin(rnd, true); const c = fsCollect(st, r); st.total += r.total + c.collect; st.left += c.retrig; }
    return st.total;
  }
  return { REELS, ROWS, SYMS, WILD, FISH, SCATTER, FREE_SPINS, LEVELS, CFG, filler, spin, fsState, fsCollect, freeSpins };
})();
if (typeof module !== 'undefined') module.exports = Game;
