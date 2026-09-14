/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_PUBLISHABLE_KEY: string;
  readonly SUPABASE_SECRET_KEY: string;
  readonly PUBLIC_WOMPI_PUBLIC_KEY: string;
  readonly WOMPI_PRIVATE_KEY: string;
  readonly WOMPI_EVENTS_SECRET: string;
  readonly WOMPI_INTEGRITY_SECRET: string;
  readonly PUBLIC_TEL: string;
  readonly PUBLIC_WHATSAPP: string;
  readonly N8N_WEBHOOK_COTIZACIONES: string;
  readonly N8N_WEBHOOK_AGENDAMIENTOS: string;
  readonly PUBLIC_GA4_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
