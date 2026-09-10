import { useEffect, useState } from 'react';
import { leerCarrito, cambiarUnidades, quitar, totalUnidades, type ItemCarrito } from '../../lib/carrito';
import { calcularTotales, formatoCOP } from '../../lib/pricing';

/**
 * Mini-preview del carrito. Se abre al agregar un producto; nunca redirige
 * (docs/arquitectura §4). Montado una vez en TiendaLayout.
 */
export default function MiniCarrito() {
  const [abierto, setAbierto] = useState(false);
  const [items, setItems] = useState<ItemCarrito[]>([]);

  useEffect(() => {
    const sync = () => setItems(leerCarrito());
    sync();
    const abrir = () => {
      sync();
      setAbierto(true);
    };
    window.addEventListener('carrito:cambio', sync);
    window.addEventListener('storage', sync);
    window.addEventListener('minicarrito:abrir', abrir);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('carrito:cambio', sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener('minicarrito:abrir', abrir);
      window.removeEventListener('keydown', esc);
    };
  }, []);

  const totales = calcularTotales(items.map((i) => ({ unidades: i.unidades, precioUnitario: i.precio })));
  const cuenta = totalUnidades(items);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/30"
        onClick={() => setAbierto(false)}
      />
      <aside
        role="dialog"
        aria-label="Carrito"
        className="absolute right-0 top-0 flex h-full w-[min(24rem,100vw)] flex-col bg-[var(--color-surface)] shadow-[var(--shadow-md)]"
      >
        <header className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <p className="font-display font-bold">Tu carrito ({cuenta})</p>
          <button type="button" onClick={() => setAbierto(false)} className="h-9 w-9 text-[var(--text-lg)]" aria-label="Cerrar">
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">Aún no has agregado nada.</p>
          ) : (
            <ul className="grid gap-4">
              {items.map((i) => (
                <li key={i.sku} className="grid grid-cols-[1fr_auto] gap-1">
                  <a href={i.ruta} className="text-[var(--text-sm)] font-medium hover:underline">
                    {i.nombre}
                  </a>
                  <span className="text-[var(--text-sm)] tabular-nums">{formatoCOP(i.precio * i.unidades)}</span>
                  <div className="col-span-2 mt-1 flex items-center gap-3">
                    <div className="flex items-center rounded-[var(--radius-sm)] border border-[var(--color-border)]">
                      <button type="button" aria-label="Menos" className="h-8 w-8" onClick={() => setItems(cambiarUnidades(i.sku, i.unidades - 1))}>−</button>
                      <span className="w-7 text-center text-[var(--text-sm)] tabular-nums">{i.unidades}</span>
                      <button type="button" aria-label="Más" className="h-8 w-8" onClick={() => setItems(cambiarUnidades(i.sku, i.unidades + 1))}>+</button>
                    </div>
                    <button type="button" className="text-[var(--text-xs)] text-[var(--color-text-muted)] underline" onClick={() => setItems(quitar(i.sku))}>
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-[var(--color-border)] px-5 py-4">
            {totales.descuentoPct > 0 && (
              <p className="mb-1 flex justify-between text-[var(--text-xs)] text-[var(--color-success-500)]">
                <span>Descuento por volumen ({Math.round(totales.descuentoPct * 100)}%)</span>
                <span>−{formatoCOP(totales.descuento)}</span>
              </p>
            )}
            <p className="flex justify-between text-[var(--text-sm)]">
              <span>Subtotal</span>
              <span className="font-semibold tabular-nums">{formatoCOP(totales.base)}</span>
            </p>
            <p className="mt-0.5 text-[var(--text-xs)] text-[var(--color-text-muted)]">IVA y envío se calculan en el pago.</p>
            <div className="mt-4 grid gap-2">
              <a href="/tienda/checkout" className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-300)] px-5 font-semibold text-[var(--color-neutral-900)]">
                Ir a pagar
              </a>
              <a href="/tienda/carrito" className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] px-5 font-semibold">
                Ver carrito
              </a>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
