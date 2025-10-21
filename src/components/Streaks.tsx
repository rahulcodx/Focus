"use client";

import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api-client";

interface StreaksProps {
  compact?: boolean;
}

interface ActivityDay {
  date: string;
  sessions: number;
  totalTime: number;
  level: number;
}

interface PointsAward {
  points: number;
  reason: string;
  timestamp: Date;
}

export default function Streaks({ compact = false }: StreaksProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      const response = await apiGet('/api/stats/dashboard');
      if (response.success) {
        setCurrentStreak(response.data.overview.currentStreak);
        setLongestStreak(response.data.overview.longestStreak);
        setActivityData(response.data.activity || []);
        // Get points and level from user stats
        setTotalPoints(response.data.overview.points || 0);
        setLevel(response.data.overview.level || 1);
      } else {
        setError(response.error || 'Failed to fetch streak data');
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
      setError('Failed to fetch streak data');
    } finally {
      setLoading(false);
    }
  };

  // Award points for time spent on site and completed tasks
  const awardPoints = async (points: number, reason: string) => {
    try {
      // This would be called from Timer component when sessions complete
      // and from Tasks component when tasks are completed
      const response = await apiPost('/api/user/award-points', { points, reason });
      if (response.success) {
        console.log(`Awarded ${points} points for: ${reason}`);
        // Refresh streak data to show updated stats
        fetchStreakData();
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  // Group activity data into weeks
  const weeks = 7;
  const daysPerWeek = 7;
  const calendarData: ActivityDay[][] = [];
  
  for (let week = 0; week < weeks; week++) {
    const weekData = activityData.slice(week * daysPerWeek, (week + 1) * daysPerWeek);
    if (weekData.length > 0) {
      calendarData.push(weekData);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin w-6 h-6 border-2 border-[var(--accent-teal)] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-600 mt-2">Loading streak data...</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-black">{currentStreak}</p>
            <div className="flex items-center gap-1 text-sm text-black">
              <svg
                className="w-4 h-4 text-orange-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
              Day streak
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-black">{totalPoints}</p>
            <p className="text-xs text-black">Points</p>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {activityData.slice(-7).map((day, i) => (
            <div
              key={i}
              className={`aspect-square rounded ${
                day.level > 0 ? "bg-[var(--accent-teal)]" : "bg-gray-200"
              }`}
              style={{
                opacity: day.level > 0 ? 0.3 + (day.level * 0.175) : 1
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-black">Streak Tracker</h1>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-teal)] flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-black mb-1">{currentStreak}</p>
          <p className="text-black">Current Streak</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-teal)] flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-black mb-1">{longestStreak}</p>
          <p className="text-black">Longest Streak</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-teal)] flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-black mb-1">{totalPoints}</p>
          <p className="text-black">Total Points</p>
        </div>
      </div>

      {/* Activity Calendar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-black">
          Activity Calendar
        </h2>

        <div className="space-y-2">
          <div className="flex gap-2 text-xs text-black mb-2">
            <div className="w-8"></div>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="flex-1 text-center">
                {day}
              </div>
            ))}
          </div>

          {calendarData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-2">
              <div className="w-8 text-xs text-black flex items-center">
                W{weekIndex + 1}
              </div>
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`flex-1 aspect-square rounded-lg ${
                    day.level > 0
                      ? "bg-[var(--accent-teal)] shadow-md"
                      : "bg-gray-200"
                  }`}
                  style={{
                    opacity: day.level > 0 ? 0.3 + (day.level * 0.175) : 1
                  }}
                  title={`${day.date}: ${day.sessions} sessions`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-6 text-sm text-black">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-gray-200"></div>
            <div className="w-4 h-4 rounded bg-gray-400"></div>
            <div className="w-4 h-4 rounded bg-gray-600"></div>
            <div className="w-4 h-4 rounded bg-[var(--accent-teal)]"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Motivation */}
      <div className="mt-8 bg-[var(--accent-teal)] rounded-2xl p-8 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-2xl font-bold text-white">Keep it up!</p>
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2v6h6l4-4-6-6 4-4" />
            <path d="M12 12v6h6l4-4-6-6 4-4" />
          </svg>
        </div>
        <p className="text-white">
          You&apos;re on fire! Just {longestStreak - currentStreak} more days to
          beat your record!
        </p>
      </div>
    </div>
  );
}
