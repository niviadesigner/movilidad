/**
 * Motor de precios ÚNICO.
 * El descuento por volumen del carrito (tienda) y el de la cotización
 * comercial (biciparqueaderos) deben salir de esta misma fuente
 * (docs/CLAUDE.md §6 "Un solo motor de precios").
 *
 * Fase 0: solo la forma y los tramos. Sin catálogo real, sin impuestos
 * definitivos, sin envío. Todo marcado como provisional.
 */

/** IVA Colombia. TODO: confirmar exenciones por categoría con el cliente. */
export const IVA = 0.19;

/**
 * Tramos de descuento por cantidad de unidades.
 * TODO: reemplazar con la política comercial real del cliente.
 */
export interface TramoVolumen {
  desde: number; // unidades
  descuento: number; // 0..1
}

export const TRAMOS_VOLUMEN: TramoVolumen[] = [
  { desde: 1, descuento: 0 },
  { desde: 10, descuento: 0.05 },
  { desde: 25, descuento: 0.1 },
  { desde: 50, descuento: 0.15 },
  { desde: 100, descuento: 0.2 },
];

export function descuentoPorVolumen(unidades: number): number {
  let d = 0;
  for (const tramo of TRAMOS_VOLUMEN) {
    if (unidades >= tramo.desde) d = tramo.descuento;
  }
  return d;
}

export interface LineaCotizada {
  unidades: number;
  precioUnitario: number; // sin IVA
}

export interface Totales {
  subtotal: number;
  descuento: number;
  base: number;
  iva: number;
  total: number;
  descuentoPct: number;
}

/** Calcula totales para una lista de líneas (carrito o cotización). */
export function calcularTotales(lineas: LineaCotizada[]): Totales {
  const unidadesTotales = lineas.reduce((s, l) => s + l.unidades, 0);
  const subtotal = lineas.reduce((s, l) => s + l.unidades * l.precioUnitario, 0);
  const descuentoPct = descuentoPorVolumen(unidadesTotales);
  const descuento = Math.round(subtotal * descuentoPct);
  const base = subtotal - descuento;
  const iva = Math.round(base * IVA);
  return {
    subtotal,
    descuento,
    base,
    iva,
    total: base + iva,
    descuentoPct,
  };
}

/** Formatea un valor en pesos colombianos. */
export function formatoCOP(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}
