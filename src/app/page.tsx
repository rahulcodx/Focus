"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import ShareModal from "../components/ShareModal";
import SoundModal from "../components/SoundModal";
import MusicModal from "../components/MusicModal";
import SettingsModal from "../components/SettingsModal";
import AuthModal from "../components/AuthModal";
import TaskList from "../components/panels/TaskList";
import SyllabusTracker, {
  type Subject,
} from "../components/panels/SyllabusTracker";
import StudyLogger, { type StudyLogEntry } from "../components/panels/StudyLogger";
import { ProgressBar } from "../components/panels/panel-primitives";
import { useAuth } from "@/contexts/AuthContext";

const MAX_SUBJECTS = 60;
const MAX_CHAPTERS = 999;

const TIMER_MODES = [
  { id: "focus", label: "Focus" },
  { id: "shortBreak", label: "Short Break" },
  { id: "longBreak", label: "Long Break" },
] as const;

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

export default function Dashboard() {
  const { loading } = useAuth();

  const [time, setTime] = useState(new Date());
  const [activeIcon, setActiveIcon] = useState("home");
  const [activeGroup, setActiveGroup] = useState("home"); // For timer/home/idea group
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [timerTime, setTimerTime] = useState(25 * 60); // Start at 25 minutes for timer mode
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<
    "focus" | "shortBreak" | "longBreak"
  >("focus");
  const focusDuration = 25;
  const shortBreakDuration = 5;
  const longBreakDuration = 15;
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [showHoursInEdit, setShowHoursInEdit] = useState(false);
  const [editHours, setEditHours] = useState("00");
  const [editMinutes, setEditMinutes] = useState("25");
  const [editSeconds, setEditSeconds] = useState("00");
  const [isStudyLogsMode, setIsStudyLogsMode] = useState(false);
  const [studyLogs, setStudyLogs] = useState<StudyLogEntry[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState(
    "https://open.spotify.com/embed/playlist/4Zjli1P13J5mmSCD5iKAXK?utm_source=generator&theme=0",
  );
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState(
    "https://i.pinimg.com/originals/14/ae/7e/14ae7ede205573466d68eb3a562fe349.gif",
  );
  const [embedVisible, setEmbedVisible] = useState(false);
  const [syllabus, setSyllabus] = useState<Subject[]>([]);
  const [syllabusError, setSyllabusError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const [playSound, setPlaySound] = useState(true);
  const nextSubjectId = useRef(1);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      if (isStudyLogsMode) {
        // Count up for study logs
        interval = setInterval(() => {
          setTimerTime((time) => time + 1);
        }, 1000);
      } else {
        // Count down for regular timer
        interval = setInterval(() => {
          setTimerTime((time) => {
            if (time > 0) {
              return time - 1;
            } else {
              // Timer reached zero
              setIsTimerRunning(false);
              return 0;
            }
          });
        }, 1000);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isStudyLogsMode]);

  // Handle timer completion
  useEffect(() => {
    if (timerTime === 0 && isTimerRunning && !isStudyLogsMode) {
      if (playSound) {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.play().catch(e => console.error("Audio play failed:", e));
      }

      if (autoSwitch) {
        const nextMode = timerMode === "focus" ? "shortBreak" : "focus";
        switchTimerMode(nextMode);
        // Delay starting the next timer slightly to ensure state is updated
        setTimeout(() => setIsTimerRunning(true), 100);
      } else {
        setIsTimerRunning(false);
      }
    }
  }, [timerTime, isTimerRunning, isStudyLogsMode, autoSwitch, playSound, timerMode, focusDuration, shortBreakDuration, longBreakDuration]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}`;
  };

  const formatTimerTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Show HH:MM:SS only when hours > 0, otherwise show MM:SS
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
  };

  const handleEditTime = () => {
    if (isEditingTime) {
      // Save the edited time
      const hours = parseInt(editHours) || 0;
      const minutes = parseInt(editMinutes) || 0;
      const seconds = parseInt(editSeconds) || 0;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      setTimerTime(totalSeconds);
      setIsEditingTime(false);
    } else {
      // Enter edit mode
      const hours = Math.floor(timerTime / 3600);
      const mins = Math.floor((timerTime % 3600) / 60);
      const secs = timerTime % 60;
      setEditHours(hours.toString().padStart(2, "0"));
      setEditMinutes(mins.toString().padStart(2, "0"));
      setEditSeconds(secs.toString().padStart(2, "0"));
      setShowHoursInEdit(hours > 0);
      setIsEditingTime(true);
    }
  };

  const switchTimerMode = (mode: "focus" | "shortBreak" | "longBreak") => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    if (mode === "focus") {
      setTimerTime(focusDuration * 60);
    } else if (mode === "shortBreak") {
      setTimerTime(shortBreakDuration * 60);
    } else {
      setTimerTime(longBreakDuration * 60);
    }
  };

  const addSubject = useCallback(
    (subject: string) => {
      if (syllabus.length >= MAX_SUBJECTS) {
        setSyllabusError(`Up to ${MAX_SUBJECTS} subjects.`);
        return;
      }
      if (
        syllabus.some((s) => s.subject.toLowerCase() === subject.toLowerCase())
      ) {
        setSyllabusError(`"${subject}" is already tracked.`);
        return;
      }
      setSyllabus((prev) => [
        ...prev,
        {
          id: nextSubjectId.current++,
          subject,
          totalChapters: 0,
          completedChapters: 0,
        },
      ]);
      setSyllabusError(null);
    },
    [syllabus],
  );

  const removeSubject = useCallback((id: number) => {
    setSyllabus((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const setSubjectTotal = useCallback((id: number, next: number) => {
    const value = Math.max(0, Math.min(MAX_CHAPTERS, next || 0));
    setSyllabus((prev) =>
      prev.map((s) =>
        // Shrinking the total can strand `completedChapters` above it.
        s.id === id
          ? {
              ...s,
              totalChapters: value,
              completedChapters: Math.min(s.completedChapters, value),
            }
          : s,
      ),
    );
  }, []);

  /** Applies a stepper delta against current state, so rapid clicks
      (which share one render) still accumulate correctly. */
  const stepSubjectCompleted = useCallback((id: number, delta: number) => {
    setSyllabus((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              completedChapters: Math.max(
                0,
                Math.min(s.completedChapters + delta, s.totalChapters),
              ),
            }
          : s,
      ),
    );
  }, []);

  const resetSyllabusProgress = useCallback(() => {
    setSyllabus((prev) => prev.map((s) => ({ ...s, completedChapters: 0 })));
  }, []);

  /** Subjects offered as logging targets: syllabus first, then past logs. */
  const loggableSubjects = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const name of [
      ...syllabus.map((s) => s.subject),
      ...studyLogs.map((l) => l.subject),
    ]) {
      const key = name.toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        out.push(name);
      }
    }
    return out;
  }, [syllabus, studyLogs]);

  const logStudySession = useCallback(
    (subject: string) => {
      setStudyLogs((prev) => {
        const existing = prev.findIndex(
          (log) => log.subject.toLowerCase() === subject.toLowerCase(),
        );
        if (existing >= 0) {
          const next = [...prev];
          next[existing] = {
            ...next[existing],
            duration: next[existing].duration + timerTime,
          };
          return next;
        }
        return [
          ...prev,
          { subject, duration: timerTime, date: new Date().toISOString() },
        ];
      });
      setTimerTime(0);
      setIsTimerRunning(false);
    },
    [timerTime],
  );

  const deleteStudyLog = useCallback((index: number) => {
    setStudyLogs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearStudyLogs = useCallback(() => setStudyLogs([]), []);

  /** Throw away an in-progress manual study session. */
  const discardStudySession = useCallback(() => {
    setTimerTime(0);
    setIsTimerRunning(false);
  }, []);

  const resetTimer = () => {
    if (timerMode === "focus") {
      setTimerTime(focusDuration * 60);
    } else if (timerMode === "shortBreak") {
      setTimerTime(shortBreakDuration * 60);
    } else {
      setTimerTime(longBreakDuration * 60);
    }
    setIsTimerRunning(false);
  };

  const modeSeconds =
    timerMode === "focus"
      ? focusDuration * 60
      : timerMode === "shortBreak"
        ? shortBreakDuration * 60
        : longBreakDuration * 60;

  const sessionProgress = modeSeconds > 0 ? 1 - timerTime / modeSeconds : 0;

  const openMiniWindow = () => {
    const currentTime = timerTime;
    const bgUrl = backgroundUrl;
    const miniWindow = window.open("", "MiniTimer", "width=400,height=250");
    if (miniWindow) {
      miniWindow.document.write(`
        <html>
          <head>
            <title>Mini Timer - Focus</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-image: url('${bgUrl}');
                background-size: cover;
                background-position: center;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                position: relative;
              }
              body::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%);
              }
              .content { position: relative; z-index: 10; text-align: center; }
              .timer { font-size: 3.5rem; font-weight: bold; margin-bottom: 1rem; }
              .controls { margin-top: 1rem; }
              button {
                background: rgba(255,255,255,0.2);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                margin: 0 0.5rem;
                border-radius: 0.75rem;
                cursor: pointer;
                font-size: 1rem;
                font-weight: bold;
                transition: all 0.3s;
              }
              button:hover { background: rgba(255,255,255,0.3); }
            </style>
          </head>
          <body>
            <div class="content">
              <div class="timer" id="timer">${Math.floor(currentTime / 60)
          .toString()
          .padStart(
            2,
            "0",
          )}:${(currentTime % 60).toString().padStart(2, "0")}</div>
              <div class="controls">
                <button id="start">Start</button>
                <button id="close">Close</button>
              </div>
            </div>
            <script>
              let time = ${currentTime};
              let running = false;
              let interval;

              function updateTimer() {
                if (time >= 3600) {
                  const hours = Math.floor(time / 3600);
                  const mins = Math.floor((time % 3600) / 60);
                  const secs = time % 60;
                  document.getElementById('timer').textContent = hours.toString().padStart(2, '0') + ':' + mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
                } else {
                  const mins = Math.floor(time / 60);
                  const secs = time % 60;
                  document.getElementById('timer').textContent = mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
                }
              }

              document.getElementById('start').addEventListener('click', () => {
                running = !running;
                document.getElementById('start').textContent = running ? 'Pause' : 'Start';
                if (running) {
                  interval = setInterval(() => {
                    if (time > 0) {
                      time--;
                      updateTimer();
                    } else {
                      running = false;
                      document.getElementById('start').textContent = 'Start';
                      clearInterval(interval);
                    }
                  }, 1000);
                } else {
                  clearInterval(interval);
                }
              });

              document.getElementById('close').addEventListener('click', () => {
                window.close();
              });

              updateTimer();
            </script>
          </body>
        </html>
      `);
    }
  };

  const handleIdeaClick = () => {
    setIsStudyLogsMode(true);
    setIsTimerMode(false);
    setTimerTime(0);
    setIsTimerRunning(false);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  const handleIconClick = (iconName: string) => {
    setActiveIcon(iconName);
  };

  const handleGroupClick = (groupName: string) => {
    setActiveGroup(groupName);
    setActiveIcon(groupName);
    if (groupName === "timer") {
      setIsTimerMode(true);
      setIsStudyLogsMode(false);
      setTimerMode("focus");
      setTimerTime(focusDuration * 60);
      setIsTimerRunning(false);
    } else if (groupName === "home") {
      setIsTimerMode(false);
      setIsStudyLogsMode(false);
      setTimerTime(25 * 60);
      setIsTimerRunning(false);
    } else if (groupName === "idea") {
      handleIdeaClick();
    }
  };

  const motivationalTexts = [
    "Stay focused, achieve greatness!",
    "Every moment counts, make it productive!",
    "Your future self will thank you!",
    "Small steps lead to big achievements!",
    "Consistency is the key to success!",
    "Push through, you're almost there!",
    "Believe in yourself and your abilities!",
    "Make today amazing!",
    "You're capable of incredible things!",
    "Stay determined, stay focused!",
    "Success is a journey, not a destination!",
    "Keep going, you're doing great!",
    "Your hard work will pay off!",
    "Dream big, work hard!",
    "Stay positive, work hard!",
    "You're stronger than you think!",
    "Make every second count!",
    "Focus on your goals!",
    "You're on the right path!",
    "Keep pushing forward!",
    "Success starts with focus!",
    "Embrace the challenge!",
    "Rise above the ordinary!",
    "Unlock your potential!",
    "Chase your dreams relentlessly!",
    "Turn obstacles into opportunities!",
    "Inspire others with your actions!",
    "Build habits that last!",
    "Celebrate small victories!",
    "Learn from every experience!",
    "Adapt and overcome!",
    "Visualize your success!",
    "Stay hungry for knowledge!",
    "Lead with purpose!",
    "Innovate and create!",
    "Persevere through difficulties!",
    "Find joy in the process!",
    "Balance work and rest!",
    "Nurture your passions!",
    "Connect with like-minded people!",
    "Reflect and grow!",
    "Aim high, achieve more!",
  ];

  // Note: kept after every hook so the hook order stays stable while
  // the auth provider resolves.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background + overlay are fixed so the content column can scroll
          underneath them without dragging the artwork along. */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
      />
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)",
        }}
      />
      {/* Logo */}
      <div className="fixed top-6 left-6 z-30">
        <div className="text-white">
          <div className="text-6xl font-bold">focus</div>
          <div className="text-[10px] text-white text-right">
            by RAHULCODX
          </div>
        </div>
      </div>

      {/* Check Source Code */}
      <div className="fixed top-6 right-6 z-30">
        <a
          href="https://github.com/rahulxdevv/Focus"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 sm:px-4 transition-all duration-300 text-white group shadow-lg"
          title="Check Source Code"
        >
          <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.61-4.041-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span className="text-sm font-bold tracking-wide hidden sm:inline">Check Source Code</span>
        </a>
      </div>

      {/* Main Content — `m-auto` on the inner column keeps the clock centred
          on tall screens without clipping the top of an overflowing view. */}
      <div className="relative z-20 w-full min-h-screen flex px-4 sm:px-6">
        <div className="m-auto w-full flex flex-col items-center py-24">
        {!isTimerMode && !isStudyLogsMode ? (
          <>
            {/* Motivational Text and Real-time Clock Centered */}
            <div className="text-center">
              {/* Motivational Text */}
              <div className="-mb-10">
                <h1 className="text-white text-3xl font-bold">
                  {motivationalTexts[time.getDay()]}
                </h1>
              </div>

              {/* Real-time Clock */}
              <div className="text-white text-[12rem] font-bold font-avion tracking-wider">
                {formatTime(time)}
              </div>
            </div>
          </>
        ) : isStudyLogsMode ? (
          <StudyLogger
            elapsed={timerTime}
            isRunning={isTimerRunning}
            onToggle={() => setIsTimerRunning((running) => !running)}
            onLog={logStudySession}
            onDiscard={discardStudySession}
            logs={studyLogs}
            onDeleteLog={deleteStudyLog}
            onClearLogs={clearStudyLogs}
            knownSubjects={loggableSubjects}
          />
        ) : (
          <div className="w-full max-w-7xl grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-[17.5rem_minmax(0,1fr)_17.5rem] items-start">
            {/* Left — Syllabus tracker */}
            <div className="order-2 xl:order-1">
              <SyllabusTracker
                subjects={syllabus}
                onAdd={addSubject}
                onRemove={removeSubject}
                onSetTotal={setSubjectTotal}
                onStepCompleted={stepSubjectCompleted}
                onResetProgress={resetSyllabusProgress}
                error={syllabusError}
                onErrorConsumed={() => setSyllabusError(null)}
              />
            </div>

            {/* Center — Timer */}
            <div className="order-1 xl:order-2 md:col-span-2 xl:col-span-1 flex flex-col items-center">
              <div className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/20 shadow-2xl shadow-black/25">
                {/* Mode switcher — `flex` (block-level) so `mx-auto` can
                    actually centre it; `w-fit` keeps it shrink-wrapped. */}
                <div
                  role="radiogroup"
                  aria-label="Timer mode"
                  className="flex w-fit mx-auto items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/15"
                >
                  {TIMER_MODES.map((mode) => {
                    const isActive = timerMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => switchTimerMode(mode.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                          isActive
                            ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>

                {/* Readout */}
                <div className="mt-6 mb-2 flex flex-col items-center">
                  {isEditingTime ? (
                    <>
                      <div className="flex justify-center items-center gap-2">
                        {showHoursInEdit ? (
                          <>
                            <input
                              type="number"
                              inputMode="numeric"
                              value={editHours}
                              min="0"
                              max="99"
                              aria-label="Hours"
                              onChange={(e) => {
                                const val = e.target.value;
                                if (
                                  val === "" ||
                                  (parseInt(val) >= 0 && parseInt(val) <= 99)
                                ) {
                                  setEditHours(val.padStart(2, "0"));
                                }
                              }}
                              onBlur={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setEditHours(
                                  val.toString().padStart(2, "0"),
                                );
                              }}
                              className="no-spin panel-focus w-20 sm:w-24 bg-white/10 text-white text-[clamp(2.5rem,9vw,3.5rem)] leading-none font-bold text-center rounded-xl border border-white/20 focus:border-teal-400/60"
                            />
                            <span className="text-white/40 text-[clamp(2.5rem,9vw,3.5rem)] leading-none font-bold">
                              :
                            </span>
                          </>
                        ) : null}
                        <input
                          type="number"
                          inputMode="numeric"
                          value={editMinutes}
                          min="0"
                          max="59"
                          aria-label="Minutes"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (
                              val === "" ||
                              (parseInt(val) >= 0 && parseInt(val) <= 59)
                            ) {
                              setEditMinutes(val.padStart(2, "0"));
                            }
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setEditMinutes(
                              Math.min(59, val).toString().padStart(2, "0"),
                            );
                          }}
                          className="no-spin panel-focus w-20 sm:w-24 bg-white/10 text-white text-[clamp(2.5rem,9vw,3.5rem)] leading-none font-bold text-center rounded-xl border border-white/20 focus:border-teal-400/60"
                        />
                        <span className="text-white/40 text-[clamp(2.5rem,9vw,3.5rem)] leading-none font-bold">
                          :
                        </span>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={editSeconds}
                          min="0"
                          max="59"
                          aria-label="Seconds"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (
                              val === "" ||
                              (parseInt(val) >= 0 && parseInt(val) <= 59)
                            ) {
                              setEditSeconds(val.padStart(2, "0"));
                            }
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setEditSeconds(
                              Math.min(59, val).toString().padStart(2, "0"),
                            );
                          }}
                          className="no-spin panel-focus w-20 sm:w-24 bg-white/10 text-white text-[clamp(2.5rem,9vw,3.5rem)] leading-none font-bold text-center rounded-xl border border-white/20 focus:border-teal-400/60"
                        />
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowHoursInEdit((v) => !v)}
                          className="text-[11px] font-semibold text-white/50 hover:text-white transition-colors"
                        >
                          {showHoursInEdit ? "Hide hours" : "Add hours"}
                        </button>
                        <button
                          type="button"
                          onClick={handleEditTime}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-400 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  ) : (
                    /* tabular-nums keeps the readout from shifting as digits change */
                    <div
                      role="timer"
                      aria-label={`${Math.floor(timerTime / 60)} minutes ${timerTime % 60} seconds remaining`}
                      className="text-white text-[clamp(3.5rem,14vw,5.5rem)] leading-none font-bold tabular-nums tracking-tight"
                    >
                      {formatTimerTime(timerTime)}
                    </div>
                  )}
                </div>

                {/* Session progress */}
                {!isEditingTime ? (
                  <ProgressBar value={sessionProgress} className="mt-4" />
                ) : null}

                {/* Controls */}
                <div className="mt-6 flex items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleEditTime}
                    className="panel-focus inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white/50 hover:text-white hover:bg-white/10 border border-transparent transition-all duration-200"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                    {isEditingTime ? "Cancel" : "Edit"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTimerRunning((running) => !running)}
                    className="panel-focus inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-400 shadow-lg shadow-teal-500/25 border border-teal-400/40 transition-all duration-200 active:scale-[0.98]"
                  >
                    {isTimerRunning ? PauseIcon : PlayIcon}
                    {isTimerRunning ? "Pause" : "Start"}
                  </button>

                  <button
                    type="button"
                    onClick={resetTimer}
                    className="panel-focus inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/20 border border-white/20 transition-all duration-200 active:scale-[0.98]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7" />
                    </svg>
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={openMiniWindow}
                    aria-label="Open mini timer in a small window"
                    title="Open mini timer in a small window"
                    className="panel-focus grid place-items-center w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200 active:scale-95"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M9 4H4v5M20 9V4h-5M15 20h5v-5M4 15v5h5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right — Tasks */}
            <div className="order-3">
              <TaskList />
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Spotify Embed */}
      {embedVisible && (
        <div className="fixed bottom-20 left-6 z-30">
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: "12px" }}
            src={spotifyUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-6 right-6 flex justify-between items-end z-30 pointer-events-none">
        {/* Left Side - Music and Sound */}
        <div className="flex gap-3 pointer-events-auto">
          <button
            type="button"
            aria-label="Music"
            aria-pressed={showMusicModal}
            onClick={() => {
              if (activeIcon === "music") {
                handleIconClick("home");
                setShowMusicModal(false);
              } else {
                handleIconClick("music");
                setShowMusicModal(true);
              }
            }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer ${activeIcon === "music"
              ? "bg-teal-500/90 shadow-lg shadow-teal-500/40 border-teal-400/50"
              : "bg-white/5"
              }`}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 21q-1.65 0-2.825-1.175T6 17t1.175-2.825T10 13q.575 0 1.063.138t.937.412V4q0-.425.288-.712T13 3h4q.425 0 .713.288T18 4v2q0 .425-.288.713T17 7h-3v10q0 1.65-1.175 2.825T10 21" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Ambient sounds"
            aria-pressed={showSoundModal}
            onClick={() => {
              if (activeIcon === "sound") {
                handleIconClick("home");
                setShowSoundModal(false);
              } else {
                handleIconClick("sound");
                setShowSoundModal(true);
              }
            }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer ${activeIcon === "sound"
              ? "bg-teal-500/90 shadow-lg shadow-teal-500/40 border-teal-400/50"
              : "bg-white/5"
              }`}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9.025 22q-.35 0-.612-.187T8.05 21.3L5.5 13H3q-.425 0-.712-.288T2 12t.288-.712T3 11h3.25q.325 0 .588.188t.362.512l1.65 5.375L12.025 2.8q.075-.35.35-.575T13 2t.625.213t.35.562l2.175 9.4l1.4-4.475q.1-.325.362-.512T18.5 7t.575.175t.375.475L20.7 11h.3q.425 0 .713.288T22 12t-.288.713T21 13h-1q-.325 0-.575-.175t-.375-.475l-.475-1.275L16.95 16.3q-.1.325-.375.525T15.95 17t-.6-.238t-.325-.537L13 7.525l-3.025 13.7q-.075.35-.337.55T9.025 22" />
            </svg>
          </button>
        </div>

        {/* Right Side - Grouped Timer/Home/Idea + Individual Icons */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Grouped Timer/Home/Idea with sliding indicator */}
          <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20">
            {/* Sliding background indicator */}
            <div
              className={`absolute top-1 bottom-1 w-8 rounded-xl bg-teal-500/90 shadow-lg shadow-teal-500/40 transition-all duration-500 ease-out ${activeGroup === "timer"
                ? "left-1"
                : activeGroup === "home"
                  ? "left-9"
                  : "left-17"
                }`}
            />

            <button
              type="button"
              aria-label="Focus timer"
              aria-pressed={activeGroup === "timer"}
              onClick={() => handleGroupClick("timer")}
              className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer z-10"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 3q-.425 0-.712-.288T9 2t.288-.712T10 1h4q.425 0 .713.288T15 2t-.288.713T14 3zm2 11q.425 0 .713-.288T13 13V9q0-.425-.288-.712T12 8t-.712.288T11 9v4q0 .425.288.713T12 14m0 8q-1.85 0-3.488-.712T5.65 19.35t-1.937-2.863T3 13t.713-3.488T5.65 6.65t2.863-1.937T12 4q1.55 0 2.975.5t2.675 1.45l.7-.7q.275-.275.7-.275t.7.275t.275.7t-.275.7l-.7.7Q20 8.6 20.5 10.025T21 13q0 1.85-.713 3.488T18.35 19.35t-2.863 1.938T12 22m0-2q2.9 0 4.95-2.05T19 13t-2.05-4.95T12 6T7.05 8.05T5 13t2.05 4.95T12 20m0-7" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Clock"
              aria-pressed={activeGroup === "home"}
              onClick={() => handleGroupClick("home")}
              className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer z-10"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-3q-.425 0-.712-.288T14 20v-5q0-.425-.288-.712T13 14h-2q-.425 0-.712.288T10 15v5q0 .425-.288.713T9 21H6q-.825 0-1.412-.587T4 19" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Study log"
              aria-pressed={activeGroup === "idea"}
              onClick={() => handleGroupClick("idea")}
              className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer z-10"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 17q-.425 0-.712-.288T7 16t.288-.712T8 15h3q-.35-.425-.562-.937T10.1 13H5.5q-.425 0-.712-.288T4.5 12t.288-.712T5.5 11h4.6q.125-.55.338-1.062T11 9H5q-.425 0-.712-.288T4 8t.288-.712T5 7h10q2.075 0 3.538 1.463T20 12t-1.463 3.538T15 17zm7-2q1.25 0 2.125-.875T18 12t-.875-2.125T15 9t-2.125.875T12 12t.875 2.125T15 15M5 17q-.425 0-.712-.288T4 16t.288-.712T5 15t.713.288T6 16t-.288.713T5 17" />
              </svg>
            </button>
          </div>

          {/* Individual buttons */}
          <button
            type="button"
            aria-label="Share"
            aria-pressed={showShareModal}
            onClick={() => {
              if (activeIcon === "share") {
                handleIconClick("home");
                setShowShareModal(false);
              } else {
                handleIconClick("share");
                setShowShareModal(true);
              }
            }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer ${activeIcon === "share"
              ? "bg-teal-500/90 shadow-lg shadow-teal-500/40 border-teal-400/50"
              : "bg-white/5"
              }`}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 18q-1.25 0-2.125-.875T1 15V9q0-1.25.875-2.125T4 6h11.175q.425 0 .713.288t.287.712t-.288.713t-.712.287H4q-.425 0-.712.288T3 9v6q0 .425.288.713T4 16h6q.425 0 .713.288T11 17t-.288.713T10 18zm-1-2V8zm11 0q.425 0 .713-.288T15 15v-2h4.175l-.875.875q-.3.3-.3.7t.3.7t.713.3t.712-.3L22.3 12.7q.3-.3.3-.7t-.3-.7l-2.6-2.6q-.275-.275-.687-.287T18.3 8.7q-.275.275-.275.7t.275.7l.875.9H15q-.825 0-1.412.588T13 13v2q0 .425.288.713T14 16" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Settings"
            aria-pressed={showSettingsModal}
            onClick={() => {
              if (activeIcon === "settings") {
                handleIconClick("home");
                setShowSettingsModal(false);
              } else {
                handleIconClick("settings");
                setShowSettingsModal(true);
              }
            }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer ${activeIcon === "settings"
              ? "bg-teal-500/90 shadow-lg shadow-teal-500/40 border-teal-400/50"
              : "bg-white/5"
              }`}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17 22q-2.075 0-3.537-1.463T12 17t1.463-3.537T17 12t3.538 1.463T22 17t-1.463 3.538T17 22m2.2-2.85q.125-.125.063-.3t-.238-.2q-.65-.125-1.213-.488T16.9 17.2t-.387-1.275t.187-1.3q.05-.175-.062-.313t-.288-.087q-1.675.3-2.287 1.9t.487 2.975q.875 1.1 2.3 1.125t2.35-1.075M10.575 22q-.6 0-1-.462t-.5-1.088L8.85 18.8q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337l-1.325-1Q2.675 9.9 2.525 9.25t.2-1.225L3.9 5.975q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.563-.375t.612-.3l.225-1.65q.1-.65.6-1.1t1.15-.45h2.35q.65 0 1.15.45t.6 1.1l.225 1.65q.325.125.613.3t.562.375l1.55-.65q.625-.275 1.25-.05t.975.8l1.175 2.05q.35.575.2 1.225t-.675 1.075l-.2.15q-.2.15-.425.162t-.45-.087q-.525-.225-1.062-.363t-1.113-.162q-.625-.05-1.237.05t-1.238.175q-.475-.8-1.275-1.275T12.05 8.5q-1.45 0-2.475 1.025T8.55 12q0 .95.475 1.763t1.3 1.287q-.175.5-.25 1.025T10 17.125q0 1.05.338 2.038t.937 1.862q.2.3-.025.638t-.675.337" />
            </svg>
          </button>

          <button
            type="button"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={() => {
              handleIconClick("fullscreen");
              toggleFullscreen();
            }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer bg-white/5"
          >
            {isFullscreen ? (
              // Exit fullscreen icon
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 18H4q-.425 0-.712-.288T3 17t.288-.712T4 16h3q.425 0 .713.288T8 17v3q0 .425-.288.713T7 21t-.712-.288T6 20zm12 0v2q0 .425-.288.713T17 21t-.712-.288T16 20v-3q0-.425.288-.712T17 16h3q.425 0 .713.288T21 17t-.288.713T20 18zM6 6V4q0-.425.288-.712T7 3t.713.288T8 4v3q0 .425-.288.713T7 8H4q-.425 0-.712-.288T3 7t.288-.712T4 6zm12 0h2q.425 0 .713.288T21 7t-.288.713T20 8h-3q-.425 0-.712-.288T16 7V4q0-.425.288-.712T17 3t.713.288T18 4z" />
              </svg>
            ) : (
              // Enter fullscreen icon
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 19h2q.425 0 .713.288T8 20t-.288.713T7 21H4q-.425 0-.712-.288T3 20v-3q0-.425.288-.712T4 16t.713.288T5 17zm14 0v-2q0-.425.288-.712T20 16t.713.288T21 17v3q0 .425-.288.713T20 21h-3q-.425 0-.712-.288T16 20t.288-.712T17 19zM5 5v2q0 .425-.288.713T4 8t-.712-.288T3 7V4q0-.425.288-.712T4 3h3q.425 0 .713.288T8 4t-.288.713T7 5zm14 0h-2q-.425 0-.712-.288T16 4t.288-.712T17 3h3q.425 0 .713.288T21 4v3q0 .425-.288-.713T20 8t-.712-.288T19 7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setActiveIcon("home"); // Reset to default when modal closes
        }}
      />

      {/* Sound Modal */}
      <SoundModal
        isOpen={showSoundModal}
        onClose={() => {
          setShowSoundModal(false);
          setActiveIcon("home"); // Reset to default when modal closes
        }}
      />

      {/* Music Modal */}
      <MusicModal
        isOpen={showMusicModal}
        onClose={() => {
          setShowMusicModal(false);
          setActiveIcon("home"); // Reset to default when modal closes
        }}
        onUpdate={setSpotifyUrl}
        onToggleEmbed={() => setEmbedVisible(!embedVisible)}
        embedVisible={embedVisible}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
          setActiveIcon("home"); // Reset to default when modal closes
        }}
        onBackgroundChange={setBackgroundUrl}
        currentBackground={backgroundUrl}
        onOpenAuth={() => setShowAuthModal(true)}
        autoSwitch={autoSwitch}
        setAutoSwitch={setAutoSwitch}
        playSound={playSound}
        setPlaySound={setPlaySound}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
