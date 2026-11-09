# Galeria — Living Capibaribe (AB)

Galeria de imagens/plantas (+ player de vídeo) para injeção via script no 3DVista, hospedada no AWS S3.

**Tema (nova identidade visual):** fundo `assets/brand/bg.webp` com véu na cor principal **#301711**;
cor secundária **#BE4119** (filtro ativo, selos, detalhes). Fonte única: **Montserrat SemiBold (600)**.
Plantas (traço escuro, fundo transparente) ficam sobre papel claro `#F6F1EC`.

## URLs de produção

| Arquivo | URL |
|---------|-----|
| Galeria | `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/ab-corte-real/galeria-living-capibaribe/index.html` |
| Vídeo   | `.../video-gallery.html` |
| Script  | `.../inject.js` |

**S3:** `s3://skylineip/Tour Virtual/ab-corte-real/galeria-living-capibaribe/`
**GitHub:** https://github.com/LuizUltratour/galeria-ab-living-capibaribe

## Estrutura

```
index.html           galeria (?mode=imagens | plantas)
video-gallery.html   player do vídeo
inject.js            loader para o 3DVista
deploy.ps1           deploy para o S3
build_assets.mjs     gera assets/ a partir de _originais/ (Node + sharp)
_originais/          material entregue (FORA do git e do deploy)
assets/
  brand/             logo.png, bg.webp, close/voltar/proximo (normal + hover)
  fachada/ areas-comuns/ apartamento/ plantas/   imagens do lightbox (webp)
  miniaturas/        espelha as pastas acima (grade)
```

Arquivos publicados: minúsculos, sem espaços/acentos (S3 é case-sensitive).

## Categorias

Fachada e Acessos · Áreas Comuns (Lazer e Gourmet / Bem-estar e Serviços) · Apartamentos ·
Plantas (Pavimentos: Térreo, Tipo 1 ao 8, Tipo 9, Vazado, Rooftop · Apartamentos: Padrão, Loft, Loft Mezanino).

## Assets

```
npm i && node build_assets.mjs
```

Imagens: lightbox ≤ 2400 px (q80), miniatura ≤ 800 px (q72). Plantas: mantêm transparência,
lightbox ≤ 3000 px (q85), miniatura ≤ 1400 px (q80). Para acrescentar: coloque o original em
`_originais/`, registre em `build_assets.mjs` e em `GALLERY_CONFIG.items` (campo `ar` = largura/altura,
impresso pelo build).

## Deploy

```powershell
./deploy.ps1             # sync completo + cache-control no HTML/JS
./deploy.ps1 -QuickHtml  # só HTML/JS
./deploy.ps1 -WithVideo  # inclui o vídeo
```

## Integração 3DVista

Loader no JavaScript global do projeto (roda uma vez):

```js
(function(){
  var s = document.createElement('script');
  s.src = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/ab-corte-real/galeria-living-capibaribe/inject.js?v=' + Date.now();
  document.head.appendChild(s);
})();
```

Chamadas nos botões/hotspots — trechos prontos em `3dvista-snippets.md`:

```js
GaleriaImagens(1);      // abre galeria de imagens    · GaleriaImagens(0) fecha
GaleriaPlantas(1);      // abre galeria de plantas    · GaleriaPlantas(0) fecha
AbrirGaleriaVideos(1);  // abre o vídeo               · AbrirGaleriaVideos(0) fecha
```

`GaleriaImagens` abre com `?mode=imagens` (sem Plantas) e `GaleriaPlantas` com `?mode=plantas`.

## Pendências

- **Vídeo:** não entregue; `video-gallery.html` aponta para `assets/video/video-living-capibaribe.mp4`.
- **Legendas:** descrevem o que se vê em cada render; conferir com o material oficial.
