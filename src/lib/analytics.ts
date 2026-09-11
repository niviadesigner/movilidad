/**
 * Analítica y eventos de conversión (Fase 6).
 *
 * Elegimos Google Analytics 4 por defecto: gratis y el más pedido por PYME en
 * Colombia. Es una decisión reversible — confírmala o cámbiala por Plausible/
 * Fathom/ninguna. Mientras no exista PUBLIC_GA4_ID, esto no carga nada: cero
 * costo, cero cookies, cero script de terceros.
 *
 * Los eventos de conversión están instrumentados en los 5 puntos donde el
 * sitio genera un lead o una venta, para que al activar GA4 (o cambiarlo por
 * otra herramienta) no haya que tocar cada página de nuevo.
 */

export const GA4_ID = import.meta.env.PUBLIC_GA4_ID || '';
export const analyticsActivo = Boolean(GA4_ID);

/** Nombres de evento — un solo lugar para no desalinear disparo y reporte. */
export const EVENTOS = {
  cotizacionEnviada: 'cotizacion_enviada',
  agendamientoWhatsapp: 'agendamiento_whatsapp',
  pedidoConfirmado: 'pedido_confirmado',
  calculadoraLead: 'calculadora_lead',
  fichaTecnicaLead: 'ficha_tecnica_lead',
} as const;

type NombreEvento = (typeof EVENTOS)[keyof typeof EVENTOS];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Dispara un evento de conversión. Seguro de llamar siempre: si GA4 no está
 * activo o `gtag` no cargó todavía, no hace nada (no revienta el flujo del
 * usuario por un fallo de analítica).
 */
export function trackEvent(nombre: NombreEvento, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  try {
    window.gtag('event', nombre, params);
  } catch {
    /* la analítica nunca debe romper la conversión real */
  }
}
