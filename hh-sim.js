// Simulace RTP pro Halo & Horns: node hh-sim.js 300000
const H = require('./hh-engine.js');
const N = +process.argv[2] || 200000, rnd = Math.random;
let base = 0, bonus = 0, trig = 0, hits = 0, featN = 0, jpHits = [0, 0, 0], jpWin = 0, cb = 0, bon = [];
const jp = H.JP.map(j => j.seed);
let level = 1, sinceClaim = 0;
function jackpot(n) { const l = H.jackpotLevel(n); if (l < 0) return 0; jpHits[l]++; const v = jp[l]; jp[l] = H.JP[l].seed; return v; }
function playBonus(spins) {
  let tot = 0, left = spins;
  while (left > 0) {
    left--;
    const g = H.spinGrid(rnd), f = H.rollFeature(true, rnd), e = H.evaluate(g, f, true);
    tot += (e.total > 0 ? Math.max(1, Math.floor(e.total * 10)) / 10 : 0) + jackpot(e.jp);
    if (e.sc >= 3) left += H.RETRIGGER;
  }
  return tot;
}
for (let i = 0; i < N; i++) {
  H.JP.forEach((j, k) => jp[k] += j.grow);
  const g = H.spinGrid(rnd), f = H.rollFeature(false, rnd), e = H.evaluate(g, f, false);
  if (f.length) featN++;
  let w = e.total > 0 ? Math.max(1, Math.floor(e.total * 10)) / 10 : 0; if (w > 0) hits++;
  const jw = jackpot(e.jp); jpWin += jw;
  base += w;
  let bw = 0;
  if (e.sc >= 3) { trig++; bw = playBonus(H.FREE_SPINS[Math.min(e.sc, 5)]); bonus += bw; bon.push(bw); }
  const net = 1 - (w + jw + bw);
  if (net > 0) cb += net * level / 100;
  if (++sinceClaim % 100 === 0) level = Math.min(5, level + 1);
  if (sinceClaim >= 400) { level = 1; sinceClaim = 0; } // hráč si vybere zhruba co 400 spinů
}
const pc = x => (x / N * 100).toFixed(1);
bon.sort((a, b) => a - b);
console.log('base', pc(base), 'bonus', pc(bonus), 'jackpot', pc(jpWin), 'cashback', pc(cb), 'TOTAL', pc(base + bonus + jpWin + cb));
console.log('hit', pc(hits) + '%', 'feature', pc(featN) + '%', 'bonus 1 in', (N / trig).toFixed(0), 'avg', (bonus / trig).toFixed(0), 'med', bon[bon.length >> 1]?.toFixed(0), 'jp hits', jpHits.join('/'));
