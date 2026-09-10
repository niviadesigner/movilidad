/**
 * Colecciones de contenido.
 * Regla (docs/CLAUDE.md §6): productos, modelos y casos de estudio viven en
 * colecciones o base de datos, nunca hardcodeados en el JSX.
 *
 * Fase 0: esquemas definidos + una entrada de ejemplo por colección,
 * marcada como provisional. El catálogo real llega en fases posteriores.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const modelos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/modelos' }),
  schema: z.object({
    nombre: z.string(),
    codigo: z.string(),
    // Familia de biciparqueadero (por sector o tipología).
    familia: z.enum(['corporativo', 'institucional', 'residencial', 'mobiliario-urbano']),
    cupos: z.number().int().positive(),
    material: z.string(),
    dimensiones: z.string(),
    normativa: z.array(z.string()).default([]),
    fichaPdf: z.string().optional(),
    precioDesde: z.number().optional(),
    imagenPrincipal: z.string().optional(),
    resumen: z.string(),
    borrador: z.boolean().default(false),
  }),
});

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z.object({
    cliente: z.string(),
    sector: z.string(),
    ciudad: z.string(),
    reto: z.string(),
    solucion: z.string(),
    // Exactamente 3 métricas duras (Plantilla D).
    metricas: z
      .array(z.object({ valor: z.string(), etiqueta: z.string(), fuente: z.string() }))
      .length(3),
    testimonio: z
      .object({ cita: z.string(), autor: z.string(), cargo: z.string() })
      .optional(),
    modelosUsados: z.array(z.string()).default([]),
    fecha: z.coerce.date(),
    borrador: z.boolean().default(false),
  }),
});

const CATEGORIAS_TIENDA = ['soportes', 'morrales-maletines', 'seguridad', 'accesorios'] as const;

const productos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/productos' }),
  schema: z.object({
    nombre: z.string(),
    sku: z.string(),
    categoria: z.enum(CATEGORIAS_TIENDA),
    // Precios en pesos, sin IVA. El IVA y el descuento por volumen los aplica pricing.ts.
    precio: z.number().int().nonnegative(),
    /** Precio anterior, solo si es real y verificable (regla §8). */
    precioAntes: z.number().int().positive().optional(),
    stock: z.number().int().nonnegative().default(0),
    destacado: z.boolean().default(false),
    imagenes: z.array(z.string()).default([]),
    specs: z.array(z.object({ etiqueta: z.string(), valor: z.string() })).default([]),
    /** Aplica descuento por volumen del motor de precios único. */
    descuentoVolumen: z.boolean().default(true),
    resumen: z.string(),
    borrador: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    fecha: z.coerce.date(),
    actualizado: z.coerce.date().optional(),
    autor: z.string().default('Soluciones de Movilidad'),
    etiquetas: z.array(z.string()).default([]),
    borrador: z.boolean().default(false),
  }),
});

export const collections = { modelos, proyectos, productos, blog };
