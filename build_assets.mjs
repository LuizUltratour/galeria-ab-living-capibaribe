// build_assets.mjs — regera assets/ a partir de _originais/ (fora do git).
//   npm i  &&  node build_assets.mjs
// imagens: lightbox <= 2400px (webp q80) · miniatura <= 800px (q72)
// plantas: mantém transparência; lightbox <= 3000px (q85) · miniatura <= 1400px (q80)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const O = '_originais';
const imgs = {
  'fachada/fachada-frente-diurna':   'Livng Capibaribe-Fachada Frente-Diurna.jpeg',
  'fachada/fachada-frente-noturna':  'Livng Capibaribe-Fachada Frente-Noturna.jpg',
  'fachada/fachada-lateral-diurna':  'Livng Capibaribe-Fachada Lateral-Diurna.jpg',
  'fachada/fachada-lateral-noturna': 'Livng Capibaribe-Fachada Lateral-Noturna.jpg',
  'fachada/guarita-acesso':          'Livng Capibaribe-Guarita Acesso.jpeg',
  'fachada/insercao':                'Livng Capibaribe-Insercao.jpeg',
  'fachada/hall-social':             'Livng Capibaribe-Hall Social.jpg',
  'areas-comuns/piscina':            'Livng Capibaribe-Piscina.jpg',
  'areas-comuns/sunset-lounge':      'Livng Capibaribe-Sunset Louge.jpg',
  'areas-comuns/terraco-gourmet':    'Livng Capibaribe-Terraço Gourmet.jpg',
  'areas-comuns/espaco-gourmet':     'Livng Capibaribe-Espaço Gourmet.jpg',
  'areas-comuns/academia':           'Livng Capibaribe-Academia.jpg',
  'areas-comuns/coworking':          'Livng Capibaribe-Coworking.jpg',
  'areas-comuns/mini-market':        'Livng Capibaribe-Mini Market.jpg',
  'areas-comuns/lavanderia':         'Livng Capibaribe-Lavanderia.jpeg',
  'areas-comuns/pet-wash':           'Livng Capibaribe-PetWash.jpg',
  'apartamento/apto-tipo-estar':     'Livng Capibaribe-Apto Tipo-Estar.jpg',
  'apartamento/apto-tipo-suite':     'Livng Capibaribe-Apto Tipo-Suite.jpg',
  'apartamento/loft-panoramica':     'Livng Capibaribe-Loft-Panoramica.jpg',
};
const plans = {
  'plantas/terreo':            'Livng Capibaribe-Planta-Terreo.png',
  'plantas/tipo-1-ao-8':       'Livng Capibaribe-Planta-Tipo-1 ao 8.png',
  'plantas/tipo-9':            'Livng Capibaribe-Planta-Tipo-9.png',
  'plantas/vazado':            'Livng Capibaribe-Planta-Vazado.png',
  'plantas/rooftop':           'Livng Capibaribe-Planta-Rooftop.png',
  'plantas/apto-padrao':       'Livng Capibaribe-Planta-AptoTipo-Padrao.png',
  'plantas/apto-loft':         'Livng Capibaribe-Planta-AptoTipo-Loft.png',
  'plantas/apto-loft-mezanino':'Livng Capibaribe-Planta-AptoTipo-Loft-Mezanino.png',
};
async function out(src, dest, size, q, trim) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let s = sharp(src, { limitInputPixels: false });
  if (trim) s = s.trim({ threshold: 1 });
  const { data, info } = await s.resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: q, effort: 5 }).toBuffer({ resolveWithObject: true });
  fs.writeFileSync(dest, data);
  return info;
}
const manifest = {};
for (const [k, f] of Object.entries(imgs)) {
  const src = path.join(O, 'imagens', f);
  const a = await out(src, `assets/${k}.webp`, 2400, 80);
  await out(src, `assets/miniaturas/${k}.webp`, 800, 72);
  manifest[k] = +(a.width / a.height).toFixed(3); console.log(k, a.width, a.height);
}
for (const [k, f] of Object.entries(plans)) {
  const src = path.join(O, 'plantas', f);
  const a = await out(src, `assets/${k}.webp`, 3000, 85, true);
  await out(src, `assets/miniaturas/${k}.webp`, 1400, 80, true);
  manifest[k] = +(a.width / a.height).toFixed(3); console.log(k, a.width, a.height);
}
// fundo da página: png 2,6 MB -> webp
await sharp('_originais/brand/bg.png').webp({ quality: 82 }).toFile('assets/brand/bg.webp');
fs.writeFileSync('assets-manifest.json', JSON.stringify(manifest, null, 1));
