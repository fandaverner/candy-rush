# 🍭 Candy Rush 8×8

Cukrovinkový výherní automat v prohlížeči (jen pro zábavu, fiktivní kredity).

- Plocha 8×8, výhra za shluk **5+ stejných symbolů** (sousedí stranou), kdekoli na ploše
- Padání symbolů (tumble) – výhry se řetězí
- 🔗 Základní hra: každý výherní shluk je propojení; výhry se sčítají a po konci kola se násobí: 2 propojení ×2, 3 ×4, 4 ×6, 5 ×8 …
- 🌈 Násobky ×2–×50 padají jen ve free spinech
- Start s 1 000 kredity, sázky 10–500
- 🍭 Scatter: 3 = 10, 4 = 12, 5+ = 15 free spinů
- Ve free spinech se násobky sčítají a zůstávají do konce bonusu
- 4 scattery = startovní násobek ×10, 5 scatterů = startovní násobek ×100
- Bonus padá cca 1× za 145 spinů, koupě bonusu za 80× sázka, RTP ≈ 96 % (ověřeno simulací)

## Soubory
- `index.html` – hotová hra (jeden soubor, stačí otevřít)
- `engine.js` – herní logika
- `template.html` – UI šablona (`/*ENGINE*/` se nahradí obsahem `engine.js`)
- `sim.js` – simulace RTP: `node sim.js 400000`
