/**
 * Contenido de la línea Mantenimiento (hub + servicios + planes + cobertura).
 * Contenido en datos, no en los .astro (regla §6).
 *
 * Copy provisional de estructura. Sin precios ni nombres de clientes inventados.
 */
import type { ContenidoHub } from './biciparqueaderos';
import type { Paso } from '../components/ui/Pasos.astro';
import type { ItemFAQ } from '../components/ui/FAQ.astro';
import { whatsappUrl } from '../lib/site';

const CTA_AGENDAR = { label: 'Agendar ahora', href: '/mantenimiento/agendar' };

/* -------------------------------------------------------------- HUB (A) ---- */

const FAQ_HUB: ItemFAQ[] = [
  {
    pregunta: '¿Qué incluye un mantenimiento básico?',
    respuesta:
      'Revisión general, ajuste de frenos y cambios, lubricación de transmisión, apriete de tornillería y revisión de llantas. El detalle exacto va en cada plan.',
  },
  {
    pregunta: '¿Trabajan con cualquier tipo de bicicleta?',
    respuesta:
      'Sí: urbanas, de ruta, montaña y eléctricas. Para eléctricas revisamos también el sistema de asistencia.',
  },
  {
    pregunta: '¿Los repuestos están incluidos?',
    respuesta:
      'La mano de obra sí. Los repuestos se cotizan aparte según lo que necesite cada bicicleta, con tu autorización previa.',
  },
  {
    pregunta: '¿Cuánto se demora?',
    respuesta:
      'Un mantenimiento estándar toma el mismo día. En jornadas y flotas se define un cronograma por volumen.',
  },
];

export const HUB: ContenidoHub = {
  eyebrow: 'Línea 2 · Mantenimiento',
  titulo: 'Mantenimiento de bicicletas, donde te sirva',
  intro:
    'Servicio recurrente en tres modalidades: jornadas en la sede de tu empresa, en nuestro taller o a domicilio. Se agenda en línea y se confirma en el momento.',
  ctaPrimario: CTA_AGENDAR,
  ctaSecundario: { label: 'Ver planes y precios', href: '/mantenimiento/planes' },
  imagenHero: { src: '/images/mantenimiento.jpg', alt: 'Técnico ajustando la transmisión de una bicicleta en el taller' },
  selector: {
    titulo: '¿Dónde necesitas el servicio?',
    items: [
      { titulo: 'En mi empresa', texto: 'Jornada en sede para las bicicletas del equipo.', href: '/mantenimiento/jornadas-empresariales', icono: 'maletin' },
      { titulo: 'Flota de la empresa', texto: 'Plan recurrente con reporte por unidad.', href: '/mantenimiento/flotas', icono: 'camion' },
      { titulo: 'En el taller', texto: 'Dejas la bici y la recoges lista el mismo día.', href: '/mantenimiento/taller', icono: 'herramienta' },
      { titulo: 'En mi casa', texto: 'Un técnico se desplaza, previa validación de cobertura.', href: '/mantenimiento/domicilio', icono: 'casa' },
    ],
  },
  pasos: {
    titulo: 'Cómo funciona',
    items: [
      { titulo: 'Eliges dónde', texto: 'En tu empresa, en el taller o a domicilio.' },
      { titulo: 'Das los datos de la ruta', texto: 'Número de bicis, tipo de servicio o validación de cobertura.' },
      { titulo: 'Reservas fecha y hora', texto: 'O una fecha tentativa para jornadas y flotas.' },
      { titulo: 'Confirmas', texto: 'Recibes la confirmación con el resumen y el canal de contacto.' },
    ],
  },
  ventaCruzada: {
    titulo: 'Esto también te va a servir',
    items: [
      { label: 'Lámina PPF', texto: 'Protege el cuadro de tu bicicleta o moto de rayones y golpes.', href: '/mantenimiento/laminado-ppf' },
      { label: 'Suspensiones (próximamente)', texto: 'Servicio técnico especializado, en desarrollo. Avísanos si te interesa.', href: '/mantenimiento/suspensiones' },
      { label: 'Biciparqueaderos', texto: 'Si vas a promover la bici en la empresa, empieza por dónde guardarlas.', href: '/biciparqueaderos' },
      { label: 'Guayas y candados', texto: 'Seguridad para dejar la bici tranquila.', href: '/tienda/seguridad' },
      { label: 'Accesorios', texto: 'Luces, guardabarros e infladores para el día a día.', href: '/tienda/accesorios' },
    ],
  },
  faq: { titulo: 'Preguntas frecuentes de mantenimiento', items: FAQ_HUB },
  cierre: {
    titulo: 'Agenda tu mantenimiento',
    texto: 'Eliges la modalidad, das los datos de esa ruta y confirmas. Toma un par de minutos.',
    cta: CTA_AGENDAR,
  },
};

