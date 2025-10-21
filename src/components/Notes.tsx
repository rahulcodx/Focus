"use client";

import { useState, useEffect } from "react";
import { apiGet, apiPost, apiDelete } from "@/lib/api-client";

interface Note {
  _id: string;
  title?: string;
  content: string;
  color: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange';
  createdAt: string;
  updatedAt: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await apiGet('/api/notes');
      if (response.success) {
        setNotes(response.data);
      } else {
        setError(response.error || 'Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newContent.trim()) return;

    try {
      const response = await apiPost('/api/notes', {
        title: newTitle.trim() || 'Untitled Note',
        content: newContent.trim(),
        color: 'yellow'
      });

      if (response.success) {
        setNotes([response.data, ...notes]);
        setNewTitle("");
        setNewContent("");
        setShowAddModal(false);
      } else {
        setError(response.error || 'Failed to create note');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Failed to create note');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const response = await apiDelete(`/api/notes/${id}`);
      if (response.success) {
        setNotes(notes.filter((note) => note._id !== id));
      } else {
        setError(response.error || 'Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--accent-teal)] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-600 mt-4">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">Quick Notes</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 rounded-xl bg-[var(--accent-teal)] text-white font-semibold hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
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
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Note
        </button>
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

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer group relative shadow-sm hover:shadow-md transition-all"
          >
            <div className="mt-0">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-black flex-1">
                  {note.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note._id);
                  }}
                  className="text-gray-400 hover:text-red-600 transition-all cursor-pointer p-1 rounded ml-2"
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
              <p className="text-gray-700 text-sm whitespace-pre-wrap mb-4 line-clamp-3 leading-relaxed">
                {note.content}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                  {note.content.split("\n").length} lines
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Note Card */}
        <div
          onClick={() => setShowAddModal(true)}
          className="bg-white border-2 border-dashed border-gray-300 hover:border-[var(--accent-teal)] hover:bg-gray-50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px] rounded-2xl shadow-sm group"
        >
          <div className="mb-4 p-4 rounded-full bg-gray-100 group-hover:bg-[var(--accent-teal)] transition-all">
            <svg
              className="w-8 h-8 text-gray-600 group-hover:text-white transition-all"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium group-hover:text-[var(--accent-teal)] transition-all">
            Add New Note
          </p>
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 cursor-default">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-2xl w-full animate-fade-in-up shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-[var(--accent-teal)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
                Create New Note
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTitle("");
                  setNewContent("");
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] transition-all mb-4 cursor-text"
            />

            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Start typing..."
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] transition-all mb-4 resize-none cursor-text"
            />

            <div className="flex gap-4">
              <button
                onClick={addNote}
                className="flex-1 py-3 rounded-xl bg-[var(--accent-teal)] text-white font-semibold hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
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
                Create Note
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTitle("");
                  setNewContent("");
                }}
                className="px-8 py-3 rounded-xl bg-white border border-gray-200 font-semibold text-black hover:bg-gray-50 transition-all cursor-pointer flex items-center gap-2"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
