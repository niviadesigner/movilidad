/**
 * Redirecciones 301 desde el sitio anterior (Fase 6, docs/plan-de-construccion.md).
 *
 * Confirmado con el cliente (2026-09-11): solucionesdemovilidad.com.co es un
 * dominio nuevo, sin sitio anterior. No hay URLs que redirigir — este archivo
 * se queda vacío. Se deja el mecanismo listo por si en el futuro se retira
 * otro dominio o subdominio y hay que apuntarlo aquí.
 *
 * Formato: { '/ruta-vieja': '/ruta-nueva' }. Astro + el adapter de Vercel
 * convierten esto en redirecciones 301 reales (no meta-refresh de cliente).
 * Ver astro.config.mjs, opción `redirects`.
 */
export const REDIRECTS_301: Record<string, string> = {};
