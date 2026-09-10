import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { calcularTotales, type LineaCotizada } from '../../lib/pricing';
import { calcularEnvio, zonaEnvio } from '../../lib/envios';
import { iniciarPago } from '../../lib/pago';
import { notificarLead } from '../../lib/notify';

export const prerender = false;

const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Entrada {
  contacto?: { nombre?: string; correo?: string; telefono?: string };
  direccion?: string;
  zona?: string;
  lineas?: { sku?: string; unidades?: number }[];
  // trampa anti-bots
  empresa_web?: string;
}

function referencia(): string {
  return `MOV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export const POST: APIRoute = async ({ request, url }) => {
  let body: Entrada;
  try {
    body = (await request.json()) as Entrada;
  } catch {
    return Response.json({ ok: false, error: 'json' }, { status: 400 });
  }

  if (body.empresa_web) return Response.json({ ok: true, ref: referencia(), modo: 'demo' });

  const nombre = (body.contacto?.nombre ?? '').trim();
  const correo = (body.contacto?.correo ?? '').trim();
  const telefono = (body.contacto?.telefono ?? '').trim();
  const direccion = (body.direccion ?? '').trim();
  const zonaId = (body.zona ?? '').trim();

  if (nombre.length < 2 || !RE_CORREO.test(correo) || telefono.length < 7 || direccion.length < 5 || !zonaEnvio(zonaId)) {
    return Response.json({ ok: false, error: 'datos' }, { status: 422 });
  }

  // Precios recalculados en el servidor desde el catálogo. Nunca se confía en el cliente.
  const catalogo = await getCollection('productos');
  const lineas: LineaCotizada[] = [];
  const detalle: { sku: string; nombre: string; unidades: number; precio: number }[] = [];

  for (const l of body.lineas ?? []) {
    const p = catalogo.find((x) => x.data.sku === l.sku);
    const unidades = Math.max(1, Math.min(99, Math.floor(Number(l.unidades) || 0)));
    if (!p || p.data.stock <= 0) continue;
    lineas.push({ unidades, precioUnitario: p.data.precio });
    detalle.push({ sku: p.data.sku, nombre: p.data.nombre, unidades, precio: p.data.precio });
  }

  if (lineas.length === 0) {
    return Response.json({ ok: false, error: 'carrito-vacio' }, { status: 422 });
  }

  const totales = calcularTotales(lineas);
  const envio = calcularEnvio(totales.base, zonaId);
  const total = totales.total + envio.costo;

  const ref = referencia();
  const urlRetorno = `${url.origin}/tienda/pedido-confirmado?ref=${ref}`;
  const pago = await iniciarPago({ referencia: ref, total, correo }, urlRetorno);

  await notificarLead({
    tipo: 'pedido',
    referencia: ref,
    modoPago: pago.modo,
    nombre,
    correo,
    telefono,
    direccion,
    zona: zonaEnvio(zonaId)!.nombre,
    total,
    lineas: detalle,
    recibidoEn: new Date().toISOString(),
  });

  return Response.json({ ok: true, ref, modo: pago.modo, urlPago: pago.urlPago ?? null });
};

export const GET: APIRoute = () =>
  new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } });
