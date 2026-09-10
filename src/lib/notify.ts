/**
 * Notificación de leads (cotizaciones y descargas de ficha).
 * Envía a un webhook de n8n si está configurado; si no, registra en consola
 * para no romper el flujo en desarrollo.
 *
 * TODO Fase 1: conectar el webhook real de n8n o el envío por correo.
 */

type TipoLead = 'cotizacion' | 'ficha-tecnica';

interface LeadBase {
  tipo: TipoLead;
  origen?: string;
  recibidoEn: string;
}

export interface LeadCotizacion extends LeadBase {
  tipo: 'cotizacion';
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  cupos: string;
}

export interface LeadFicha extends LeadBase {
  tipo: 'ficha-tecnica';
  correo: string;
  modeloId: string;
  modeloNombre: string;
}

export type Lead = LeadCotizacion | LeadFicha;

const WEBHOOKS: Record<TipoLead, string | undefined> = {
  cotizacion: import.meta.env.N8N_WEBHOOK_COTIZACIONES,
  'ficha-tecnica': import.meta.env.N8N_WEBHOOK_AGENDAMIENTOS, // reusar hasta tener uno propio
};

export async function notificarLead(lead: Lead): Promise<void> {
  const url = WEBHOOKS[lead.tipo];

  if (!url) {
    console.info('[notify] lead sin webhook configurado:', JSON.stringify(lead));
    return;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!res.ok) {
      console.error('[notify] webhook respondió', res.status);
    }
  } catch (err) {
    // No propagamos: el usuario ya envió el formulario, el lead no se pierde
    // si además se guarda en base de datos (Fase 1+).
    console.error('[notify] fallo al enviar al webhook:', err);
  }
}
