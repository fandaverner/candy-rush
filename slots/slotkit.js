// SlotKit – sdílené UI pro automaty Lucky 7 Casina (válce, ovládání, peněženka, okna, zvuky)
const Kit = (() => {
  const css = `
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{background:var(--bg0)}html,body{margin:0}
body{font-family:'Fredoka',system-ui,sans-serif;color:#fff;min-height:100vh;overflow-x:hidden;background:var(--bgimg) fixed}
.app{position:relative;z-index:1;max-width:520px;margin:0 auto;padding:8px 8px 18px;display:flex;flex-direction:column;gap:8px}
header{display:flex;align-items:center;justify-content:space-between;gap:6px}
.icon{width:36px;height:36px;border-radius:50%;border:1.5px solid var(--acc2);background:#0005;color:#fff;font-size:16px;display:grid;place-items:center;cursor:pointer;text-decoration:none;font-family:inherit}
.title{text-align:center;line-height:1}
.title .t{font-family:var(--tfont);font-weight:900;font-size:24px;letter-spacing:1px;background:var(--tgrad);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 #0008) drop-shadow(0 0 10px var(--glow))}
.title small{display:block;font-size:9px;letter-spacing:4px;opacity:.75;margin-top:3px}
.fsbar{display:none;justify-content:space-between;align-items:center;padding:6px 12px;border-radius:12px;font-weight:600;font-size:13px;background:var(--fsbar);color:#fff;text-shadow:0 1px 2px #0008;box-shadow:0 0 16px var(--glow)}
.fsbar.on{display:flex}.fsbar b{font-size:20px}
.frame{position:relative;padding:7px;border-radius:18px;background:var(--frame);box-shadow:0 0 0 2px #0008,0 0 24px var(--glow),0 10px 24px #000a}
.board{position:relative;display:grid;gap:3px;border-radius:12px;overflow:hidden;background:var(--boardbg)}
.reel{position:relative;overflow:hidden;background:var(--reelbg);border-radius:6px}
.strip{position:absolute;left:0;right:0;top:0;will-change:transform}
.strip.blur .sym svg{filter:blur(1.3px)}
.sym{height:var(--ch);display:grid;place-items:center;position:relative}
.sym svg{width:84%;height:88%;overflow:visible;filter:drop-shadow(0 2px 2px #000a)}
.sym .val{position:absolute;left:50%;bottom:6%;transform:translateX(-50%);font-weight:700;font-size:calc(var(--cw)*.2);color:#fff;white-space:nowrap;
 text-shadow:0 0 3px #000,0 1px 0 #000,0 0 8px #000;padding:0 4px;border-radius:6px;background:#0007;line-height:1.25}
.sym .val.jp{color:var(--jpc,#ffe28a);font-family:var(--tfont)}
.sym.empty svg{opacity:0}
.sym.win svg{animation:kwin .7s ease-in-out infinite}
.sym.win::before{content:"";position:absolute;inset:3px;border-radius:10px;background:radial-gradient(circle,var(--winglow),transparent 70%);box-shadow:inset 0 0 0 2px var(--acc)}
@keyframes kwin{50%{transform:scale(1.13)}}
.board.dim .sym:not(.win){opacity:.33;transition:opacity .3s}
.sym.pulse svg{animation:kpulse 1.4s ease-in-out infinite}
@keyframes kpulse{50%{transform:scale(1.1)}}
.sym.flick svg{animation:kflick .12s linear infinite}
@keyframes kflick{50%{opacity:.3;transform:translateY(-6px)}}
.sym.landed svg{animation:kland .45s cubic-bezier(.2,1.6,.4,1)}
@keyframes kland{from{transform:scale(.3);opacity:0}}
.reel.antic{box-shadow:inset 0 0 0 2px var(--acc),inset 0 0 20px var(--glow)}
.ovl{position:absolute;left:0;right:0;height:var(--ch);z-index:3;display:grid;place-items:center;pointer-events:none}
.winpop{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:8;pointer-events:none;text-align:center;font-family:var(--tfont);font-weight:900;color:#fff6d0;
 text-shadow:0 0 6px #000,0 0 18px var(--glow),0 3px 0 #000;font-size:34px;opacity:0;white-space:nowrap}
.winpop.on{animation:kpop 1.8s ease-out forwards}
.winpop small{display:block;font-family:'Fredoka';font-size:13px;font-weight:600;letter-spacing:1px}
@keyframes kpop{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.12)}25%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0}}
.msgline{min-height:18px;text-align:center;font-size:12px;opacity:.9}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.stat{background:#0007;border:1px solid var(--acc2);border-radius:12px;padding:4px 8px;text-align:center}
.stat small{display:block;font-size:10px;letter-spacing:1.5px;opacity:.75}
.stat b{font-size:19px}.stat.w b{color:var(--acc);text-shadow:0 0 8px var(--glow)}
.controls{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px}
.betbox{display:flex;align-items:center;justify-content:space-between;gap:4px;background:#0007;border:1px solid var(--acc2);border-radius:999px;padding:3px}
.betbox button{width:32px;height:32px;border-radius:50%;border:0;font-size:20px;font-weight:700;cursor:pointer;color:var(--btntext);background:var(--btn);font-family:inherit;line-height:1}
.betbox button:disabled{opacity:.4}
.betbox .bv{text-align:center;font-weight:700;font-size:15px;line-height:1.05}.betbox .bv small{display:block;font-size:9px;letter-spacing:1px;opacity:.7;font-weight:400}
.spin{width:86px;height:86px;border-radius:50%;cursor:pointer;border:0;padding:0;font-family:var(--tfont);font-weight:900;font-size:15px;color:#fff;letter-spacing:1px;background:var(--spinbg);
 box-shadow:0 0 0 3px var(--acc),0 0 0 5px #0008,0 0 22px var(--glow),0 6px 12px #000a;text-shadow:0 1px 3px #000}
.spin:active{transform:scale(.95)}.spin:disabled{filter:grayscale(.5) brightness(.8)}
.spin .ic{display:block;font-size:26px;line-height:1;font-family:'Fredoka'}
.side{display:flex;gap:6px;justify-content:center}
.pill{border:1.5px solid var(--acc2);border-radius:12px;padding:8px 9px;font-family:inherit;font-weight:700;font-size:12px;cursor:pointer;color:#fff;background:#0007}
.pill.on{background:var(--btn);color:var(--btntext)}
.buy{border:0;border-radius:12px;padding:9px;font-family:var(--tfont);font-weight:800;font-size:14px;cursor:pointer;color:#fff;letter-spacing:1px;background:var(--buybg);box-shadow:0 3px 0 #0008,0 0 14px var(--glow);text-shadow:0 1px 2px #000}
.buy:disabled{filter:grayscale(.7);opacity:.6}.buy small{font-family:'Fredoka';font-weight:600;opacity:.85}
.foot{text-align:center;font-size:10px;opacity:.6}
.ov{position:fixed;inset:0;z-index:50;display:none;align-items:center;justify-content:center;padding:16px;background:#000c;backdrop-filter:blur(4px)}
.ov.on{display:flex}
.card{max-width:420px;width:100%;max-height:88vh;overflow:auto;border-radius:20px;padding:20px 18px;text-align:center;color:#fff;background:var(--cardbg);border:1px solid var(--acc2);box-shadow:0 0 40px var(--glow);animation:kcin .4s cubic-bezier(.2,1.5,.4,1)}
@keyframes kcin{from{transform:scale(.6);opacity:0}}
.card h2{margin:0 0 6px;font-family:var(--tfont);font-size:26px;color:var(--acc);text-shadow:0 0 12px var(--glow)}
.card .big{font-family:var(--tfont);font-weight:900;font-size:44px;color:#fff6d0;text-shadow:0 0 16px var(--glow);margin:4px 0}
.card p{margin:6px 0;font-size:14px;line-height:1.45}
.card .go{margin-top:10px;border:0;border-radius:999px;padding:11px 26px;font-family:var(--tfont);font-weight:800;font-size:16px;cursor:pointer;color:var(--btntext);background:var(--btn);box-shadow:0 3px 0 #0008}
.card .ghost{background:#ffffff22;color:#fff;margin-left:6px}
.pt{width:100%;border-collapse:collapse;font-size:12px;margin:8px 0}.pt td,.pt th{padding:3px;border-bottom:1px solid #ffffff1a}.pt th{font-size:10px;color:var(--acc)}
.pt svg{width:34px;height:30px;vertical-align:middle}
.rules{text-align:left;font-size:13px;line-height:1.45;padding-left:18px}.rules li{margin:3px 0}
.confetti{position:fixed;top:-20px;z-index:60;pointer-events:none;font-size:20px;animation:kfall linear forwards}
@keyframes kfall{to{transform:translateY(110vh) rotate(540deg)}}
.fly{position:fixed;z-index:30;pointer-events:none;font-weight:700;font-size:16px;color:#fff;text-shadow:0 0 4px #000,0 0 10px var(--glow);transition:transform .6s cubic-bezier(.5,0,.3,1),opacity .6s}
`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const $ = id => document.getElementById(id);
  const fmt = x => Math.round(x).toLocaleString('cs-CZ');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const WKEY = 'lucky7_wallet';
  const K = { fmt, sleep, busy: false, auto: false, turbo: false, sound: true, bonus: false, bonusBet: 10 };
  let bal = 1000; try { const s = localStorage.getItem(WKEY); if (s !== null && isFinite(+s)) bal = +s; } catch (e) {}
  let O, betI = 0, grid, reels = [], strips = [];
  const save = () => { try { localStorage.setItem(WKEY, String(Math.round(bal))); localStorage.setItem(O.key + '_bet', String(betI)); } catch (e) {} };
  K.bet = () => K.bonus ? K.bonusBet : O.bets[betI];
  K.wait = ms => sleep(K.turbo ? ms * .45 : ms);
  K.addBal = x => { bal += x; save(); K.update(); };
  K.getBal = () => bal;

  // zvuk
  let actx = null;
  K.tone = (f, d = .1, type = 'sine', v = .08, delay = 0, f2) => {
    if (!K.sound) return;
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const t = actx.currentTime + delay, o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch (e) {}
  };
  K.sfx = {
    stop: i => K.tone(140 + i * 25, .09, 'triangle', .09),
    win: () => [523, 659, 784].forEach((f, i) => K.tone(f, .25, 'sine', .08, i * .08)),
    big: () => [392, 523, 659, 784, 1046].forEach((f, i) => K.tone(f, .4, 'triangle', .1, i * .1)),
    tick: () => K.tone(1200, .03, 'square', .03),
    ding: (i = 0) => K.tone(700 + i * 90, .25, 'sine', .09),
    whoosh: () => K.tone(200, .5, 'sawtooth', .05, 0, 900),
    jp: () => [784, 988, 1175, 1568, 1175, 1568, 2093].forEach((f, i) => K.tone(f, .3, 'triangle', .1, i * .12)),
  };

  // ---------- sestavení stránky ----------
  K.create = opts => {
    O = Object.assign({ bets: [10, 20, 30, 50, 100, 200, 500], cellRatio: .84, buyX: 0 }, opts);
    try { const b = +localStorage.getItem(O.key + '_bet'); if (b >= 0 && b < O.bets.length) betI = b | 0; } catch (e) {}
    document.body.insertAdjacentHTML('beforeend', `
<div class="app">
  <header><a class="icon" href="index.html" title="Lobby">🏠</a>
    <div class="title"><div class="t">${O.title}</div><small>${O.subtitle}</small></div>
    <div style="display:flex;gap:5px"><button class="icon" id="kSound">🔊</button><button class="icon" id="kInfo">ℹ️</button></div></header>
  <div id="kTop"></div>
  <div class="fsbar" id="kFs"><div id="kFsL">FREE SPINY <b>0</b></div><div id="kFsR" style="text-align:right">VÝHRA BONUSU <b>0</b></div></div>
  <div class="frame"><div class="board" id="kBoard" style="grid-template-columns:repeat(${O.reels},1fr)"></div><div class="winpop" id="kPop"></div></div>
  <div class="msgline" id="kMsg">${O.hint || ''}</div>
  <div class="stats"><div class="stat"><small>KREDIT</small><b id="kBal">0</b></div><div class="stat w"><small>VÝHRA</small><b id="kWin">0</b></div></div>
  <div class="controls">
    <div class="betbox"><button id="kBm">−</button><div class="bv"><small>SÁZKA</small><span id="kBet">10</span></div><button id="kBp">+</button></div>
    <button class="spin" id="kSpin"><span class="ic">⟳</span>TOČIT</button>
    <div class="side"><button class="pill" id="kAuto">AUTO</button><button class="pill" id="kTurbo">⚡</button></div>
  </div>
  ${O.buyX ? `<button class="buy" id="kBuy">${O.buyLabel || 'KOUPIT BONUS'} <small id="kBuyC"></small></button>` : ''}
  <div class="foot">Lucky 7 Casino • jen pro zábavu, fiktivní kredity</div>
</div>
<div class="ov" id="kOv"><div class="card" id="kCard"></div></div>`);
    const board = $('kBoard');
    for (let r = 0; r < O.reels; r++) {
      const el = document.createElement('div'); el.className = 'reel';
      const s = document.createElement('div'); s.className = 'strip'; el.appendChild(s); board.appendChild(el); reels.push(el); strips.push(s);
    }
    const size = () => { const w = board.clientWidth / O.reels; document.documentElement.style.setProperty('--cw', w + 'px'); document.documentElement.style.setProperty('--ch', Math.round(w * O.cellRatio) + 'px'); reels.forEach(r => r.style.height = `calc(var(--ch) * ${O.rows})`); };
    size(); addEventListener('resize', () => { size(); K.render(grid); });
    grid = Array.from({ length: O.reels }, () => Array.from({ length: O.rows }, () => O.filler(Math.random)));
    K.render(grid);
    $('kSpin').onclick = () => { if (K.auto) { K.stopAuto(); return; } K.spin(); };
    $('kAuto').onclick = () => { K.auto = !K.auto; $('kAuto').classList.toggle('on', K.auto); if (K.auto && !K.busy) K.spin(); K.update(); };
    $('kTurbo').onclick = () => { K.turbo = !K.turbo; $('kTurbo').classList.toggle('on', K.turbo); };
    $('kSound').onclick = () => { K.sound = !K.sound; $('kSound').textContent = K.sound ? '🔊' : '🔇'; };
    $('kInfo').onclick = () => { $('kCard').innerHTML = O.info() + '<button class="go" id="kGo">ROZUMÍM</button>'; $('kOv').classList.add('on'); $('kGo').onclick = () => $('kOv').classList.remove('on'); };
    $('kBm').onclick = () => { if (betI > 0) betI--; save(); K.update(); };
    $('kBp').onclick = () => { if (betI < O.bets.length - 1) betI++; save(); K.update(); };
    if (O.buyX) $('kBuy').onclick = K.buy;
    document.addEventListener('keydown', e => { if (e.code === 'Space' && !$('kOv').classList.contains('on')) { e.preventDefault(); $('kSpin').click(); } });
    K.update();
  };

  K.update = () => {
    $('kBal').textContent = fmt(bal); $('kBet').textContent = fmt(K.bet());
    $('kSpin').disabled = K.busy && !K.auto;
    $('kBm').disabled = $('kBp').disabled = K.busy || K.bonus;
    if (O.buyX) { $('kBuy').disabled = K.busy || K.bonus || bal < O.bets[betI] * O.buyX; $('kBuyC').textContent = '(' + fmt(O.bets[betI] * O.buyX) + ')'; }
    O.onUpdate && O.onUpdate();
  };
  K.setWin = x => $('kWin').textContent = fmt(x);
  K.msg = t => $('kMsg').innerHTML = t || ' ';
  K.fsBar = (on, left, win, leftLabel = 'FREE SPINY', rightLabel = 'VÝHRA BONUSU') => {
    $('kFs').classList.toggle('on', on);
    $('kFsL').innerHTML = `${leftLabel} <b>${left}</b>`; $('kFsR').innerHTML = `${rightLabel} <b>${fmt(win)}</b>`;
  };
  K.top = () => $('kTop');

  // ---------- válce ----------
  K.symHTML = (c, extra = '') => {
    const lab = O.label ? O.label(c, K.bet()) : null;
    return `<div class="sym s${c.s}${extra}${O.pulse && O.pulse.includes(c.s) ? ' pulse' : ''}"><svg viewBox="0 0 100 100"><use href="#${O.prefix}${c.s}"/></svg>${lab ? `<span class="val${lab.cls ? ' ' + lab.cls : ''}">${lab.t}</span>` : ''}</div>`;
  };
  K.render = g => { grid = g; for (let r = 0; r < O.reels; r++) { strips[r].style.transition = 'none'; strips[r].style.transform = 'translateY(0)'; strips[r].innerHTML = g[r].map(c => K.symHTML(c)).join(''); } };
  K.cell = (r, y) => strips[r].children[y];
  K.setCell = (r, y, c, extra = '') => { grid[r][y] = c; const el = K.cell(r, y); el.outerHTML = K.symHTML(c, extra); };
  K.reelEl = r => reels[r];
  const cellH = () => reels[0].clientHeight / O.rows;
  // roztočí válce a zastaví je na nové mřížce; keep[r][y] = buňky, které zůstávají (lepivé)
  K.spinTo = async (ng, o = {}) => {
    $('kBoard').classList.remove('dim');
    const h = cellH(), done = []; let delay = 0, cnt = 0;
    for (let r = 0; r < O.reels; r++) {
      const antic = o.anticSym != null && r >= 2 && cnt >= 2;
      const n = 12 + r * 4 + (antic ? 14 : 0);
      const seq = [...ng[r], ...Array.from({ length: n }, () => O.filler(Math.random)), ...grid[r]];
      const s = strips[r];
      s.style.transition = 'none'; s.innerHTML = seq.map(c => K.symHTML(c)).join('');
      s.style.transform = `translateY(${-(seq.length - O.rows) * h}px)`; s.classList.add('blur');
      const dur = (K.turbo ? .45 : 1) * (600 + n * 36);
      done.push(new Promise(res => setTimeout(() => {
        if (antic) { reels[r].classList.add('antic'); K.tone(300, .8, 'sine', .04, 0, 900); }
        s.style.transition = `transform ${dur}ms cubic-bezier(.25,.1,.25,1.06)`; s.style.transform = 'translateY(0)';
        setTimeout(() => { s.classList.remove('blur'); reels[r].classList.remove('antic'); K.sfx.stop(r); s.style.transition = 'none'; s.innerHTML = ng[r].map(c => K.symHTML(c)).join(''); res(); }, dur);
      }, delay)));
      delay += K.turbo ? 50 : 120;
      if (o.anticSym != null) cnt += ng[r].filter(c => c.s === o.anticSym).length;
    }
    await Promise.all(done); grid = ng;
  };
  K.highlight = cells => {
    const set = new Set(cells.map(([r, y]) => r * 10 + y));
    for (let r = 0; r < O.reels; r++) for (let y = 0; y < O.rows; y++) K.cell(r, y)?.classList.toggle('win', set.has(r * 10 + y));
    $('kBoard').classList.toggle('dim', cells.length > 0);
  };
  K.clearHighlight = () => K.highlight([]);
  K.overlay = (r, y, html, cls = '') => { const d = document.createElement('div'); d.className = 'ovl ' + cls; d.style.top = `calc(var(--ch) * ${y})`; d.innerHTML = html; reels[r].appendChild(d); return d; };
  K.clearOverlays = cls => document.querySelectorAll('.ovl' + (cls ? '.' + cls : '')).forEach(e => e.remove());
  K.fly = (fromEl, toEl, text) => new Promise(res => {
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const f = document.createElement('div'); f.className = 'fly'; f.textContent = text;
    f.style.left = (a.left + a.width / 2 - 14) + 'px'; f.style.top = (a.top + a.height / 2 - 10) + 'px'; document.body.appendChild(f);
    requestAnimationFrame(() => requestAnimationFrame(() => { f.style.transform = `translate(${b.left - a.left}px,${b.top - a.top}px) scale(1.3)`; }));
    setTimeout(() => { f.style.opacity = 0; }, K.turbo ? 300 : 550); setTimeout(() => { f.remove(); res(); }, K.turbo ? 350 : 650);
  });
  K.winpop = (t, sub) => { const p = $('kPop'); p.innerHTML = t + (sub ? `<small>${sub}</small>` : ''); p.classList.remove('on'); void p.offsetWidth; p.classList.add('on'); };
  // standardní prezentace výher „ways“
  K.showWays = async (wins, total, names) => {
    if (!wins.length) return;
    K.highlight(wins.flatMap(w => w.cells));
    const best = wins.slice().sort((a, b) => b.win - a.win).slice(0, 3);
    K.msg(best.map(w => `${names[w.s]} ×${w.len} • ${w.ways} cest${w.mult > 1 ? ' • ×' + (Math.round(w.mult * 10) / 10) : ''}`).join(' &nbsp;|&nbsp; '));
    if (total > 0) {
      const r = total / K.bet();
      K.setWin(total); K.winpop(fmt(total), r >= 50 ? 'MEGA VÝHRA' : r >= 15 ? 'VELKÁ VÝHRA' : r >= 5 ? 'PĚKNÁ VÝHRA' : '');
      r >= 15 ? K.sfx.big() : K.sfx.win();
      await K.wait(r >= 15 ? 2100 : 1250);
    }
  };
  K.coins = w => w > 0 ? Math.max(1, Math.floor(w * K.bet())) : 0; // výhra × sázka → celé kredity (min. 1)

  K.modal = (html, btn, autoClose = 0) => new Promise(res => {
    $('kCard').innerHTML = html + (btn ? `<div><button class="go" id="kGo">${btn}</button></div>` : '');
    $('kOv').classList.add('on'); let d = false; const c = () => { if (d) return; d = true; $('kOv').classList.remove('on'); res(); };
    if (btn) $('kGo').onclick = c; if (autoClose) setTimeout(c, autoClose);
  });
  K.confirm = html => new Promise(res => {
    $('kCard').innerHTML = html + '<div><button class="go" id="kY">KOUPIT</button><button class="go ghost" id="kN">Zpět</button></div>';
    $('kOv').classList.add('on'); $('kY').onclick = () => { $('kOv').classList.remove('on'); res(true); }; $('kN').onclick = () => { $('kOv').classList.remove('on'); res(false); };
  });
  K.confetti = (n, set) => { for (let i = 0; i < n; i++) { const s = document.createElement('div'); s.className = 'confetti'; s.textContent = set[i % set.length];
    s.style.left = Math.random() * 100 + 'vw'; s.style.animationDuration = (2 + Math.random() * 2) + 's'; s.style.animationDelay = Math.random() * .8 + 's'; document.body.appendChild(s); setTimeout(() => s.remove(), 5000); } };
  K.stopAuto = () => { K.auto = false; $('kAuto').classList.remove('on'); K.update(); };

  // ---------- hlavní smyčka ----------
  K.spin = async () => {
    if (K.busy) return;
    const b = O.bets[betI];
    if (bal < b) { K.stopAuto(); return K.modal('<h2>Došel kredit</h2><p>Doplnit kredit můžeš v lobby kasina, když klesne pod 10.</p>', 'OK'); }
    K.busy = true; bal -= b; save(); K.update(); K.setWin(0); K.msg('');
    const w = await O.round(b);
    bal += w; save(); K.busy = false; K.update();
    if (K.auto) { await K.wait(300); if (K.auto) K.spin(); }
  };
  K.buy = async () => {
    const b = O.bets[betI], cost = b * O.buyX;
    if (K.busy || K.bonus || bal < cost) return;
    if (!(await K.confirm(`<h2>Koupit bonus?</h2><p>${O.buyText}</p><div class="big">${fmt(cost)}</div>`))) return;
    K.busy = true; bal -= cost; save(); K.update();
    const w = await O.buy(b);
    bal += w; save(); K.busy = false; K.update();
  };
  // pomocník pro free spiny: přičítá výhry průběžně do kreditu
  K.credit = x => { bal += x; save(); K.update(); };
  return K;
})();
