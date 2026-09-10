import { useEffect, useState } from 'react';
import { formatoCOP } from '../../lib/pricing';

interface PedidoLocal {
  ref: string;
  fecha: string;
  modo?: string;
  total: number;
  zona?: string;
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState<PedidoLocal[] | null>(null);

  useEffect(() => {
    try {
      setPedidos(JSON.parse(localStorage.getItem('pedidos') || '[]'));
    } catch {
      setPedidos([]);
    }
  }, []);

  if (pedidos === null) return <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">Cargando…</p>;

  return (
    <>
      <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
        Se muestran los pedidos hechos en este dispositivo. La cuenta con historial completo llega más adelante.
      </p>

      {pedidos.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-8 text-center">
          <p className="font-semibold">Aún no tienes pedidos</p>
          <a href="/tienda" className="mt-4 inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-5 font-semibold text-white">
            Ver productos
          </a>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {pedidos.map((p) => (
            <li key={p.ref} className="flex flex-wrap items-center justify-between gap-2 py-4">
              <div>
                <a href={`/mi-cuenta/pedidos/detalle?ref=${p.ref}`} className="font-mono font-medium hover:underline">
                  {p.ref}
                </a>
                <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                  {new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(p.fecha))}
                  {p.modo === 'demo' && ' · pedido de prueba'}
                </p>
              </div>
              <span className="font-semibold tabular-nums">{formatoCOP(p.total)}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
