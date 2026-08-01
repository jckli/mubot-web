import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface GenericPageHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export default function GenericPageHeader({ 
  title, 
  subtitle, 
  backHref = "/", 
  backLabel = "Back",
  className = ""
}: GenericPageHeaderProps) {
  return (
    <div className={`space-y-4 pb-6 border-b border-border/50 ${className}`}>
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{backLabel}</span>
      </Link>
      <div>
        <div className="text-2xl font-bold tracking-tight">{title}</div>
        {subtitle && (
          <div className="text-sm text-muted-foreground mt-2">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
