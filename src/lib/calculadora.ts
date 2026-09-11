/**
 * Calculadora de cupos (/recursos/calculadora-cupos).
 * Da un estimado orientativo para planear el proyecto, NO la cifra oficial que
 * exige el POT de cada municipio — esa se confirma en la cotización.
 *
 * Proporciones de referencia, no una norma. TODO: afinar con datos reales de
 * proyectos ejecutados cuando existan.
 */

export type TipoEspacio = 'oficina' | 'educativo' | 'residencial' | 'publico';

export interface OpcionTipoEspacio {
  id: TipoEspacio;
  label: string;
  unidad: string;
  familia: 'corporativo' | 'institucional' | 'residencial' | 'mobiliario-urbano';
  /** Proporción de cupos por unidad de entrada (personas o unidades de vivienda). */
  proporcion: number;
  minimo: number;
}

export const TIPOS_ESPACIO: OpcionTipoEspacio[] = [
  { id: 'oficina', label: 'Oficina o sede de empresa', unidad: 'empleados', familia: 'corporativo', proporcion: 0.06, minimo: 4 },
  { id: 'educativo', label: 'Institución educativa', unidad: 'estudiantes y personal', familia: 'institucional', proporcion: 0.08, minimo: 10 },
  { id: 'residencial', label: 'Conjunto residencial', unidad: 'unidades de vivienda', familia: 'residencial', proporcion: 0.3, minimo: 6 },
  { id: 'publico', label: 'Espacio público o comercio', unidad: 'visitantes por hora pico', familia: 'mobiliario-urbano', proporcion: 0.15, minimo: 6 },
];

export interface EstimacionCupos {
  minimo: number;
  recomendado: number;
  familiaSugerida: OpcionTipoEspacio['familia'];
}

export function estimarCupos(tipo: TipoEspacio, personas: number): EstimacionCupos | null {
  const opcion = TIPOS_ESPACIO.find((t) => t.id === tipo);
  if (!opcion || !Number.isFinite(personas) || personas <= 0) return null;

  const base = personas * opcion.proporcion;
  const minimo = Math.max(opcion.minimo, Math.round(base * 0.7));
  const recomendado = Math.max(minimo + 1, Math.round(base));

  return { minimo, recomendado, familiaSugerida: opcion.familia };
}
