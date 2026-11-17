# 🎰 Lucky 7 Casino

Malé herní kasino v prohlížeči – jen pro zábavu, fiktivní kredity. Kredit je společný pro všechny hry (localStorage).

| Soubor | Hra |
|---|---|
| `index.html` | Lobby kasina s kreditem a výběrem her |
| `candy-rush.html` | 🍭 Candy Rush 8×8 – cukrovinkový automat |
| `halo-horns.html` | 😇😈 Halo & Horns – automat 5×6, 7 776 cest, rozšiřující se válce s násobkem, 3 jackpoty, cashback |
| `poklad-faraona.html` | 🪙 Poklad faraona – 243 cest, Hold & Win s mincemi, 4 jackpoty |
| `divoky-zapad.html` | 🤠 Divoký západ – 1024 cest, bandité s násobky (násobí se), lepiví ve free spinech |
| `zlaty-ulovek.html` | 🎣 Zlatý úlovek – 243 cest, rybář ve free spinech sbírá hodnoty ryb |
| `ruleta.html` | 🎡 Evropská ruleta (jedna nula) |
| `blackjack.html` | 🃏 Blackjack (6 balíčků, BJ 3:2, krupiér stojí na 17, zdvojení, rozdělení) |

## Candy Rush
- Plocha 8×8, výhra za shluk **5+ stejných symbolů** (sousedí stranou), kdekoli na ploše
- Padání symbolů (tumble) – výhry se řetězí
- 🔗 Základní hra: každý výherní shluk je propojení; výhry se sčítají a po konci kola se násobí: 2 propojení ×2, 3 ×4, 4 ×6, 5 ×8 …
- 🌈 Násobky ×2–×50 padají jen ve free spinech
- 🍭 Scatter: 3 = 10, 4 = 12 (+ start ×10), 5+ = 15 (+ start ×100) free spinů
- Ve free spinech se násobky sčítají a zůstávají do konce bonusu
- Lízátka v bonusu přidají spiny: 2 = +2, 3 = +5, 4 = +8, 5+ = +10
- Koupě bonusu za 75× sázka (koupený startuje s násobkem ×0, chycený se 3 scattery s ×5)

Vývoj: `engine.js` (logika) + `template.html` (UI) → `python3 build.py` vytvoří `candy-rush.html`. Simulace výplat: `node sim.js 400000`.

## Halo & Horns
- 5 válců × 6 řad = **7 776 cest** (3–5 stejných na sousedních válcích zleva)
- **Symbol Duel**: když padne na válec, roztáhne ho přes celou výšku, válec je WILD; nahoře a dole jsou dva různé násobky (×2–×100) a náhodně se vybere jeden z nich
- **Bonus**: 3/4/5 scatterů = 10/12/15 free spinů, v každém zaručený aspoň jeden rozšířený válec; 3+ scattery = +5 spinů
- **3 progresivní jackpoty** (MINI/MAJOR/GRAND za 3/4/5 jackpotových symbolů)
- **Rostoucí cashback** 1–5 % z prohraných spinů (+1 % každých 50 spinů, výběr vrací úroveň na 1 %)
- Logika `hh-engine.js`, UI `hh-template.html`, simulace `node hh-sim.js 300000`

## Poklad faraona, Divoký západ, Zlatý úlovek
Sdílené UI je ve `slots/slotkit.js`, výpočet výher „ways“ ve `slots/slotmath.js`, logika her v `slots/*-engine.js`, šablony `slots/*.tpl.html`.
`python3 build.py` sestaví všechny hry. Simulace: `node slots/sim-pharaoh.js`, `node slots/sim-bandits.js`, `node slots/sim-fisher.js` (cíl RTP ≈ 96 %).

## Chycený vs. koupený bonus
Bonus chycený ve hře má vždy výhodu: Candy Rush start ×5, Halo & Horns 2 Duely v 1. spinu, Poklad faraona 4 respiny,
Divoký západ jeden startovní bandita ×2, Zlatý úlovek 1 rybář v počítadle. Koupené bonusy vrací cca 92–94 %.
Ve všech free spinech přidávají scattery spiny: 2 = +2, 3 = +5, 4 = +8, 5 = +10. Ladění: `node tune.js <candy|halo|pharaoh|bandits|fisher>`.
