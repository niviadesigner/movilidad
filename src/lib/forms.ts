/**
 * Validación de formularios del sitio, sin dependencias.
 * Regla §7: el formulario de cotización tiene máximo 5 campos.
 */

export interface ResultadoValidacion<T> {
  ok: boolean;
  datos?: T;
  errores: Record<string, string>;
  /** true si se activó la trampa anti-bots (tratar como éxito silencioso). */
  bot?: boolean;
}

const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RE_TEL = /^[+()\d\s-]{7,20}$/;

function limpio(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : '';
}

export interface DatosCotizacion {
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  cupos: string;
}

export function validarCotizacion(fd: FormData): ResultadoValidacion<DatosCotizacion> {
  // Trampa: campo oculto que solo un bot rellena.
  if (limpio(fd.get('empresa_web'))) {
    return { ok: true, bot: true, errores: {} };
  }

  const datos: DatosCotizacion = {
    nombre: limpio(fd.get('nombre')),
    empresa: limpio(fd.get('empresa')),
    correo: limpio(fd.get('correo')),
    telefono: limpio(fd.get('telefono')),
    cupos: limpio(fd.get('cupos')),
  };

  const errores: Record<string, string> = {};
  if (datos.nombre.length < 2) errores.nombre = 'Escribe tu nombre.';
  if (datos.empresa.length < 2) errores.empresa = 'Escribe el nombre de la empresa.';
  if (!RE_CORREO.test(datos.correo)) errores.correo = 'Revisa el correo.';
  if (!RE_TEL.test(datos.telefono)) errores.telefono = 'Revisa el teléfono.';
  if (!datos.cupos || Number(datos.cupos) <= 0) errores.cupos = 'Indica un número aproximado de cupos.';

  return { ok: Object.keys(errores).length === 0, datos, errores };
}

export interface DatosFicha {
  correo: string;
  modeloId: string;
  modeloNombre: string;
  origen: string;
}

export function validarFicha(fd: FormData): ResultadoValidacion<DatosFicha> {
  if (limpio(fd.get('empresa_web'))) {
    return { ok: true, bot: true, errores: {} };
  }
  const datos: DatosFicha = {
    correo: limpio(fd.get('correo')),
    modeloId: limpio(fd.get('modeloId')),
    modeloNombre: limpio(fd.get('modeloNombre')),
    origen: limpio(fd.get('origen')),
  };
  const errores: Record<string, string> = {};
  if (!RE_CORREO.test(datos.correo)) errores.correo = 'Revisa el correo.';
  if (!datos.modeloId) errores.modeloId = 'Falta el modelo.';
  return { ok: Object.keys(errores).length === 0, datos, errores };
}
