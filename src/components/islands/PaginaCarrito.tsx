import { useEffect, useState } from 'react';
import { leerCarrito, cambiarUnidades, quitar, type ItemCarrito } from '../../lib/carrito';
import { calcularTotales, formatoCOP, TRAMOS_VOLUMEN, descuentoPorVolumen } from '../../lib/pricing';

export default function PaginaCarrito() {
  const [items, setItems] = useState<ItemCarrito[] | null>(null);

  useEffect(() => {
    setItems(leerCarrito());
    const sync = () => setItems(leerCarrito());
    window.addEventListener('carrito:cambio', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('carrito:cambio', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (items === null) return <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">Cargando carrito…</p>;

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-8 text-center">
        <p className="text-[var(--text-lg)] font-semibold">Tu carrito está vacío</p>
        <a href="/tienda" className="mt-4 inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-5 font-semibold text-white">
          Ver productos
        </a>
      </div>
    );
  }

  const unidades = items.reduce((s, i) => s + i.unidades, 0);
  const totales = calcularTotales(items.map((i) => ({ unidades: i.unidades, precioUnitario: i.precio })));

  // Siguiente tramo de descuento por volumen
  const siguiente = TRAMOS_VOLUMEN.find((t) => t.desde > unidades);
  const actual = descuentoPorVolumen(unidades);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {items.map((i) => (
            <li key={i.sku} className="grid grid-cols-[1fr_auto] items-start gap-2 py-5">
              <div>
                <a href={i.ruta} className="font-medium hover:underline">{i.nombre}</a>
                <p className="mt-0.5 font-mono text-[var(--text-xs)] text-[var(--color-text-muted)]">{i.sku}</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)]">
                    <button type="button" aria-label="Menos" className="h-10 w-10" onClick={() => setItems(cambiarUnidades(i.sku, i.unidades - 1))}>−</button>
                    <span className="w-9 text-center tabular-nums">{i.unidades}</span>
                    <button type="button" aria-label="Más" className="h-10 w-10" onClick={() => setItems(cambiarUnidades(i.sku, i.unidades + 1))}>+</button>
                  </div>
                  <button type="button" className="text-[var(--text-sm)] text-[var(--color-text-muted)] underline" onClick={() => setItems(quitar(i.sku))}>
                    Quitar
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold tabular-nums">{formatoCOP(i.precio * i.unidades)}</p>
                <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] tabular-nums">{formatoCOP(i.precio)} c/u</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
        <h2 className="font-display text-[var(--text-lg)] font-bold">Resumen</h2>

        <dl className="mt-4 grid gap-1.5 text-[var(--text-sm)]">
          <div className="flex justify-between">
            <dt>Subtotal ({unidades} art.)</dt>
            <dd className="tabular-nums">{formatoCOP(totales.subtotal)}</dd>
          </div>
          {totales.descuento > 0 && (
            <div className="flex justify-between text-[var(--color-success-500)]">
              <dt>Descuento por volumen ({Math.round(actual * 100)}%)</dt>
              <dd className="tabular-nums">−{formatoCOP(totales.descuento)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>IVA (19%)</dt>
            <dd className="tabular-nums">{formatoCOP(totales.iva)}</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-[var(--color-border)] pt-2 text-[var(--text-base)] font-bold">
            <dt>Total sin envío</dt>
            <dd className="tabular-nums">{formatoCOP(totales.total)}</dd>
          </div>
        </dl>

        {siguiente && (
          <p className="mt-3 rounded-[var(--radius-sm)] bg-[var(--color-surface)] px-3 py-2 text-[var(--text-xs)] text-[var(--color-text-muted)]">
            Agrega {siguiente.desde - unidades} art. más y el descuento sube al {Math.round(siguiente.descuento * 100)}%.
          </p>
        )}

        <a href="/tienda/checkout" className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-300)] px-5 font-semibold text-[var(--color-neutral-900)]">
          Continuar al pago
        </a>
        <p className="mt-2 text-center text-[var(--text-xs)] text-[var(--color-text-muted)]">El envío se calcula en el siguiente paso.</p>
      </aside>
    </div>
  );
}
