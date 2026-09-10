import { useEffect, useMemo, useState } from 'react';
import { validarCobertura } from '../../data/mantenimiento';

/**
 * Agendador de mantenimiento en 4 pasos (docs/arquitectura §7).
 * Paso 1 selector de modalidad · Paso 2 datos de la ruta · Paso 3 fecha y hora ·
 * Paso 4 datos de contacto.
 *
 * Regla crítica: en la ruta domicilio la cobertura se valida en el paso 2,
 * ANTES de pedir cualquier dato personal (el paso 4).
 */
type Modalidad = 'empresa' | 'taller' | 'domicilio';

interface Props {
  /** Modalidad preseleccionada desde ?m= en la URL. */
  modalidadInicial?: Modalidad | null;
  tel: string;
  whatsappHref: string;
}

const MODALIDADES: { id: Modalidad; titulo: string; desc: string }[] = [
  { id: 'empresa', titulo: 'En mi empresa', desc: 'Jornada en la sede para las bicicletas del equipo.' },
  { id: 'taller', titulo: 'En el taller', desc: 'Llevas la bici y la recoges lista.' },
  { id: 'domicilio', titulo: 'En mi casa', desc: 'Un técnico se desplaza. Validamos cobertura primero.' },
];

const TIPOS_SERVICIO = ['Puesta a punto', 'Alistamiento pre-salida', 'Frenos y cambios', 'Revisión de bici eléctrica', 'Otro'];
const FRANJAS = ['Mañana (8:00–12:00)', 'Tarde (12:00–17:00)'];

const hoyISO = () => new Date().toISOString().slice(0, 10);
const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RE_TEL = /^[+()\d\s-]{7,20}$/;

const inputCls =
  'h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[var(--text-base)]';
const labelCls = 'grid gap-1.5 text-[var(--text-sm)] font-semibold';

