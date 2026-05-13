import React from 'react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
    >
      <path d="M19.11 17.18c-.27-.14-1.62-.8-1.87-.9-.25-.09-.44-.14-.62.14-.18.27-.71.9-.88 1.08-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.18-1.33-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.86-2.04-.23-.54-.46-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.98 2.66 1.12 2.84.14.18 1.92 2.92 4.65 4.09.65.28 1.16.44 1.56.56.66.21 1.27.18 1.75.11.53-.08 1.62-.66 1.85-1.29.23-.63.23-1.16.16-1.29-.06-.12-.25-.19-.52-.33Z" />
      <path d="M16.02 3.2c-7.06 0-12.8 5.73-12.8 12.79 0 2.26.59 4.46 1.72 6.4L3.1 28.8l6.56-1.72a12.77 12.77 0 0 0 6.35 1.73h.01c7.05 0 12.79-5.74 12.79-12.8A12.8 12.8 0 0 0 16.02 3.2Zm0 23.44h-.01a10.62 10.62 0 0 1-5.42-1.49l-.39-.23-3.9 1.02 1.04-3.8-.25-.39a10.58 10.58 0 0 1-1.64-5.74c0-5.87 4.78-10.65 10.66-10.65 2.84 0 5.51 1.11 7.51 3.12a10.55 10.55 0 0 1 3.11 7.52c0 5.88-4.78 10.65-10.65 10.65Z" />
    </svg>
  );
}

export function StorefrontFloatingWhatsAppButton({
  whatsAppLabel,
  whatsAppNumber
}: {
  whatsAppLabel: string;
  whatsAppNumber: string;
}) {
  const normalizedWhatsAppNumber = whatsAppNumber.replace(/[^\d]/g, '');

  return (
    <a
      data-testid="storefront-floating-whatsapp-button"
      href={`https://wa.me/${normalizedWhatsAppNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${whatsAppLabel}: ${whatsAppNumber}`}
      className="group fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#047857] bg-[#059669] px-0 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(5,150,105,0.24)] transition-[width,background-color,box-shadow,transform] duration-300 ease-out hover:w-[148px] hover:bg-[#047857] hover:shadow-[0_18px_36px_rgba(5,150,105,0.28)] active:scale-[0.98] focus-visible:w-[148px] focus-visible:bg-[#047857] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#059669] motion-reduce:transition-none sm:bottom-6 sm:right-5 lg:bottom-auto lg:right-6 lg:top-1/2 lg:-translate-y-1/2"
    >
      <WhatsAppIcon className="h-6 w-6 flex-none" />
      <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-300 ease-out group-hover:ml-3 group-hover:max-w-24 group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:max-w-24 group-focus-visible:opacity-100 motion-reduce:transition-none">
        {whatsAppLabel}
      </span>
    </a>
  );
}
