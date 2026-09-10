import type { APIRoute } from 'astro';
import { validarFicha } from '../../lib/forms';
import { notificarLead } from '../../lib/notify';

export const prerender = false;

const FALLBACK = '/biciparqueaderos/modelos';

export const POST: APIRoute = async ({ request, redirect }) => {
  const fd = await request.formData();
  const { ok, datos, bot } = validarFicha(fd);

  const origen = typeof fd.get('origen') === 'string' ? String(fd.get('origen')) : FALLBACK;
  const base = origen.startsWith('/') ? origen : FALLBACK;

  if (bot) return redirect(`${base}?ficha=enviada`, 303);

  if (!ok || !datos) {
    return redirect(`${base}?ficha=error`, 303);
  }

  await notificarLead({
    tipo: 'ficha-tecnica',
    correo: datos.correo,
    modeloId: datos.modeloId,
    modeloNombre: datos.modeloNombre,
    origen: datos.origen,
    recibidoEn: new Date().toISOString(),
  });

  return redirect(`${base}?ficha=enviada`, 303);
};

export const GET: APIRoute = () =>
  new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } });
