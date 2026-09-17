/**
 * Constantes globales del sitio.
 * Un solo teléfono (línea comercial, llamadas) y un solo WhatsApp en todo el
 * sitio (regla de credibilidad §8) — pueden ser números distintos.
 */

export const SITE = {
  nombre: 'Soluciones de Movilidad',
  // Razón social real, del RUT (NIT 901.569.372-6).
  nombreLegal: 'Soluciones de Movilidad, Transporte y Recreación SAS',
  nit: '901.569.372-6',
  direccion: 'Cl. 74A # 27-51, P.1, Bogotá D.C.',
  dominio: 'https://solucionesdemovilidad.com.co',
  descripcion:
    'Infraestructura y servicios para movilidad en bicicleta: biciparqueaderos, mantenimiento y tienda de accesorios.',
  ciudad: 'Bogotá',
  cobertura: 'Cobertura nacional',
  idioma: 'es-CO',
  ogLocale: 'es_CO',

  // Contacto único (regla §8): línea comercial para llamadas + WhatsApp aparte.
  tel: import.meta.env.PUBLIC_TEL || '+57 310 771 1461',
  whatsapp: import.meta.env.PUBLIC_WHATSAPP || '573057134994',
  correo: 'contacto@solucionesdemovilidad.com.co', // TODO: confirmar (el del RUT es interno, no de cara al público)

  // Autoría (no se muestra en el sitio, solo referencia interna).
  construidoPor: 'NIVI@DESIGN / Nivia Studio Creativo',
} as const;

/** Las tres líneas de negocio. El `id` se usa para el WhatsApp contextual. */
export const LINEAS = {
  biciparqueaderos: {
    id: 'biciparqueaderos',
    nombre: 'Biciparqueaderos',
    ruta: '/biciparqueaderos',
    mensajeWhatsApp:
      'Hola, quiero información sobre biciparqueaderos para mi proyecto.',
  },
  mantenimiento: {
    id: 'mantenimiento',
    nombre: 'Mantenimiento',
    ruta: '/mantenimiento',
    mensajeWhatsApp:
      'Hola, quiero información sobre el servicio de mantenimiento de bicicletas.',
  },
  tienda: {
    id: 'tienda',
    nombre: 'Tienda',
    ruta: '/tienda',
    mensajeWhatsApp: 'Hola, tengo una pregunta sobre un producto de la tienda.',
  },
} as const;

export type LineaId = keyof typeof LINEAS;

/** Construye la URL de WhatsApp con mensaje precargado según la línea. */
export function whatsappUrl(linea?: LineaId): string {
  const texto = linea
    ? LINEAS[linea].mensajeWhatsApp
    : 'Hola, quiero más información sobre Soluciones de Movilidad.';
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(texto)}`;
}
