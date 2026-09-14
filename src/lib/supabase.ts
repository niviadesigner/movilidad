/**
 * Cliente de Supabase (catálogo, pedidos, agendamientos, leads).
 *
 * Fase 0: NO se usa todavía. Se deja el punto de entrada listo para que
 * las siguientes fases importen desde aquí y no dupliquen configuración.
 *
 * - `supabase`        -> cliente público (anon key), seguro en el navegador.
 * - `supabaseAdmin()` -> cliente con service role, SOLO en código de servidor.
 */
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.SUPABASE_URL;
const publishableKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY;

const configurado = Boolean(url && publishableKey && !url.includes('TU-PROYECTO'));

if (!configurado && import.meta.env.DEV) {
  // Aviso en desarrollo, sin romper el build del esqueleto.
  console.warn(
    '[supabase] Sin configurar. Copia .env.example a .env con llaves reales cuando toque.',
  );
}

export const supabase = configurado
  ? createClient(url, publishableKey)
  : null;

/** Cliente con permisos elevados. Nunca lo importes en componentes de cliente. */
export function supabaseAdmin() {
  const secretKey = import.meta.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error('[supabase] Falta SUPABASE_SECRET_KEY o SUPABASE_URL.');
  }
  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const supabaseConfigurado = configurado;
