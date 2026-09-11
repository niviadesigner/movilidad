# CLAUDE.md — Soluciones de Movilidad

Archivo de contexto permanente del proyecto. Léelo completo antes de escribir código.
Si algo de aquí choca con una instrucción puntual del chat, gana la instrucción del chat, pero avísame.

---

## 1. QUÉ ES ESTE PROYECTO

Sitio web de **Soluciones de Movilidad** (solucionesdemovilidad.com.co), empresa colombiana de
infraestructura y servicios para movilidad en bicicleta.

Lo construye **NIVI@DESIGN / Nivia Studio Creativo** (Cajicá, Colombia) para el cliente.

**Tres líneas de negocio, tres lógicas de compra distintas:**

| Línea | Modelo | Decisor | Acción de cierre |
|---|---|---|---|
| Biciparqueaderos | Proyecto B2B, ticket alto | Comité: RRHH, sostenibilidad, compras | Cotización |
| Soportes y accesorios | Ecommerce, ticket bajo | Persona natural o compras | Carrito y pago |
| Mantenimiento | Servicio recurrente | Empresa o persona | Agendamiento |

**La arquitectura debe separarlas en la navegación y unirlas en el recorrido.**
Cada línea es una autopista independiente con rampas de acceso entre ellas.

---

## 2. DECISIONES YA TOMADAS — NO LAS CAMBIES SIN PREGUNTAR

1. **La tienda vende con carrito y precio público.** No es un catálogo de cotización.
2. **La home le habla primero a empresas y constructoras (B2B).** El ecommerce entra por una
   puerta lateral discreta en la barra superior, NO por el hero ni por el menú principal.
3. **El mantenimiento se presta en 3 modalidades:** jornadas en sede de la empresa, taller
   propio y a domicilio. El agendamiento arranca con un selector de modalidad.
4. **Profundidad máxima de 3 niveles.** Todo lo que factura está a 2 clics de la home.
5. **La navegación cambia de contexto al entrar a `/tienda`.** Header corporativo fuera,
   header de ecommerce dentro, con botón de regreso al sitio.
6. **Peso visual proporcional al ticket.** El bloque de biciparqueaderos ocupa el doble que
   los de mantenimiento y tienda.
7. **Plataforma: custom con Astro 5 + Tailwind 4 + Supabase.** Islas de React solo donde hay
   interactividad. Deploy en Vercel (adapter `@astrojs/vercel`). Decidido en Fase 0.
8. **Pasarela de pago: Wompi.** El checkout se construye sobre una capa de pago abstracta
   para no acoplar el resto del código a Wompi. Decidido en Fase 0.
9. **Paleta (v2, tomada del logo):** azul petróleo `#06364E` (primario), amarillo señal
   `#FCF618` (acento — SOLO relleno del CTA primario y remates), casi negro azulado `#1E242A`.
   El CTA primario es amarillo con texto casi negro. Tokens en `src/styles/global.css`.
10. **Tipografía: Archivo (títulos) + IBM Plex Sans (cuerpo) + IBM Plex Mono (datos/specs).**
   Autoalojadas vía `@fontsource`, importadas en `BaseLayout.astro`. Sin CDN (regla §6).
11. **Logo:** `brand/` guarda los PNG originales; `public/logo/logo.png` (horizontal) y
   `public/logo/isotipo.png` (símbolo) son los de uso web. Favicons en `public/favicon-*.png`.
   Header corporativo usa el logo horizontal; header de tienda usa el isotipo + "Tienda".
12. **Agendamiento de mantenimiento = handoff a WhatsApp.** El agendador de 4 pasos recoge
   los datos y termina abriendo WhatsApp con el resumen; no confirma ni cobra en el acto.
   En segundo plano registra el lead en `/api/agendar`. Decidido en Fase 3.
13. **Contacto único: `305 713 4994`** (`573057134994`), el mismo para llamar y WhatsApp.
   Valor por defecto en `src/lib/site.ts`; `PUBLIC_TEL`/`PUBLIC_WHATSAPP` lo sobrescriben.
14. **Carrito y checkout (Fase 4):** carrito en `localStorage` (`src/lib/carrito.ts`); precios
   siempre recalculados en el servidor (`/api/pedido`); pago vía `src/lib/pago.ts` — modo demo
   si no hay llaves de Wompi, Wompi Checkout Web (con firma de integridad) cuando las hay.
   Sin cuenta con login: pedidos y direcciones son locales al dispositivo hasta nueva fase.
