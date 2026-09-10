/**
 * Catálogo de la tienda: metadatos de categoría y ayudas de listado.
 * Los productos viven en la colección `productos` (regla §6).
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Producto = CollectionEntry<'productos'>;
export type CategoriaSlug = Producto['data']['categoria'];

export interface CategoriaMeta {
  slug: CategoriaSlug;
  nombre: string;
  descripcion: string;
  /** Enlace de venta cruzada al sitio corporativo (regla de enlazado §8). */
  cruzada?: { label: string; href: string };
}

export const CATEGORIAS: CategoriaMeta[] = [
  {
    slug: 'soportes',
    nombre: 'Soportes para bicicleta',
    descripcion: 'De pared, piso y techo para guardar la bici en casa u oficina.',
  },
  {
    slug: 'morrales-maletines',
    nombre: 'Morrales y maletines',
    descripcion: 'Morrales impermeables, maletines y alforjas para moverte con el equipo protegido.',
  },
  {
    slug: 'seguridad',
    nombre: 'Seguridad: guayas y candados',
    descripcion: 'Guayas, candados de U y anclajes para dejar la bici tranquila.',
    cruzada: {
      label: '¿Necesitas un biciparqueadero en tu edificio?',
      href: '/biciparqueaderos',
    },
  },
  {
    slug: 'accesorios',
    nombre: 'Accesorios',
    descripcion: 'Luces, timbres, guardabarros e infladores para el día a día.',
  },
];

export function categoriaMeta(slug: string): CategoriaMeta | undefined {
  return CATEGORIAS.find((c) => c.slug === slug);
}

/** Todos los productos visibles (oculta borradores en producción). */
export async function getProductos(): Promise<Producto[]> {
  const productos = await getCollection('productos');
  return productos
    .filter((p) => import.meta.env.DEV || !p.data.borrador)
    .sort((a, b) => a.data.nombre.localeCompare(b.data.nombre, 'es'));
}

export async function getProductosPorCategoria(slug: CategoriaSlug): Promise<Producto[]> {
  return (await getProductos()).filter((p) => p.data.categoria === slug);
}

export async function getDestacados(limite = 4): Promise<Producto[]> {
  const todos = await getProductos();
  const destacados = todos.filter((p) => p.data.destacado);
  return (destacados.length ? destacados : todos).slice(0, limite);
}

export async function getOfertas(): Promise<Producto[]> {
  return (await getProductos()).filter((p) => p.data.precioAntes && p.data.precioAntes > p.data.precio);
}

/** Slug de URL de un producto: /tienda/{categoria}/{id}. */
export function rutaProducto(p: Producto): string {
  return `/tienda/${p.data.categoria}/${p.id}`;
}

export function porcentajeDescuento(precio: number, precioAntes?: number): number | null {
  if (!precioAntes || precioAntes <= precio) return null;
  return Math.round((1 - precio / precioAntes) * 100);
}
