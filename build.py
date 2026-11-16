# Sestaví hry z šablon: candy-rush.html (template.html + engine.js), halo-horns.html (hh-template.html + hh-engine.js)
for tpl, eng, out in [('template.html', 'engine.js', 'candy-rush.html'), ('hh-template.html', 'hh-engine.js', 'halo-horns.html')]:
    open(out, 'w').write(open(tpl).read().replace('/*ENGINE*/', open(eng).read()))
