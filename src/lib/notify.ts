/**
 * Notificación de leads (cotizaciones, agendamientos, fichas, calculadora y
 * pedidos). Guarda cada lead en Supabase (tabla `leads`) y, si además hay un
 * webhook de n8n configurado, también lo envía ahí.
 */
import { supabaseAdmin, supabaseConfigurado } from './supabase';

type TipoLead = 'cotizacion' | 'ficha-tecnica' | 'agendamiento' | 'pedido' | 'calculadora';

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

export interface LeadAgendamiento extends LeadBase {
  tipo: 'agendamiento';
  modalidad: 'empresa' | 'taller' | 'domicilio';
  nombre: string;
  telefono: string;
  fecha: string;
  /** Campos variables según la modalidad. */
  detalle: Record<string, string>;
}

export interface LeadPedido extends LeadBase {
  tipo: 'pedido';
  referencia: string;
  modoPago: 'demo' | 'wompi';
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  zona: string;
  total: number;
  lineas: { sku: string; nombre: string; unidades: number; precio: number }[];
}

export interface LeadCalculadora extends LeadBase {
  tipo: 'calculadora';
  correo: string;
  tipoEspacio: string;
  personas: number;
  cuposEstimado: number;
  familiaSugerida: string;
}

export type Lead = LeadCotizacion | LeadFicha | LeadAgendamiento | LeadPedido | LeadCalculadora;

const WEBHOOKS: Record<TipoLead, string | undefined> = {
  cotizacion: import.meta.env.N8N_WEBHOOK_COTIZACIONES,
  'ficha-tecnica': import.meta.env.N8N_WEBHOOK_COTIZACIONES, // reusar hasta tener uno propio
  agendamiento: import.meta.env.N8N_WEBHOOK_AGENDAMIENTOS,
  pedido: import.meta.env.N8N_WEBHOOK_COTIZACIONES, // reusar hasta tener uno de pedidos
  calculadora: import.meta.env.N8N_WEBHOOK_COTIZACIONES, // mismo canal: es un lead calificado
};

export async function notificarLead(lead: Lead): Promise<void> {
  if (supabaseConfigurado) {
    const { error } = await supabaseAdmin()
      .from('leads')
      .insert({ tipo: lead.tipo, recibido_en: lead.recibidoEn, origen: lead.origen ?? null, payload: lead });
    if (error) console.error('[notify] error guardando en Supabase:', error.message);
  }

  const url = WEBHOOKS[lead.tipo];

  if (!url) {
    if (!supabaseConfigurado) console.info('[notify] lead sin Supabase ni webhook configurados:', JSON.stringify(lead));
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
    // porque ya quedó guardado en Supabase arriba.
    console.error('[notify] fallo al enviar al webhook:', err);
  }
}
