"use client";

import { useState, useEffect } from "react";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksProps {
  compact?: boolean;
}

const API_BASE = '/api';

export default function Tasks({ compact = false }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${API_BASE}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setTasks(data.data);
      } else {
        setError(data.error || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !task.completed })
      });

      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map(t => t._id === taskId ? data.data : t));
      } else {
        setError(data.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTask.trim(),
          priority: 'medium',
          category: 'Personal'
        })
      });

      const data = await response.json();
      if (data.success) {
        setTasks([...tasks, data.data]);
        setNewTask("");
      } else {
        setError(data.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setTasks(tasks.filter(t => t._id !== taskId));
      } else {
        setError(data.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const priorityColors = {
    high: "from-red-500 to-orange-500",
    medium: "from-yellow-500 to-orange-500",
    low: "from-green-500 to-blue-500",
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin w-6 h-6 border-2 border-[var(--accent-teal)] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-600 mt-2">Loading tasks...</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-3">
            {error}
          </div>
        )}
        {tasks.slice(0, 3).map((task) => (
          <div key={task._id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task._id)}
              className="w-5 h-5 rounded border-2 border-gray-300 accent-[var(--accent-teal)] cursor-pointer"
            />
            <span
              className={`flex-1 ${task.completed ? "line-through text-gray-500" : "text-black"}`}
            >
              {task.title}
            </span>
          </div>
        ))}
        <p className="text-sm text-black pt-2">
          {tasks.filter((t) => !t.completed).length} remaining
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-black">Task Manager</h1>

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

      {/* Add Task Form */}
      <form
        onSubmit={addTask}
        className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm"
      >
        <div className="flex gap-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] transition-all cursor-text"
          />
          <button
            type="submit"
            disabled={!newTask.trim()}
            className="px-6 py-3 rounded-xl bg-[var(--accent-teal)] text-white font-medium hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
            filter === "all"
              ? "bg-[var(--accent-teal)] text-white"
              : "bg-white border border-gray-200 text-black"
          }`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
            filter === "active"
              ? "bg-[var(--accent-teal)] text-white"
              : "bg-white border border-gray-200 text-black"
          }`}
        >
          Active ({tasks.filter((t) => !t.completed).length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
            filter === "completed"
              ? "bg-[var(--accent-teal)] text-white"
              : "bg-white border border-gray-200 text-black"
          }`}
        >
          Completed ({tasks.filter((t) => t.completed).length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task._id)}
              className="w-6 h-6 rounded border-2 border-gray-300 accent-[var(--accent-teal)] cursor-pointer"
            />
            <div className="flex-1">
              <p
                className={`font-medium mb-1 ${task.completed ? "line-through text-gray-500" : "text-black"}`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    task.priority === "high"
                      ? "bg-red-500"
                      : task.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  } text-white`}
                >
                  {task.priority}
                </span>
                {task.category && (
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-black">
                    {task.category}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => deleteTask(task._id)}
              className="px-4 py-2 rounded-lg text-black hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
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
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <p className="text-black">No tasks to show</p>
        </div>
      )}
    </div>
  );
}
