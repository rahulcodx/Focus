"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = isLogin
      ? await login(email, password)
      : await signup(email, password, name);

    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white/20 backdrop-blur-lg rounded-lg p-8 w-full max-w-md border border-white/30 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label
                className="block text-white text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name (optional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-white/30 rounded focus:outline-none focus:border-teal-500 bg-white/20 text-white placeholder-white/60 cursor-text hover:bg-white/30 transition-all"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-white/30 rounded focus:outline-none focus:border-teal-500 bg-white/20 text-white placeholder-white/60 cursor-text hover:bg-white/30 transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-white/30 rounded focus:outline-none focus:border-teal-500 bg-white/20 text-white placeholder-white/60 cursor-text hover:bg-white/30 transition-all"
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 disabled:opacity-50 cursor-pointer transition-all hover:shadow-lg"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-teal-400 hover:text-teal-300 cursor-pointer transition-all hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
