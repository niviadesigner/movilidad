import type { APIRoute } from 'astro';
import { validarCalculadora } from '../../lib/forms';
import { notificarLead } from '../../lib/notify';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const fd = await request.formData();
  const { ok, datos, bot } = validarCalculadora(fd);

  if (bot) return Response.json({ ok: true });
  if (!ok || !datos) return Response.json({ ok: false }, { status: 422 });

  await notificarLead({
    tipo: 'calculadora',
    correo: datos.correo,
    tipoEspacio: datos.tipoEspacio,
    personas: datos.personas,
    cuposEstimado: datos.cuposEstimado,
    familiaSugerida: datos.familiaSugerida,
    recibidoEn: new Date().toISOString(),
  });

  return Response.json({ ok: true });
};

export const GET: APIRoute = () =>
  new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } });
