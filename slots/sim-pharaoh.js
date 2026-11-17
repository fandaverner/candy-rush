const G = require('./pharaoh-engine.js'); const N = +process.argv[2] || 200000, rnd = Math.random;
let base = 0, bon = 0, trig = 0, hits = 0, arr = [], grand = 0;
const fl = w => w > 0 ? Math.max(1, Math.floor(w * 10)) / 10 : 0;
for (let i = 0; i < N; i++) { const r = G.base(rnd); const w = fl(r.total); base += w; if (w) hits++;
  if (r.trigger) { trig++; const h = G.holdAndWin(r.g, rnd); bon += h.total; arr.push(h.total); if (h.grand) grand++; } }
let buy = []; for (let i = 0; i < 20000; i++) buy.push(G.holdAndWin(G.buyGrid(rnd), rnd).total);
arr.sort((a, b) => a - b); const av = a => a.reduce((x, y) => x + y, 0) / a.length;
console.log('base', (base / N * 100).toFixed(1), 'H&W', (bon / N * 100).toFixed(1), 'TOTAL', ((base + bon) / N * 100).toFixed(1));
console.log('hit', (hits / N * 100).toFixed(1) + '%', 'trig 1 in', (N / trig).toFixed(0), 'avg', av(arr).toFixed(1), 'med', arr[arr.length >> 1], 'grand', grand, '| buy avg', av(buy).toFixed(1));
