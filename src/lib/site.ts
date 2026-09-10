/**
 * Constantes globales del sitio.
 * Un solo teléfono y un solo WhatsApp en todo el sitio (regla de credibilidad §8).
 */

export const SITE = {
  nombre: 'Soluciones de Movilidad',
  nombreLegal: 'Soluciones de Movilidad S.A.S.', // TODO: confirmar razón social real
  dominio: 'https://solucionesdemovilidad.com.co',
  descripcion:
    'Infraestructura y servicios para movilidad en bicicleta: biciparqueaderos, mantenimiento y tienda de accesorios.',
  ciudad: 'Bogotá',
  cobertura: 'Cobertura nacional',
  idioma: 'es-CO',
  ogLocale: 'es_CO',

  // Contacto único (regla §8). Un solo número, el mismo para llamar y para WhatsApp.
  tel: import.meta.env.PUBLIC_TEL || '+57 305 713 4994',
  whatsapp: import.meta.env.PUBLIC_WHATSAPP || '573057134994',
  correo: 'contacto@solucionesdemovilidad.com.co', // TODO: confirmar

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
