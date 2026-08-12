"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

export type NavDropdownItem = { label: string; href: string; active?: boolean };

export function NavDropdown({
  label,
  href,
  items,
  active,
  isOpen,
  onOpen,
  onScheduleClose,
  onCloseNow,
}: {
  label: string;
  href?: string;
  items: NavDropdownItem[];
  active: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onScheduleClose: () => void;
  onCloseNow: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const focusTrigger = () => (anchorRef.current ?? buttonRef.current)?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onCloseNow();
      focusTrigger();
    };
    const handleFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (!containerRef.current || !next || !containerRef.current.contains(next)) onCloseNow();
    };

    document.addEventListener("keydown", handleKey);
    const node = containerRef.current;
    node?.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("keydown", handleKey);
      node?.removeEventListener("focusout", handleFocusOut);
    };
  }, [isOpen, onCloseNow]);

  return (
    <div className="nav-dropdown" ref={containerRef} data-open={isOpen || undefined} onMouseEnter={onOpen} onMouseLeave={onScheduleClose}>
      {href ? (
        <Link ref={anchorRef} href={href} className="nav-dropdown-trigger" aria-haspopup="true" aria-expanded={isOpen} aria-current={active ? "page" : undefined} onFocus={onOpen}>
          {label}
          <ChevronDown aria-hidden="true" className="nav-caret" size={14} />
        </Link>
      ) : (
        <button ref={buttonRef} type="button" className="nav-dropdown-trigger" aria-haspopup="true" aria-expanded={isOpen} aria-current={active ? "page" : undefined} onFocus={onOpen} onClick={() => (isOpen ? onCloseNow() : onOpen())}>
          {label}
          <ChevronDown aria-hidden="true" className="nav-caret" size={14} />
        </button>
      )}

      {isOpen && (
        <div className="nav-dropdown-panel">
          {items.map((item) => (
            <Link href={item.href} key={item.href} aria-current={item.active ? "page" : undefined} onClick={onCloseNow}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
