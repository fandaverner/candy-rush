const G = require('./fisher-engine.js'); const N = +process.argv[2] || 200000, rnd = Math.random;
let base = 0, bon = 0, trig = 0, hits = 0, arr = [];
const fl = w => w > 0 ? Math.max(1, Math.floor(w * 10)) / 10 : 0;
for (let i = 0; i < N; i++) { const r = G.spin(rnd); const w = fl(r.total); base += w; if (w) hits++;
  if (r.sc >= 3) { trig++; const b = G.freeSpins(G.FREE_SPINS[Math.min(r.sc, 5)], rnd); bon += b; arr.push(b); } }
let buy = []; for (let i = 0; i < 5000; i++) buy.push(G.freeSpins(10, rnd));
arr.sort((a, b) => a - b); const av = a => a.reduce((x, y) => x + y, 0) / a.length;
console.log('base', (base / N * 100).toFixed(1), 'FS', (bon / N * 100).toFixed(1), 'TOTAL', ((base + bon) / N * 100).toFixed(1));
console.log('hit', (hits / N * 100).toFixed(1) + '%', 'trig 1 in', (N / trig).toFixed(0), 'avg', av(arr).toFixed(1), 'med', arr[arr.length >> 1]?.toFixed(1), 'max', arr[arr.length - 1]?.toFixed(0), '| buy avg', av(buy).toFixed(1));
