'use client';

import { useState } from 'react';

interface MusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (playlistUrl: string) => void;
  onToggleEmbed: () => void;
  embedVisible: boolean;
}

export default function MusicModal({ isOpen, onClose, onUpdate, onToggleEmbed, embedVisible }: MusicModalProps) {
  const [playlistUrl, setPlaylistUrl] = useState('https://open.spotify.com/playlist/4Zjli1P13J5mmSCD5iKAXK');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert playlist URL to embed URL
    let embedUrl = playlistUrl.replace('/playlist/', '/embed/playlist/');
    if (!embedUrl.includes('?')) {
      embedUrl += '?utm_source=generator&theme=0';
    } else if (!embedUrl.includes('theme=0')) {
      embedUrl += '&theme=0';
    }
    onUpdate(embedUrl);
    onClose();
  };

  return (
    <div className="fixed bottom-20 left-6 z-40">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 w-80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-lg font-bold">Update Playlist</h3>
          <button
            onClick={onClose}
            className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            placeholder="Enter Spotify playlist URL (e.g., https://open.spotify.com/playlist/...)"
            className="w-full bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 border border-white/30 mb-3"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-teal-500/80 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-teal-500 transition-all"
            >
              Update
            </button>
            <button
              onClick={onToggleEmbed}
              className="p-2 bg-white/20 text-white rounded-lg cursor-pointer hover:bg-white/30 transition-all"
              title={embedVisible ? "Hide Embed" : "Show Embed"}
            >
              {embedVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.175 8.325q.725.725 1.063 1.65t.237 1.9q0 .375-.275.638t-.65.262t-.638-.262t-.262-.638q.125-.65-.075-1.25T13.95 9.6t-1.025-.65t-1.275-.1q-.375 0-.638-.275t-.262-.65t.263-.637t.637-.263q.95-.1 1.875.238t1.65 1.062M12 6q-.475 0-.925.037t-.9.138q-.425.075-.763-.125t-.462-.6t.088-.775t.612-.45q.575-.125 1.163-.175T12 4q3.425 0 6.263 1.8t4.337 4.85q.1.2.15.413t.05.437t-.038.438t-.137.412q-.45 1-1.112 1.875t-1.463 1.6q-.3.275-.7.225t-.65-.4t-.212-.763t.337-.687q.6-.575 1.1-1.25t.875-1.45q-1.25-2.525-3.613-4.012T12 6m0 13q-3.35 0-6.125-1.812T1.5 12.425q-.125-.2-.187-.437T1.25 11.5t.05-.475t.175-.45q.5-1 1.163-1.912T4.15 7L2.075 4.9q-.275-.3-.262-.712T2.1 3.5t.7-.275t.7.275l17 17q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275l-3.5-3.45q-.875.275-1.775.413T12 19M5.55 8.4q-.725.65-1.325 1.425T3.2 11.5q1.25 2.525 3.613 4.013T12 17q.5 0 .975-.062t.975-.138l-.9-.95q-.275.075-.525.113T12 16q-1.875 0-3.188-1.312T7.5 11.5q0-.275.038-.525t.112-.525zm4.2 4.2"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 16q1.875 0 3.188-1.312T16.5 11.5t-1.312-3.187T12 7T8.813 8.313T7.5 11.5t1.313 3.188T12 16m0-1.8q-1.125 0-1.912-.788T9.3 11.5t.788-1.912T12 8.8t1.913.788t.787 1.912t-.787 1.913T12 14.2m0 4.8q-3.35 0-6.113-1.8t-4.362-4.75q-.125-.225-.187-.462t-.063-.488t.063-.488t.187-.462q1.6-2.95 4.363-4.75T12 4t6.113 1.8t4.362 4.75q.125.225.188.463t.062.487t-.062.488t-.188.462q-1.6 2.95-4.362 4.75T12 19m0-2q2.825 0 5.188-1.487T20.8 11.5q-1.25-2.525-3.613-4.012T12 6T6.813 7.488T3.2 11.5q1.25 2.525 3.613 4.013T12 17"/>
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}