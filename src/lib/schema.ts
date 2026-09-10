/**
 * Constructores de JSON-LD (schema.org).
 * En Fase 0: Organization (global) y BreadcrumbList (desde nivel 2).
 */
import { SITE } from './site';
import type { Miga } from './routes';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.nombre,
    legalName: SITE.nombreLegal,
    url: SITE.dominio,
    description: SITE.descripcion,
    logo: `${SITE.dominio}/logo/isotipo.png`,
    areaServed: 'CO',
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.ciudad,
      addressCountry: 'CO',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'ventas',
      telephone: SITE.tel,
      availableLanguage: ['es-CO'],
    },
  };
}

export function breadcrumbSchema(migas: Miga[]) {
  if (migas.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.label,
      item: `${SITE.dominio}${m.href}`,
    })),
  };
}

/** Serializa un objeto schema a string seguro para incrustar en <script>. */
export function serializarSchema(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
