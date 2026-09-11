// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { REDIRECTS_301 } from './src/data/redirects-301.ts';

// Dominio de producción. Se usa para canonical, og:url y sitemap.
const SITE = 'https://solucionesdemovilidad.com.co';

export default defineConfig({
  site: SITE,
  // Política única de barra final: sin barra en ningún lado.
  trailingSlash: 'never',
  build: { format: 'file' },
  // 301 reales desde el sitio anterior, vía el adapter de Vercel.
  // Vacío hasta tener el mapa de URLs viejo — ver src/data/redirects-301.ts.
  redirects: Object.fromEntries(
    Object.entries(REDIRECTS_301).map(([origen, destino]) => [
      origen,
      { status: 301, destination: destino },
    ]),
  ),
  // Fase 0: sitio estático. Se pasará a páginas server puntuales
  // (cotizar, agendar, checkout) con `export const prerender = false` más adelante.
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({
      // Excluye del sitemap lo que no debe indexarse.
      filter: (page) =>
        !page.includes('/mi-cuenta') &&
        !page.includes('/tienda/carrito') &&
        !page.includes('/tienda/checkout') &&
        !page.includes('/gracias') &&
        !page.includes('/pedido-confirmado') &&
        !page.includes('/mantenimiento/agendar/confirmado'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
