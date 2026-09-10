import { useEffect, useState } from 'react';

/**
 * Barra inferior fija en móvil con 3 acciones (docs/arquitectura §4).
 * Contexto corporativo: Cotizar · WhatsApp · Carrito.
 * El contador del carrito se leerá de almacenamiento local en fases posteriores.
 */
interface Props {
  whatsappHref: string;
  cotizarHref?: string;
  carritoHref?: string;
}

export default function MobileBottomBar({
  whatsappHref,
  cotizarHref = '/cotizar',
  carritoHref = '/tienda/carrito',
}: Props) {
  const [items, setItems] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('carrito');
      if (raw) {
        const carrito = JSON.parse(raw) as { unidades?: number }[];
        setItems(carrito.reduce((s, i) => s + (i.unidades ?? 0), 0));
      }
    } catch {
      /* sin carrito todavía */
    }
  }, []);

  const celda =
    'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[0.7rem] font-medium';

  return (
    <nav
      aria-label="Acciones rápidas"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] sm:hidden"
    >
      <a href={cotizarHref} className={celda}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" /><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        Cotizar
      </a>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={celda}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Z" /></svg>
        WhatsApp
      </a>
      <a href={carritoHref} className={`${celda} relative`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Carrito
        {items > 0 && (
          <span className="absolute right-6 top-1 min-w-4 rounded-full bg-[var(--color-accent-500)] px-1 text-center text-[0.65rem] text-white">
            {items}
          </span>
        )}
      </a>
    </nav>
  );
}
