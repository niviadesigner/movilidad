import type { APIRoute } from 'astro';
import { validarAgendamiento } from '../../lib/forms';
import { notificarLead } from '../../lib/notify';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const fd = await request.formData();
  const { ok, datos, bot } = validarAgendamiento(fd);

  // Bot: respondemos éxito para no dar pistas.
  if (bot) return Response.json({ ok: true });

  if (!ok || !datos) {
    return Response.json({ ok: false }, { status: 422 });
  }

  await notificarLead({
    tipo: 'agendamiento',
    modalidad: datos.modalidad,
    nombre: datos.nombre,
    telefono: datos.telefono,
    fecha: datos.fecha,
    detalle: datos.detalle,
    recibidoEn: new Date().toISOString(),
  });

  return Response.json({ ok: true });
};

export const GET: APIRoute = () =>
  new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } });
