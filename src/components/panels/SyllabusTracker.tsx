"use client";

import { useCallback, useMemo, useState } from "react";
import {
  EmptyState,
  GlassPanel,
  PanelBadge,
  PanelBody,
  PanelFooter,
  PanelHeader,
  PanelInput,
  ProgressBar,
  IconButton,
  ActionButton,
} from "./panel-primitives";

export interface Subject {
  id: number;
  subject: string;
  totalChapters: number;
  completedChapters: number;
}

interface SyllabusTrackerProps {
  subjects: Subject[];
  onAdd: (subject: string) => void;
  onRemove: (id: number) => void;
  onSetTotal: (id: number, next: number) => void;
  onStepCompleted: (id: number, delta: number) => void;
  onResetProgress: () => void;
  /** Set when a rejected add needs to surface to the user. */
  error: string | null;
  onErrorConsumed: () => void;
}

const MAX_SUBJECT_LENGTH = 60;
const MAX_CHAPTERS = 999;
const MAX_STAGGER_INDEX = 8;

const BookIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M5 3h11a3 3 0 0 1 3 3v15a1 1 0 0 1-1.53.85L12 18.6 6.53 21.85A1 1 0 0 1 5 21zm3 5v2h6V8zm0 4v2h6v-2z" />
  </svg>
);

const PlusIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
  </svg>
);

const TrashIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M9 3h6l1 1h4v2H4V4h4zm-3 6h12l-1 12H7z" />
  </svg>
);

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

function StepperButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="panel-focus grid place-items-center w-7 h-7 shrink-0 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/15 transition-all duration-200 active:scale-90 disabled:opacity-25 disabled:pointer-events-none"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
      </svg>
    </button>
  );
}

function Stepper({
  label,
  value,
  onStep,
  max = MAX_CHAPTERS,
  disabled = false,
}: {
  label: string;
  value: number;
  /** Emits a delta rather than an absolute value so the caller can resolve
      it against the latest state instead of a possibly-stale prop. */
  onStep: (delta: number) => void;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] uppercase tracking-[0.12em] text-white/40 font-semibold">
        {label}
      </span>
      <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-1 py-0.5">
        <StepperButton
          label={`Decrease ${label.toLowerCase()}`}
          onClick={() => onStep(-1)}
          disabled={disabled || value <= 0}
        />
        <span
          className="min-w-6 text-center text-sm font-bold tabular-nums text-white/90"
          aria-live="polite"
        >
          {value}
        </span>
        <StepperButton
          label={`Increase ${label.toLowerCase()}`}
          onClick={() => onStep(1)}
          disabled={disabled || value >= max}
        />
      </div>
    </div>
  );
}

/**
 * Syllabus tracker: a subject list with per-subject chapter progress.
 *
 * Interaction split follows how the data is actually used — the total
 * chapter count is entered once (typed number field) while completed
 * chapters are ticked up frequently (stepper).
 *
 * Fully controlled: the dashboard owns the subject list so the study
 * logger can offer the same subjects as logging targets.
 */
