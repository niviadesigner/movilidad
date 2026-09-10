import type { APIRoute } from 'astro';
import { validarCotizacion } from '../../lib/forms';
import { notificarLead } from '../../lib/notify';

// Ruta bajo demanda (serverless en Vercel), no se pre-renderiza.
export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const fd = await request.formData();
  const { ok, datos, bot } = validarCotizacion(fd);

  // Bot: respondemos como éxito para no darle pistas.
  if (bot) return redirect('/gracias', 303);

  if (!ok || !datos) {
    return redirect('/cotizar?error=1', 303);
  }

  await notificarLead({
    tipo: 'cotizacion',
    ...datos,
    origen: limpioOrigen(fd.get('origen')),
    recibidoEn: new Date().toISOString(),
  });

  return redirect('/gracias', 303);
};

// Método no permitido para GET.
export const GET: APIRoute = () =>
  new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } });

function limpioOrigen(v: FormDataEntryValue | null): string | undefined {
  return typeof v === 'string' && v ? v : undefined;
}
