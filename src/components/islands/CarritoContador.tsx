import { useEffect, useState } from 'react';
import { leerCarrito, totalUnidades } from '../../lib/carrito';

/** Contador del carrito en el header de tienda. Se sincroniza entre pestañas. */
export default function CarritoContador() {
  const [n, setN] = useState(0);

  useEffect(() => {
    const actualizar = () => setN(totalUnidades(leerCarrito()));
    actualizar();
    window.addEventListener('carrito:cambio', actualizar);
    window.addEventListener('storage', actualizar);
    return () => {
      window.removeEventListener('carrito:cambio', actualizar);
      window.removeEventListener('storage', actualizar);
    };
  }, []);

  return (
    <span
      aria-hidden={n === 0}
      className={
        n > 0
          ? 'inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--color-accent-300)] px-1.5 text-[0.7rem] font-bold text-[var(--color-neutral-900)] tabular-nums'
          : 'text-[var(--text-sm)] tabular-nums'
      }
    >
      {n}
    </span>
  );
}
