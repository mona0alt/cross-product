import React from 'react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
}

export function AdminButton({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  asChild,
  ...props
}: AdminButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-accent/30 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-admin-accent text-white hover:bg-admin-accent-hover shadow-sm shadow-admin-accent/20',
    secondary:
      'bg-admin-elevated text-admin-text-primary border border-admin-border hover:border-admin-border-strong hover:bg-[#e8e5e0]',
    ghost:
      'bg-transparent text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-elevated',
    danger:
      'bg-admin-danger/10 text-admin-danger border border-admin-danger/20 hover:bg-admin-danger/20'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2'
  };

  const combined = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (asChild) {
    return (
      <span className={combined}>
        {children}
      </span>
    );
  }

  return (
    <button className={combined} {...props}>
      {children}
    </button>
  );
}

interface AdminLinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href: string;
}

export function AdminLinkButton({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  href,
  ...props
}: AdminLinkButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-accent/30';

  const variantClasses = {
    primary:
      'bg-admin-accent text-white hover:bg-admin-accent-hover shadow-sm shadow-admin-accent/20',
    secondary:
      'bg-admin-elevated text-admin-text-primary border border-admin-border hover:border-admin-border-strong hover:bg-[#e8e5e0]',
    ghost:
      'bg-transparent text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-elevated',
    danger:
      'bg-admin-danger/10 text-admin-danger border border-admin-danger/20 hover:bg-admin-danger/20'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2'
  };

  return (
    <a
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
