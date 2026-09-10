import { useState } from 'react';
import { validarCobertura } from '../../data/mantenimiento';

/**
 * Chequeo rápido de cobertura para la página /mantenimiento/cobertura.
 * Comparte la lógica con el paso 2 del agendador.
 */
export default function ChequeoCobertura() {
  const [valor, setValor] = useState('');
  const [res, setRes] = useState<{ cubierto: boolean; match?: string } | null>(null);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
      <label className="grid gap-1.5 text-[var(--text-sm)] font-semibold" htmlFor="cob-q">
        Escribe tu localidad, barrio o municipio
        <div className="flex gap-2">
          <input
            id="cob-q"
            type="text"
            value={valor}
            onChange={(e) => {
              setValor(e.target.value);
              setRes(null);
            }}
            placeholder="Ej.: Chapinero, Usaquén, Cajicá"
            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[var(--text-base)]"
          />
          <button
            type="button"
            onClick={() => setRes(validarCobertura(valor))}
            className="shrink-0 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-4 font-semibold text-white"
          >
            Validar
          </button>
        </div>
      </label>
      <p aria-live="polite" className="mt-3 text-[var(--text-sm)]">
        {res?.cubierto && (
          <span className="text-[var(--color-success-500)]">
            Sí llegamos a {res.match}.{' '}
            <a className="font-semibold underline" href="/mantenimiento/agendar?m=domicilio">
              Agendar a domicilio
            </a>
          </span>
        )}
        {res && !res.cubierto && (
          <span className="text-[var(--color-text-muted)]">
            Todavía no tenemos cobertura ahí. Puedes usar el{' '}
            <a className="font-semibold underline" href="/mantenimiento/taller">
              taller
            </a>
            .
          </span>
        )}
      </p>
    </div>
  );
}