15. **Analítica: Google Analytics 4** (`src/lib/analytics.ts` + `Analytics.astro`), detrás de
   `PUBLIC_GA4_ID` — sin esa variable no carga nada. Es la elección por defecto de Fase 6,
   reversible: confírmala o pide cambiarla por Plausible/Fathom/ninguna. 5 eventos de
   conversión ya instrumentados (cotización, agendamiento, pedido, calculadora, ficha técnica).
16. **Redirecciones 301** desde el sitio anterior: mecanismo listo en
   `src/data/redirects-301.ts` → `astro.config.mjs` (redirecciones reales vía Vercel, no
   meta-refresh). Vacío — hace falta el sitemap o el listado de URLs del sitio viejo.
17. **Legal (Fase 6):** los tres textos de `/legal/*` pasaron de `Placeholder` a un borrador
   completo en estructura (Ley 1581 de 2012, Decreto 1377 de 2013, Ley 1480 de 2011), con
   aviso visible de que falta la revisión de un abogado del cliente antes de publicarse.

---

## 3. DECISIONES PENDIENTES — PREGUNTA ANTES DE ASUMIR

- [ ] **Operador logístico y tabla de envíos** (bloquea el cálculo de envío del checkout).
- [ ] **Versión clara del logo** para fondos oscuros (footer usa texto blanco por ahora) e
      imagen social `og-default` (1200×630).
- [ ] **Copy final** de home y hubs (se está redactando aparte, ver `docs/copy/`).
- [ ] **Catálogo real**: SKUs, precios, fotos, stock inicial.
- [ ] **Confirmar Google Analytics 4** como herramienta de analítica, o cambiarla.
- [ ] **Sitemap o listado de URLs del sitio anterior**, para las redirecciones 301.
- [ ] **Revisión legal** de `/legal/terminos`, `/legal/privacidad` y `/legal/tratamiento-datos`
      por un abogado, más el NIT y la dirección física exacta del responsable del tratamiento.

Mientras no estén definidas, trabaja con datos de ejemplo claramente marcados como
`// TODO: reemplazar con dato real` y nunca inventes precios, cifras ni nombres de clientes.

---

## 4. STACK RECOMENDADO (ruta custom)

```
Framework      Astro 5 (islas de React donde haga falta interactividad)
Estilos        Tailwind CSS
Base de datos  Supabase (catálogo, pedidos, agendamientos, leads)
Pagos          Wompi o Mercado Pago
Automatización n8n (notificación de cotizaciones y agendamientos)
Deploy         Netlify o Vercel
Formularios    Server actions o endpoints propios, nunca servicios de terceros con marca visible
```

**Por qué Astro:** el sitio es mayoritariamente contenido estático con islas de
interactividad (carrito, agendador, calculadora). Astro entrega HTML plano y rapidísimo,
que es exactamente lo que este sitio necesita para posicionar.

---

## 5. ARQUITECTURA DE INFORMACIÓN

La estructura completa de páginas, URLs, navegación y plantillas está en
**`docs/arquitectura-informacion.md`**. Es la fuente de verdad. Respétala.

Resumen de rutas de primer nivel:

```
/                        Home B2B
/biciparqueaderos        Hub línea 1
/mantenimiento           Hub línea 2
/tienda                  Hub línea 3 (subsitio con header propio)
/proyectos               Casos de estudio
/recursos                Normativa, calculadora, fichas, FAQ, blog
/nosotros                Empresa, aliados y certificaciones
/cotizar                 Conversión principal B2B
/soluciones/{segmento}   Landings transversales por audiencia
```

---

## 6. REGLAS DE CONSTRUCCIÓN

### Escalabilidad
Construye **4 plantillas**, no 40 páginas:

- **Plantilla A — Hub de línea**: encabezado con dolor + selector de sector + cómo funciona +
  prueba social + venta cruzada + FAQ + CTA
- **Plantilla B — Ficha de modelo o producto**: galería, specs, normativa que cumple, ficha
  técnica PDF descargable, precio o cotizar, relacionados
- **Plantilla C — Servicio agendable**: qué incluye, comparativo de planes, cobertura,
  agendador embebido, FAQ
- **Plantilla D — Caso de estudio**: reto, solución, 3 métricas duras, antes/después,
  testimonio, productos usados, CTA

