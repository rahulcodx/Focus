"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost } from "@/lib/api-client";

interface TimerProps {
  compact?: boolean;
}

export default function Timer({ compact = false }: TimerProps) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"pomodoro" | "short" | "long" | "custom">("pomodoro");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [stats, setStats] = useState({ todaySessions: 0, totalMinutes: 0, thisWeekSessions: 0 });
  const [baselineTotalMinutes, setBaselineTotalMinutes] = useState(0);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);

  const presets = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
    custom: customMinutes * 60,
  };

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiGet('/api/stats/dashboard');
      if (response.success) {
        const totalSeconds = response.data.overview.totalFocusTime || 0;
        const totalMinutes = Math.floor(totalSeconds / 60);
        
        const newStats = {
          todaySessions: response.data.today.sessions || 0,
          totalMinutes: totalMinutes,
          thisWeekSessions: response.data.overview.thisWeekSessions || 0
        };
        setStats(newStats);
        setBaselineTotalMinutes(newStats.totalMinutes);
        console.log('Stats updated:', { totalMinutes, todaySessions: response.data.today.sessions, thisWeekSessions: response.data.overview.thisWeekSessions });
      } else {
        console.error('Failed to fetch stats:', response);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    // interval effect moved below so completeSession is defined before usage
  }, [fetchStats]);

  

  const formatTimeDisplay = (totalMinutes: number): string => {
    if (totalMinutes < 60) {
      return `${totalMinutes}m`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (mins === 0) {
      return `${hours}h`;
    }
    // Format as decimal for cleaner display (e.g., 2.5h instead of 2h 30m)
    const decimal = (mins / 60).toFixed(1);
    return `${hours}.${decimal.split('.')[1]}h`;
  };

  const startSession = async () => {
    try {
      const response = await apiPost('/api/sessions', {
        type: mode,
        duration: presets[mode]
      });

      if (response.success) {
        setCurrentSessionId(response.data._id);
      }
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const awardPoints = useCallback(async (points: number, reason: string) => {
    try {
      const response = await apiPost('/api/user/award-points', { points, reason });
      if (response.success) {
        console.log(`Awarded ${points} points for: ${reason}`);
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  }, []);

  const completeSession = useCallback(async () => {
    if (!currentSessionId) return;

    try {
      console.log('Completing session:', currentSessionId);
      await apiPost(`/api/sessions/${currentSessionId}/complete`, {});
      setCurrentSessionId(null);

      // Award points for completing a session
      const pointsEarned = mode === 'pomodoro' ? 10 : mode === 'short' ? 5 : mode === 'long' ? 15 : 8;
      await awardPoints(pointsEarned, `Completed ${mode} session`);
      
      // Refresh stats after completing session and awarding points
      await fetchStats();
    } catch (error) {
      console.error('Error completing session:', { id: currentSessionId, error });
    }
  }, [currentSessionId, mode, fetchStats, awardPoints]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let heartbeat: NodeJS.Timeout;

    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
            completeSession();
            // Play notification sound here
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);

      // Heartbeat to persist focus time to DB every 60s
      heartbeat = setInterval(async () => {
        try {
          await apiPost('/api/user/increment-focus', { seconds: 60 });
          // Optimistically reflect in UI without full refetch
          setBaselineTotalMinutes((prev) => prev + 1);
        } catch (err) {
          console.error('Heartbeat focus increment failed:', err);
        }
      }, 60000);
    }

    return () => {
      clearInterval(interval);
      if (heartbeat) clearInterval(heartbeat);
    };
  }, [isRunning, minutes, seconds, completeSession]);

  const resetTimer = (newMode: typeof mode) => {
    setMode(newMode);
    const totalSeconds = newMode === 'custom' ? customMinutes * 60 : presets[newMode];
    setMinutes(Math.floor(totalSeconds / 60));
    setSeconds(totalSeconds % 60);
    setIsRunning(false);
  };

  const setCustomTimer = () => {
    if (customMinutes > 0 && customMinutes <= 180) {
      setMode('custom');
      setMinutes(customMinutes);
      setSeconds(0);
      setIsRunning(false);
      setShowCustomInput(false);
    }
  };

  const toggleTimer = () => {
    if (!isRunning) {
      startSession();
      // capture baseline so we can show live-added minutes during this run
      setBaselineTotalMinutes(stats.totalMinutes);
    }
    setIsRunning(!isRunning);
  };

  const formatTime = (m: number, s: number) => {
    // If timer is over 60 minutes, show HH:MM:SS format
    if (m >= 60) {
      const hours = Math.floor(m / 60);
      const mins = m % 60;
      return `${hours}:${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    // Otherwise show MM:SS format
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const remainingSeconds = minutes * 60 + seconds;
  const elapsedThisSessionSeconds = Math.max(0, presets[mode] - remainingSeconds);
  const liveAddedMinutes = isRunning ? Math.floor(elapsedThisSessionSeconds / 60) : 0;
  const displayTotalMinutes = baselineTotalMinutes + liveAddedMinutes;
  const displayThisWeekSessions = stats.thisWeekSessions + (isRunning && seconds === 0 && minutes % 60 === 0 ? 0 : 0); // keep sessions day/week server-driven
  const displayTodaySessions = stats.todaySessions; // sessions counted by completed sessions

  const progress = (elapsedThisSessionSeconds / presets[mode]) * 100;

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <svg className="w-full h-32" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#e5e5e5"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="var(--accent-teal)"
              strokeWidth="12"
              strokeDasharray={`${progress * 5.024} 502.4`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-black">
                {formatTime(minutes, seconds)}
              </p>
              <p className="text-xs text-black capitalize">{mode}</p>
            </div>
          </div>
        </div>
        <button
          onClick={toggleTimer}
          className="w-full py-2 rounded-lg bg-[var(--accent-teal)] text-white font-medium hover:shadow-md transition-all cursor-pointer"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-black">Focus Timer</h1>

      {/* Mode Selector */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => resetTimer("pomodoro")}
          className={`flex-1 py-3 rounded-xl font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
            mode === "pomodoro"
              ? "bg-white border border-gray-200 text-black"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-4 h-4 text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v10l4 4" />
          </svg>
          Pomodoro
        </button>
        <button
          onClick={() => resetTimer("short")}
          className={`flex-1 py-3 rounded-xl font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
            mode === "short"
              ? "bg-white border border-gray-200 text-black"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-4 h-4 text-orange-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
          Short Break
        </button>
        <button
          onClick={() => resetTimer("long")}
          className={`flex-1 py-3 rounded-xl font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
            mode === "long"
              ? "bg-white border border-gray-200 text-black"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-4 h-4 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Long Break
        </button>
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className={`flex-1 py-3 rounded-xl font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
            mode === "custom"
              ? "bg-white border border-gray-200 text-black"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-4 h-4 text-purple-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Custom
        </button>
      </div>

      {/* Custom Timer Input */}
      {showCustomInput && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold text-black mb-4">Set Custom Duration</h3>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minutes (1-180)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              onClick={setCustomTimer}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all cursor-pointer mt-6"
            >
              Set Timer
            </button>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="bg-white border border-gray-200 rounded-2xl p-12 mb-8 shadow-sm">
        <div className="relative">
          <svg className="w-full max-w-md mx-auto" viewBox="0 0 300 300">
            <circle
              cx="150"
              cy="150"
              r="130"
              fill="none"
              stroke="#e5e5e5"
              strokeWidth="20"
            />
            <circle
              cx="150"
              cy="150"
              r="130"
              fill="none"
              stroke="var(--accent-teal)"
              strokeWidth="20"
              strokeDasharray={`${progress * 8.168} 816.8`}
              strokeLinecap="round"
              transform="rotate(-90 150 150)"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-7xl font-bold text-black mb-2">
                {formatTime(minutes, seconds)}
              </p>
              <p className="text-xl text-black capitalize">{mode} Session</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={toggleTimer}
          className="px-12 py-4 rounded-xl bg-[var(--accent-teal)] text-white font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Start
            </>
          )}
        </button>
        <button
          onClick={() => resetTimer(mode)}
          className="px-8 py-4 rounded-xl bg-white border border-gray-200 font-semibold text-lg text-black hover:bg-gray-50 transition-all cursor-pointer flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23,4 23,10 17,10" />
            <polyline points="1,20 1,14 7,14" />
            <path d="m3.51,9a9,9,0,0,1,14.85-3.36L23,10M1,14l4.64,4.36A9,9,0,0,0,20.49,15" />
          </svg>
          Reset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-black">{displayTodaySessions}</p>
          <p className="text-sm text-black">Today&apos;s Sessions</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-black">{formatTimeDisplay(displayTotalMinutes)}</p>
          <p className="text-sm text-black">Total Time</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-black">{displayThisWeekSessions}</p>
          <p className="text-sm text-black">This Week</p>
        </div>
      </div>
    </div>
  );
}
