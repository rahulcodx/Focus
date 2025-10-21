"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api-client";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  streak: number;
  tasksCompleted: number;
  isCurrentUser: boolean;
}

interface LeaderboardProps {
  compact?: boolean;
}

export default function Leaderboard({ compact = false }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "all">(
    "week",
  );
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await apiGet('/api/stats/dashboard');
      if (response.success && response.data.leaderboard) {
        setLeaderboardData(response.data.leaderboard.topUsers || []);
      } else {
        setError(response.error || 'Failed to fetch leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1)
      return (
        <svg
          className="w-5 h-5 text-yellow-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="9" r="7" />
          <path d="M8 16l4 4 4-4" />
          <rect x="10" y="20" width="4" height="2" />
          <path
            d="M12 6l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="1"
          />
        </svg>
      );
    if (rank === 2)
      return (
        <svg
          className="w-5 h-5 text-gray-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="8" r="6" />
          <path d="M8 14l4 4 4-4" />
          <rect x="10" y="18" width="4" height="4" />
        </svg>
      );
    if (rank === 3)
      return (
        <svg
          className="w-5 h-5 text-orange-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="8" r="6" />
          <path d="M8 14l4 4 4-4" />
          <rect x="10" y="18" width="4" height="4" />
        </svg>
      );
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-black">
        {rank}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin w-6 h-6 border-2 border-[var(--accent-teal)] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-600 mt-2">Loading leaderboard...</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {leaderboardData.slice(0, 3).map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              entry.isCurrentUser
                ? "bg-[var(--accent-teal)]/10 border-2 border-[var(--accent-teal)]"
                : "bg-white"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-black">
              {entry.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-black">{entry.name}</p>
              <p className="text-xs text-black">
                {entry.points.toLocaleString()} pts
              </p>
            </div>
            <span className="text-xl">{getRankEmoji(entry.rank)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-black">Leaderboard</h1>

      {/* Timeframe Selector */}
      <div className="flex gap-2 mb-8">
        {(["day", "week", "month", "all"] as const).map((period) => (
          <button
            key={period}
            onClick={() => setTimeframe(period)}
            className={`px-6 py-2 rounded-full font-medium capitalize transition-all cursor-pointer ${
              timeframe === period
                ? "bg-[var(--accent-teal)] text-white"
                : "bg-white border border-gray-200 text-black"
            }`}
          >
            {period === "all" ? "All Time" : `This ${period}`}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* 2nd Place */}
        {leaderboardData[1] && (
        <div className="flex flex-col items-center mt-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center w-full shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-black mx-auto mb-3">
              {leaderboardData[1].name.charAt(0)}
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="6" fill="currentColor" />
                <path d="M8 14l4 4 4-4" fill="currentColor" />
                <rect x="10" y="18" width="4" height="4" fill="currentColor" />
              </svg>
            </div>
            <p className="font-bold text-black mb-1">
              {leaderboardData[1].name}
            </p>
            <p className="text-2xl font-bold text-black">
              {leaderboardData[1].points}
            </p>
            <p className="text-sm text-black">points</p>
          </div>
        </div>
        )}

        {/* 1st Place */}
        {leaderboardData[0] && (
        <div className="flex flex-col items-center">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center w-full shadow-sm">
            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-3xl font-bold text-black mx-auto mb-3">
              {leaderboardData[0].name.charAt(0)}
            </div>
            <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <circle cx="12" cy="9" r="7" fill="currentColor" />
                <path d="M8 16l4 4 4-4" fill="currentColor" />
                <rect x="10" y="20" width="4" height="2" fill="currentColor" />
                <path
                  d="M12 6l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z"
                  fill="#FFD700"
                  stroke="#FFA500"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <p className="font-bold text-black mb-1">
              {leaderboardData[0].name}
            </p>
            <p className="text-3xl font-bold text-black">
              {leaderboardData[0].points}
            </p>
            <p className="text-sm text-black">points</p>
          </div>
        </div>
        )}

        {/* 3rd Place */}
        {leaderboardData[2] && (
        <div className="flex flex-col items-center mt-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center w-full shadow-sm">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-black mx-auto mb-3">
              {leaderboardData[2].name.charAt(0)}
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="6" fill="currentColor" />
                <path d="M8 14l4 4 4-4" fill="currentColor" />
                <rect x="10" y="18" width="4" height="4" fill="currentColor" />
              </svg>
            </div>
            <p className="font-bold text-black mb-1">
              {leaderboardData[2].name}
            </p>
            <p className="text-2xl font-bold text-black">
              {leaderboardData[2].points}
            </p>
            <p className="text-sm text-black">points</p>
          </div>
        </div>
        )}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-black">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5">User</div>
            <div className="col-span-2 text-center">Points</div>
            <div className="col-span-2 text-center">Streak</div>
            <div className="col-span-2 text-center">Tasks</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {leaderboardData.map((entry) => (
            <div
              key={entry.rank}
              className={`p-4 ${
                entry.isCurrentUser
                  ? "bg-[var(--accent-teal)]/5 border-l-4 border-[var(--accent-teal)]"
                  : ""
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 text-center flex justify-center">
                  {getRankEmoji(entry.rank)}
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-black">
                    {entry.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-black">{entry.name}</p>
                    {entry.isCurrentUser && (
                      <span className="text-xs text-[var(--accent-teal)]">
                        You
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <p className="font-bold text-black">
                    {entry.points.toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2 text-center">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-teal)] text-white text-sm font-medium flex items-center justify-center gap-1">
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                    </svg>
                    {entry.streak}
                  </span>
                </div>
                <div className="col-span-2 text-center">
                  <p className="font-semibold text-black">
                    {entry.tasksCompleted}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-black">+120</p>
          <p className="text-sm text-black">Points this week</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-black">↑ 2</p>
          <p className="text-sm text-black">Rank change</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-black">Top 5%</p>
          <p className="text-sm text-black">Global ranking</p>
        </div>
      </div>
    </div>
  );
}
