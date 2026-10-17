import pathlib
src = pathlib.Path(__file__).parent / 'src'
order = ['data.js', 'core.js', 'deco.js', 'hubmap.js', 'potager.js', 'jardin.js', 'bouquet.js', 'noel.js', 'galerie.js', 'clinique.js', 'coulisses.js', 'boot.js']
css = (src / 'style.css').read_text()
for extra in ['potager.css', 'jardin.css', 'bouquet.css', 'noel.css', 'galerie.css', 'clinique.css']:
    p = src / extra
    if p.exists(): css += '\n' + p.read_text()
js = '\n'.join((src / f).read_text() for f in order if (src / f).exists())
html = (src / 'shell.html').read_text().replace('/*CSS*/', css).replace('/*JS*/', js.replace('</script', '<\\/script'))
out = pathlib.Path(__file__).parent / 'index.html'
out.write_text(html)
print(out, len(html))
