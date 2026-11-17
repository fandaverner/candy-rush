# Sestaví hry ze zdrojů (šablona + logika) do samostatných HTML souborů
def rd(p): return open(p, encoding='utf-8').read()
for tpl, eng, out in [('template.html', 'engine.js', 'candy-rush.html'), ('hh-template.html', 'hh-engine.js', 'halo-horns.html')]:
    open(out, 'w', encoding='utf-8').write(rd(tpl).replace('/*ENGINE*/', rd(eng)))
for name, out in [('pharaoh', 'poklad-faraona.html'), ('bandits', 'divoky-zapad.html'), ('fisher', 'zlaty-ulovek.html')]:
    import os
    if not os.path.exists(f'slots/{name}.tpl.html'): continue
    t = rd(f'slots/{name}.tpl.html')
    t = t.replace('/*SLOTMATH*/', rd('slots/slotmath.js')).replace('/*ENGINE*/', rd(f'slots/{name}-engine.js')).replace('/*KIT*/', rd('slots/slotkit.js'))
    open(out, 'w', encoding='utf-8').write(t)
