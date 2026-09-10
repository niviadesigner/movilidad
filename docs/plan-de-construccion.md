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

## Fase 1 — Línea 1: Biciparqueaderos (la que factura)

- Plantilla A aplicada al hub `/biciparqueaderos`
- Las 4 páginas de sector
- Listado de modelos y Plantilla B para la ficha
- Descarga de ficha técnica con captura de correo
- Formulario de cotización de 5 campos + `/gracias`
- Notificación de la cotización por n8n o correo

**Entrega:** una línea de negocio completa y funcional, de punta a punta.

---

## Fase 2 — Home y landings por segmento

- Home con los 11 bloques en el orden definido
- Las 4 landings de `/soluciones/*`
- Barra superior con la puerta lateral a la tienda
- Barra inferior fija en móvil

**Entrega:** el sitio ya se puede mostrar al cliente.

---

## Fase 3 — Línea 2: Mantenimiento

- Hub y páginas de las 3 modalidades
- Comparativo de planes
- Página de cobertura
- Agendador de 4 pasos con selector de modalidad y validación de cobertura previa
- Confirmación y notificación

**Entrega:** agendamiento funcionando en las tres modalidades.

---

## Fase 4 — Línea 3: Tienda

- Catálogo, categorías, buscador y filtros
- Ficha de producto con descuento por volumen visible
- Carrito con mini-preview
- Checkout de invitado, cálculo de envío previo, pasarela de pago
- Confirmación de pedido, correo transaccional y rastreo
- Páginas de envíos, devoluciones y garantía
- Área de cuenta

**Entrega:** primera venta de prueba completada de punta a punta.

---

## Fase 5 — Autoridad y captura

- `/recursos/normativa` con Ley 1811, PESV y POT
- Calculadora de cupos con captura y calificación de lead
- Casos de estudio con Plantilla D
- Blog y primeros artículos
- Fichas técnicas descargables

**Entrega:** el motor de tráfico y leads encendido.

---

## Fase 6 — Cierre

- Auditoría de rendimiento: LCP bajo 2,5 s en móvil
- Auditoría de accesibilidad AA
- Auditoría de la lista de credibilidad de `CLAUDE.md` sección 8
- Revisión de que ningún enlace externo lleve parámetros de rastreo de IA
- Analítica, eventos de conversión y píxeles
- Redirecciones 301 desde el sitio anterior

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
