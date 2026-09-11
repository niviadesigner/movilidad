/**
 * Redirecciones 301 desde el sitio anterior (Fase 6, docs/plan-de-construccion.md).
 *
 * TODO: está vacío porque todavía no tenemos el mapa de URLs del sitio viejo.
 * Para llenarlo hace falta uno de estos, del cliente:
 *   - El sitemap.xml del sitio anterior, o
 *   - Un export de Google Search Console (páginas indexadas), o
 *   - Un crawl con Screaming Frog / similar.
 *
 * Formato: { '/ruta-vieja': '/ruta-nueva' }. Astro + el adapter de Vercel
 * convierten esto en redirecciones 301 reales (no meta-refresh de cliente).
 * Ver astro.config.mjs, opción `redirects`.
 */
export const REDIRECTS_301: Record<string, string> = {
  // Ejemplo, una vez tengamos las URLs reales:
  // '/parqueaderos-bicicletas': '/biciparqueaderos',
  // '/tienda-vieja/candados': '/tienda/seguridad',
};
