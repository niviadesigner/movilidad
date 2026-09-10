/**
 * Cálculo de envío. El costo se muestra ANTES del checkout, nunca como
 * sorpresa final (regla §7).
 *
 * TODO Fase 4: reemplazar zonas y tarifas con la tabla real del operador logístico.
 */

/** Compra mínima para envío gratis, en pesos (subtotal con descuento, sin IVA). */
export const UMBRAL_ENVIO_GRATIS = 150000;

export interface ZonaEnvio {
  id: string;
  nombre: string;
  /** Tarifa plana en pesos. */
  tarifa: number;
  /** Días hábiles estimados. */
  dias: string;
}

export const ZONAS_ENVIO: ZonaEnvio[] = [
  { id: 'bogota', nombre: 'Bogotá', tarifa: 9000, dias: '1 a 2' },
  { id: 'cundinamarca', nombre: 'Cundinamarca (sabana)', tarifa: 14000, dias: '2 a 3' },
  { id: 'nacional', nombre: 'Resto del país', tarifa: 19000, dias: '3 a 6' },
];

export function zonaEnvio(id: string): ZonaEnvio | undefined {
  return ZONAS_ENVIO.find((z) => z.id === id);
}

export interface ResultadoEnvio {
  costo: number;
  gratis: boolean;
  dias: string;
  falta: number;
}

/** Calcula el envío para un subtotal (ya con descuento por volumen, sin IVA). */
export function calcularEnvio(subtotal: number, zonaId: string): ResultadoEnvio {
  const zona = zonaEnvio(zonaId) ?? ZONAS_ENVIO[0];
  const gratis = subtotal >= UMBRAL_ENVIO_GRATIS;
  return {
    costo: gratis ? 0 : zona.tarifa,
    gratis,
    dias: zona.dias,
    falta: gratis ? 0 : Math.max(0, UMBRAL_ENVIO_GRATIS - subtotal),
  };
}