/* --------------------------------------------------- SERVICIOS (C) -------- */

export interface ContenidoServicio {
  eyebrow: string;
  titulo: string;
  intro: string;
  paraQuien: string;
  incluye: string[];
  tiempos: string;
  /** CTA principal: agendar (con modalidad) o cotizar para rutas B2B. */
  cta: { label: string; href: string };
  ctaSecundario?: { label: string; href: string };
  /** Aviso destacado (p. ej. cobertura previa en domicilio). */
  aviso?: string;
  pasos?: Paso[];
  faq: ItemFAQ[];
}

const PASOS_AGENDA_INSTANTE: Paso[] = [
  { titulo: 'Eliges el servicio', texto: 'Puesta a punto, alistamiento o revisión específica.' },
  { titulo: 'Reservas fecha y hora', texto: 'Ves la disponibilidad y eliges el turno.' },
  { titulo: 'Dejas tus datos', texto: 'Nombre, contacto y detalle de la bicicleta.' },
  { titulo: 'Confirmas', texto: 'Recibes la confirmación con el resumen.' },
];

export const SERVICIOS: Record<string, ContenidoServicio> = {
  'jornadas-empresariales': {
    eyebrow: 'Mantenimiento · Empresas',
    titulo: 'Jornadas de mantenimiento en tu sede',
    intro:
      'Montamos el taller en la sede un día pactado y atendemos las bicicletas de los colaboradores, una por una, con reporte del estado de cada una.',
    paraQuien: 'Empresas con plan de movilidad, semana de la bici o beneficio para el equipo.',
    incluye: [
      'Estación de trabajo montada en la sede',
      'Revisión general por bicicleta',
      'Ajuste de frenos, cambios y transmisión',
      'Lubricación y apriete de tornillería',
      'Reporte del estado de cada bicicleta',
      'Cotización de repuestos, si hacen falta, con autorización previa',
    ],
    tiempos: 'Se define un cronograma según el número de bicicletas inscritas.',
    cta: { label: 'Agendar jornada', href: '/mantenimiento/agendar?m=empresa' },
    ctaSecundario: { label: 'Cotizar para mi empresa', href: '/cotizar' },
    faq: FAQ_HUB.slice(0, 3),
  },

  flotas: {
    eyebrow: 'Mantenimiento · Empresas',
    titulo: 'Planes de mantenimiento para flotas',
    intro:
      'Mantenimiento recurrente para flotas corporativas y de última milla, con acuerdo de servicio y un tablero del estado de cada bicicleta.',
    paraQuien: 'Empresas con flota propia de reparto, mensajería o uso interno.',
    incluye: [
      'Visitas programadas según frecuencia acordada',
      'Historial y estado por unidad',
      'Prioridad de atención ante fallas',
      'Cotización mensual de repuestos consolidada',
      'Interlocución única',
    ],
    tiempos: 'Frecuencia mensual, quincenal o a demanda, según el uso de la flota.',
    cta: { label: 'Cotizar plan de flota', href: '/cotizar' },
    ctaSecundario: { label: 'Ver comparativo de planes', href: '/mantenimiento/planes' },
    aviso: 'Las flotas se cotizan a la medida: el plan depende del número de bicicletas y de la frecuencia.',
    faq: FAQ_HUB.slice(0, 3),
  },

  taller: {
    eyebrow: 'Mantenimiento · Personas',
    titulo: 'Taller de bicicletas',
    intro:
      'Llevas tu bicicleta al taller, eliges el tipo de servicio y la hora. La mayoría de servicios quedan listos el mismo día.',
    paraQuien: 'Cualquier persona con una bicicleta urbana, de ruta, montaña o eléctrica.',
    incluye: [
      'Diagnóstico al recibir la bicicleta',
      'Puesta a punto o servicio específico, según elijas',
      'Prueba de rodaje antes de entregar',
      'Repuestos con tu autorización previa',
    ],
    tiempos: 'Servicio estándar el mismo día. Reparaciones mayores, 2 a 3 días.',
    cta: { label: 'Agendar en el taller', href: '/mantenimiento/agendar?m=taller' },
    pasos: PASOS_AGENDA_INSTANTE,
    faq: FAQ_HUB.slice(1, 4),
  },

  domicilio: {
    eyebrow: 'Mantenimiento · Personas',
    titulo: 'Mantenimiento a domicilio',
    intro:
      'Un técnico va a tu casa con las herramientas. Primero confirmas que llegamos a tu zona; solo después pedimos tus datos.',
    paraQuien: 'Personas y conjuntos dentro de las zonas con cobertura.',
    incluye: [
      'Desplazamiento del técnico con herramienta',
      'Puesta a punto en sitio',
      'Ajustes de frenos, cambios y transmisión',
      'Repuestos menores frecuentes disponibles; el resto se agenda',
    ],
    tiempos: 'Ventanas de 2 horas. La duración del servicio en sitio es de 45 a 90 minutos.',
    cta: { label: 'Validar cobertura y agendar', href: '/mantenimiento/agendar?m=domicilio' },
    ctaSecundario: { label: 'Ver zonas con cobertura', href: '/mantenimiento/cobertura' },
    aviso: 'La cobertura se valida ANTES de pedir cualquier dato personal.',
    faq: FAQ_HUB.slice(1, 4),
  },

  ppf: {
    eyebrow: 'Mantenimiento · Protección',
    titulo: 'Lámina PPF para cuadros de bicicleta y motocicleta',
    intro:
      'Instalamos lámina protectora PPF en cuadros de bicicleta y en motocicletas, en nuestro taller o a domicilio, para proteger la pintura de rayones y golpes del uso diario.',
    paraQuien: 'Ciclistas y motociclistas que quieren proteger su cuadro o carrocería.',
    incluye: [
      'Revisión inicial de la pieza a proteger',
      'Lámina de clase media TPH (híbrido de PVC y TPU)',
      'Lámina de clase premium TPU',
      'Instalación en taller, o recogida y entrega a domicilio',
      'Confirmación del trabajo antes de empezar',
    ],
    tiempos: 'Se confirman en la revisión inicial, según la pieza y el tipo de lámina.',
    cta: { label: 'Solicitar servicio PPF', href: '/cotizar' },
    ctaSecundario: { label: 'Preguntar por WhatsApp', href: whatsappUrl('mantenimiento') },
    pasos: [
      { titulo: 'Nos cuentas', texto: 'Qué bicicleta o moto y qué zonas quieres proteger.' },
      { titulo: 'Eliges la lámina', texto: 'Clase media (TPH) o premium (TPU).' },
      { titulo: 'Confirmamos', texto: 'Alcance y valor por escrito antes de empezar.' },
      { titulo: 'Instalamos', texto: 'En el taller, o con recogida y entrega a domicilio.' },
    ],
    faq: [
      { pregunta: '¿Qué diferencia hay entre TPH y TPU?', respuesta: 'TPH es un híbrido de PVC y TPU (clase media); TPU es la clase premium. Te recomendamos según tu caso en la revisión inicial.' },
      { pregunta: '¿Puedo dejar la bicicleta o la moto en el taller?', respuesta: 'Sí, o pedir recogida y entrega a domicilio.' },
      { pregunta: '¿Cómo se agenda?', respuesta: 'Por ahora, con la solicitud o por WhatsApp; confirmamos el trabajo antes de empezar.' },
    ],
  },

  suspensiones: {
    eyebrow: 'Mantenimiento · Próximamente',
    titulo: 'Mantenimiento especializado de suspensiones',
    intro:
      'Estamos preparando un servicio técnico para suspensiones de bicicleta. Todavía no lo ofrecemos; si te interesa, avísanos y te contamos cuando esté listo.',
    paraQuien: 'Ciclistas con suspensión que quieren un servicio técnico especializado.',
    incluye: [
      'Marcas atendidas, tipos de servicio, tiempos y precios orientativos: por definir',
      'Proceso de recepción: por definir',
    ],
    tiempos: 'Aún no disponible.',
    aviso: 'Próximamente. Lo publicaremos cuando el servicio esté realmente listo.',
    cta: { label: 'Avísame cuando esté listo', href: whatsappUrl('mantenimiento') },
    ctaSecundario: { label: 'Ver mantenimiento disponible', href: '/mantenimiento' },
    faq: [
      { pregunta: '¿Ya puedo agendar este servicio?', respuesta: 'Todavía no. Es una línea en desarrollo; escríbenos y te avisamos.' },
    ],
  },
};

