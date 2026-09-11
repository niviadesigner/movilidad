/**
 * Contenido de /recursos/normativa. Página de autoridad SEO (prioridad alta,
 * arquitectura §3) — es la que trae tráfico de quien busca si está obligado
 * a tener biciparqueadero.
 *
 * Regla §8: cada cifra lleva fuente. Aquí las fuentes son las normas mismas.
 * Es contenido informativo, no asesoría legal — se lo advertimos al lector y
 * lo llevamos a cotizar para resolver su caso puntual.
 */
import type { ItemFAQ } from '../components/ui/FAQ.astro';

export interface BloqueNormativo {
  norma: string;
  vigencia: string;
  resumen: string;
  aplicaA: string;
  puntoClave: string;
}

export const NORMAS: BloqueNormativo[] = [
  {
    norma: 'Ley 1811 de 2016',
    vigencia: 'Vigente desde el 21 de octubre de 2016',
    resumen:
      'Otorga incentivos para promover el uso de la bicicleta como medio de transporte en Colombia.',
    aplicaA: 'Entidades públicas y empresas privadas, según su número de trabajadores.',
    puntoClave:
      'Obliga a construir biciparqueaderos —y, donde sea posible, duchas y vestieres— para quienes lleguen en bicicleta. El umbral de trabajadores y los plazos están en el texto de la ley y su reglamentación.',
  },
  {
    norma: 'PESV — Plan Estratégico de Seguridad Vial',
    vigencia: 'Ley 1503 de 2011, reglamentado por el Ministerio de Transporte',
    resumen:
      'Exige a empresas con flota de vehículos o personal que se moviliza por motivo de trabajo un plan de seguridad vial.',
    aplicaA: 'Empresas obligadas según su tamaño y tipo de flota.',
    puntoClave:
      'El PESV incluye promover modos de transporte más seguros. La infraestructura para bicicleta suele quedar como una de las medidas del plan, con seguimiento y auditoría.',
  },
  {
    norma: 'POT — Plan de Ordenamiento Territorial',
    vigencia: 'Uno por municipio; se actualiza cada cierto número de años',
    resumen:
      'Cada municipio fija, en su propio POT, cupos mínimos de estacionamiento para bicicletas en construcciones nuevas y en cambios de uso.',
    aplicaA: 'Constructoras, arquitectos y propietarios que construyen o remodelan.',
    puntoClave:
      'La exigencia varía por municipio y por uso del predio (oficina, vivienda, comercio). No hay una cifra única nacional: hay que revisar el POT del municipio del proyecto.',
  },
];

export const FAQ_NORMATIVA: ItemFAQ[] = [
  {
    pregunta: '¿Mi empresa está obligada a tener biciparqueadero?',
    respuesta:
      'Depende de tu número de trabajadores y de si aplicas a la Ley 1811. Cuéntanos tu caso en la cotización y te confirmamos si te aplica.',
  },
  {
    pregunta: '¿Cuántos cupos exige la norma?',
    respuesta:
      'La Ley 1811 no fija una cifra nacional única; el POT de cada municipio sí puede exigir un mínimo según el uso del predio. Usa la calculadora para una estimación y confírmala con tu curaduría o planeación municipal.',
  },
  {
    pregunta: '¿El PESV me obliga a instalar biciparqueaderos?',
    respuesta:
      'El PESV te obliga a tener un plan de seguridad vial; promover la bicicleta con infraestructura segura es una de las medidas más comunes para cumplirlo, pero no siempre es obligatoria por sí sola. Te ayudamos a revisar tu plan.',
  },
  {
    pregunta: '¿Esta página reemplaza una asesoría legal?',
    respuesta:
      'No. Es información general para orientarte. Para tu caso puntual, cotiza y lo revisamos con detalle.',
  },
];
