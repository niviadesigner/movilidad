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
  // El id del modelo va en la redirección para que, si la página tiene varias
  // fichas (p. ej. /recursos/fichas-tecnicas), se revele solo la que se envió.
  const modeloId = typeof fd.get('modeloId') === 'string' ? String(fd.get('modeloId')) : '';
  const conModelo = (estado: string) =>
    `${base}?ficha=${estado}${modeloId ? `&modelo=${encodeURIComponent(modeloId)}` : ''}`;

  if (bot) return redirect(conModelo('enviada'), 303);

  if (!ok || !datos) {
    return redirect(conModelo('error'), 303);
  }

  await notificarLead({
    tipo: 'ficha-tecnica',
    correo: datos.correo,
    modeloId: datos.modeloId,
    modeloNombre: datos.modeloNombre,
    origen: datos.origen,
    recibidoEn: new Date().toISOString(),
  });

  return redirect(conModelo('enviada'), 303);
};

export const GET: APIRoute = () =>
  new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } });
