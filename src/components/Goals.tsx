"use client";

import { useState, useEffect } from "react";
import { apiGet, apiPut, apiPost } from "@/lib/api-client";

interface Goal {
  _id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  category: string;
  unit: string;
  deadline?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: 10,
    unit: 'tasks',
    category: '',
    deadline: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await apiGet('/api/goals');
      if (response.success) {
        setGoals(response.data);
      } else {
        setError(response.error || 'Failed to fetch goals');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (id: string, increment: number) => {
    try {
      const goal = goals.find(g => g._id === id);
      if (!goal) return;

      const response = await apiPut(`/api/goals/${id}`, { 
        current: Math.min(goal.current + increment, goal.target) 
      });

      if (response.success) {
        setGoals(goals.map(g => g._id === id ? response.data : g));
      } else {
        setError(response.error || 'Failed to update goal');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      setError('Failed to update goal');
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const createGoal = async () => {
    try {
      if (!newGoal.title.trim() || newGoal.target <= 0) {
        setError('Please provide a valid title and target');
        return;
      }

      const response = await apiPost('/api/goals', {
        title: newGoal.title,
        description: newGoal.description,
        target: newGoal.target,
        unit: newGoal.unit,
        category: newGoal.category,
        deadline: newGoal.deadline || undefined
      });

      if (response.success) {
        setGoals([response.data, ...goals]);
        setShowNewGoalModal(false);
        setNewGoal({
          title: '',
          description: '',
          target: 10,
          unit: 'tasks',
          category: '',
          deadline: ''
        });
      } else {
        setError(response.error || 'Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      setError('Failed to create goal');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--accent-teal)] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-600 mt-4">Loading goals...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Goals & Milestones</h1>
          <p className="text-black mt-2">
            Track your progress towards your objectives
          </p>
        </div>
        <button 
          onClick={() => setShowNewGoalModal(true)}
          className="px-6 py-3 rounded-xl bg-[var(--accent-teal)] text-white font-semibold hover:shadow-lg transition-all cursor-pointer flex items-center gap-2">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Goal
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-black">Active Goals</span>
            <svg
              className="w-6 h-6 text-[var(--accent-teal)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8l-8 8M8 8l8 8" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-black">{goals.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-black">Avg. Progress</span>
            <svg
              className="w-6 h-6 text-[var(--accent-teal)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-black">
            {goals.length > 0 ? Math.round(
              goals.reduce(
                (acc, g) => acc + getProgressPercentage(g.current, g.target),
                0,
              ) / goals.length,
            ) : 0}
            %
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-black">Completed</span>
            <svg
              className="w-6 h-6 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-black">
            {goals.filter((g) => g.completed).length}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-6">
        {goals.map((goal) => {
          const percentage = getProgressPercentage(goal.current, goal.target);
          const daysLeft = getDaysRemaining(goal.deadline);
          const isCompleted = goal.completed;

          return (
            <div
              key={goal._id}
              className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${isCompleted ? "border-2 border-[var(--accent-teal)]" : ""}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-black">
                      {goal.title}
                    </h3>
                    {isCompleted && (
                      <svg
                        className="w-6 h-6 text-yellow-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                      </svg>
                    )}
                  </div>
                  <p className="text-black mb-2">{goal.description}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-3 py-1 rounded-full bg-[var(--accent-teal)] text-white"
                    >
                      {goal.category}
                    </span>
                    {daysLeft !== null && (
                      <span className="text-xs text-black">
                        {daysLeft > 0
                          ? `${daysLeft} days left`
                          : daysLeft === 0
                            ? "Due today"
                            : "Overdue"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-black">{percentage}%</p>
                  <p className="text-sm text-black">
                    {goal.current} / {goal.target} {goal.unit}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent-teal)] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {!isCompleted && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateProgress(goal._id, 1)}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-black font-medium hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => updateProgress(goal._id, 5)}
                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-black font-medium hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    +5
                  </button>
                  <button
                    onClick={() =>
                      updateProgress(goal._id, goal.target - goal.current)
                    }
                    className="ml-auto px-6 py-2 rounded-lg bg-[var(--accent-teal)] text-white font-medium hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                    Mark Complete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Motivation Card */}
      <div className="mt-8 bg-[var(--accent-teal)] rounded-2xl p-8 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-2xl font-bold text-white">Keep Pushing Forward!</p>
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
          You&apos;re making great progress. Every step counts towards your
          goals!
        </p>
      </div>

      {/* New Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Create New Goal</h2>
              <button
                onClick={() => setShowNewGoalModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., Complete 50 tasks"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="What do you want to achieve?"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Target *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    placeholder="e.g., tasks, hours"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  placeholder="e.g., Work, Personal, Fitness"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewGoalModal(false)}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-black font-semibold hover:bg-gray-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={createGoal}
                className="flex-1 px-6 py-3 rounded-xl bg-[var(--accent-teal)] text-white font-semibold hover:shadow-lg transition-all cursor-pointer"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
