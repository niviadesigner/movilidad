# Soluciones de Movilidad

Sitio web de infraestructura y servicios para movilidad en bicicleta.
Construido por NIVI@DESIGN / Nivia Studio Creativo.

## Stack

- **Astro 5** (estático, con islas de React donde hace falta interactividad)
- **Tailwind CSS 4** (configuración por CSS en `src/styles/global.css`)
- **Supabase** (catálogo, pedidos, agendamientos, leads — aún sin conectar)
- **Wompi** (pasarela de pago de la tienda — se integra en Fase 4)
- Deploy en **Vercel**

## Requisitos

- Node 24 (ver `.nvmrc`)

## Puesta en marcha

```bash
npm install
cp .env.example .env   # rellenar cuando haya llaves reales
npm run dev            # http://localhost:4321
```

Otros scripts: `npm run build`, `npm run preview`, `npm run check`.

## Documentación (fuente de verdad)

- `CLAUDE.md` — contexto permanente, decisiones y reglas
- `docs/arquitectura-informacion.md` — estructura de páginas, URLs y navegación
- `docs/plan-de-construccion.md` — fases de trabajo y estado

## Estructura

```
src/
  styles/global.css      Sistema de diseño (tokens) — identidad v0, provisional
  lib/                    site, nav, routes, seo, schema, supabase, pricing
  content/                Colecciones: modelos, proyectos, blog
  layouts/                BaseLayout · SiteLayout (corporativo) · TiendaLayout
  components/
    layout/               TopBar, HeaderCorporativo, HeaderTienda, MegaMenu,
                          Footer, Breadcrumbs, Container, MobileNav
    ui/                    CTA, Card, FAQ, LogoBar, Section, Placeholder
    islands/               WhatsAppFloat, MobileBottomBar (React)
  pages/                   Árbol completo de arquitectura-informacion.md
```

## Estado

**Fase 0 — Cimientos y esqueleto navegable: en curso.**
Todas las rutas existen y se puede navegar el sitio completo; el contenido real
entra por fases (ver `docs/plan-de-construccion.md`).
