import { useEffect, useMemo, useState } from 'react';
import { formatoCOP } from '../../lib/pricing';
import { agregar } from '../../lib/carrito';

export interface ProductoBusqueda {
  id: string;
  nombre: string;
  sku: string;
  categoria: string;
  categoriaNombre: string;
  precio: number;
  precioAntes?: number;
  stock: number;
  resumen: string;
  ruta: string;
  imagen?: string;
}

interface Props {
  catalogo: ProductoBusqueda[];
  categorias: { slug: string; nombre: string }[];
  consultaInicial?: string;
}

type Orden = 'relevancia' | 'precio-asc' | 'precio-desc';

function normalizar(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export default function BuscadorTienda({ catalogo, categorias, consultaInicial = '' }: Props) {
  const [q, setQ] = useState(consultaInicial);
  const [cats, setCats] = useState<string[]>([]);
  const [soloStock, setSoloStock] = useState(false);
  const [orden, setOrden] = useState<Orden>('relevancia');

  // La página es estática: si viene ?q= en la URL, se aplica en el cliente.
  useEffect(() => {
    if (consultaInicial) return;
    const desdeUrl = new URLSearchParams(window.location.search).get('q');
    if (desdeUrl) setQ(desdeUrl);
  }, [consultaInicial]);

  const resultados = useMemo(() => {
    const term = normalizar(q.trim());
    let out = catalogo.filter((p) => {
      if (cats.length && !cats.includes(p.categoria)) return false;
      if (soloStock && p.stock <= 0) return false;
      if (!term) return true;
      return normalizar(`${p.nombre} ${p.resumen} ${p.sku} ${p.categoriaNombre}`).includes(term);
    });
    if (orden === 'precio-asc') out = [...out].sort((a, b) => a.precio - b.precio);
    if (orden === 'precio-desc') out = [...out].sort((a, b) => b.precio - a.precio);
    return out;
  }, [catalogo, q, cats, soloStock, orden]);

  function toggleCat(slug: string) {
    setCats((c) => (c.includes(slug) ? c.filter((x) => x !== slug) : [...c, slug]));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside className="grid h-fit gap-5">
        <label className="grid gap-1.5 text-[var(--text-sm)] font-semibold">
          Buscar
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="candado, morral, luz…"
            className="h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3"
          />
        </label>

        <fieldset className="grid gap-2">
          <legend className="text-[var(--text-sm)] font-semibold">Categoría</legend>
          {categorias.map((c) => (
            <label key={c.slug} className="flex items-center gap-2 text-[var(--text-sm)]">
              <input type="checkbox" checked={cats.includes(c.slug)} onChange={() => toggleCat(c.slug)} />
              {c.nombre}
            </label>
          ))}
        </fieldset>

        <label className="flex items-center gap-2 text-[var(--text-sm)]">
          <input type="checkbox" checked={soloStock} onChange={(e) => setSoloStock(e.target.checked)} />
          Solo disponibles
        </label>

        <label className="grid gap-1.5 text-[var(--text-sm)] font-semibold">
          Ordenar
          <select value={orden} onChange={(e) => setOrden(e.target.value as Orden)} className="h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3">
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </label>
      </aside>

      <div>
        <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]" aria-live="polite">
          {resultados.length} {resultados.length === 1 ? 'producto' : 'productos'}
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {resultados.map((p) => (
            <li key={p.id} className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <a href={p.ruta} className="font-semibold hover:underline">{p.nombre}</a>
              <p className="mt-1 flex-1 text-[var(--text-sm)] text-[var(--color-text-muted)]">{p.resumen}</p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <span className="font-display text-[var(--text-lg)] font-bold tabular-nums">{formatoCOP(p.precio)}</span>
                  {p.precioAntes && <span className="ml-2 text-[var(--text-xs)] text-[var(--color-text-muted)] line-through tabular-nums">{formatoCOP(p.precioAntes)}</span>}
                  <span className="block text-[var(--text-xs)] text-[var(--color-text-muted)]">{p.stock > 0 ? 'Disponible' : 'Agotado'}</span>
                </div>
                {p.stock > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      agregar({ sku: p.sku, nombre: p.nombre, precio: p.precio, categoria: p.categoria, ruta: p.ruta, imagen: p.imagen });
                      window.dispatchEvent(new CustomEvent('minicarrito:abrir'));
                    }}
                    className="min-h-9 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-3 text-[var(--text-xs)] font-semibold text-white"
                  >
                    Agregar
                  </button>
                ) : (
                  <span className="text-[var(--text-xs)] text-[var(--color-text-muted)]">—</span>
                )}
              </div>
            </li>
          ))}
        </ul>
        {resultados.length === 0 && (
          <p className="mt-8 text-[var(--text-sm)] text-[var(--color-text-muted)]">No hay productos con esos filtros.</p>
        )}
      </div>
    </div>
  );
}
