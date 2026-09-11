import { useMemo, useState } from 'react';
import { TIPOS_ESPACIO, estimarCupos, type TipoEspacio } from '../../lib/calculadora';
import { trackEvent, EVENTOS } from '../../lib/analytics';

/**
 * Calculadora de cupos (/recursos/calculadora-cupos).
 * Dos pasos: 1) estimado inmediato, sin pedir nada · 2) captura de correo para
 * el resultado detallado, que también califica el lead (regla §7: capta y califica).
 */
const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CalculadoraCupos() {
  const [tipo, setTipo] = useState<TipoEspacio>('oficina');
  const [personas, setPersonas] = useState('');
  const [calculado, setCalculado] = useState(false);
  const [correo, setCorreo] = useState('');
  const [honey, setHoney] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const opcion = TIPOS_ESPACIO.find((t) => t.id === tipo)!;
  const resultado = useMemo(() => estimarCupos(tipo, Number(personas)), [tipo, personas]);

  async function enviarCorreo(e: React.FormEvent) {
    e.preventDefault();
    if (!resultado || !RE_CORREO.test(correo)) return;
    setError('');

    const fd = new FormData();
    fd.set('empresa_web', honey);
    fd.set('correo', correo);
    fd.set('tipoEspacio', opcion.label);
    fd.set('personas', personas);
    fd.set('cuposEstimado', String(resultado.recomendado));
    fd.set('familiaSugerida', resultado.familiaSugerida);

    try {
      const res = await fetch('/api/calculadora', { method: 'POST', body: fd });
      const data = (await res.json()) as { ok: boolean };
      if (data.ok) {
        setEnviado(true);
        trackEvent(EVENTOS.calculadoraLead, {
          tipo_espacio: opcion.label,
          cupos_estimado: resultado.recomendado,
        });
        return;
      }
      setError('No pudimos enviarlo. Revisa el correo e inténtalo de nuevo.');
    } catch {
      setError('Hubo un problema de conexión. Inténtalo de nuevo en un momento.');
    }
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-[var(--text-sm)] font-semibold">
          Tipo de espacio
          <select
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value as TipoEspacio);
              setCalculado(false);
            }}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[var(--text-base)]"
          >
            {TIPOS_ESPACIO.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-[var(--text-sm)] font-semibold">
          Número de {opcion.unidad}
          <input
            type="number"
            min={1}
            value={personas}
            onChange={(e) => {
              setPersonas(e.target.value);
              setCalculado(false);
            }}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[var(--text-base)]"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => setCalculado(true)}
        disabled={!resultado}
        className="mt-5 min-h-11 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-6 font-semibold text-white disabled:opacity-50"
      >
        Calcular
      </button>

      {calculado && resultado && (
        <div className="mt-8 border-t border-[var(--color-border)] pt-6">
          <p className="font-mono text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-muted)]">
            Estimado orientativo
          </p>
          <p className="mt-2 text-[var(--text-3xl)] font-bold text-[var(--color-primary-700)]">
            {resultado.minimo}–{resultado.recomendado} cupos
          </p>
          <p className="mt-2 max-w-[38rem] text-[var(--text-sm)] text-[var(--color-text-muted)]">
            Para {personas} {opcion.unidad} en un {opcion.label.toLowerCase()}. Esta es una
            proporción de referencia para planear, no la cifra oficial del POT de tu municipio —
            esa se confirma en la cotización.
          </p>

          {!enviado ? (
            <form onSubmit={enviarCorreo} className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-start">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
                value={honey}
                onChange={(e) => setHoney(e.target.value)}
              />
              <div className="flex-1">
                <label htmlFor="calc-correo" className="sr-only">
                  Tu correo
                </label>
                <input
                  id="calc-correo"
                  type="email"
                  required
                  placeholder="tucorreo@empresa.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[var(--text-base)]"
                />
                {error && <p className="mt-1 text-[var(--text-xs)] text-[var(--color-danger-500)]">{error}</p>}
              </div>
              <button
                type="submit"
                className="min-h-11 shrink-0 rounded-[var(--radius-md)] bg-[var(--color-accent-300)] px-5 font-semibold text-[var(--color-neutral-900)]"
              >
                Recibir el detalle
              </button>
            </form>
          ) : (
            <p className="mt-6 text-[var(--text-sm)] font-medium text-[var(--color-success-500)]">
              Listo, te enviamos el detalle. Un ingeniero también puede confirmarte el número
              exacto que exige tu municipio.
            </p>
          )}

          <a
            href={`/cotizar?cupos=${resultado.recomendado}`}
            className="mt-4 inline-block text-[var(--text-sm)] font-semibold text-[var(--color-link)] hover:underline"
          >
            Cotizar con este estimado &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
