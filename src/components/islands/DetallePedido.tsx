import { useEffect, useState } from 'react';
import { formatoCOP } from '../../lib/pricing';

interface Linea { sku: string; nombre: string; unidades: number; precio: number }
interface PedidoLocal {
  ref: string;
  fecha: string;
  modo?: string;
  total: number;
  zona?: string;
  contacto?: { nombre?: string; correo?: string; telefono?: string; direccion?: string };
  lineas?: Linea[];
}

interface Props {
  /** Si no se pasa, se lee de ?ref= en la URL. */
  refInicial?: string;
}

export default function DetallePedido({ refInicial }: Props) {
  const [pedido, setPedido] = useState<PedidoLocal | null | undefined>(undefined);

  useEffect(() => {
    const ref = refInicial || new URLSearchParams(window.location.search).get('ref') || '';
    try {
      const pedidos: PedidoLocal[] = JSON.parse(localStorage.getItem('pedidos') || '[]');
      setPedido(pedidos.find((p) => p.ref === ref) ?? null);
    } catch {
      setPedido(null);
    }
  }, [refInicial]);

  if (pedido === undefined) return <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">Cargando…</p>;

  if (pedido === null) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-8">
        <p className="font-semibold">No encontramos ese pedido en este dispositivo.</p>
        <a href="/mi-cuenta/pedidos" className="mt-3 inline-block text-[var(--text-sm)] font-semibold text-[var(--color-link)] hover:underline">
          Volver a mis pedidos
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <p className="font-mono text-[var(--text-lg)] font-bold">{pedido.ref}</p>
        <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
          {new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(new Date(pedido.fecha))}
          {pedido.modo === 'demo' && ' · pedido de prueba (sin cobro)'}
        </p>

        <h2 className="mt-6 font-display text-[var(--text-lg)] font-bold">Productos</h2>
        <ul className="mt-3 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {(pedido.lineas ?? []).map((l) => (
            <li key={l.sku} className="flex justify-between gap-3 py-3 text-[var(--text-sm)]">
              <span>{l.unidades} × {l.nombre}</span>
              <span className="tabular-nums">{formatoCOP(l.precio * l.unidades)}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-6 font-display text-[var(--text-lg)] font-bold">Rastreo</h2>
        <p className="mt-2 text-[var(--text-sm)] text-[var(--color-text-muted)]">
          El seguimiento con la guía del transportador se activa cuando el pedido sale de bodega.
        </p>
      </div>

      <aside className="h-fit rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 text-[var(--text-sm)]">
        <h2 className="font-display text-[var(--text-base)] font-bold">Envío</h2>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {pedido.contacto?.nombre}<br />
          {pedido.contacto?.direccion}<br />
          {pedido.zona}
        </p>
        <p className="mt-4 flex justify-between border-t border-[var(--color-border)] pt-3 font-bold">
          <span>Total</span>
          <span className="tabular-nums">{formatoCOP(pedido.total)}</span>
        </p>
      </aside>
    </div>
  );
}
