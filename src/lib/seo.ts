/**
 * Ayudas de SEO. Metadatos únicos por página.
 * `og:locale` en es_CO, `lang` es-CO (docs/CLAUDE.md §6).
 */
import { SITE } from './site';

export interface SeoInput {
  /** Título de la pestaña. Se le añade el sufijo de marca salvo en la home. */
  titulo: string;
  descripcion: string;
  /** Ruta absoluta del sitio, p. ej. "/biciparqueaderos". */
  ruta: string;
  /** Imagen social. Ruta relativa a /public o URL absoluta. */
  imagen?: string;
  /** No indexar (carrito, checkout, mi-cuenta, páginas de gracias). */
  noIndex?: boolean;
  /** Tipo Open Graph. */
  tipo?: 'website' | 'article' | 'product';
}

export interface SeoResuelto {
  titulo: string;
  descripcion: string;
  canonical: string;
  imagen: string;
  noIndex: boolean;
  tipo: 'website' | 'article' | 'product';
  locale: string;
}

const SUFIJO = ` | ${SITE.nombre}`;
const IMAGEN_POR_DEFECTO = '/og/og-default.png'; // TODO: crear imagen social real

export function resolverSeo(input: SeoInput): SeoResuelto {
  const rutaLimpia = input.ruta.replace(/\/+$/, '') || '/';
  const titulo =
    rutaLimpia === '/' ? input.titulo : `${input.titulo}${SUFIJO}`;

  const imagen = input.imagen ?? IMAGEN_POR_DEFECTO;
  const imagenAbsoluta = imagen.startsWith('http')
    ? imagen
    : `${SITE.dominio}${imagen}`;

  return {
    titulo,
    descripcion: input.descripcion,
    canonical: `${SITE.dominio}${rutaLimpia}`,
    imagen: imagenAbsoluta,
    noIndex: input.noIndex ?? false,
    tipo: input.tipo ?? 'website',
    locale: SITE.ogLocale,
  };
}
