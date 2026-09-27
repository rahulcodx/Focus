"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActionButton,
  EmptyState,
  GlassPanel,
  PanelBadge,
  PanelBody,
  PanelFooter,
  PanelHeader,
  ProgressBar,
} from "./panel-primitives";

export interface StudyLogEntry {
  subject: string;
  /** Accumulated seconds. */
  duration: number;
  /** ISO timestamp of the first session for this subject. */
  date: string;
}

interface StudyLoggerProps {
  elapsed: number;
  isRunning: boolean;
  onToggle: () => void;
  onLog: (subject: string) => void;
  onDiscard: () => void;
  logs: StudyLogEntry[];
  onDeleteLog: (index: number) => void;
  onClearLogs: () => void;
  /** Subjects from the syllabus tracker, offered as suggestions. */
  knownSubjects: string[];
}

const MAX_SUBJECT_LENGTH = 60;

const PlayIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M8 5.14v13.72L19 12z" />
  </svg>
);

const PauseIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M7 5h4v14H7zm6 0h4v14h-4z" />
  </svg>
);

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const ChevronIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 transition-transform duration-200"
  >
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

const TrashIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M9 3h6l1 1h4v2H4V4h4zm-3 6h12l-1 12H7z" />
  </svg>
);

const ChartIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M4 20h16v2H2V2h2zm3-3V9h3v8zm5 0V4h3v13zm5 0v-6h3v6z" />
  </svg>
);

const ClockIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16m.5-13H11v6l5.2 3.1.8-1.3-4.5-2.6z" />
  </svg>
);

/** HH:MM:SS — used for the live session readout where precision matters. */
function formatElapsed(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  return [hours, minutes, secs]
    .map((n) => n.toString().padStart(2, "0"))
    .join(":");
}

