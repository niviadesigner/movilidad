/**
 * Contenido de la línea Biciparqueaderos (hub + 4 sectores).
 * El contenido vive aquí, no incrustado en los .astro (regla §6).
 *
 * Copy provisional de estructura. El copy final de hub y sectores se está
 * redactando aparte (docs/copy/). No hay cifras ni nombres de clientes
 * inventados: el caso destacado se conecta cuando exista uno real.
 */
import type { Paso } from '../components/ui/Pasos.astro';
import type { ItemCruzada } from '../components/ui/VentaCruzada.astro';
import type { ItemFAQ } from '../components/ui/FAQ.astro';
import type { NombreIcono } from '../components/ui/Icono.astro';

interface Enlace {
  label: string;
  href: string;
}
interface TarjetaSelector {
  titulo: string;
  texto: string;
  href: string;
  icono?: NombreIcono;
}

export interface ContenidoHub {
  eyebrow?: string;
  titulo: string;
  intro: string;
  ctaPrimario: Enlace;
  ctaSecundario?: Enlace;
  imagenHero?: { src: string; alt: string };
  selector?: { titulo: string; items: TarjetaSelector[] };
  pasos?: { titulo?: string; items: Paso[] };
  ventaCruzada?: { titulo?: string; items: ItemCruzada[] };
  faq?: { titulo?: string; items: ItemFAQ[] };
  cierre?: { titulo: string; texto: string; cta: Enlace };
}

const CTA_COTIZAR: Enlace = { label: 'Cotizar en 24 h', href: '/cotizar' };

const PASOS_PROYECTO: Paso[] = [
  { titulo: 'Visita técnica', texto: 'Medimos el espacio disponible y evaluamos accesos, pisos y anclajes.' },
  { titulo: 'Diseño de distribución', texto: 'Proponemos el modelo y la cantidad de cupos que caben y cumplen la norma.' },
  { titulo: 'Fabricación', texto: 'Producimos la estructura en acero con acabado para intemperie.' },
  { titulo: 'Instalación y entrega', texto: 'Instalamos en sitio y entregamos con acta y garantía.' },
];

const CRUZADA_DESDE_BICIPARQUEADEROS: ItemCruzada[] = [
  {
    label: 'Mantenimiento para flotas',
    texto: 'Un biciparqueadero lleno necesita bicicletas que rueden. Planes de mantenimiento con reporte por unidad.',
    href: '/mantenimiento/flotas',
  },
  {
    label: 'Guayas y candados',
    texto: 'Complementa el parqueadero con anclaje y seguridad certificada de la tienda.',
    href: '/tienda/seguridad',
  },
  {
    label: 'Normativa: Ley 1811 y PESV',
    texto: '¿Necesitas justificar la inversión ante el comité? Aquí está la base normativa.',
    href: '/recursos/normativa',
  },
];

const FAQ_HUB: ItemFAQ[] = [
  {
    pregunta: '¿Cuánto tarda un proyecto de principio a fin?',
    respuesta:
      'Depende del tamaño y de la fabricación. En la visita técnica te damos un cronograma concreto y queda en la cotización.',
  },
  {
    pregunta: '¿Instalan en todo el país?',
    respuesta:
      'Trabajamos desde Bogotá con cobertura nacional para proyectos. El desplazamiento y la logística se detallan en la propuesta.',
  },
  {
    pregunta: '¿El biciparqueadero cumple la Ley 1811 y el PESV?',
    respuesta:
      'Los modelos se diseñan para cumplir la normativa aplicable. En la ficha de cada modelo indicamos qué normas cubre.',
  },
  {
    pregunta: '¿Puedo empezar con pocos cupos y ampliar después?',
    respuesta:
      'Sí. La distribución se diseña modular para que puedas crecer sin rehacer lo instalado.',
  },
];

const CIERRE: ContenidoHub['cierre'] = {
  titulo: 'Cuéntanos tu espacio y te devolvemos una propuesta',
  texto: 'Cotiza y un ingeniero te responde en menos de 24 h con modelo sugerido, cupos y valor estimado.',
  cta: CTA_COTIZAR,
};

/* ---------------------------------------------------------------- HUB ---- */

export const HUB: ContenidoHub = {
  eyebrow: 'Línea 1 · Biciparqueaderos',
  titulo: 'Biciparqueaderos que cumplen la norma y aguantan el uso',
  intro:
    'Diseñamos, fabricamos e instalamos la infraestructura para que tu equipo, tus residentes o tus estudiantes lleguen en bici. Un solo proveedor, de la visita a la entrega.',
  ctaPrimario: CTA_COTIZAR,
  ctaSecundario: { label: 'Calcular cupos que necesito', href: '/recursos/calculadora-cupos' },
  imagenHero: { src: '/images/modelos/rack-lineal.jpg', alt: 'Biciparqueadero tipo rack lineal, varias unidades en fila' },
  selector: {
    titulo: '¿Para qué tipo de espacio?',
    items: [
      { titulo: 'Corporativo', texto: 'Sedes y oficinas. Cumplimiento de PESV y recuperación de área.', href: '/biciparqueaderos/corporativo', icono: 'edificio' },
      { titulo: 'Institucional y educativo', texto: 'Universidades, colegios y entidades. Alto volumen de cupos.', href: '/biciparqueaderos/institucional', icono: 'graduacion' },
      { titulo: 'Residencial y PH', texto: 'Conjuntos y propiedad horizontal. Aprovecha sótanos y cumple el POT.', href: '/biciparqueaderos/residencial', icono: 'casa' },
      { titulo: 'Mobiliario urbano', texto: 'Espacio público y comercio. Resistente al vandalismo y a la intemperie.', href: '/biciparqueaderos/mobiliario-urbano', icono: 'bici' },
    ],
  },
  pasos: { titulo: 'Cómo trabajamos', items: PASOS_PROYECTO },
  ventaCruzada: { items: CRUZADA_DESDE_BICIPARQUEADEROS },
  faq: { titulo: 'Preguntas frecuentes de biciparqueaderos', items: FAQ_HUB },
  cierre: CIERRE,
};

