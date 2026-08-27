"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NavItem, NavLeaf } from "@/lib/nav";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";

/** Baris untuk satu child: link nyata bila ada route, teks nonaktif bila belum. */
function ChildRow({ child, onNavigate }: { child: NavLeaf; onNavigate: () => void }) {
  if (child.href) {
    return (
      <Link
        href={child.href}
        onClick={onNavigate}
        className={`block rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-brand-700 ${FOCUS_RING}`}
      >
        {child.label}
      </Link>
    );
  }
  return (
    <span
      aria-disabled="true"
      className="flex cursor-default items-center justify-between rounded-md px-3 py-2 text-sm text-slate-400"
    >
      {child.label}
      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-300">
        Segera
      </span>
    </span>
  );
}

/** Isi panel: link ringkasan (bila item punya href) lalu daftar child. Dipakai desktop & mobile. */
function NavPanelList({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const children = item.children ?? [];
  return (
    <>
      {item.href && (
        <>
          <Link
            href={item.href}
            onClick={onNavigate}
            className={`block rounded-md px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 ${FOCUS_RING}`}
          >
            Lihat semua {item.label}
          </Link>
          {children.length > 0 && <div className="my-1 border-t border-slate-100" />}
        </>
      )}
      {children.length > 0 && (
        <ul className="space-y-0.5">
          {children.map((child) => (
            <li key={child.label}>
              <ChildRow child={child} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Trigger dropdown desktop: klik untuk buka/tutup, klik-luar dan Escape untuk menutup. */
export function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-brand-700 ${FOCUS_RING}`}
      >
        {item.label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <NavPanelList item={item} onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

/** Satu baris accordion untuk panel navigasi mobile. */
export function MobileNavAccordion({
  item,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <li className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${FOCUS_RING}`}
      >
        {item.label}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {expanded && (
        <div className="px-3 pb-2">
          <NavPanelList item={item} onNavigate={onNavigate} />
        </div>
      )}
    </li>
  );
}
