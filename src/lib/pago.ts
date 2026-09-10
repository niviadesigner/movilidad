/**
 * Capa de pago abstracta (docs/CLAUDE.md §2.8): el resto del código no depende
 * de Wompi. Si no hay llaves configuradas, el checkout opera en MODO DEMO y el
 * pedido se marca como prueba.
 *
 * TODO Fase 4: cargar llaves reales de Wompi en el entorno (.env / Vercel).
 */

const PUBLIC_KEY = import.meta.env.PUBLIC_WOMPI_PUBLIC_KEY ?? '';
const INTEGRITY_SECRET = import.meta.env.WOMPI_INTEGRITY_SECRET ?? '';

export const pagoConfigurado =
  PUBLIC_KEY.startsWith('pub_') && !PUBLIC_KEY.includes('XXXX') && INTEGRITY_SECRET.length > 0;

export interface PedidoPago {
  referencia: string;
  /** Total a cobrar en pesos (con IVA y envío). */
  total: number;
  correo: string;
}

export interface InicioPago {
  modo: 'demo' | 'wompi';
  /** URL a la que redirigir para pagar (solo en modo wompi). */
  urlPago?: string;
}

async function firmaIntegridad(referencia: string, centavos: number, moneda: string): Promise<string> {
  const cadena = `${referencia}${centavos}${moneda}${INTEGRITY_SECRET}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(cadena));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Inicia el pago de un pedido. En modo demo no cobra nada.
 * En modo wompi devuelve la URL del Checkout Web con la firma de integridad.
 */
export async function iniciarPago(pedido: PedidoPago, urlRetorno: string): Promise<InicioPago> {
  if (!pagoConfigurado) return { modo: 'demo' };

  const centavos = Math.round(pedido.total * 100);
  const moneda = 'COP';
  const firma = await firmaIntegridad(pedido.referencia, centavos, moneda);

  const q = new URLSearchParams({
    'public-key': PUBLIC_KEY,
    currency: moneda,
    'amount-in-cents': String(centavos),
    reference: pedido.referencia,
    'signature:integrity': firma,
    'redirect-url': urlRetorno,
    'customer-data:email': pedido.correo,
  });

  return { modo: 'wompi', urlPago: `https://checkout.wompi.co/p/?${q.toString()}` };
}