export default function SyllabusTracker({
  subjects,
  onAdd,
  onRemove,
  onSetTotal,
  onStepCompleted,
  onResetProgress,
  error,
  onErrorConsumed,
}: SyllabusTrackerProps) {
  const [draft, setDraft] = useState("");

  const submitDraft = useCallback(() => {
    const subject = draft.trim().replace(/\s+/g, " ");
    if (!subject) return;
    onAdd(subject);
    setDraft("");
  }, [draft, onAdd]);

  const totals = useMemo(() => {
    const totalChapters = subjects.reduce((sum, s) => sum + s.totalChapters, 0);
    const completedChapters = subjects.reduce(
      (sum, s) => sum + s.completedChapters,
      0,
    );
    return {
      totalChapters,
      completedChapters,
      progress: totalChapters === 0 ? 0 : completedChapters / totalChapters,
    };
  }, [subjects]);

  const hasProgress = totals.completedChapters > 0;

  return (
    <GlassPanel className="flex flex-col">
      <PanelHeader
        icon={BookIcon}
        title="Syllabus"
        trailing={
          subjects.length > 0 ? (
            <PanelBadge>{Math.round(totals.progress * 100)}%</PanelBadge>
          ) : undefined
        }
      />

      <PanelBody className="pb-3">
        <div className="flex items-center gap-2">
          <PanelInput
            ariaLabel="Add a subject"
            placeholder="Add a subject…"
            value={draft}
            maxLength={MAX_SUBJECT_LENGTH}
            onChange={(value) => {
              setDraft(value);
              if (error) onErrorConsumed();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitDraft();
              }
            }}
          />
          <IconButton
            label="Add subject"
            onClick={submitDraft}
            disabled={draft.trim().length === 0}
            className="bg-teal-500/90 hover:bg-teal-400 text-white border-teal-400/40 shadow-lg shadow-teal-500/25"
          >
            {PlusIcon}
          </IconButton>
        </div>
        {error ? (
          <p
            role="status"
            className="mt-2 text-[11px] font-medium text-rose-300/90 animate-fade-in-up"
          >
            {error}
          </p>
        ) : null}
      </PanelBody>

      {subjects.length === 0 ? (
        <EmptyState
          icon={BookIcon}
          title="No subjects yet"
          hint="Add a subject, set its chapter count, then tick chapters off as you go."
        />
      ) : (
        <>
          <ul className="flex-1 min-h-0 max-h-72 overflow-y-auto glass-scroll px-2 pb-2 space-y-1.5">
            {subjects.map((item, index) => {
              const ratio =
                item.totalChapters > 0
                  ? item.completedChapters / item.totalChapters
                  : 0;
              const isDone = item.totalChapters > 0 && ratio >= 1;
              const isPlanned = item.totalChapters > 0;

              return (
                <li
                  key={item.id}
                  className="animate-panel-item group rounded-xl bg-white/5 border border-white/10 p-3 transition-colors hover:border-white/20"
                  style={{
                    animationDelay: `${Math.min(index, MAX_STAGGER_INDEX) * 35}ms`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="flex-1 min-w-0 truncate text-sm font-semibold text-white/90"
                      title={item.subject}
                    >
                      {item.subject}
                    </span>

                    {isDone ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 border border-teal-400/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-200">
                        {CheckIcon}
                        Done
                      </span>
                    ) : isPlanned ? (
                      <span className="shrink-0 text-[11px] font-semibold tabular-nums text-white/50">
                        {item.completedChapters}/{item.totalChapters}
                      </span>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.subject}`}
                      title="Remove subject"
                      className="panel-focus grid place-items-center w-6 h-6 shrink-0 rounded-lg text-white/25 hover:text-rose-300 hover:bg-rose-500/20 transition-all duration-200 opacity-60 group-hover:opacity-100 focus-visible:opacity-100"
                    >
                      {TrashIcon}
                    </button>
                  </div>

                  <ProgressBar value={ratio} className="mt-2" />

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <label className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-[0.12em] text-white/40 font-semibold">
                        Chapters
                      </span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={MAX_CHAPTERS}
                        step={1}
                        value={item.totalChapters || ""}
                        placeholder="0"
                        aria-label={`Total chapters in ${item.subject}`}
                        onChange={(e) => {
                          const raw = e.target.value;
                          onSetTotal(
                            item.id,
                            raw === "" ? 0 : parseInt(raw, 10),
                          );
                        }}
                        className="panel-focus no-spin w-14 rounded-lg bg-white/10 border border-white/15 px-2 py-1 text-sm font-bold tabular-nums text-white/90 text-center placeholder-white/25 transition-colors focus:bg-white/15 focus:border-teal-400/50"
                      />
                    </label>

                    <Stepper
                      label="Done"
                      value={item.completedChapters}
                      onStep={(delta) => onStepCompleted(item.id, delta)}
                      max={item.totalChapters}
                      disabled={!isPlanned}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <PanelFooter>
            <div className="flex items-center gap-3">
              <span className="tabular-nums shrink-0">
                {totals.completedChapters} / {totals.totalChapters} chapters
              </span>
              {hasProgress ? (
                <ActionButton
                  variant="ghost"
                  onClick={onResetProgress}
                  className="ml-auto !px-2 !py-1 !text-[11px]"
                >
                  Reset progress
                </ActionButton>
              ) : null}
            </div>
          </PanelFooter>
        </>
      )}
    </GlassPanel>
  );
}
