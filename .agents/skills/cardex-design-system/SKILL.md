---
name: cardex-design-system
description: >
  Sistema de diseño completo del proyecto Cardex TCG Marketplace. Úsalo SIEMPRE que el
  usuario pida crear, modificar o extender páginas, componentes o pantallas del proyecto
  Cardex. Cubre la paleta de colores exacta, tipografía, efectos visuales (glassmorphism,
  aurora, holo), patrones de componentes, layout y reglas de uso. Aplica este skill también
  si el usuario menciona "aurora glassmorphism", "holo card", "surface container", o pide
  mantener consistencia con el diseño existente del marketplace de cartas.
---

# Cardex Design System — Aurora Glassmorphism

Guía de referencia canónica para replicar y extender el diseño del proyecto Cardex.
Sigue estas reglas al pie de la letra para mantener coherencia visual en toda la app.

---

## 1. PALETA DE COLORES

### Colores principales (Tailwind custom tokens)

| Token                        | Hex       | Uso principal                                      |
|------------------------------|-----------|----------------------------------------------------|
| `background`                 | `#0b1326` | Fondo global de todas las páginas                  |
| `surface`                    | `#0b1326` | Fondo de navbars con opacidad                      |
| `surface-container-lowest`   | `#060e20` | Cards de marketplace (fondo más profundo)          |
| `surface-container-low`      | `#131b2e` | Paneles secundarios, sidebar                       |
| `surface-container`          | `#171f33` | Paneles de estadísticas, history items             |
| `surface-container-high`     | `#222a3d` | Inputs, badges de tipo de carta                    |
| `surface-container-highest`  | `#2d3449` | Elementos muy elevados, surface-variant            |
| `surface-variant`            | `#2d3449` | Mismo que highest; chips de filtro                 |
| `surface-bright`             | `#31394d` | Botones secundarios, hover states                  |
| `primary`                    | `#c3c0ff` | Texto destacado, iconos activos, bordes de foco    |
| `primary-container`          | `#4f46e5` | Botones primarios CTA, nav item activo mobile      |
| `on-primary-container`       | `#dad7ff` | Texto sobre primary-container                      |
| `secondary`                  | `#fda9ff` | Badges Mythic, iconos search, acentos magenta      |
| `secondary-container`        | `#af03c3` | Fondo badge Mythic (con opacidad 20%)              |
| `tertiary`                   | `#89ceff` | Tendencias positivas, verified badges, auctions    |
| `tertiary-container`         | `#006693` | Fondos de elementos tertiary                       |
| `on-surface`                 | `#dae2fd` | Texto primario sobre superficies oscuras           |
| `on-surface-variant`         | `#c7c4d8` | Texto secundario / placeholders                    |
| `on-background`              | `#dae2fd` | Igual que on-surface; texto general                |
| `outline`                    | `#918fa1` | Bordes sutiles, separadores                        |
| `outline-variant`            | `#464555` | Bordes más oscuros, hover borders                  |
| `error`                      | `#ffb4ab` | Precios negativos, contadores urgentes             |
| `inverse-primary`            | `#4d44e3` | Gradientes de botón alternativo                    |

### Regla de uso de opacidades
- Navbars y overlays: `bg-surface/60` + `backdrop-blur-xl`
- Cards del marketplace: `bg-surface-container-lowest/50` + `backdrop-blur-xl`
- Paneles de detalle: `bg-surface-container/60` + `backdrop-blur-2xl`
- Sidebar: `bg-surface-container-low/40` + `backdrop-blur-xl`
- Bottom navbar mobile: `bg-surface-container/80` + `backdrop-blur-2xl`

---

## 2. TIPOGRAFÍA

### Familias
- **Montserrat** (600, 700): Headings, brand name, display sizes
- **Inter** (400, 600): Body text, labels, UI elements

### Escala tipográfica

