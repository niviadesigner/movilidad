// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// Dominio de producción. Se usa para canonical, og:url y sitemap.
const SITE = 'https://solucionesdemovilidad.com.co';

export default defineConfig({
  site: SITE,
  // Política única de barra final: sin barra en ningún lado.
  trailingSlash: 'never',
  build: { format: 'file' },
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
