import { useState } from 'react';
import { agregar, type ItemCarrito } from '../../lib/carrito';

interface Props {
  item: Omit<ItemCarrito, 'unidades'>;
  stock: number;
  /** Compacto para la grilla; completo (con selector de cantidad) en la ficha. */
  compacto?: boolean;
}

export default function BotonAgregar({ item, stock, compacto = false }: Props) {
  const [unidades, setUnidades] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const agotado = stock <= 0;

  function alAgregar() {
    if (agotado) return;
    agregar(item, compacto ? 1 : unidades);
    window.dispatchEvent(new CustomEvent('minicarrito:abrir'));
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 2500);
  }

  if (agotado) {
    return (
      <span className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] px-4 text-[var(--text-sm)] font-semibold text-[var(--color-text-muted)]">
        Agotado
      </span>
    );
  }

  if (compacto) {
    return (
      <button
        type="button"
        onClick={alAgregar}
        className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-4 text-[var(--text-sm)] font-semibold text-white transition-colors hover:bg-[var(--color-primary-800)]"
      >
        {agregado ? 'Agregado ✓' : 'Agregar'}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)]">
        <button
          type="button"
          aria-label="Quitar una unidad"
          className="h-11 w-11 text-[var(--text-lg)]"
          onClick={() => setUnidades((u) => Math.max(1, u - 1))}
        >
          −
        </button>
        <span className="w-8 text-center tabular-nums" aria-live="polite">
          {unidades}
        </span>
        <button
          type="button"
          aria-label="Añadir una unidad"
          className="h-11 w-11 text-[var(--text-lg)]"
          onClick={() => setUnidades((u) => Math.min(stock, u + 1))}
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={alAgregar}
        className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-accent-300)] px-6 font-semibold text-[var(--color-neutral-900)] transition-colors hover:bg-[var(--color-accent-400)]"
      >
        {agregado ? 'Agregado al carrito ✓' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