| Token                  | Size  | Weight | Line-height | Letter-spacing | Uso                               |
|------------------------|-------|--------|-------------|----------------|-----------------------------------|
| `display-lg`           | 48px  | 700    | 1.1         | -0.02em        | Hero headlines, dashboard title   |
| `headline-lg`          | 32px  | 600    | 1.2         | —              | Section titles (desktop)          |
| `headline-lg-mobile`   | 24px  | 600    | 1.2         | —              | Section titles (mobile)           |
| `body-md`              | 16px  | 400    | 1.6         | —              | Descripciones, párrafos           |
| `label-sm`             | 12px  | 600    | 1           | 0.05em         | Badges, chips, metadata, nav tabs |

### Brand name
```html
<span class="font-display-lg text-display-lg tracking-tighter text-transparent 
             bg-clip-text bg-gradient-to-r from-primary to-secondary">
  Cardex
</span>
```

---

## 3. EFECTOS VISUALES

### 3.1 Aurora Background (fondo ambiental)

**Versión CSS estática** (Hero, páginas simples):
```css
.aurora-bg {
  background: radial-gradient(circle at 50% 50%, rgba(79,70,229,0.15) 0%, rgba(11,19,38,0) 50%),
              radial-gradient(circle at 80% 20%, rgba(253,169,255,0.1) 0%, rgba(11,19,38,0) 40%);
  background-color: #0b1326;
}
```

**Versión animada con orbs** (Marketplace, páginas con actividad):
```html
<div class="aurora-bg"> <!-- position:fixed, inset-0, z-index:-1 -->
  <div class="aurora-orb orb-1"></div> <!-- primary: arriba-izquierda, 50vw, blur-100 -->
  <div class="aurora-orb orb-2"></div> <!-- secondary: abajo-derecha, 60vw, delay-5s -->
  <div class="aurora-orb orb-3"></div> <!-- tertiary: centro-derecha, 40vw, delay-10s -->
</div>
```
```css
.aurora-orb { position:absolute; border-radius:50%; filter:blur(100px); opacity:0.4; animation:float 20s infinite ease-in-out alternate; }
.orb-1 { top:-10%; left:-10%; width:50vw; height:50vw; background:radial-gradient(circle, rgba(79,70,229,0.8) 0%, transparent 70%); }
.orb-2 { bottom:-20%; right:-10%; width:60vw; height:60vw; background:radial-gradient(circle, rgba(175,3,195,0.6) 0%, transparent 70%); animation-delay:-5s; }
.orb-3 { top:40%; left:60%; width:40vw; height:40vw; background:radial-gradient(circle, rgba(137,206,255,0.5) 0%, transparent 70%); animation-delay:-10s; }
@keyframes float { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(5%,5%) scale(1.1)} 100%{transform:translate(-5%,-5%) scale(0.95)} }
```

**Cuándo usar cuál:**
- Orbs animados → marketplace, listados, páginas de alta energía
- CSS estático → hero landing, dashboard, páginas de detalle

### 3.2 Glass Card (glassmorphism base)

```css
.glass-card {
  background: rgba(45, 52, 73, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.glass-card:hover {
  backdrop-filter: blur(16px);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px -10px rgba(79, 70, 229, 0.3);
}
```

**Aplicar en:** cards de colección, paneles de info, modales.

### 3.3 Holo Border (borde holográfico)

```css
.holo-border { position: relative; }
.holo-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #c3c0ff, #fda9ff, #89ceff);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.5;
  transition: opacity 0.3s;
}
.holo-border:hover::before { opacity: 1; }
```

**Aplicar en:** stat cards del dashboard, hero card, elementos premium destacados.

### 3.4 Holo Card (efecto foil marketplace)

```css
.holo-card {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease;
}
.holo-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5), 0 0 20px rgba(195,192,255,0.2);
}
/* Borde interno con gradiente diagonal */
.holo-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.4), transparent 40%, transparent 60%, rgba(195,192,255,0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: 10;
  pointer-events: none;
}
/* Glare animado al hover */
.holo-glare {
  position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.1) 25%, transparent 30%);
  opacity: 0; transition: opacity 0.3s; z-index: 2; pointer-events: none;
}
.holo-card:hover .holo-glare { opacity: 1; animation: glareShimmer 2s infinite linear; }
@keyframes glareShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
```

