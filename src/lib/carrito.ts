/**
 * Carrito de compra en el navegador (localStorage). Sin backend en Fase 4.
 * Todas las funciones son seguras si localStorage no está disponible.
 *
 * Al cambiar el carrito se emite `window` event 'carrito:cambio' para que
 * el contador del header y el mini-carrito se sincronicen.
 */
const CLAVE = 'carrito';
const MAX_UNIDADES = 99;

export interface ItemCarrito {
  sku: string;
  nombre: string;
  precio: number; // sin IVA
  categoria: string;
  ruta: string;
  imagen?: string;
  unidades: number;
}

export function leerCarrito(): ItemCarrito[] {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as ItemCarrito[]) : [];
  } catch {
    return [];
  }
}

function guardar(items: ItemCarrito[]): ItemCarrito[] {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(items));
  } catch {
    /* modo privado o almacenamiento lleno: el carrito no persiste */
  }
  try {
    window.dispatchEvent(new CustomEvent('carrito:cambio', { detail: items }));
  } catch {
    /* SSR */
  }
  return items;
}

export function totalUnidades(items: ItemCarrito[] = leerCarrito()): number {
  return items.reduce((s, i) => s + i.unidades, 0);
}

export function agregar(item: Omit<ItemCarrito, 'unidades'>, unidades = 1): ItemCarrito[] {
  const items = leerCarrito();
  const existente = items.find((i) => i.sku === item.sku);
  if (existente) {
    existente.unidades = Math.min(MAX_UNIDADES, existente.unidades + unidades);
  } else {
    items.push({ ...item, unidades: Math.min(MAX_UNIDADES, Math.max(1, unidades)) });
  }
  return guardar(items);
}

export function cambiarUnidades(sku: string, unidades: number): ItemCarrito[] {
  let items = leerCarrito();
  if (unidades <= 0) {
    items = items.filter((i) => i.sku !== sku);
  } else {
    const it = items.find((i) => i.sku === sku);
    if (it) it.unidades = Math.min(MAX_UNIDADES, unidades);
  }
  return guardar(items);
}

export function quitar(sku: string): ItemCarrito[] {
  return guardar(leerCarrito().filter((i) => i.sku !== sku));
}

export function vaciar(): ItemCarrito[] {
  return guardar([]);
}
