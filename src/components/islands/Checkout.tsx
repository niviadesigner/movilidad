import { useEffect, useMemo, useState } from 'react';
import { leerCarrito, vaciar, type ItemCarrito } from '../../lib/carrito';
import { calcularTotales, formatoCOP } from '../../lib/pricing';
import { ZONAS_ENVIO, calcularEnvio, UMBRAL_ENVIO_GRATIS } from '../../lib/envios';

const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RE_TEL = /^[+()\d\s-]{7,20}$/;
const inputCls =
  'h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[var(--text-base)]';
const labelCls = 'grid gap-1.5 text-[var(--text-sm)] font-semibold';

export default function Checkout() {
  const [items, setItems] = useState<ItemCarrito[] | null>(null);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [zona, setZona] = useState(ZONAS_ENVIO[0].id);
  const [honey, setHoney] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setItems(leerCarrito());
  }, []);

  const totales = useMemo(
    () => calcularTotales((items ?? []).map((i) => ({ unidades: i.unidades, precioUnitario: i.precio }))),
    [items],
  );
  const envio = useMemo(() => calcularEnvio(totales.base, zona), [totales.base, zona]);
  const total = totales.total + envio.costo;

  const valido =
    (items?.length ?? 0) > 0 &&
    nombre.trim().length > 1 &&
    RE_CORREO.test(correo) &&
    RE_TEL.test(telefono) &&
    direccion.trim().length > 5;

  async function pagar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || enviando || honey) return;
    setEnviando(true);
    setError('');

    try {
      const res = await fetch('/api/pedido', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contacto: { nombre, correo, telefono },
          direccion,
          zona,
          lineas: (items ?? []).map((i) => ({ sku: i.sku, unidades: i.unidades })),
        }),
      });
      const data = (await res.json()) as { ok: boolean; ref?: string; modo?: string; urlPago?: string | null };
      if (!data.ok || !data.ref) {
        setError('No pudimos crear el pedido. Revisa los datos e inténtalo de nuevo.');
        setEnviando(false);
        return;
      }

      // Guarda el pedido en el dispositivo para "Mis pedidos" y la confirmación.
      try {
        const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
        pedidos.unshift({
          ref: data.ref,
          fecha: new Date().toISOString(),
          modo: data.modo,
          total,
          zona: ZONAS_ENVIO.find((z) => z.id === zona)?.nombre,
          contacto: { nombre, correo, telefono, direccion },
          lineas: (items ?? []).map((i) => ({ sku: i.sku, nombre: i.nombre, unidades: i.unidades, precio: i.precio })),
        });
        localStorage.setItem('pedidos', JSON.stringify(pedidos.slice(0, 20)));
      } catch {
        /* sin persistencia local */
      }

      if (data.modo === 'wompi' && data.urlPago) {
        window.location.href = data.urlPago;
        return;
      }
      vaciar();
      window.location.href = `/tienda/pedido-confirmado?ref=${data.ref}`;
    } catch {
      setError('Hubo un problema de conexión. Inténtalo de nuevo en un momento.');
      setEnviando(false);
    }
  }

  if (items === null) return <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">Cargando…</p>;

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-8 text-center">
        <p className="text-[var(--text-lg)] font-semibold">No hay nada para pagar</p>
        <a href="/tienda" className="mt-4 inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-5 font-semibold text-white">
          Ver productos
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <form className="grid gap-4" onSubmit={pagar}>
        <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" value={honey} onChange={(e) => setHoney(e.target.value)} />
        <h2 className="font-display text-[var(--text-xl)] font-bold">Datos de entrega</h2>
        <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">Compra como invitado. La cuenta es opcional al final.</p>

        <label className={labelCls}>Nombre completo
          <input type="text" autoComplete="name" className={inputCls} value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>Correo
            <input type="email" autoComplete="email" className={inputCls} value={correo} onChange={(e) => setCorreo(e.target.value)} />
          </label>
          <label className={labelCls}>Teléfono
            <input type="tel" autoComplete="tel" className={inputCls} value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </label>
        </div>
        <label className={labelCls}>Dirección
          <input type="text" autoComplete="street-address" className={inputCls} value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </label>
        <label className={labelCls}>Zona de envío
          <select className={inputCls} value={zona} onChange={(e) => setZona(e.target.value)}>
            {ZONAS_ENVIO.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nombre} — {formatoCOP(z.tarifa)} · {z.dias} días hábiles
              </option>
            ))}
          </select>
        </label>

        {error && <p role="alert" className="text-[var(--text-sm)] text-[var(--color-danger-500)]">{error}</p>}

        <button
          type="submit"
          disabled={!valido || enviando}
          className="mt-2 inline-flex min-h-11 w-fit items-center rounded-[var(--radius-md)] bg-[var(--color-accent-300)] px-7 font-semibold text-[var(--color-neutral-900)] disabled:opacity-50"
        >
          {enviando ? 'Procesando…' : `Pagar ${formatoCOP(total)}`}
        </button>
        <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
          Al pagar aceptas la <a className="underline" href="/legal/tratamiento-datos">política de tratamiento de datos</a>.
        </p>
      </form>

      <aside className="h-fit rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
        <h2 className="font-display text-[var(--text-lg)] font-bold">Tu pedido</h2>
        <ul className="mt-4 grid gap-2 text-[var(--text-sm)]">
          {items.map((i) => (
            <li key={i.sku} className="flex justify-between gap-3">
              <span>{i.unidades} × {i.nombre}</span>
              <span className="tabular-nums">{formatoCOP(i.precio * i.unidades)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 grid gap-1.5 border-t border-[var(--color-border)] pt-4 text-[var(--text-sm)]">
          {totales.descuento > 0 && (
            <div className="flex justify-between text-[var(--color-success-500)]">
              <dt>Descuento por volumen</dt><dd className="tabular-nums">−{formatoCOP(totales.descuento)}</dd>
            </div>
          )}
          <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{formatoCOP(totales.base)}</dd></div>
          <div className="flex justify-between"><dt>IVA (19%)</dt><dd className="tabular-nums">{formatoCOP(totales.iva)}</dd></div>
          <div className="flex justify-between">
            <dt>Envío</dt>
            <dd className="tabular-nums">{envio.gratis ? 'Gratis' : formatoCOP(envio.costo)}</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-[var(--color-border)] pt-2 text-[var(--text-base)] font-bold">
            <dt>Total</dt><dd className="tabular-nums">{formatoCOP(total)}</dd>
          </div>
        </dl>
        {!envio.gratis && (
          <p className="mt-3 text-[var(--text-xs)] text-[var(--color-text-muted)]">
            Te faltan {formatoCOP(envio.falta)} para envío gratis (desde {formatoCOP(UMBRAL_ENVIO_GRATIS)}).
          </p>
        )}
      </aside>
    </div>
  );
}
