# Plan de construcción — Soluciones de Movilidad

Orden de trabajo para Claude Code. **No te adelantes de fase.**
Cada fase termina con algo revisable, no con "casi listo".

---

## Fase 0 — Cimientos (antes de tocar diseño) — ✅ COMPLETADA

Estado: proyecto Astro 5 inicializado, esqueleto navegable de 59 páginas, `astro check` y
`astro build` en verde. Contenido real pendiente por fases.

- Inicializar proyecto con el stack definido
- Sistema de diseño mínimo: tokens de color, escala tipográfica, espaciado, radios, sombras
- Layout base: `<Header>`, `<Footer>`, `<Breadcrumbs>`, contenedor y grilla
- Los **dos headers**: corporativo y de tienda, con cambio automático de contexto por ruta
- Componentes transversales: `<CTA>`, `<Card>`, `<FAQ>`, `<LogoBar>`, `<WhatsAppFloat>`,
  `<MobileBottomBar>`
- Configuración de SEO: metadatos por página, `lang="es-CO"`, `og:locale="es_CO"`, sitemap,
  robots, schema de organización y migas de pan
- Rutas vacías creadas según el árbol de `arquitectura-informacion.md`

**Entrega:** el esqueleto navegable completo, sin contenido real. Se puede hacer clic en todo.

---

## Fase 1 — Línea 1: Biciparqueaderos (la que factura) — 🔨 ESTRUCTURA LISTA

Estado: plantillas A y B construidas como componentes reutilizables; hub y 4 sectores
funcionando; listado y ficha de modelo; captura de correo para ficha PDF; formulario de
cotización de 5 campos con endpoint serverless, validación, honeypot y redirección a
`/gracias`; notificación de lead vía `notificarLead()` (webhook n8n con fallback a log).
Identidad v1 aplicada (paleta Dirección A + fuentes Archivo/IBM Plex).

Pendiente antes de cerrar la fase:
- Copy final de hub y sectores (se redacta aparte, `docs/copy/`).
- Modelos reales: specs, fotos, PDF de ficha técnica (hoy hay 3 de ejemplo, `borrador: true`).
- URL real del webhook de n8n en `.env` (`N8N_WEBHOOK_COTIZACIONES`).
- Portafolio real en PDF para `/gracias`.
- Un caso de estudio real para el bloque de prueba social.

- Plantilla A aplicada al hub `/biciparqueaderos`
- Las 4 páginas de sector
- Listado de modelos y Plantilla B para la ficha
- Descarga de ficha técnica con captura de correo
- Formulario de cotización de 5 campos + `/gracias`
- Notificación de la cotización por n8n o correo

**Entrega:** una línea de negocio completa y funcional, de punta a punta.

---

## Fase 2 — Home y landings por segmento — 🔨 ESTRUCTURA LISTA

Estado: identidad v2 aplicada desde el logo real (azul petróleo + amarillo señal + casi
negro); logo en los dos headers y favicons. Home con los 11 bloques en orden. Las 4 landings
de `/soluciones/*` con Plantilla A y contenido en `src/data/soluciones.ts`. TopBar con puerta
a la tienda y barra inferior móvil ya venían de Fase 0. Formulario de 5 campos extraído a
`FormularioCotizacion` y reutilizado en `/cotizar` y el bloque 11 de la home.

Pendiente antes de cerrar: copy final, logos reales de clientes y aliados, un caso de estudio
real para el bloque 5, versión clara del logo para fondos oscuros e imagen `og-default`.

- Home con los 11 bloques en el orden definido
- Las 4 landings de `/soluciones/*`
- Barra superior con la puerta lateral a la tienda
- Barra inferior fija en móvil

**Entrega:** el sitio ya se puede mostrar al cliente.

---

## Fase 3 — Línea 2: Mantenimiento — 🔨 ESTRUCTURA LISTA

Estado: hub con Plantilla A; 4 servicios (jornadas, flotas, taller, domicilio) con
Plantilla C nueva (`ServicioAgendable`); comparativo de planes; página de cobertura con
chequeo en vivo. Agendador de 4 pasos (`Agendador.tsx`, isla React) con selector de
modalidad y validación de cobertura ANTES de pedir datos personales; endpoint serverless
`/api/agendar` con validación y notificación (`notificarLead` tipo `agendamiento`);
página de confirmación con mensaje por modalidad. Contenido en `src/data/mantenimiento.ts`.
Probado de punta a punta en la ruta domicilio.

