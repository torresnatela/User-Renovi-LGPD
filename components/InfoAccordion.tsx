'use client';

import { useState } from 'react';

interface InfoAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function InfoAccordion({ title, children, defaultOpen = false }: InfoAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors min-h-[44px]"
        aria-expanded={open}
      >
        <span className="font-medium text-gray-800 text-sm">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 py-4 bg-white text-sm text-gray-700 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