/* --------------------------------------------------------- PLANES --------- */

export interface FilaPlan {
  caracteristica: string;
  /** Un valor por plan, en el mismo orden que PLANES. */
  valores: (boolean | string)[];
}

export const PLANES = ['Puesta a punto', 'Plan Rueda', 'Plan Flota'] as const;

export const PLANES_DESC: Record<(typeof PLANES)[number], string> = {
  'Puesta a punto': 'Servicio único, para dejar la bici lista.',
  'Plan Rueda': 'Mantenimiento periódico para una bicicleta de uso diario.',
  'Plan Flota': 'Acuerdo de servicio para varias bicicletas de una empresa.',
};

// TODO: reemplazar con la matriz y los precios reales del cliente.
export const PLANES_FILAS: FilaPlan[] = [
  { caracteristica: 'Revisión general', valores: [true, true, true] },
  { caracteristica: 'Ajuste de frenos y cambios', valores: [true, true, true] },
  { caracteristica: 'Lubricación de transmisión', valores: [true, true, true] },
  { caracteristica: 'Apriete de tornillería', valores: [true, true, true] },
  { caracteristica: 'Limpieza profunda', valores: [false, true, true] },
  { caracteristica: 'Revisión de rodamientos', valores: [false, true, true] },
  { caracteristica: 'Reporte por unidad', valores: [false, false, true] },
  { caracteristica: 'Prioridad ante fallas', valores: [false, false, true] },
  { caracteristica: 'Frecuencia', valores: ['Una vez', 'Cada 2 meses', 'A convenir'] },
  { caracteristica: 'Modalidad', valores: ['Taller o domicilio', 'Taller o domicilio', 'En sede'] },
  { caracteristica: 'Precio', valores: ['Pendiente', 'Pendiente', 'A cotizar'] },
];