Cierre del agendamiento: **handoff a WhatsApp** (`305 713 4994`). El agendador recoge los
datos y abre WhatsApp con el resumen; `/api/agendar` registra el lead en segundo plano.

Pendiente antes de cerrar: precios reales de los planes, zonas de cobertura definitivas y
—opcional— URL de `N8N_WEBHOOK_AGENDAMIENTOS` para además guardar el lead.

- Hub y páginas de las 3 modalidades
- Comparativo de planes
- Página de cobertura
- Agendador de 4 pasos con selector de modalidad y validación de cobertura previa
- Confirmación y notificación

**Entrega:** agendamiento funcionando en las tres modalidades.

---

## Fase 4 — Línea 3: Tienda — 🔨 ESTRUCTURA LISTA

Estado: colección `productos` (8 de ejemplo, `borrador`); grillas de categoría y ofertas con
precio y stock visibles; Plantilla B de producto con descuento por volumen visible; carrito
en localStorage con mini-preview (`MiniCarrito`) y contador vivo en el header; buscador con
filtros (`BuscadorTienda`); checkout de invitado (`Checkout`) con envío calculado antes de
pagar; `/api/pedido` serverless que recalcula precios en el servidor, notifica y usa la capa
de pago abstracta (`pago.ts`, modo demo sin llaves / Wompi Checkout Web con firma de
integridad cuando hay llaves); confirmación de pedido y "Mis pedidos"/"Direcciones" locales
al dispositivo. Envíos, devoluciones y garantía con contenido base.
Probado de punta a punta en modo demo: carrito → checkout → pedido registrado → confirmación.

Pendiente antes de cerrar: catálogo real (SKU, precios, fotos, stock), tabla de envíos del
operador logístico, llaves de Wompi, correo transaccional, y cuenta real con inicio de sesión
(hoy los pedidos son locales al dispositivo).

- Catálogo, categorías, buscador y filtros
- Ficha de producto con descuento por volumen visible
- Carrito con mini-preview
- Checkout de invitado, cálculo de envío previo, pasarela de pago
- Confirmación de pedido, correo transaccional y rastreo
- Páginas de envíos, devoluciones y garantía
- Área de cuenta

**Entrega:** primera venta de prueba completada de punta a punta.

---

## Fase 5 — Autoridad y captura — 🔨 ESTRUCTURA LISTA

Estado: `/recursos/normativa` con Ley 1811, PESV y POT (contenido informativo real, con
disclaimer de que no es asesoría legal) + FAQ con schema `FAQPage`; `/recursos/calculadora-cupos`
(`CalculadoraCupos.tsx`) con heurística de cupos por tipo de espacio (`lib/calculadora.ts`),
captura de correo y `/api/calculadora` (lead calificado); `/recursos/fichas-tecnicas` lista
todos los modelos con descarga por correo; Plantilla D (`CasoEstudio.astro`) aplicada a
`/proyectos/[cliente]`, con testimonio y modelos usados enlazados; blog con 3 artículos reales
(Ley 1811, PESV, cómo elegir modelo) y `/recursos/faq` con preguntas reales del sitio completo.

De paso se corrigieron dos fallos reales que Fase 5 dejó ver: `CapturaCorreo` solo revelaba la
confirmación en la primera ficha de la página cuando había varias (ahora cada una se identifica
por `?modelo=`); y `/cotizar` es una página estática que nunca podía leer `?error=1` ni
`?cupos=` en el servidor (ahora un script en `FormularioCotizacion` los lee en el cliente). Se
añadió también un `.prose` mínimo en `global.css`: sin él, los artículos largos perdían
jerarquía de encabezados y viñetas de lista.

Pendiente antes de cerrar: revisión legal del contenido de normativa, cifras reales de los
casos de estudio (hoy son de ejemplo, `borrador`), y una imagen `og-default` para redes.

**Entrega:** el motor de tráfico y leads encendido.

---

## Fase 6 — Cierre — 🔨 ESTRUCTURA LISTA

Estado:

- **Rendimiento**: hidratación de islas ya usaba `client:idle`/`client:load` con criterio
  (nada bloquea el LCP); se añadió `fetchpriority="high"` a las imágenes de ficha (los
  candidatos a LCP en esas páginas); fuentes con `font-display: swap` (por defecto de
  `@fontsource`); bundles de islas livianos (todas < 11 kB sin comprimir, la mayoría < 5 kB).
  Sin fotos reales todavía, la optimización de imágenes queda pendiente de cuando lleguen.
