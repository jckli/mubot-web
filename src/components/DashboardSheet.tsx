"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { type ReactNode } from "react";

export default function DashboardSheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-3 backdrop-blur-sm sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
    <motion.section role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-lg rounded-2xl border border-border/70 bg-card p-4 shadow-2xl" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} transition={{ duration: 0.18 }} onMouseDown={(event) => event.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><button aria-label="Close" onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-5" /></button></div>
      {children}
    </motion.section>
  </motion.div>;
}