/** Human duration, e.g. "2h 45m" — used for totals where seconds are noise. */
function formatDuration(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${safe}s`;
}

function getTier(duration: number) {
  if (duration >= 3600 * 5)
    return { rank: "Excellent", className: "text-emerald-300 border-emerald-400/30 bg-emerald-500/15" };
  if (duration >= 3600 * 3)
    return { rank: "Best", className: "text-sky-300 border-sky-400/30 bg-sky-500/15" };
  if (duration >= 3600 * 2)
    return { rank: "Good", className: "text-amber-300 border-amber-400/30 bg-amber-500/15" };
  if (duration >= 3600)
    return { rank: "Average", className: "text-orange-300 border-orange-400/30 bg-orange-500/15" };
  return { rank: "Beginner", className: "text-white/60 border-white/20 bg-white/10" };
}

/**
 * Subject picker.
 *
 * Replaces the hardcoded `<select>` with a searchable combobox that
 * suggests subjects the user already tracks (syllabus first, then
 * previously logged subjects) and lets them type anything else. Fully
 * keyboard operable: arrows move, Enter commits, Escape closes.
 */
function SubjectCombobox({
  knownSubjects,
  value,
  onCommit,
}: {
  knownSubjects: string[];
  value: string;
  onCommit: (subject: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = "study-subject-listbox";

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const options = useMemo(() => {
    const q = query.trim().replace(/\s+/g, " ").toLowerCase();
    const matches = knownSubjects.filter(
      (s) => q === "" || s.toLowerCase().includes(q),
    );
    const isNew =
      q.length > 0 &&
      !knownSubjects.some((s) => s.toLowerCase() === q);

    return {
      matches,
      newSubject: isNew ? query.trim().replace(/\s+/g, " ") : null,
    };
  }, [knownSubjects, query]);

  const optionCount =
    options.matches.length + (options.newSubject ? 1 : 0);

  const commit = (subject: string) => {
    onCommit(subject);
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (optionCount === 0) return;
      setActiveIndex((i) => {
        const next =
          e.key === "ArrowDown" ? i + 1 : i - 1;
        return (next + optionCount) % optionCount;
      });
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (!open) {
        if (value) commit(value);
        return;
      }
      if (activeIndex < options.matches.length) {
        commit(options.matches[activeIndex]);
      } else if (options.newSubject) {
        commit(options.newSubject);
      }
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <label
        className="block text-[10px] uppercase tracking-[0.14em] font-bold text-white/40 mb-1.5"
        htmlFor={`${listId}-input`}
      >
        Subject
      </label>

      <div className="relative">
        <input
          id={`${listId}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && optionCount > 0
              ? `${listId}-opt-${activeIndex}`
              : undefined
          }
          autoComplete="off"
          maxLength={MAX_SUBJECT_LENGTH}
          value={open ? query : value}
          placeholder="Pick or type a subject"
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="panel-focus w-full rounded-xl bg-white/10 border border-white/15 pl-3 pr-10 py-2.5 text-sm text-white placeholder-white/35 transition-colors focus:bg-white/15 focus:border-teal-400/50"
        />
        <button
          type="button"
          aria-label={open ? "Close suggestions" : "Show suggestions"}
          aria-expanded={open}
          tabIndex={-1}
          onClick={() => {
            setOpen((o) => !o);
            setQuery("");
          }}
          className={`panel-focus absolute top-1/2 right-2 -translate-y-1/2 grid place-items-center w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors ${open ? "rotate-180" : ""}`}
        >
          {ChevronIcon}
        </button>
      </div>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Subject suggestions"
          className="animate-fade-in-up absolute z-30 left-0 right-0 mt-2 max-h-56 overflow-y-auto glass-scroll rounded-xl bg-[#151b21]/95 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/50 p-1"
        >
          {optionCount === 0 ? (
            <li className="px-3 py-3 text-center text-xs text-white/40">
              Start typing to create a subject
            </li>
          ) : null}

          {options.matches.map((subject, i) => (
            <li key={subject} id={`${listId}-opt-${i}`} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => commit(subject)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  i === activeIndex
                    ? "bg-teal-500/25 text-white"
                    : "text-white/75 hover:bg-white/5"
                }`}
              >
                <span className="text-teal-300/80 shrink-0">{CheckIcon}</span>
                <span className="truncate">{subject}</span>
              </button>
            </li>
          ))}

          {options.newSubject ? (
            <li
              id={`${listId}-opt-${options.matches.length}`}
              role="option"
              aria-selected={activeIndex === options.matches.length}
            >
              <button
                type="button"
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(options.matches.length)}
                onClick={() => commit(options.newSubject as string)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activeIndex === options.matches.length
                    ? "bg-teal-500/25 text-white"
                    : "text-white/75 hover:bg-white/5"
                }`}
              >
                <span className="shrink-0 text-white/40">+</span>
                <span className="truncate">
                  Log as{" "}
                  <span className="font-semibold">{options.newSubject}</span>
                </span>
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * Manual study timer: count up against a subject, then bank the time.
 *
 * Split into the live session card (left) and the accumulated log
 * (right). The log panel is always mounted — it shows an empty state
 * before the first entry — so the layout never reflows when the first
 * session is logged.
 */
export default function StudyLogger({
  elapsed,
  isRunning,
  onToggle,
  onLog,
  onDiscard,
  logs,
  onDeleteLog,
  onClearLogs,
  knownSubjects,
}: StudyLoggerProps) {
  const [subject, setSubject] = useState("");

  const canLog = subject.trim().length > 0 && elapsed > 0;

  /** Choosing a subject only selects it — logging is a separate, explicit
      action so picking an option never banks time as a side effect. */
  const selectSubject = useCallback((next: string) => {
    setSubject(next.trim().replace(/\s+/g, " ").slice(0, MAX_SUBJECT_LENGTH));
  }, []);

  const logSession = useCallback(() => {
    if (!canLog) return;
    onLog(subject);
  }, [canLog, onLog, subject]);

  const ranked = useMemo(
    () =>
      logs
        .map((log, index) => ({ ...log, index }))
        .sort((a, b) => b.duration - a.duration),
    [logs],
  );

  const total = useMemo(
    () => logs.reduce((sum, log) => sum + log.duration, 0),
    [logs],
  );

  return (
    <div className="w-full max-w-6xl grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      {/* Live session */}
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl shadow-black/25 p-6 sm:p-7">
          <div className="text-center">
            {/* tabular-nums keeps the readout from shifting as digits change */}
            <div className="text-white text-[clamp(3.25rem,13vw,5.5rem)] leading-none font-bold tabular-nums tracking-tight">
              {formatElapsed(elapsed)}
            </div>
          </div>

          <div className="mt-6">
            <SubjectCombobox
              knownSubjects={knownSubjects}
              value={subject}
              onCommit={selectSubject}
            />
          </div>

          <div className="mt-5 flex items-center justify-center gap-2.5">
            <ActionButton
              variant={isRunning ? "secondary" : "primary"}
              onClick={onToggle}
              className="!px-5 !py-2.5"
            >
              {isRunning ? PauseIcon : PlayIcon}
              {isRunning ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
            </ActionButton>

            <ActionButton
              variant="primary"
              onClick={logSession}
              disabled={!canLog}
              className="!px-5 !py-2.5"
            >
              Log session
            </ActionButton>

            <ActionButton
              variant="ghost"
              onClick={onDiscard}
              disabled={elapsed === 0}
              title="Discard this session"
            >
              Discard
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Accumulated log */}
      <GlassPanel className="flex flex-col self-start">
        <PanelHeader
          icon={ChartIcon}
          title="Study log"
          trailing={
            ranked.length > 0 ? <PanelBadge>{ranked.length}</PanelBadge> : undefined
          }
        />

        {ranked.length === 0 ? (
          <EmptyState
            icon={ClockIcon}
            title="Nothing logged yet"
            hint="Start the timer, pick a subject, then log the session to build up your totals."
          />
        ) : (
          <>
            <PanelBody className="pb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums text-white">
                  {formatDuration(total)}
                </span>
                <span className="text-xs text-white/40">
                  across {ranked.length} subject{ranked.length === 1 ? "" : "s"}
                </span>
              </div>
            </PanelBody>

            <ul className="flex-1 min-h-0 max-h-72 overflow-y-auto glass-scroll px-2 pb-2 space-y-1">
              {ranked.map((log, position) => {
                const tier = getTier(log.duration);
                const share = total > 0 ? log.duration / total : 0;
                return (
                  <li
                    key={`${log.subject}-${log.index}`}
                    className="animate-panel-item group rounded-xl bg-white/5 border border-white/10 p-3 transition-colors hover:border-white/20"
                    style={{
                      animationDelay: `${Math.min(position, 8) * 35}ms`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white/90 truncate">
                        {log.subject}
                      </span>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tier.className}`}
                      >
                        {tier.rank}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteLog(log.index)}
                        aria-label={`Delete ${log.subject} log`}
                        title="Delete log"
                        className="panel-focus ml-auto grid place-items-center w-6 h-6 shrink-0 rounded-lg text-white/25 hover:text-rose-300 hover:bg-rose-500/20 transition-all duration-200 opacity-60 group-hover:opacity-100 focus-visible:opacity-100"
                      >
                        {TrashIcon}
                      </button>
                    </div>

                    <ProgressBar value={share} className="mt-2" />

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-white/45 tabular-nums">
                      <span>
                        {formatDuration(log.duration)} ·{" "}
                        {Math.round(share * 100)}%
                      </span>
                      <span>
                        {new Date(log.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <PanelFooter>
              <ActionButton
                variant="ghost"
                onClick={onClearLogs}
                className="w-full !text-[11px]"
              >
                Clear all logs
              </ActionButton>
            </PanelFooter>
          </>
        )}
      </GlassPanel>
    </div>
  );
}
