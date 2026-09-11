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
  // Política única de barra final: sin barra en ningún lado. La aplica el
  // adapter de Vercel en .vercel/output/config.json (redirige 308 cualquier
  // URL con "/" final), sin importar si el archivo generado es x.html o
  // x/index.html — por eso no fijamos build.format aquí, no cambia nada.
  trailingSlash: 'never',
  // 301 reales del cliente: por ahora vacío. Confirmado con el cliente
  // (2026-09-11) que solucionesdemovilidad.com.co es un dominio nuevo, sin
  // sitio anterior que redirigir. Ver src/data/redirects-301.ts.
  redirects: Object.fromEntries(
    Object.entries(REDIRECTS_301).map(([origen, destino]) => [
      origen,
      { status: 301, destination: destino },
    ]),
  ),
  // Sitio mayormente estático. Los formularios que necesitan servidor
  // (cotizar, agendar, ficha técnica, calculadora, pedido) viven en
  // src/pages/api/*.ts con `export const prerender = false`.
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
