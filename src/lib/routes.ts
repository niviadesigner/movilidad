/**
 * Mapa de rutas y generador de migas de pan.
 * Regla: migas obligatorias desde el nivel 2, espejo exacto de la URL,
 * todos los segmentos clicables menos el actual (docs/arquitectura §4).
 */

/** Etiqueta legible por ruta completa. Si no está aquí, se deriva del slug. */
export const LABELS: Record<string, string> = {
  '/': 'Inicio',

  '/biciparqueaderos': 'Biciparqueaderos',
  '/biciparqueaderos/corporativo': 'Corporativo',
  '/biciparqueaderos/institucional': 'Institucional y educativo',
  '/biciparqueaderos/residencial': 'Residencial y PH',
  '/biciparqueaderos/mobiliario-urbano': 'Mobiliario urbano',
  '/biciparqueaderos/bicitalleres': 'Bicitalleres',
  '/biciparqueaderos/modelos': 'Modelos',
  '/biciparqueaderos/diseno-instalacion': 'Diseño e instalación',

  '/mantenimiento': 'Mantenimiento',
  '/mantenimiento/jornadas-empresariales': 'Jornadas en sede',
  '/mantenimiento/flotas': 'Planes para flotas',
  '/mantenimiento/taller': 'Taller',
  '/mantenimiento/domicilio': 'A domicilio',
  '/mantenimiento/laminado-ppf': 'Lámina PPF',
  '/mantenimiento/suspensiones': 'Suspensiones (próximamente)',
  '/mantenimiento/planes': 'Planes y precios',
  '/mantenimiento/cobertura': 'Cobertura',
  '/mantenimiento/agendar': 'Agendar',
  '/mantenimiento/agendar/confirmado': 'Confirmación',

  '/proyectos': 'Proyectos',

  '/recursos': 'Recursos',
  '/recursos/normativa': 'Normativa: Ley 1811, PESV y POT',
  '/recursos/calculadora-cupos': 'Calculadora de cupos',
  '/recursos/faq': 'Preguntas frecuentes',

  '/blog': 'Blog',

  '/nosotros': 'Nosotros',
  '/nosotros/aliados': 'Aliados y certificaciones',

  '/cotizar': 'Cotizar',
  '/gracias': 'Gracias',

  '/soluciones/empresas': 'Para empresas',
  '/soluciones/constructoras': 'Para constructoras y arquitectos',
  '/soluciones/conjuntos': 'Para conjuntos residenciales',
  '/soluciones/universidades': 'Para universidades',

  '/tienda': 'Tienda',
  '/tienda/soportes': 'Bicicleteros y soportes',
  '/tienda/disenos-personalizados': 'Diseños personalizados',
  '/tienda/morrales-maletines': 'Morrales y maletines',
  '/tienda/seguridad': 'Seguridad: guayas y candados',
  '/tienda/accesorios': 'Accesorios',
  '/tienda/ofertas': 'Ofertas',
  '/tienda/corporativo': 'Compra por volumen',
  '/tienda/buscar': 'Buscador',
  '/tienda/carrito': 'Carrito',
  '/tienda/checkout': 'Checkout',
  '/tienda/pedido-confirmado': 'Pedido confirmado',
  '/tienda/envios': 'Envíos y entregas',
  '/tienda/devoluciones': 'Cambios y devoluciones',
  '/tienda/garantia': 'Garantía',

  '/mi-cuenta': 'Mi cuenta',
  '/mi-cuenta/pedidos': 'Mis pedidos',
  '/mi-cuenta/pedidos/detalle': 'Detalle',
  '/mi-cuenta/direcciones': 'Direcciones',

  '/legal/terminos': 'Términos',
  '/legal/privacidad': 'Privacidad',
  '/legal/tratamiento-datos': 'Política de tratamiento de datos',
};

/** Deriva una etiqueta a partir de un slug: "diseno-instalacion" -> "Diseno instalacion". */
export function labelDesdeSlug(slug: string): string {
  const texto = slug.replace(/-/g, ' ');
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export interface Miga {
  label: string;
  href: string;
  actual: boolean;
}

/**
 * Genera las migas de pan para un pathname.
 * Devuelve [] cuando estamos en nivel 0 o 1 (no se muestran migas).
 *
 * @param pathname  ruta actual, p. ej. "/biciparqueaderos/modelos"
 * @param overrides etiquetas puntuales para segmentos dinámicos, p. ej.
 *                  { '/biciparqueaderos/modelos/u-invertida': 'U invertida' }
 */
export function generarMigas(
  pathname: string,
  overrides: Record<string, string> = {},
): Miga[] {
  const limpio = pathname.replace(/\/+$/, '') || '/';
  if (limpio === '/') return [];

  const segmentos = limpio.split('/').filter(Boolean);
  if (segmentos.length < 2) return []; // desde nivel 2

  const migas: Miga[] = [{ label: LABELS['/'], href: '/', actual: false }];

  let acumulado = '';
  segmentos.forEach((seg, i) => {
    acumulado += `/${seg}`;
    const esUltimo = i === segmentos.length - 1;
    const label =
      overrides[acumulado] ?? LABELS[acumulado] ?? labelDesdeSlug(seg);
    migas.push({ label, href: acumulado, actual: esUltimo });
  });

  return migas;
}