export default function Agendador({ modalidadInicial = null, tel, whatsappHref }: Props) {
  const [paso, setPaso] = useState(modalidadInicial ? 2 : 1);
  const [modalidad, setModalidad] = useState<Modalidad | null>(modalidadInicial);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const TITULO_ID = 'agendador-paso-titulo';

  // Paso 2 — datos de la ruta
  const [numBicis, setNumBicis] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [sede, setSede] = useState('');
  const [tipoServicio, setTipoServicio] = useState('');
  const [consultaCobertura, setConsultaCobertura] = useState('');
  const [cobertura, setCobertura] = useState<{ estado: 'pendiente' | 'ok' | 'fuera'; zona?: string }>({
    estado: 'pendiente',
  });

  // Paso 3 — fecha y hora
  const [fecha, setFecha] = useState('');
  const [franja, setFranja] = useState('');

  // Paso 4 — contacto
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [honey, setHoney] = useState('');

  // La página es estática: la modalidad de ?m= se lee en el cliente al montar.
  useEffect(() => {
    if (modalidad) return;
    const m = new URLSearchParams(window.location.search).get('m');
    if (m === 'empresa' || m === 'taller' || m === 'domicilio') {
      setModalidad(m);
      setPaso(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.getElementById(TITULO_ID)?.focus();
  }, [paso]);

  function comprobarCobertura() {
    const r = validarCobertura(consultaCobertura);
    setCobertura(r.cubierto ? { estado: 'ok', zona: r.match } : { estado: 'fuera' });
  }

  const paso2Valido = useMemo(() => {
    if (modalidad === 'empresa') return Number(numBicis) >= 1 && ciudad.trim().length > 1;
    if (modalidad === 'taller') return tipoServicio !== '';
    if (modalidad === 'domicilio') return cobertura.estado === 'ok';
    return false;
  }, [modalidad, numBicis, ciudad, tipoServicio, cobertura]);

  const paso3Valido = useMemo(() => {
    if (!fecha || fecha < hoyISO()) return false;
    if (modalidad === 'empresa') return true; // fecha tentativa, sin franja
    return franja !== '';
  }, [fecha, franja, modalidad]);

  const paso4Valido = useMemo(() => {
    const base = nombre.trim().length > 1 && RE_CORREO.test(correo) && RE_TEL.test(telefono);
    if (modalidad === 'empresa') return base && empresa.trim().length > 1;
    if (modalidad === 'domicilio') return base && direccion.trim().length > 4;
    return base;
  }, [nombre, correo, telefono, empresa, direccion, modalidad]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!paso4Valido || enviando) return;
    setEnviando(true);
    setErrorEnvio('');

    const fd = new FormData();
    fd.set('modalidad', modalidad!);
    fd.set('empresa_web', honey);
    fd.set('fecha', fecha);
    fd.set('nombre', nombre);
    fd.set('correo', correo);
    fd.set('telefono', telefono);
    if (modalidad === 'empresa') {
      fd.set('numBicis', numBicis);
      fd.set('ciudad', ciudad);
      fd.set('sede', sede);
      fd.set('empresa', empresa);
    } else if (modalidad === 'taller') {
      fd.set('tipoServicio', tipoServicio);
      fd.set('franja', franja);
    } else {
      fd.set('cobertura', cobertura.zona ?? consultaCobertura);
      fd.set('franja', franja);
      fd.set('direccion', direccion);
    }

    try {
      const res = await fetch('/api/agendar', { method: 'POST', body: fd });
      const data = (await res.json()) as { ok: boolean };
      if (data.ok) {
        window.location.href = `/mantenimiento/agendar/confirmado?m=${modalidad}`;
        return;
      }
      setErrorEnvio('No pudimos registrar el agendamiento. Revisa los datos e inténtalo de nuevo.');
    } catch {
      setErrorEnvio('Hubo un problema de conexión. Inténtalo de nuevo en un momento.');
    }
    setEnviando(false);
  }

  const totalPasos = 4;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
      <p className="font-mono text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-muted)]">
        Paso {paso} de {totalPasos}
      </p>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: totalPasos }, (_, i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{ background: i < paso ? 'var(--color-primary-600)' : 'var(--color-border)' }}
          />
        ))}
      </div>

      {/* ---------- Paso 1 · Modalidad ---------- */}
      {paso === 1 && (
        <fieldset className="mt-6">
          <legend className="text-[var(--text-xl)] font-bold" tabIndex={-1} id="agendador-paso-titulo">
            ¿Dónde necesitas el servicio?
          </legend>
          <div className="mt-4 grid gap-3">
            {MODALIDADES.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-4 ${
                  modalidad === m.id
                    ? 'border-[var(--color-primary-600)] bg-[var(--color-primary-50)]'
                    : 'border-[var(--color-border)]'
                }`}
              >
                <input
                  type="radio"
                  name="modalidad"
                  className="mt-1"
                  checked={modalidad === m.id}
                  onChange={() => setModalidad(m.id)}
                />
                <span>
                  <span className="block font-semibold">{m.titulo}</span>
                  <span className="block text-[var(--text-sm)] text-[var(--color-text-muted)]">{m.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* ---------- Paso 2 · Datos de la ruta ---------- */}
      {paso === 2 && (
        <div className="mt-6 grid gap-4">
          <h2 className="text-[var(--text-xl)] font-bold" tabIndex={-1} id="agendador-paso-titulo">
            {modalidad === 'empresa' && 'Datos de la jornada'}
            {modalidad === 'taller' && 'Qué necesita tu bicicleta'}
            {modalidad === 'domicilio' && '¿Llegamos a tu zona?'}
          </h2>

          {modalidad === 'empresa' && (
            <>
              <label className={labelCls}>
                Número de bicicletas (aproximado)
                <input type="number" min={1} className={inputCls} value={numBicis} onChange={(e) => setNumBicis(e.target.value)} />
              </label>
              <label className={labelCls}>
                Ciudad
                <input type="text" className={inputCls} value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
              </label>
              <label className={labelCls}>
                Sede o dirección (opcional)
                <input type="text" className={inputCls} value={sede} onChange={(e) => setSede(e.target.value)} />
              </label>
            </>
          )}

          {modalidad === 'taller' && (
            <fieldset className="grid gap-2">
              <legend className="text-[var(--text-sm)] font-semibold">Tipo de servicio</legend>
              {TIPOS_SERVICIO.map((t) => (
                <label key={t} className="flex items-center gap-2 text-[var(--text-sm)]">
                  <input type="radio" name="tipoServicio" checked={tipoServicio === t} onChange={() => setTipoServicio(t)} />
                  {t}
                </label>
              ))}
            </fieldset>
          )}

          {modalidad === 'domicilio' && (
            <>
              <label className={labelCls}>
                Tu localidad o barrio
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="Ej.: Chapinero, Usaquén, Cajicá"
                    value={consultaCobertura}
                    onChange={(e) => {
                      setConsultaCobertura(e.target.value);
                      setCobertura({ estado: 'pendiente' });
                    }}
                  />
                  <button
                    type="button"
                    onClick={comprobarCobertura}
                    className="shrink-0 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-4 font-semibold text-white"
                  >
                    Validar
                  </button>
                </div>
              </label>
              <p aria-live="polite" className="text-[var(--text-sm)]">
                {cobertura.estado === 'ok' && (
                  <span className="text-[var(--color-success-500)]">
                    Sí llegamos a {cobertura.zona}. Continúa para elegir fecha.
                  </span>
                )}
                {cobertura.estado === 'fuera' && (
                  <span className="text-[var(--color-text-muted)]">
                    Todavía no tenemos cobertura ahí. Puedes usar el{' '}
                    <a className="font-semibold text-[var(--color-link)] underline" href="/mantenimiento/taller">
                      taller
                    </a>{' '}
                    o escribirnos por WhatsApp.
                  </span>
                )}
              </p>
              <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                No pedimos tus datos hasta confirmar que hay cobertura.
              </p>
            </>
          )}
        </div>
      )}

      {/* ---------- Paso 3 · Fecha y hora ---------- */}
      {paso === 3 && (
        <div className="mt-6 grid gap-4">
          <h2 className="text-[var(--text-xl)] font-bold" tabIndex={-1} id="agendador-paso-titulo">
            {modalidad === 'empresa' ? 'Fecha tentativa' : 'Fecha y hora'}
          </h2>
          <label className={labelCls}>
            {modalidad === 'empresa' ? 'Fecha tentativa de la jornada' : 'Fecha'}
            <input type="date" min={hoyISO()} className={inputCls} value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </label>
          {modalidad !== 'empresa' && (
            <fieldset className="grid gap-2">
              <legend className="text-[var(--text-sm)] font-semibold">Franja horaria</legend>
              {FRANJAS.map((f) => (
                <label key={f} className="flex items-center gap-2 text-[var(--text-sm)]">
                  <input type="radio" name="franja" checked={franja === f} onChange={() => setFranja(f)} />
                  {f}
                </label>
              ))}
            </fieldset>
          )}
          {modalidad === 'empresa' && (
            <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
              Confirmamos el cronograma definitivo según el número de bicicletas inscritas.
            </p>
          )}
        </div>
      )}

      {/* ---------- Paso 4 · Contacto ---------- */}
      {paso === 4 && (
        <form className="mt-6 grid gap-4" onSubmit={enviar}>
          <h2 className="text-[var(--text-xl)] font-bold" tabIndex={-1} id="agendador-paso-titulo">
            Tus datos
          </h2>
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
          />
          <label className={labelCls}>
            Nombre
            <input type="text" autoComplete="name" className={inputCls} value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </label>
          {modalidad === 'empresa' && (
            <label className={labelCls}>
              Empresa
              <input type="text" autoComplete="organization" className={inputCls} value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
            </label>
          )}
          <label className={labelCls}>
            Correo
            <input type="email" autoComplete="email" className={inputCls} value={correo} onChange={(e) => setCorreo(e.target.value)} />
          </label>
          <label className={labelCls}>
            Teléfono
            <input type="tel" autoComplete="tel" className={inputCls} value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </label>
          {modalidad === 'domicilio' && (
            <label className={labelCls}>
              Dirección exacta
              <input type="text" autoComplete="street-address" className={inputCls} value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            </label>
          )}

          {errorEnvio && (
            <p role="alert" className="text-[var(--text-sm)] text-[var(--color-danger-500)]">
              {errorEnvio}
            </p>
          )}

          <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
            Al confirmar aceptas la{' '}
            <a className="underline" href="/legal/tratamiento-datos">
              política de tratamiento de datos
            </a>
            .
          </p>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setPaso(3)} className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] px-5 font-semibold">
              Atrás
            </button>
            <button
              type="submit"
              disabled={!paso4Valido || enviando}
              className="min-h-11 rounded-[var(--radius-md)] bg-[var(--color-accent-300)] px-6 font-semibold text-[var(--color-neutral-900)] disabled:opacity-50"
            >
              {enviando ? 'Enviando…' : 'Confirmar agendamiento'}
            </button>
          </div>
        </form>
      )}

      {/* ---------- Navegación (pasos 1–3) ---------- */}
      {paso < 4 && (
        <div className="mt-8 flex flex-wrap gap-3">
          {paso > 1 && (
            <button
              type="button"
              onClick={() => setPaso((p) => p - 1)}
              className="min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] px-5 font-semibold"
            >
              Atrás
            </button>
          )}
          <button
            type="button"
            onClick={() => setPaso((p) => p + 1)}
            disabled={(paso === 1 && !modalidad) || (paso === 2 && !paso2Valido) || (paso === 3 && !paso3Valido)}
            className="min-h-11 rounded-[var(--radius-md)] bg-[var(--color-primary-700)] px-6 font-semibold text-white disabled:opacity-50"
          >
            Continuar
          </button>
        </div>
      )}

      <p className="mt-6 border-t border-[var(--color-border)] pt-4 text-[var(--text-xs)] text-[var(--color-text-muted)]">
        ¿Prefieres hablar con alguien? Llama al {tel} o escríbenos por{' '}
        <a className="underline" href={whatsappHref} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
