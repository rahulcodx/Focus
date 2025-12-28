'use client';

import { useState, useEffect } from 'react';

interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AnnouncementModal({ isOpen, onClose }: AnnouncementModalProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setShouldRender(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-[100] p-4 transition-all duration-500 ${isAnimating ? 'bg-black/60 backdrop-blur-md' : 'bg-transparent backdrop-blur-none'
                }`}
        >
            <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(30px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .modal-content {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

            <div
                className={`bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 p-8 max-w-lg w-full shadow-2xl transform transition-all duration-500 ${isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
                    }`}
            >
                {/* Decorative elements */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 cursor-pointer group"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="text-center">
                    {/* Icon/Logo */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg shadow-teal-500/30 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.61-4.041-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-white text-3xl font-bold mb-4 tracking-tight">Now Open Source! 🚀</h2>

                    <p className="text-white/70 text-lg leading-relaxed mb-8">
                        Focus is officially open source. Explore the code, contribute to the future of productivity, and join our mission on GitHub.
                    </p>

                    <div className="space-y-4">
                        <a
                            href="https://github.com/friday2su/Focus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-white text-black hover:bg-teal-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.61-4.041-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            View on GitHub
                        </a>

                        <button
                            onClick={onClose}
                            className="w-full text-white/50 hover:text-white font-medium py-2 transition-colors cursor-pointer"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-white/30 text-xs uppercase tracking-widest font-bold">
                        Built with ❤️ by FRIDAY
                    </p>
                </div>
            </div>
        </div>
    );
}