Cuando entre una línea nueva (cargadores, software, bici pública), se agrega un hub con
Plantilla A y sus hijos. Cero rediseño.

### Contenido y datos
- Todo el contenido de páginas en colecciones de contenido, no incrustado en componentes.
- Productos, modelos y casos de estudio viven en base de datos o en colecciones, nunca
  hardcodeados en el JSX.
- Un solo motor de precios. El descuento por volumen del carrito y el de la cotización
  comercial deben salir de la misma fuente.

### SEO y semántica
- **Un solo `<h1>` por página.** Jerarquía real de encabezados. Este es el error exacto que
  hunde a la competencia; no lo repitas.
- URLs en minúsculas, con guiones, sin tildes, sin ñ, sin fechas, sin IDs.
- Política única de barra final, aplicada en todo el sitio.
- Migas de pan desde el nivel 2, espejo exacto de la URL, con schema `BreadcrumbList`.
- `alt` descriptivo real en cada imagen. Nada de "imagen1".
- Metadatos únicos por página. `og:locale` en `es_CO`.

### Rendimiento
- LCP por debajo de 2,5 s en móvil con 4G.
- Imágenes en WebP o AVIF, servidas con el componente de imagen del framework.
- Cero dependencias de dominios externos para elementos visuales.
- Sin carruseles de video con autoplay pesado en la home.

### Accesibilidad
- Contraste mínimo AA.
- Navegación completa por teclado, foco visible.
- Áreas táctiles de 44×44 px mínimo.
- Formularios con `<label>` real asociado, no solo placeholder.

---

## 7. REGLAS DE CONVERSIÓN

- **Un solo CTA primario por pantalla.** Los secundarios en texto o borde, nunca del mismo peso.
- CTA B2B con promesa de tiempo: *"Cotiza y un ingeniero te responde en menos de 24 h"*.
- **Formulario de cotización: máximo 5 campos** — nombre, empresa, correo, teléfono, número
  aproximado de cupos.
- Página de gracias real en `/gracias` con próximo paso y descarga de portafolio, para poder
  medir conversiones.
- WhatsApp flotante con mensaje precargado **distinto según la línea** en la que esté el usuario.
- En la tienda: precio y disponibilidad visibles en la grilla, no solo en la ficha.
- Checkout sin registro obligatorio. Invitado primero, cuenta opcional al final.
- Costo de envío calculado antes del checkout, jamás como sorpresa final.
- En la ruta de mantenimiento a domicilio: **validar cobertura ANTES de pedir datos personales.**

---

## 8. REGLAS DE CREDIBILIDAD — INNEGOCIABLES

Estas nacen de auditar a la competencia. Son las que nos diferencian:

- **Cero estrellas o reseñas decorativas.** O son reales y verificables, o no van.
- **Cada cifra lleva fuente o cálculo visible.** Nada de "ROI de hasta 120%" sin explicación.
- **Nunca dejes texto de relleno, placeholders ni "Lorem ipsum" en producción.**
- **Nunca dejes parámetros de rastreo de IA en enlaces salientes** (`?utm_source=chatgpt.com`
  y similares). Limpia toda URL externa.
- Fecha de actualización visible en blog y recursos.
- Logos de clientes en la parte alta de la home, no enterrados en el pie.
- Certificaciones y aliados visibles en cada ficha de producto, no solo en "Nosotros".
- Un solo número de teléfono y un solo WhatsApp en todo el sitio.

---

## 9. IDIOMA Y TONO

- Sitio 100% en **español de Colombia**. `lang="es-CO"`.
- Sin anglicismos innecesarios: "biciparqueadero", no "bike parking".
- Copy directo y concreto. Párrafos de 2 a 3 líneas. Bloques escaneables.
- El comité de compras no lee, barre. Escribe para barrer.

---

## 10. CÓMO QUIERO QUE TRABAJES

- **Pregunta antes de asumir** cualquier cosa de la sección 3.
- Trabaja por fases, ver `docs/plan-de-construccion.md`. No te adelantes de fase.
- Commits pequeños y descriptivos en español.
- Antes de crear un componente nuevo, revisa si ya existe uno que sirva.
- Si detectas que algo de la arquitectura no funciona en la práctica, dilo y propón, no lo
  cambies en silencio.
- No instales dependencias pesadas sin justificarlas.
