import { useEffect, useState } from 'react';

/**
 * Botón flotante de WhatsApp.
 * Mensaje precargado DISTINTO según la línea en la que está el usuario
 * (docs/CLAUDE.md §7). La URL ya viene resuelta desde el servidor.
 */
interface Props {
  href: string;
  etiqueta?: string;
  /** Oculto en móvil cuando hay barra inferior fija, para no encimarse. */
  ocultarEnMovil?: boolean;
}

export default function WhatsAppFloat({
  href,
  etiqueta = 'Escríbenos por WhatsApp',
  ocultarEnMovil = true,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > 320);
    alScroll();
    window.addEventListener('scroll', alScroll, { passive: true });
    return () => window.removeEventListener('scroll', alScroll);
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={etiqueta}
      className={[
        'fixed right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full',
        'bg-[var(--color-success-500)] text-white shadow-[var(--shadow-md)]',
        'transition-[opacity,transform] duration-200',
        ocultarEnMovil ? 'bottom-20 sm:bottom-6' : 'bottom-6',
        visible ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      ].join(' ')}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.6 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-3.9-4.5-4.1-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.5.2.6.3.1.2.1.8-.1 1.3Z" />
      </svg>
    </a>
  );
}
