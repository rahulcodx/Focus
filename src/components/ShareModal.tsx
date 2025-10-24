'use client';

import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://focus-app.com';
  const shareText = 'Check out Focus - the ultimate productivity app! Stay focused and achieve your goals.';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShare = async (platform: string) => {
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'Focus App',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style jsx>{`
        @keyframes modalEnter {
          0% {
            transform: scale(0.8) translateY(20px);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) translateY(-5px);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      <div
        className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 max-w-md w-full transform transition-all duration-500 ease-out`}
        style={{
          animation: 'modalEnter 0.5s ease-out forwards',
        }}
      >
        {/* Header */}
        <div className="text-center mb-6 relative">
          <h2 className="text-white text-2xl font-bold mb-2">Share Focus with Friends</h2>
          <p className="text-white/80 text-sm">
            Help your friends discover the power of focused productivity and achieve their goals together!
          </p>
          {/* Close Button - Top Right */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer"
            title="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Copy Link Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                copied
                  ? 'bg-green-500/80 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title="Copy Link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className={`transition-all duration-300 ${copied ? 'scale-110' : 'scale-100'}`}
              >
                {copied ? (
                  // Tick/Check icon when copied
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                  />
                ) : (
                  // Copy icon when not copied
                  <path
                    fill="currentColor"
                    d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V7q0-.425.288-.712T4 6t.713.288T5 7v13h10q.425 0 .713.288T16 21t-.288.713T15 22zm4-6V4z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          <p className="text-white/60 text-sm text-center mb-4">Share on social media:</p>

          <div className="grid grid-cols-2 gap-3">
            {/* Twitter */}
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center gap-2 bg-blue-500/80 text-white px-4 py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-500 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center gap-2 bg-blue-600/80 text-white px-4 py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-600 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleShare('linkedin')}
              className="flex items-center justify-center gap-2 bg-blue-700/80 text-white px-4 py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-1.953 0-1.077.92-1.954 2.063-1.954 1.143 0 2.062.877 2.062 1.954 0 1.027-.919 1.953-2.062 1.953zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex items-center justify-center gap-2 bg-green-500/80 text-white px-4 py-3 rounded-lg font-medium cursor-pointer hover:bg-green-500 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </button>

            {/* Telegram */}
            <button
              onClick={() => handleShare('telegram')}
              className="flex items-center justify-center gap-2 bg-blue-500/80 text-white px-4 py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-500 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Telegram
            </button>

            {/* Native Share (if supported) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 bg-purple-500/80 text-white px-4 py-3 rounded-lg font-medium cursor-pointer hover:bg-purple-500 transition-all col-span-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 23q-.825 0-1.412-.587T4 21V10q0-.825.588-1.412T6 8h2q.425 0 .713.288T9 9t-.288.713T8 10H6v11h12V10h-2q-.425 0-.712-.288T15 9t.288-.712T16 8h2q.825 0 1.413.588T20 10v11q0 .825-.587 1.413T18 23zm5-18.175l-.9.9q-.3.3-.7.288T8.7 5.7q-.275-.3-.287-.7t.287-.7l2.6-2.6q.3-.3.7-.3t.7.3l2.6 2.6q.275.275.275.688T15.3 5.7q-.3.3-.712.3t-.713-.3L13 4.825V15q0 .425-.288.713T12 16t-.712-.288T11 15z"/>
                </svg>
                Share
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}