# Sestaví candy-rush.html z template.html + engine.js
t = open('template.html').read()
open('candy-rush.html', 'w').write(t.replace('/*ENGINE*/', open('engine.js').read()))
