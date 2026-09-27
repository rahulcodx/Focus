"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BACKGROUND_CATEGORIES } from "@/lib/backgrounds";

type Section = "backgrounds" | "timer" | "custom";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "backgrounds", label: "Backgrounds" },
  { id: "timer", label: "Timer" },
  { id: "custom", label: "Custom" },
];

/** Compact resolution label from the real measured width. */
function resolutionLabel(width: number) {
  if (width >= 3800) return "4K+";
  if (width >= 3000) return "4K";
  if (width >= 2400) return "2K+";
  if (width >= 1900) return "2K";
  return "HD";
}

function ToggleRow({
  title,
  hint,
  checked,
  onChange,
}: {
  title: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
      <div className="min-w-0">
        <h4 className="text-white font-medium text-sm">{title}</h4>
        <p className="text-white/45 text-xs">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-teal-500" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundChange: (url: string) => void;
  currentBackground: string;
  onOpenAuth?: () => void;
  autoSwitch: boolean;
  setAutoSwitch: (val: boolean) => void;
  playSound: boolean;
  setPlaySound: (val: boolean) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onBackgroundChange,
  currentBackground,
  onOpenAuth,
  autoSwitch,
  setAutoSwitch,
  playSound,
  setPlaySound,
}: SettingsModalProps) {
  const [section, setSection] = useState<Section>("backgrounds");
  const [categoryId, setCategoryId] = useState(BACKGROUND_CATEGORIES[0]?.id ?? "");
  const [customUrl, setCustomUrl] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const activeCategory =
    BACKGROUND_CATEGORIES.find((c) => c.id === categoryId) ??
    BACKGROUND_CATEGORIES[0];

  /**
   * Accepts a Pinterest CDN url, a shared pin link, or any direct image
   * address. Pinterest CDN links are rewritten to `originals`, which is the
   * full-size asset rather than the 236x/474x/736x thumbnail variants.
   */
  const normaliseImageUrl = (raw: string): string | null => {
    const value = raw.trim();
    if (!value) return null;
    if (/^data:image\//i.test(value)) return value;

    const pinAsset = value.match(
      /i\.pinimg\.com\/(?:\d+x|originals)\/((?:[0-9a-f]{2}\/){3}[0-9a-f]{10,})\.(jpg|jpeg|png|gif)/i,
    );
    if (pinAsset) {
      const ext = pinAsset[2].toLowerCase() === "jpeg" ? "jpg" : pinAsset[2].toLowerCase();
      return `https://i.pinimg.com/originals/${pinAsset[1]}.${ext}`;
    }

    // A shared pin page link still works directly: the browser follows the
    // redirect to the image CDN.
    if (/^https?:\/\//i.test(value)) return value;
    return null;
  };

  const handleCustomUrlChange = (value: string) => {
    setCustomUrl(value);
    if (customError) setCustomError(null);
  };

  const handleApplyCustom = () => {
    const url = normaliseImageUrl(customUrl);
    if (!url) {
      setCustomError("Enter an image URL or a Pinterest pin link.");
      return;
    }
    onBackgroundChange(url);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setCustomError("Image is over 8 MB - pick a smaller one.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onBackgroundChange(result);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 left-6 sm:left-auto z-40 flex justify-end">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl shadow-black/40 p-4 w-full sm:w-[26rem] max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-white text-lg font-bold">Settings</h3>
          <div className="flex items-center gap-1">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="px-3 py-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm"
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenAuth?.();
                  onClose();
                }}
                className="px-3 py-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm"
              >
                Login
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close settings"
              className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Top-level sections */}
        <div
          role="tablist"
          aria-label="Settings sections"
          className="flex gap-1 p-1 mb-3 shrink-0 rounded-xl bg-black/20 border border-white/10"
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={section === s.id}
              onClick={() => setSection(s.id)}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                section === s.id
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto glass-scroll -mx-1 px-1">
          {section === "timer" ? (
            <div className="space-y-2">
              <ToggleRow
                title="Auto-switch to Break"
                hint="Automatically start next session"
                checked={autoSwitch}
                onChange={setAutoSwitch}
              />
              <ToggleRow
                title="Notification Sound"
                hint="Play sound when timer ends"
                checked={playSound}
                onChange={setPlaySound}
              />
            </div>
          ) : section === "custom" ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="custom-bg-url" className="text-white/80 text-sm font-medium mb-1 block">
                  Image URL
                </label>
                <input
                  id="custom-bg-url"
                  type="text"
                  value={customUrl}
                  onChange={(e) => handleCustomUrlChange(e.target.value)}
                  placeholder="Paste a Pinterest pin or image link"
                  className="w-full bg-black/25 text-white placeholder-white/35 rounded-lg px-3 py-2 text-sm border border-white/15 focus:outline-none focus:border-teal-400/60"
                />
                <p className="mt-1.5 text-[11px] text-white/35 leading-relaxed">
                  Works with a pin link, a pinimg.com URL, or any direct image
                  address. Low-res images get cropped and blurry — 1600px wide or
                  more is a good floor.
                </p>
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="mt-2 w-full bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal-400 transition-all disabled:opacity-40 disabled:pointer-events-none"
                  disabled={customUrl.trim().length === 0}
                >
                  Apply
                </button>
              </div>

              <div>
                <label htmlFor="custom-bg-file" className="text-white/80 text-sm font-medium mb-1 block">
                  Upload image
                </label>
                <input
                  id="custom-bg-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-[11px] text-white/50 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/20 transition-colors"
                />
              </div>

              {/* One shared error region — both fields write to the same state. */}
              {customError ? (
                <p
                  role="status"
                  className="text-[11px] font-medium text-rose-300/90 animate-fade-in-up"
                >
                  {customError}
                </p>
              ) : null}
            </div>
          ) : (
            <>
              {/* Category chips — the library is large enough that a single
                  flat tab row would be unreadable at this width. */}
              <div className="flex gap-1.5 pb-2.5 mb-2.5 overflow-x-auto glass-scroll shrink-0 border-b border-white/10">
                {BACKGROUND_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={activeCategory?.id === cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      activeCategory?.id === cat.id
                        ? "bg-white/20 text-white border border-white/25"
                        : "bg-white/5 text-white/55 hover:text-white hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    {cat.label}
                    <span className="ml-1.5 text-[10px] opacity-50 tabular-nums">
                      {cat.items.length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {activeCategory?.items.map((bg) => {
                  const isActive = currentBackground === bg.url;
                  return (
                    <button
                      key={bg.url}
                      type="button"
                      onClick={() => onBackgroundChange(bg.url)}
                      aria-pressed={isActive}
                      title={`${bg.name} — ${bg.w}x${bg.h}`}
                      className={`group text-left rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        isActive
                          ? "border-teal-400"
                          : "border-transparent hover:border-white/40"
                      }`}
                    >
                      <span className="relative block">
                        <img
                          src={bg.url}
                          alt={bg.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-20 object-cover"
                        />
                        <span className="absolute top-1 right-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-white/90 backdrop-blur-sm">
                          {resolutionLabel(bg.w)}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 px-1.5 py-1">
                        <span className="text-white/85 text-[11px] font-semibold truncate">
                          {bg.name}
                        </span>
                        {isActive ? (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-teal-300 shrink-0 ml-auto">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
