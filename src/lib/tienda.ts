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
  /** Avisos de líneas que aún no se venden. Nunca se muestran como disponibles. */
  proximamente?: { titulo: string; texto: string; estado: 'proximamente' | 'desarrollo' }[];
}

export const CATEGORIAS: CategoriaMeta[] = [
  {
    slug: 'soportes',
    nombre: 'Bicicleteros y soportes',
    descripcion:
      'Hechos por ciclistas, para ciclistas: soportes de pared, piso y techo que cuidan la bici (sin rayones ni golpes), aprovechan el espacio y facilitan el uso.',
    cruzada: {
      label: '¿Tienda de ciclismo, café o taller? Pide un diseño a medida',
      href: '/tienda/disenos-personalizados',
    },
  },
  {
    slug: 'morrales-maletines',
    nombre: 'Morrales y maletines',
    descripcion: 'Morrales impermeables, maletines y alforjas para moverte con el equipo protegido.',
    proximamente: [
      {
        titulo: 'Línea propia de bolsos para bicicleta',
        estado: 'proximamente',
        texto:
          'Ya hemos fabricado bolsos de lona impermeable; la nueva línea de uso urbano busca mejorar diseño, funcionalidad, estanqueidad y presentación. Próximamente.',
      },
      {
        titulo: 'Equipamiento premium 100 % impermeable',
        estado: 'desarrollo',
        texto:
          'Estamos trabajando en incorporar equipamiento premium impermeable para ciclismo y motocicleta. En desarrollo.',
      },
    ],
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