/* ------------------------------------------------------- COBERTURA -------- */

export interface ZonaCobertura {
  ciudad: string;
  zonas: string[];
}

// TODO: reemplazar con las zonas reales de cobertura del cliente.
export const COBERTURA: ZonaCobertura[] = [
  {
    ciudad: 'Bogotá',
    zonas: [
      'Usaquén',
      'Chapinero',
      'Santa Fe',
      'Teusaquillo',
      'Barrios Unidos',
      'Suba (oriente)',
      'Engativá (norte)',
      'Fontibón',
      'Puente Aranda',
      'Kennedy (norte)',
    ],
  },
  {
    ciudad: 'Chía',
    zonas: ['Casco urbano'],
  },
  {
    ciudad: 'Cajicá',
    zonas: ['Casco urbano'],
  },
];

/**
 * ¿La consulta coincide con alguna zona con cobertura?
 * Coincidencia laxa por nombre de zona o ciudad. Los códigos postales se
 * conectarán cuando exista la tabla real.
 */
const DIACRITICOS = /[̀-ͯ]/g;
const sinTildes = (s: string) => s.toLowerCase().normalize('NFD').replace(DIACRITICOS, '').trim();

export function validarCobertura(consulta: string): { cubierto: boolean; match?: string } {
  const q = sinTildes(consulta);
  if (q.length < 3) return { cubierto: false };

  for (const c of COBERTURA) {
    const ciudad = sinTildes(c.ciudad);
    if (q.includes(ciudad) || ciudad.includes(q)) return { cubierto: true, match: c.ciudad };
    for (const z of c.zonas) {
      const zona = sinTildes(z);
      if (q.includes(zona) || zona.includes(q)) return { cubierto: true, match: `${z}, ${c.ciudad}` };
    }
  }
  return { cubierto: false };
}
