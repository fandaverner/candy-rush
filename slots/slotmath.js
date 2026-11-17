// Sdílená matematika automatů: výplaty „ways“ s wildy a násobky
const SlotMath = (() => {
  function pickW(arr, w, rnd) { let t = 0; for (const x of w) t += x; let x = rnd() * t; for (let i = 0; i < arr.length; i++) if ((x -= w[i]) < 0) return arr[i]; return arr[arr.length - 1]; }
  // g[reel][row] = {s, m?}; syms = [{id, pay:[3,4,5]}]; wild = id wildu
  // Násobky wildů v jedné cestě se NÁSOBÍ (součet přes cesty = součin součtů po válcích)
  function ways(g, syms, wild, scale = 1) {
    const out = [];
    for (const s of syms) {
      let factor = 1, count = 1, len = 0, real = false; const cells = [];
      for (let r = 0; r < g.length; r++) {
        let f = 0, c = 0;
        for (let y = 0; y < g[r].length; y++) {
          const x = g[r][y];
          if (x.s === s.id) { f += 1; c++; real = true; cells.push([r, y]); }
          else if (x.s === wild) { f += x.m || 1; c++; cells.push([r, y]); }
        }
        if (!f) break;
        factor *= f; count *= c; len++;
      }
      if (len >= 3 && real) {
        const win = s.pay[Math.min(len, 5) - 3] * factor * scale;
        out.push({ s: s.id, len, ways: count, mult: Math.round(factor / count * 100) / 100, win, cells: cells.filter(([r]) => r < len) });
      }
    }
    return { wins: out, total: out.reduce((a, w) => a + w.win, 0) };
  }
  const count = (g, s) => { let n = 0; for (const col of g) for (const x of col) if (x.s === s) n++; return n; };
  return { pickW, ways, count };
})();
if (typeof module !== 'undefined') module.exports = SlotMath;
