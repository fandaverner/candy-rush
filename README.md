# 🎰 Lucky 7 Casino

Malé herní kasino v prohlížeči – jen pro zábavu, fiktivní kredity. Kredit je společný pro všechny hry (localStorage).

| Soubor | Hra |
|---|---|
| `index.html` | Lobby kasina s kreditem a výběrem her |
| `candy-rush.html` | 🍭 Candy Rush 8×8 – cukrovinkový automat |
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
- Koupě bonusu za 80× sázka

Vývoj: `engine.js` (logika) + `template.html` (UI) → `python3 build.py` vytvoří `candy-rush.html`. Simulace výplat: `node sim.js 400000`.
