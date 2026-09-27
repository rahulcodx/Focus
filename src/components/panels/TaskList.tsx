"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActionButton,
  EmptyState,
  GlassPanel,
  PanelBadge,
  PanelBody,
  PanelFooter,
  PanelHeader,
  PanelInput,
  ProgressBar,
  IconButton,
} from "./panel-primitives";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const MAX_TASKS = 200;
const MAX_TASK_LENGTH = 120;
const MAX_STAGGER_INDEX = 8;

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
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

const ListIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M4 5h2v2H4zm4 0h12v2H8zM4 11h2v2H4zm4 0h12v2H8zm-4 6h2v2H4zm4 0h12v2H8z" />
  </svg>
);

/**
 * Task list for the current focus session.
 *
 * Owns its own state — nothing outside this panel reads it — so the
 * dashboard stays free of task bookkeeping. The list is intentionally
 * session-scoped rather than persisted: the timer view is a scratchpad
 * for the session you are running right now.
 */
export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState("");
  const nextId = useRef(1);

  const addTask = useCallback(() => {
    const text = draft.trim().replace(/\s+/g, " ");
    if (!text) return;
    setTasks((prev) => {
      if (prev.length >= MAX_TASKS) return prev;
      return [...prev, { id: nextId.current++, text, completed: false }];
    });
    setDraft("");
  }, [draft]);

  const toggleTask = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const removeTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  const { completedCount, remaining, progress } = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    return {
      completedCount: completed,
      remaining: tasks.length - completed,
      progress: tasks.length === 0 ? 0 : completed / tasks.length,
    };
  }, [tasks]);

  const canAdd = draft.trim().length > 0 && tasks.length < MAX_TASKS;

  return (
    <GlassPanel className="flex flex-col">
      <PanelHeader
        icon={ListIcon}
        title="Tasks"
        trailing={
          tasks.length > 0 ? (
            <PanelBadge>
              {completedCount}/{tasks.length}
            </PanelBadge>
          ) : undefined
        }
      />

      <PanelBody className="pb-3">
        <div className="flex items-center gap-2">
          <PanelInput
            ariaLabel="Add a task"
            placeholder="What needs doing?"
            value={draft}
            maxLength={MAX_TASK_LENGTH}
            onChange={setDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTask();
              }
            }}
          />
          <IconButton
            label="Add task"
            onClick={addTask}
            disabled={!canAdd}
            className="bg-teal-500/90 hover:bg-teal-400 text-white border-teal-400/40 shadow-lg shadow-teal-500/25"
          >
            {PlusIcon}
          </IconButton>
        </div>
      </PanelBody>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListIcon}
          title="No tasks yet"
          hint="Add the one thing you want to finish in this session."
        />
      ) : (
        <>
          <ul className="flex-1 min-h-0 max-h-72 overflow-y-auto glass-scroll px-2 pb-2 space-y-0.5">
            {tasks.map((task, index) => (
              <li
                key={task.id}
                className="animate-panel-item group flex items-start gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-white/5"
                style={{
                  animationDelay: `${Math.min(index, MAX_STAGGER_INDEX) * 30}ms`,
                }}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={task.completed}
                  aria-label={task.completed ? `Mark "${task.text}" as not done` : `Mark "${task.text}" as done`}
                  onClick={() => toggleTask(task.id)}
                  className={`panel-focus mt-0.5 grid place-items-center w-5 h-5 shrink-0 rounded-md border-2 transition-all duration-200 ${
                    task.completed
                      ? "bg-teal-500 border-teal-500"
                      : "border-white/40 hover:border-teal-400"
                  }`}
                >
                  {task.completed ? (
                    <span className="text-white animate-fade-in-up">{CheckIcon}</span>
                  ) : null}
                </button>

                <span
                  className={`flex-1 min-w-0 text-sm leading-snug break-words transition-colors duration-200 ${
                    task.completed ? "text-white/35 line-through" : "text-white/90"
                  }`}
                >
                  {task.text}
                </span>

                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  aria-label={`Delete task "${task.text}"`}
                  title="Delete task"
                  className="panel-focus grid place-items-center w-6 h-6 shrink-0 rounded-lg text-white/25 hover:text-rose-300 hover:bg-rose-500/20 transition-all duration-200 opacity-60 group-hover:opacity-100 focus-visible:opacity-100"
                >
                  {TrashIcon}
                </button>
              </li>
            ))}
          </ul>

          <PanelFooter>
            <div className="flex items-center gap-3">
              <ProgressBar value={progress} className="flex-1" />
              <span className="shrink-0 tabular-nums">
                {remaining === 0 ? "All done" : `${remaining} left`}
              </span>
              {completedCount > 0 ? (
                <ActionButton
                  variant="ghost"
                  onClick={clearCompleted}
                  className="!px-2 !py-1 !text-[11px]"
                >
                  Clear done
                </ActionButton>
              ) : null}
            </div>
          </PanelFooter>
        </>
      )}
    </GlassPanel>
  );
}
