"use client";

import type { ReactNode } from "react";

/**
 * Shared building blocks for the dashboard panels (syllabus tracker,
 * task list, study logger).
 *
 * Every panel composes the same three pieces so the timer view keeps a
 * single visual rhythm: `GlassPanel` > `PanelHeader` > body. The classes
 * here intentionally mirror the palette already used across the app
 * (white/10 glass, white/20 borders, teal accent).
 */

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl shadow-black/25 overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  icon,
  title,
  trailing,
}: {
  icon: ReactNode;
  title: string;
  trailing?: ReactNode;
}) {
  return (
    <header className="flex items-center gap-2.5 px-4 py-3 border-b border-white/10">
      <span className="grid place-items-center w-7 h-7 shrink-0 rounded-lg bg-teal-500/20 border border-teal-400/30 text-teal-200">
        {icon}
      </span>
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
        {title}
      </h2>
      {trailing ? <div className="ml-auto">{trailing}</div> : null}
    </header>
  );
}

/** Small neutral chip used for counts and rollups in a panel header. */
export function PanelBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 border border-white/15 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white/70">
      {children}
    </span>
  );
}

export function PanelFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="px-4 py-2.5 border-t border-white/10 bg-black/10 text-[11px] text-white/50">
      {children}
    </footer>
  );
}

export function PanelBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

/**
 * Empty state for a panel body. Panels render one of these instead of
 * collapsing to nothing, so the layout never jumps when data arrives.
 */
export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-8">
      <span className="grid place-items-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-white/30 mb-3">
        {icon}
      </span>
      <p className="text-sm font-semibold text-white/70">{title}</p>
      <p className="text-xs text-white/40 mt-1 max-w-[22ch] leading-relaxed">
        {hint}
      </p>
    </div>
  );
}

export function ProgressBar({
  value,
  className = "",
}: {
  /** Completion ratio in the 0..1 range. */
  value: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  return (
    <div
      className={`h-1.5 w-full rounded-full bg-white/15 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct * 100)}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-500 transition-[width] duration-500 ease-out"
        style={{ width: `${pct * 100}%` }}
      />
    </div>
  );
}

/** Square icon button matching the bottom-navigation control language. */
export function IconButton({
  label,
  onClick,
  disabled = false,
  tone = "neutral",
  children,
  className = "",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "neutral" | "danger";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    neutral:
      "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border-white/20",
    danger:
      "bg-white/5 hover:bg-rose-500/25 text-white/40 hover:text-rose-200 border-white/10 hover:border-rose-400/40",
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`panel-focus grid place-items-center w-9 h-9 shrink-0 rounded-xl border transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

/** Primary / secondary action button used in panel footers and headers. */
export function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = "secondary",
  className = "",
  title,
  type = "button",
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  title?: string;
  type?: "button" | "submit";
}) {
  const variants = {
    primary:
      "bg-teal-500 text-white hover:bg-teal-400 shadow-lg shadow-teal-500/25 border border-teal-400/40",
    secondary:
      "bg-white/10 text-white hover:bg-white/20 border border-white/20",
    ghost:
      "bg-transparent text-white/50 hover:text-white hover:bg-white/10 border border-transparent",
  } as const;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`panel-focus inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

/** Text field styled to sit inside a glass panel. */
export function PanelInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  maxLength,
  ariaLabel,
  className = "",
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxLength?: number;
  ariaLabel: string;
  className?: string;
  autoFocus?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      aria-label={ariaLabel}
      placeholder={placeholder}
      maxLength={maxLength}
      autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className={`panel-focus w-full min-w-0 rounded-xl bg-white/10 text-white text-sm placeholder-white/40 border border-white/15 px-3 py-2 transition-colors focus:bg-white/15 focus:border-teal-400/50 ${className}`}
    />
  );
}
