import { useEffect, useState } from 'react';

interface Direccion {
  id: string;
  etiqueta: string;
  linea: string;
  ciudad: string;
}

const inputCls =
  'h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[var(--text-base)]';

export default function MisDirecciones() {
  const [dirs, setDirs] = useState<Direccion[] | null>(null);
  const [etiqueta, setEtiqueta] = useState('');
  const [linea, setLinea] = useState('');
  const [ciudad, setCiudad] = useState('');

  useEffect(() => {
    try {
      setDirs(JSON.parse(localStorage.getItem('direcciones') || '[]'));
    } catch {
      setDirs([]);
    }
  }, []);

  function guardar(next: Direccion[]) {
    setDirs(next);
    try {
      localStorage.setItem('direcciones', JSON.stringify(next));
    } catch {
      /* sin persistencia */
    }
  }

  function agregar(e: React.FormEvent) {
    e.preventDefault();
    if (linea.trim().length < 5 || ciudad.trim().length < 2) return;
    guardar([
      ...(dirs ?? []),
      { id: crypto.randomUUID(), etiqueta: etiqueta.trim() || 'Dirección', linea: linea.trim(), ciudad: ciudad.trim() },
    ]);
    setEtiqueta('');
    setLinea('');
    setCiudad('');
  }

  if (dirs === null) return <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">Cargando…</p>;

  return (
    <>
      <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">Guardadas en este dispositivo para autocompletar el checkout.</p>

      {dirs.length > 0 && (
        <ul className="mt-6 grid gap-3">
          {dirs.map((d) => (
            <li key={d.id} className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
              <div>
                <p className="font-semibold">{d.etiqueta}</p>
                <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">{d.linea} — {d.ciudad}</p>
              </div>
              <button type="button" className="text-[var(--text-xs)] text-[var(--color-text-muted)] underline" onClick={() => guardar(dirs.filter((x) => x.id !== d.id))}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="mt-8 grid max-w-[32rem] gap-3" onSubmit={agregar}>
        <h2 className="font-display text-[var(--text-lg)] font-bold">Agregar dirección</h2>
        <input className={inputCls} placeholder="Etiqueta (Casa, Oficina…)" value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)} />
        <input className={inputCls} placeholder="Dirección" value={linea} onChange={(e) => setLinea(e.target.value)} />
        <input className={inputCls} placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
        <button type="submit" className="inline-flex min-h-11 w-fit items-center rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-5 font-semibold text-white">
          Guardar
        </button>
      </form>
    </>
  );
}
