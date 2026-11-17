// Ladění her: node tune.js <hra> [N]  → RTP, četnost bonusu, chycený vs. koupený bonus
const game = process.argv[2], N = +process.argv[3] || 200000, rnd = Math.random;
const fl = w => w > 0 ? Math.max(1, Math.floor(w * 10)) / 10 : 0;
let G, price, spin, buy;
if (game === 'candy') {
  G = require('./engine.js'); price = 95;
  spin = () => { const r = G.playSpin(false, rnd, { meter: 0 }); let b = 0; if (r.sc >= 3) { const k = Math.min(r.sc, 5); b = G.playBonus(G.FREE_SPINS[k], rnd, G.START_MULTI[k]); } return { w: r.win, b, t: r.sc >= 3, k: Math.min(r.sc, 5) }; };
  buy = () => G.playBonus(10, rnd, 0);
} else if (game === 'halo') {
  G = require('./hh-engine.js'); price = G.CFG.buyX || 80;
  const jp = G.JP.map(j => j.seed);
  const jack = n => { const l = G.jackpotLevel(n); if (l < 0) return 0; const v = jp[l]; jp[l] = G.JP[l].seed; return v; };
  const bonus = (n, nat) => { let t = 0, left = n, first = true; while (left > 0) { left--; const g = G.spinGrid(rnd), f = G.rollFeature(true, rnd, nat && first ? 2 : 0), e = G.evaluate(g, f, true); first = false; t += fl(e.total) + jack(e.jp); left += G.retrigger(e.sc); } return t; };
  spin = () => { G.JP.forEach((j, k) => jp[k] += j.grow); const g = G.spinGrid(rnd), f = G.rollFeature(false, rnd), e = G.evaluate(g, f, false); let b = 0; if (e.sc >= 3) b = bonus(G.FREE_SPINS[Math.min(e.sc, 5)], true); return { w: fl(e.total) + jack(e.jp), b, t: e.sc >= 3, k: Math.min(e.sc, 5), cb: 1 }; };
  buy = () => bonus(10, false);
} else if (game === 'pharaoh') {
  G = require('./slots/pharaoh-engine.js'); price = G.CFG.buyX;
  spin = () => { const r = G.base(rnd); let b = 0; if (r.trigger) b = G.holdAndWin(r.g, rnd, true).total; return { w: fl(r.total), b, t: r.trigger, k: 3 }; };
  buy = () => G.holdAndWin(G.buyGrid(rnd), rnd, false).total;
} else if (game === 'bandits') {
  G = require('./slots/bandits-engine.js'); price = G.CFG.buyX;
  spin = () => { const r = G.spin(rnd); let b = 0; if (r.sc >= 3) b = G.freeSpins(G.FREE_SPINS[Math.min(r.sc, 5)], rnd, true); return { w: fl(r.total), b, t: r.sc >= 3, k: Math.min(r.sc, 5) }; };
  buy = () => G.freeSpins(10, rnd, false);
} else if (game === 'fisher') {
  G = require('./slots/fisher-engine.js'); price = G.CFG.buyX;
  spin = () => { const r = G.spin(rnd); let b = 0; if (r.sc >= 3) b = G.freeSpins(G.FREE_SPINS[Math.min(r.sc, 5)], rnd, true); return { w: fl(r.total), b, t: r.sc >= 3, k: Math.min(r.sc, 5) }; };
  buy = () => G.freeSpins(10, rnd, false);
}
if (process.env.PRICE) price = +process.env.PRICE;
let W = 0, B = 0, T = 0, nat = [], nat3 = [];
for (let i = 0; i < N; i++) { const r = spin(); W += r.w; B += r.b; if (r.t) { T++; nat.push(r.b); if (r.k === 3) nat3.push(r.b); } }
const bb = []; for (let i = 0; i < 15000; i++) bb.push(buy());
const med = a => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1] || 0; }, avg = a => a.reduce((x, y) => x + y, 0) / (a.length || 1);
const pc = (a, c) => (a.filter(x => x > c).length / (a.length || 1) * 100).toFixed(0) + '%';
const cbx = game === 'halo' ? 3.5 : 0;
console.log(`${game}: base ${(W / N * 100).toFixed(1)} + bonus ${(B / N * 100).toFixed(1)}${cbx ? ' + cashback ~' + cbx : ''} = TOTAL ${((W + B) / N * 100 + cbx).toFixed(1)} | bonus 1 in ${(N / T).toFixed(0)}`);
console.log(`  chycený (3 sc): avg ${avg(nat3).toFixed(0)} med ${med(nat3).toFixed(0)} P(>${price}) ${pc(nat3, price)} | všechny chycené avg ${avg(nat).toFixed(0)} P(>${price}) ${pc(nat, price)}`);
console.log(`  koupený za ${price}: avg ${avg(bb).toFixed(0)} med ${med(bb).toFixed(0)} P(zisk) ${pc(bb, price)} RTP koupě ${(avg(bb) / price * 100).toFixed(0)}%`);
