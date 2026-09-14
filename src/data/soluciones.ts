/**
 * Landings transversales por audiencia (docs/arquitectura §1, capa transversal).
 * Cruzan las tres líneas desde la mirada de un tipo de cliente. Califican y convierten.
 * Se renderizan con la Plantilla A (HubLinea).
 *
 * Copy provisional de estructura. Sin cifras ni nombres de clientes inventados.
 */
import type { ContenidoHub } from './biciparqueaderos';

const CTA_COTIZAR = { label: 'Cotizar en 24 h', href: '/cotizar' };

const PASOS = {
  titulo: 'Cómo empezamos',
  items: [
    { titulo: 'Nos cuentas', texto: 'Envías la solicitud con tu contexto y una idea de tamaño.' },
    { titulo: 'Visita técnica', texto: 'Un ingeniero evalúa el espacio y las necesidades.' },
    { titulo: 'Propuesta', texto: 'Recibes alcance, opciones y valor estimado en menos de 24 h.' },
    { titulo: 'Ejecución', texto: 'Instalamos o iniciamos el servicio, y acompañamos después.' },
  ],
};

export const SOLUCIONES: Record<string, ContenidoHub> = {
  empresas: {
    eyebrow: 'Soluciones · Empresas',
    titulo: 'Todo para que tu equipo se mueva en bici',
    intro:
      'Para RRHH y sostenibilidad: la infraestructura, el mantenimiento y los accesorios que sostienen un plan de movilidad y ayudan a cumplir el PESV.',
    ctaPrimario: CTA_COTIZAR,
    ctaSecundario: { label: 'Compra por volumen', href: '/tienda/corporativo' },
    selector: {
      titulo: 'Lo que suele necesitar una empresa',
      items: [
        { titulo: 'Biciparqueadero corporativo', texto: 'Cupos en la sede, con cumplimiento normativo.', href: '/biciparqueaderos/corporativo', icono: 'edificio' },
        { titulo: 'Jornadas de mantenimiento', texto: 'El taller va a tu sede para las bicis del equipo.', href: '/mantenimiento/jornadas-empresariales', icono: 'herramienta' },
        { titulo: 'Accesorios por volumen', texto: 'Candados, luces y morrales con descuento por cantidad.', href: '/tienda/corporativo', icono: 'maletin' },
      ],
    },
    pasos: PASOS,
    faq: {
      items: [
        { pregunta: '¿Nos ayudan a justificar la inversión ante el comité?', respuesta: 'Sí. La propuesta incluye el sustento normativo (Ley 1811, PESV) y el detalle de alcance.' },
        { pregunta: '¿Pueden facturar a nombre de la empresa?', respuesta: 'Sí, tanto el proyecto de biciparqueadero como la compra por volumen.' },
        { pregunta: '¿Atienden varias sedes?', respuesta: 'Sí. Coordinamos un cronograma por sede y una sola interlocución.' },
      ],
    },
    cierre: {
      titulo: 'Armemos el plan para tu empresa',
      texto: 'Cotiza y un ingeniero te responde en menos de 24 h con alcance y valor estimado.',
      cta: CTA_COTIZAR,
    },
  },

  constructoras: {
    eyebrow: 'Soluciones · Constructoras y arquitectos',
    titulo: 'Biciparqueaderos que cumplen el POT desde los planos',
    intro:
      'Para constructoras y arquitectos: especificación técnica, cumplimiento del cupo mínimo de bicicletas y una solución que se integra al diseño, no que se improvisa al final.',
    ctaPrimario: CTA_COTIZAR,
    ctaSecundario: { label: 'Ver modelos y fichas técnicas', href: '/biciparqueaderos/modelos' },
    selector: {
      titulo: 'Lo que pedimos y entregamos',
      items: [
        { titulo: 'Especificación para licitación', texto: 'Fichas técnicas y dimensiones para tus planos y pliegos.', href: '/biciparqueaderos/modelos', icono: 'documento' },
        { titulo: 'Modelos para sótano', texto: 'Distribución que aprovecha el ancho de pasillo y la altura.', href: '/biciparqueaderos/modelos', icono: 'edificio' },
        { titulo: 'Diseño e instalación', texto: 'Anclaje según superficie y montaje coordinado con obra.', href: '/biciparqueaderos/diseno-instalacion', icono: 'compas' },
      ],
    },
    pasos: PASOS,
    faq: {
      items: [
        { pregunta: '¿Entregan planos y especificaciones para el proyecto?', respuesta: 'Sí. Cada modelo tiene ficha técnica con dimensiones, materiales y normativa que cumple.' },
        { pregunta: '¿Se coordina la instalación con el cronograma de obra?', respuesta: 'Sí. Definimos la ventana de instalación en la visita técnica.' },
        { pregunta: '¿Cumple el cupo mínimo del POT?', respuesta: 'La distribución se diseña para cumplir la exigencia del POT del municipio del proyecto.' },
      ],
    },
    cierre: {
      titulo: 'Enviános el proyecto',
      texto: 'Cotiza con las áreas y cupos previstos y te devolvemos especificación y valor.',
      cta: CTA_COTIZAR,
    },
  },

  conjuntos: {
    eyebrow: 'Soluciones · Conjuntos residenciales',
    titulo: 'Aprovecha el sótano y cumple la norma',
    intro:
      'Para administración y consejo: un biciparqueadero seguro en zonas comunes, con cumplimiento del POT y un beneficio real para los residentes.',
    ctaPrimario: CTA_COTIZAR,
    ctaSecundario: { label: 'Mantenimiento a domicilio', href: '/mantenimiento/domicilio' },
    selector: {
      titulo: 'Lo que valoran los conjuntos',
      items: [
        { titulo: 'Biciparqueadero residencial', texto: 'Modular, para sótano o zona común, con anclaje seguro.', href: '/biciparqueaderos/residencial', icono: 'casa' },
        { titulo: 'Mantenimiento para residentes', texto: 'Servicio a domicilio dentro del conjunto.', href: '/mantenimiento/domicilio', icono: 'camion' },
        { titulo: 'Seguridad complementaria', texto: 'Guayas y candados de la tienda.', href: '/tienda/seguridad', icono: 'candado' },
      ],
    },
    pasos: PASOS,
    faq: {
      items: [
        { pregunta: '¿Sirve para presentar a la asamblea?', respuesta: 'Sí. La propuesta incluye render de distribución, alcance y valor para la decisión.' },
        { pregunta: '¿Se instala sin obra mayor?', respuesta: 'En la mayoría de casos el anclaje es a piso existente. Se confirma en la visita.' },
        { pregunta: '¿Cumple la exigencia del POT para vivienda?', respuesta: 'La distribución se diseña para cumplir el cupo mínimo aplicable.' },
      ],
    },
    cierre: {
      titulo: 'Llevemos la propuesta a tu asamblea',
      texto: 'Cotiza con el número de apartamentos y el espacio disponible.',
      cta: CTA_COTIZAR,
    },
  },

  universidades: {
    eyebrow: 'Soluciones · Universidades',
    titulo: 'Biciparqueaderos de alto volumen para el campus',
    intro:
      'Para bienestar y planta física: cupos a escala de campus, seguros y duraderos, integrados a los programas de movilidad sostenible.',
    ctaPrimario: CTA_COTIZAR,
    ctaSecundario: { label: 'Ver modelos', href: '/biciparqueaderos/modelos' },
    selector: {
      titulo: 'Lo que necesita un campus',
      items: [
        { titulo: 'Biciparqueadero institucional', texto: 'Distribución modular para cientos de cupos.', href: '/biciparqueaderos/institucional', icono: 'graduacion' },
        { titulo: 'Modelos de doble altura', texto: 'Duplica cupos en la misma huella donde falta espacio.', href: '/biciparqueaderos/modelos', icono: 'edificio' },
        { titulo: 'Diseño e instalación', texto: 'Levantamiento del campus y montaje por fases.', href: '/biciparqueaderos/diseno-instalacion', icono: 'compas' },
      ],
    },
    pasos: PASOS,
    faq: {
      items: [
        { pregunta: '¿Instalan por fases?', respuesta: 'Sí. Se prioriza por facultad o acceso y se amplía en etapas.' },
        { pregunta: '¿Los modelos resisten uso intensivo y exterior?', respuesta: 'Sí, se fabrican en acero galvanizado o con recubrimiento para intemperie.' },
        { pregunta: '¿Se integran a un programa de movilidad?', respuesta: 'Sí. Acompañamos con datos de aforo y distribución para el seguimiento del programa.' },
      ],
    },
    cierre: {
      titulo: 'Diseñemos la red de biciparqueaderos del campus',
      texto: 'Cotiza con los puntos previstos y el estimado de cupos por punto.',
      cta: CTA_COTIZAR,
    },
  },
};