/* ------------------------------------------------------------ SECTORES ---- */

export const SECTORES: Record<string, ContenidoHub> = {
  corporativo: {
    eyebrow: 'Biciparqueaderos · Corporativo',
    titulo: 'Biciparqueaderos para sedes empresariales',
    intro:
      'Para RRHH y sostenibilidad: infraestructura que soporta el plan de movilidad, ayuda a cumplir el PESV y libera parqueaderos de carro.',
    ctaPrimario: CTA_COTIZAR,
    ctaSecundario: { label: 'Para empresas', href: '/soluciones/empresas' },
    pasos: { titulo: 'Cómo trabajamos', items: PASOS_PROYECTO },
    ventaCruzada: {
      titulo: 'Completa el plan de movilidad',
      items: [
        { label: 'Jornadas de mantenimiento en sede', texto: 'Llevamos el taller a tu sede para las bicis de los colaboradores.', href: '/mantenimiento/jornadas-empresariales' },
        { label: 'Normativa: PESV', texto: 'La base para justificar la inversión ante el comité.', href: '/recursos/normativa' },
        { label: 'Ver modelos', texto: 'Compara capacidad, material y normativa.', href: '/biciparqueaderos/modelos' },
      ],
    },
    faq: { items: FAQ_HUB },
    cierre: CIERRE,
  },

  institucional: {
    eyebrow: 'Biciparqueaderos · Institucional y educativo',
    titulo: 'Biciparqueaderos para campus y entidades',
    intro:
      'Para universidades, colegios y entidades públicas: prioridad en volumen de cupos, seguridad y durabilidad frente al uso intensivo.',
    ctaPrimario: CTA_COTIZAR,
    ctaSecundario: { label: 'Para universidades', href: '/soluciones/universidades' },
    pasos: { titulo: 'Cómo trabajamos', items: PASOS_PROYECTO },
    ventaCruzada: {
      items: [
        { label: 'Ver modelos de alta capacidad', texto: 'Distribución modular para cientos de cupos.', href: '/biciparqueaderos/modelos' },
        { label: 'Diseño e instalación', texto: 'Levantamiento en sitio y montaje llave en mano.', href: '/biciparqueaderos/diseno-instalacion' },
        { label: 'Proyectos', texto: 'Casos donde ya se instaló.', href: '/proyectos' },
      ],
    },
    faq: { items: FAQ_HUB },
    cierre: CIERRE,
  },

  residencial: {
    eyebrow: 'Biciparqueaderos · Residencial y PH',
    titulo: 'Biciparqueaderos para conjuntos y propiedad horizontal',
    intro:
      'Para administración y consejo: aprovecha el sótano, cumple la exigencia del POT y suma un beneficio real para los residentes.',
    ctaPrimario: CTA_COTIZAR,
    ctaSecundario: { label: 'Para conjuntos residenciales', href: '/soluciones/conjuntos' },
    pasos: { titulo: 'Cómo trabajamos', items: PASOS_PROYECTO },
    ventaCruzada: {
      items: [
        { label: 'Mantenimiento a domicilio', texto: 'Servicio para los residentes, dentro del conjunto.', href: '/mantenimiento/domicilio' },
        { label: 'Para constructoras y arquitectos', texto: 'Si el proyecto está en planos, se integra desde el diseño.', href: '/soluciones/constructoras' },
        { label: 'Ver modelos', texto: 'Opciones para sótano y zonas comunes.', href: '/biciparqueaderos/modelos' },
      ],
    },
    faq: { items: FAQ_HUB },
    cierre: CIERRE,
  },

  'mobiliario-urbano': {
    eyebrow: 'Biciparqueaderos · Mobiliario urbano',
    titulo: 'Mobiliario urbano para bicicletas',
    intro:
      'Para espacio público, comercio y alcaldías: anclajes y parqueaderos que resisten el vandalismo, la intemperie y el uso continuo.',
    ctaPrimario: CTA_COTIZAR,
    ctaSecundario: { label: 'Ver modelos', href: '/biciparqueaderos/modelos' },
    pasos: { titulo: 'Cómo trabajamos', items: PASOS_PROYECTO },
    ventaCruzada: {
      items: [
        { label: 'Diseño e instalación', texto: 'Anclaje a piso según el tipo de superficie.', href: '/biciparqueaderos/diseno-instalacion' },
        { label: 'Proyectos', texto: 'Instalaciones en espacio público y comercio.', href: '/proyectos' },
        { label: 'Guayas y candados', texto: 'Seguridad complementaria de la tienda.', href: '/tienda/seguridad' },
      ],
    },
    faq: { items: FAQ_HUB },
    cierre: CIERRE,
  },
};