**Aplicar en:** cards del grid del marketplace ÚNICAMENTE.

### 3.5 TCG Card 3D (perspectiva con mouse)

```css
.tcg-card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform-style: preserve-3d;
}
.tcg-card-hover:hover {
  transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1.02);
  box-shadow: -10px 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(195,192,255,0.2);
}
```
```js
// JS para seguimiento de mouse (hero card)
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const rotateX = ((e.clientY - rect.top - rect.height/2) / (rect.height/2)) * -10;
  const rotateY = ((e.clientX - rect.left - rect.width/2) / (rect.width/2)) * 10;
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
});
card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; });
```

**Aplicar en:** hero card (una sola carta grande en landing).

### 3.6 Holo Overlay animado (detalle de carta)

```css
.holo-overlay {
  background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.3) 30%, transparent 40%);
  background-size: 200% 200%;
  animation: holo-sweep 4s infinite linear;
  mix-blend-mode: color-dodge;
}
@keyframes holo-sweep { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
```

**Aplicar en:** vista de detalle de carta individual (posición absolute inset-0 z-20).

### 3.7 Aurora Button (CTA principal)

```css
.aurora-button {
  background: linear-gradient(135deg, #4f46e5, #af03c3);
  transition: filter 0.3s ease, transform 0.2s ease;
}
.aurora-button:hover { filter: brightness(1.2); transform: scale(1.02); }
```

**Alternativa Tailwind:**
```html
<button class="bg-gradient-to-r from-primary-container to-secondary-container 
               text-on-primary-container px-8 py-3 rounded-full 
               shadow-[0_0_20px_rgba(79,70,229,0.4)]
               hover:brightness-110 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] 
               transition-all duration-300">
```

### 3.8 Glow orb decorativo (detrás de elementos)

```html
<!-- Orb detrás de hero card -->
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-3/4 h-3/4 bg-primary rounded-full blur-[100px] opacity-20 -z-10"></div>

<!-- Orb en stat cards (esquina) -->
<div class="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full 
            blur-[40px] group-hover:bg-primary/30 transition-colors duration-500"></div>
```

**Colores de orbs por sección:**
- Estimated Value / primary elements → `bg-primary/20`
- Cards owned / secondary elements → `bg-secondary/20`
- Active listings / tertiary elements → `bg-tertiary/20`

---

## 4. COMPONENTES CLAVE

### 4.1 TopNav (Desktop, `hidden md:flex`)

```html
<nav class="hidden md:flex fixed top-0 w-full z-50 
            bg-surface/60 backdrop-blur-xl border-b border-white/10 
            shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
  <div class="flex justify-between items-center px-container-padding py-base 
              max-w-[1440px] mx-auto w-full">
    <!-- Brand → link activo: text-primary border-b-2 border-primary -->
    <!-- Nav links → inactivo: text-on-surface-variant hover:text-primary -->
    <!-- Trailing: notifications, cart, avatar (w-8/10 h-8/10 rounded-full) -->
  </div>
</nav>
```

### 4.2 BottomNav (Mobile, `md:hidden fixed bottom-0`)

Estructura: 4 botones. El activo usa `bg-primary-container text-on-primary-container rounded-full` con `shadow-[0_0_15px_rgba(79,70,229,0.4)]`. Opcionalmente se eleva con `-mt-6` y `border-4 border-background`.

```html
<nav class="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl 
            bg-surface-container/80 backdrop-blur-2xl 
            border-t border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]
            flex justify-around items-center px-4 py-2">
```

### 4.3 Search Bar

