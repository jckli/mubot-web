"use client";

import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface DashboardSelectOption {
  id: string;
  label: string;
  color?: number;
}

const roleColor = (color?: number) => color ? `#${color.toString(16).padStart(6, "0")}` : undefined;

export default function DashboardSelect({ value, options, loading, disabled, onChange }: {
  value: string;
  options?: DashboardSelectOption[];
  loading?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options?.find((option) => option.id === value);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);
  const label = selected?.label || (value ? "Configured role unavailable" : "Select a role");
  return <div ref={root} className="relative min-w-0 flex-1"><button type="button" disabled={disabled || loading || !options} onClick={() => setOpen((current) => !current)} className="flex w-full items-center justify-between gap-2 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-left text-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-45"><span className="flex min-w-0 items-center gap-2 truncate">{selected?.color ? <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: roleColor(selected.color) }} /> : null}{loading ? <LoaderCircle className="size-4 shrink-0 animate-spin" /> : null}{label}</span><ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} /></button>{open ? <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-border/70 bg-card p-1 shadow-xl">{options?.map((option) => <button type="button" key={option.id} onClick={() => { onChange(option.id); setOpen(false); }} className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"><span className="flex min-w-0 items-center gap-2 truncate">{option.color ? <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: roleColor(option.color) }} /> : null}{option.label}</span>{option.id === value ? <Check className="size-4 shrink-0 text-primary" /> : null}</button>)}</div> : null}</div>;
}
