import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
}

export function Card({ children, selected, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border bg-zinc-900 p-4 transition-all ${selected ? 'border-violet-500 ring-1 ring-violet-500' : 'border-zinc-800 hover:border-zinc-600'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold text-zinc-100 mb-1">{children}</h3>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-zinc-400">{children}</p>;
}