```html
<div class="bg-surface-container-high/40 backdrop-blur-[24px] border border-white/10 
            rounded-full px-6 py-4 flex items-center gap-4
            focus-within:border-primary/50 
            focus-within:shadow-[0_0_20px_rgba(79,70,229,0.2)] 
            transition-all duration-300">
  <span class="material-symbols-outlined text-secondary opacity-80">search</span>
  <input class="bg-transparent border-none outline-none flex-1 
                text-on-surface placeholder:text-on-surface-variant/50 
                font-body-md text-body-md w-full focus:ring-0" .../>
</div>
```

### 4.4 Marketplace Card

```html
<article class="holo-card bg-surface-container-lowest/50 backdrop-blur-xl 
                rounded-xl relative overflow-hidden group cursor-pointer border-0">
  <div class="holo-glare"></div>
  <div class="p-3">
    <div class="w-full aspect-[2.5/3.5] rounded-lg overflow-hidden bg-surface-container relative">
      <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"/>
      <!-- Badge rarity: top-2 right-2 -->
    </div>
  </div>
  <div class="px-4 pb-4 pt-1">
    <h2 class="font-body-md font-semibold text-on-surface truncate mb-1">Nombre</h2>
    <!-- Precio: text-primary bg-primary/10 border border-primary/20 rounded-md -->
  </div>
</article>
```

**Aspect ratio de cartas TCG:** siempre `aspect-[2.5/3.5]`.

### 4.5 Rarity Badges

```html
<!-- Mythic -->
<div class="bg-secondary-container/80 backdrop-blur-md border border-secondary/40 
            text-secondary px-2 py-1 rounded-full font-label-sm text-[10px] 
            uppercase tracking-wider shadow-[0_0_10px_rgba(253,169,255,0.3)]
            flex items-center gap-1">
  <span class="material-symbols-outlined text-[12px] fill-icon">star</span> Mythic
</div>

<!-- Rare -->
<div class="bg-surface-container-high/80 border border-white/20 
            text-on-surface-variant px-2 py-1 rounded-full ...">
  <span class="material-symbols-outlined text-[12px]">grade</span> Rare
</div>

<!-- Uncommon: igual que Rare con star_border -->
```

### 4.6 Stat Cards (Dashboard Bento)

```html
<div class="glass-panel rounded-xl p-6 holo-border 
            hover:shadow-[0_0_30px_rgba(195,192,255,0.1)] 
            transition-all duration-500 group relative overflow-hidden">
  <!-- Orb decorativo: absolute -right-10 -top-10 w-32 h-32 -->
  <div class="flex justify-between items-start mb-4 relative z-10">
    <h3 class="font-label-sm text-on-surface-variant uppercase tracking-wider">Título</h3>
    <div class="p-2 bg-surface-container rounded-lg border border-white/5">
      <span class="material-symbols-outlined text-primary">icon</span>
    </div>
  </div>
  <span class="font-headline-lg text-transparent bg-clip-text 
               bg-gradient-to-r from-on-background to-on-surface-variant">
    $42,850.00
  </span>
</div>
```

### 4.7 Glass Panel (base para paneles)

```css
.glass-panel {
  background-color: rgba(19, 27, 46, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

---

## 5. LAYOUT Y GRID

### Contenedor máximo
```html
<div class="max-w-[1440px] mx-auto px-gutter md:px-container-padding">
```

### Grid del marketplace
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

### Grid de detalle de carta
```html
<main class="grid grid-cols-1 lg:grid-cols-12 gap-8">
  <div class="lg:col-span-5"><!-- imagen --></div>
  <div class="lg:col-span-7"><!-- detalles --></div>