- **Accesibilidad AA**: auditoría de contraste real (cálculo WCAG) sobre los pares de color en
  uso. Encontró y corrigió una falla: `--color-success-500` daba 4.10:1 sobre blanco (bajo el
  mínimo 4.5:1) en "disponible en stock", "cobertura confirmada" y el flotante de WhatsApp;
  ahora es `#157a4d`, 5.35:1. El resto de pares (texto, enlaces, CTA amarillo, secciones
  oscuras) ya pasaban con margen amplio. Alt text, `aria-*`, foco visible y asociación de
  `<label>` revisados: sin hallazgos nuevos.
- **Credibilidad (§8)**: sin lorem ipsum, sin estrellas decorativas, sin parámetros de rastreo
  de IA en enlaces salientes (auditado por grep). Se encontró y cerró un hueco real: ninguna
  ficha de modelo o de producto mostraba certificaciones ni aliados — nuevo componente
  `SelloConfianza` (normativa real en biciparqueaderos, enlace a garantía en tienda, siempre
  enlaza a `/nosotros/aliados`). Esa página, que era un `Placeholder`, ahora es real y honesta:
  dice explícitamente que aún no hay aliados publicados, en vez de simular una lista.
- **Legal**: los tres formularios del sitio ya pedían aceptar `/legal/tratamiento-datos`
  mientras esa página (y privacidad y términos) seguían siendo `Placeholder` de Fase 0. Se
  redactó un borrador completo y correcto en estructura para las tres (Ley 1581 de 2012,
  Decreto 1377 de 2013, Ley 1480 de 2011), con aviso visible de que falta la revisión de un
  abogado antes de publicarse como definitivo.
- **Analítica**: Google Analytics 4 (decisión por defecto, reversible) detrás de
  `PUBLIC_GA4_ID` — sin esa variable no carga ni un script ni una cookie. 5 eventos de
  conversión instrumentados: `cotizacion_enviada`, `agendamiento_whatsapp`,
  `pedido_confirmado`, `calculadora_lead`, `ficha_tecnica_lead`. Probado con un ID de prueba:
  carga condicional y disparo de evento confirmados.
- **Redirecciones 301**: mecanismo listo (`src/data/redirects-301.ts` → `astro.config.mjs` →
  redirecciones reales del adapter de Vercel, no meta-refresh). Vacío: sin el sitemap o el
  listado de URLs del sitio anterior no hay qué mapear.

Pendiente — necesita algo del cliente, no es código:
1. Confirmar o cambiar la elección de Google Analytics 4.
2. El sitemap.xml o listado de URLs del sitio anterior, para llenar las 301.
3. Revisión de un abogado sobre los tres textos legales antes de publicarlos como definitivos
   (falta también el NIT y la dirección física exacta del responsable).
4. Llaves reales de Wompi, catálogo y precios reales, webhook de n8n — arrastrados de fases
   anteriores.

---

# Prompt inicial para Claude Code

Copia y pega esto en la primera sesión, con `CLAUDE.md` y `docs/` ya en el repositorio:

---

Vamos a construir el sitio de Soluciones de Movilidad.

Antes de escribir código, lee `CLAUDE.md` y `docs/arquitectura-informacion.md` completos.
Son la fuente de verdad del proyecto.

Contexto: es un sitio B2B de infraestructura para movilidad en bicicleta con tres líneas de
negocio y tres lógicas de compra distintas. La arquitectura ya está cerrada; no la rediseñes.

Empezamos por la **Fase 0** del `docs/plan-de-construccion.md`: cimientos y esqueleto navegable.

Antes de arrancar, hazme las preguntas que necesites sobre las decisiones pendientes de la
sección 3 de `CLAUDE.md`. No asumas plataforma de pago, catálogo ni identidad visual.

Cuando tengas claridad, propón la estructura de carpetas y la lista de componentes base, y
espera mi visto bueno antes de generar archivos.

---

## Reglas de sesión

- **Una fase por sesión.** No mezcles.
- Si Claude Code propone cambiar la arquitectura, escúchalo, pero decide tú.
- Al cerrar cada fase, actualiza el estado en este archivo.
- Cada vez que se tome una decisión pendiente, muévela de la sección 3 a la sección 2 de
  `CLAUDE.md`.
