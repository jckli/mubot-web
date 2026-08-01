import React from 'react';
import Link from 'next/link';

interface PillButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary';
  href: string;
  isExternal?: boolean;
}

export default function PillButton({
  variant = 'secondary',
  href,
  isExternal = true,
  children,
  className = '',
  ...props
}: PillButtonProps) {
  const baseStyle = "group flex items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm transition-all w-full sm:w-auto";
  const variants = {
    primary: "border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary",
    secondary: "border-border/60 bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground"
  };

  const combinedClassName = `${baseStyle} ${variants[variant]} ${className}`;

  if (isExternal) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={combinedClassName} 
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={combinedClassName}>
      {children}
    </Link>
  );
}