</main>
```

### Padding de página
- Desktop: `pt-[120px]` (navbar fija ~72px + espacio)
- Mobile: `pb-24` (bottom nav)
- Hero: `min-h-[80vh] flex flex-col md:flex-row items-center gap-12`

### Spacing tokens
- `section-gap`: 80px (entre secciones)
- `container-padding`: 24px (padding horizontal desktop)
- `gutter`: 16px (padding horizontal mobile)
- `base`: 8px (padding vertical navbar)

---

## 6. ICONOGRAFÍA

Usa exclusivamente **Material Symbols Outlined**. Importación:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

Para icono relleno: añade clase `fill-icon` con:
```css
.fill-icon { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
```

**Iconos usados en el proyecto:**
`home`, `search`, `style`, `person`, `notifications`, `shopping_cart`, `favorite_border`, `share`, `arrow_back`, `star`, `grade`, `star_border`, `stars`, `verified`, `monitoring`, `trending_up`, `payments`, `gavel`, `shopping_cart_checkout`, `sell`, `shopping_bag`, `category`, `bolt`, `pets`, `precision_manufacturing`, `auto_awesome`, `diamond`, `tag`, `language`, `sort`, `tune`, `more_horiz`

---

## 7. SOMBRAS ESPECIALES

| Elemento                  | Shadow                                           |
|---------------------------|--------------------------------------------------|
| TopNav                    | `shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]`         |
| BottomNav                 | `shadow-[0_-4px_20px_rgba(0,0,0,0.5)]`          |
| Botón CTA primario        | `shadow-[0_0_20px_rgba(79,70,229,0.4)]`         |
| Nav item activo mobile    | `shadow-[0_0_15px_rgba(79,70,229,0.4)]`         |
| Stat card hover           | `shadow-[0_0_30px_rgba(195,192,255,0.1)]`       |
| Holo card hover           | `0 0 20px rgba(195,192,255,0.2)`                |
| Detail card               | `shadow-[0_20px_60px_rgba(0,0,0,0.6)]`          |
| Glass panel               | `shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]`         |
| Buy Now button            | `shadow-[0_0_20px_rgba(79,70,229,0.2)]` → hover `rgba(79,70,229,0.4)` |
| Mythic badge              | `shadow-[0_0_10px_rgba(253,169,255,0.3)]`       |

---

## 8. SCROLLBAR PERSONALIZADO (sidebar)

```css
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(195,192,255,0.2); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(195,192,255,0.4); }
```

---

## 9. TRANSICIONES Y MICROINTERACCIONES

- Todos los botones interactivos: `active:scale-90` o `active:scale-95`
- Scale en hover de nav icons: `scale-95 hover:scale-100`
- Imágenes dentro de cards: `group-hover:scale-110 transition-transform duration-700 ease-out`
- Estado del header al scroll:
```js
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) header.classList.add('bg-background/80', 'shadow-[0_4px_20px_rgba(0,0,0,0.5)]');
  else header.classList.remove('bg-background/80', 'shadow-[0_4px_20px_rgba(0,0,0,0.5)]');
});
```

---

## 10. PÁGINAS DEL PROYECTO Y SUS EFECTOS

| Página            | Aurora BG       | Efectos activos                                      |
|-------------------|-----------------|------------------------------------------------------|
| Landing / Hero    | CSS estático    | TCG Card 3D + mouse tracking, glow orb, holo-border |
| Marketplace       | Orbs animados   | Holo card + glare en grid, search glow              |
| Detalle de carta  | Glow estático   | Holo overlay sweep, card-tilt, aurora glow detrás   |
| Dashboard         | CSS estático    | Glass panel, holo-border, stat orbs decorativos     |

---

## 11. CHECKLIST AL CREAR UNA NUEVA PÁGINA

- [ ] `<html class="dark">` y `bg-background text-on-background` en `<body>`
- [ ] Aurora background correspondiente al tipo de página
- [ ] TopNav desktop + BottomNav mobile (mismos breakpoints)
- [ ] `max-w-[1440px] mx-auto` en el contenedor principal
- [ ] `pt-[100-120px]` para compensar navbar fija
- [ ] `pb-24 md:pb-0` para compensar bottom nav mobile
- [ ] Fuentes cargadas: Montserrat + Inter + Material Symbols
- [ ] Tailwind config con todos los tokens de color (copiar bloque `tailwind.config`)
- [ ] Aspect ratio `[2.5/3.5]` en cualquier imagen de carta TCG
- [ ] `overflow-x-hidden` en body