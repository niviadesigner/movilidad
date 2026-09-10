/**
 * Navegación del sitio como DATOS (no incrustada en componentes).
 * Fuente: docs/arquitectura-informacion.md §4.
 *
 * Dos contextos:
 *  - corporativo: todo el sitio menos /tienda/* y /mi-cuenta/*
 *  - tienda: /tienda/* y /mi-cuenta/*
 */

export interface NavLink {
  label: string;
  href: string;
  /** Nota descriptiva opcional para mega menús. */
  descripcion?: string;
}

export interface MegaColumn {
  titulo?: string;
  links: NavLink[];
}

export interface MegaMenu {
  columnas: MegaColumn[];
  /** Acción de cierre de cada mega menú (una por menú). */
  accion: NavLink;
}

export interface NavItem {
  label: string;
  href: string;
  mega?: MegaMenu;
}

/* ========================================================================
   CONTEXTO A — Header corporativo
   5 ítems + 1 CTA. La tienda NO va aquí (entra por la barra superior).
   ======================================================================== */

export const NAV_CORPORATIVO: NavItem[] = [
  {
    label: 'Biciparqueaderos',
    href: '/biciparqueaderos',
    mega: {
      columnas: [
        {
          titulo: 'Por sector',
          links: [
            { label: 'Corporativo', href: '/biciparqueaderos/corporativo' },
            { label: 'Institucional y educativo', href: '/biciparqueaderos/institucional' },
            { label: 'Residencial y PH', href: '/biciparqueaderos/residencial' },
            { label: 'Mobiliario urbano', href: '/biciparqueaderos/mobiliario-urbano' },
          ],
        },
        {
          titulo: 'Explorar',
          links: [
            { label: 'Ver todos los modelos', href: '/biciparqueaderos/modelos' },
            { label: 'Diseño e instalación', href: '/biciparqueaderos/diseno-instalacion' },
          ],
        },
      ],
      accion: { label: 'Calcular cupos que necesitas', href: '/recursos/calculadora-cupos' },
    },
  },
  {
    label: 'Mantenimiento',
    href: '/mantenimiento',
    mega: {
      columnas: [
        {
          titulo: 'Empresas',
          links: [
            { label: 'Jornadas en sede', href: '/mantenimiento/jornadas-empresariales' },
            { label: 'Planes para flotas', href: '/mantenimiento/flotas' },
          ],
        },
        {
          titulo: 'Personas',
          links: [
            { label: 'Taller', href: '/mantenimiento/taller' },
            { label: 'A domicilio', href: '/mantenimiento/domicilio' },
            { label: 'Planes y precios', href: '/mantenimiento/planes' },
          ],
        },
      ],
      accion: { label: 'Agendar ahora', href: '/mantenimiento/agendar' },
    },
  },
  {
    label: 'Proyectos',
    href: '/proyectos',
  },
  {
    label: 'Recursos',
    href: '/recursos',
    mega: {
      columnas: [
        {
          links: [
            { label: 'Normativa: Ley 1811 y PESV', href: '/recursos/normativa' },
            { label: 'Calculadora de cupos', href: '/recursos/calculadora-cupos' },
            { label: 'Fichas técnicas', href: '/recursos/fichas-tecnicas' },
          ],
        },
        {
          links: [
            { label: 'Preguntas frecuentes', href: '/recursos/faq' },
            { label: 'Blog', href: '/blog' },
          ],
        },
      ],
      accion: { label: 'Hablar con un ingeniero', href: '/cotizar' },
    },
  },
  {
    label: 'Nosotros',
    href: '/nosotros',
  },
];

/** CTA primario único del header corporativo. */
export const CTA_CORPORATIVO: NavLink = {
  label: 'Cotizar en 24 h',
  href: '/cotizar',
};

/** Puerta lateral discreta a la tienda, en la barra superior. */
export const PUERTA_TIENDA: NavLink = {
  label: '¿Eres biciusuario? Ir a la tienda',
  href: '/tienda',
};

/* ========================================================================
   CONTEXTO B — Header de tienda
   ======================================================================== */

export const NAV_TIENDA: NavItem[] = [
  {
    label: 'Soportes',
    href: '/tienda/soportes',
  },
  {
    label: 'Morrales y maletines',
    href: '/tienda/morrales-maletines',
  },
  {
    label: 'Seguridad',
    href: '/tienda/seguridad',
  },
  {
    label: 'Accesorios',
    href: '/tienda/accesorios',
  },
  {
    label: 'Ofertas',
    href: '/tienda/ofertas',
  },
];

/** Enlace de regreso al sitio corporativo desde la tienda. */
export const VOLVER_AL_SITIO: NavLink = {
  label: 'Volver al sitio',
  href: '/',
};

/* ========================================================================
   PIE DE PÁGINA — 4 columnas + barra legal
   ======================================================================== */

export interface FooterColumn {
  titulo: string;
  links: NavLink[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    titulo: 'Líneas',
    links: [
      { label: 'Biciparqueaderos', href: '/biciparqueaderos' },
      { label: 'Mantenimiento', href: '/mantenimiento' },
      { label: 'Tienda', href: '/tienda' },
    ],
  },
  {
    titulo: 'Soluciones',
    links: [
      { label: 'Para empresas', href: '/soluciones/empresas' },
      { label: 'Para constructoras y arquitectos', href: '/soluciones/constructoras' },
      { label: 'Para conjuntos residenciales', href: '/soluciones/conjuntos' },
      { label: 'Para universidades', href: '/soluciones/universidades' },
    ],
  },
  {
    titulo: 'Recursos',
    links: [
      { label: 'Normativa', href: '/recursos/normativa' },
      { label: 'Calculadora de cupos', href: '/recursos/calculadora-cupos' },
      { label: 'Fichas técnicas', href: '/recursos/fichas-tecnicas' },
      { label: 'Preguntas frecuentes', href: '/recursos/faq' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    titulo: 'Empresa',
    links: [
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Aliados y certificaciones', href: '/nosotros/aliados' },
      { label: 'Trabaja con nosotros', href: '/nosotros/trabaja-con-nosotros' },
      { label: 'Cotizar', href: '/cotizar' },
    ],
  },
];

export const FOOTER_LEGAL: NavLink[] = [
  { label: 'Términos', href: '/legal/terminos' },
  { label: 'Privacidad', href: '/legal/privacidad' },
  { label: 'Política de tratamiento de datos', href: '/legal/tratamiento-datos' },
  { label: 'Envíos y devoluciones', href: '/tienda/envios' },
];

/* ========================================================================
   Capa transversal — landings por segmento (fuera del menú)
   ======================================================================== */

export const SEGMENTOS: NavLink[] = [
  { label: 'Empresas', href: '/soluciones/empresas' },
  { label: 'Constructoras y arquitectos', href: '/soluciones/constructoras' },
  { label: 'Conjuntos residenciales', href: '/soluciones/conjuntos' },
  { label: 'Universidades', href: '/soluciones/universidades' },
];

/** ¿Esta ruta pertenece al contexto tienda? */
export function esContextoTienda(pathname: string): boolean {
  return pathname.startsWith('/tienda') || pathname.startsWith('/mi-cuenta');
}
