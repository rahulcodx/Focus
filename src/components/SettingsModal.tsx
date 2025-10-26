"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundChange: (url: string) => void;
  currentBackground: string;
  onOpenAuth?: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onBackgroundChange,
  currentBackground,
  onOpenAuth,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("custom");
  const [customUrl, setCustomUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(currentBackground);
  const { user, logout } = useAuth();

  const backgrounds = {
    anime: [
      {
        name: "Pokémon",
        url: "https://i.pinimg.com/originals/14/ae/7e/14ae7ede205573466d68eb3a562fe349.gif",
        type: "gif",
      },
      {
        name: "Streamer",
        url: "https://i.pinimg.com/originals/e0/0c/bf/e00cbfe0045873ca3306b88560f9dc01.gif",
        type: "gif",
      },
      {
        name: "Developer",
        url: "https://i.pinimg.com/originals/54/bd/a3/54bda352b17744efa1f6898040455423.gif",
        type: "gif",
      },
      {
        name: "Homie",
        url: "https://i.pinimg.com/originals/65/1e/42/651e42fdcf37fa1c13ffa701560e9ab8.gif",
        type: "gif",
      },
    ],
    study: [
      {
        name: "Cafe",
        url: "https://i.pinimg.com/originals/1a/f6/89/1af689d42bdb7686df444f22925f9e89.gif",
        type: "gif",
      },
      {
        name: "Laptop",
        url: "https://i.pinimg.com/originals/7d/07/a2/7d07a255678962d30d8717dcf5dbd266.gif",
        type: "gif",
      },
      {
        name: "Study",
        url: "https://i.pinimg.com/originals/ee/e0/c1/eee0c1dc806da44930fc6eb26b94a737.gif",
        type: "gif",
      },
      {
        name: "Writing",
        url: "https://i.pinimg.com/originals/f0/34/24/f03424bd0298f06f09d9299e930abef3.gif",
        type: "gif",
      },
      {
        name: "Night Light",
        url: "https://i.pinimg.com/1200x/c9/f7/31/c9f731ef3d1d347c9bb45d115e1cd980.jpg",
        type: "jpg",
      },
      {
        name: "Street",
        url: "https://i.pinimg.com/736x/1a/65/7d/1a657d47256220a31eb8fe310084db62.jpg",
        type: "jpg",
      },
      {
        name: "Pc",
        url: "https://i.pinimg.com/736x/36/fb/5e/36fb5e73f6a20cb4075ccb9854b2249e.jpg",
        type: "jpg",
      },
      {
        name: "Shop",
        url: "https://i.pinimg.com/736x/dc/4b/91/dc4b91063c5bbdccfb16269d51dda2bb.jpg",
        type: "jpg",
      },
      {
        name: "Desktop",
        url: "https://i.pinimg.com/originals/23/d2/5f/23d25f92483d3ece840f54c65a524b0b.gif",
        type: "gif",
      },
    ],
    nature: [
      {
        name: "Nature",
        url: "https://i.pinimg.com/originals/86/d7/5a/86d75a902dda5a4c6ac4b95d8a5afba4.gif",
        type: "gif",
      },
      {
        name: "Rain",
        url: "https://i.pinimg.com/originals/26/6d/5e/266d5e0318e716a6a032abc7a40a96a8.gif",
        type: "gif",
      },
      {
        name: "Butterfly",
        url: "https://i.pinimg.com/originals/66/ad/8a/66ad8a8b3cf59cee451e53ec45ad76c3.gif",
        type: "gif",
      },
      {
        name: "Leaves",
        url: "https://i.pinimg.com/originals/8b/88/04/8b8804f68dd860a430c7b323c4cf4eea.gif",
        type: "gif",
      },
      {
        name: "Fall",
        url: "https://i.pinimg.com/originals/3a/fb/56/3afb5680d1629a6381673ec78bdd8913.gif",
        type: "gif",
      },
      {
        name: "Sunflower",
        url: "https://i.pinimg.com/736x/de/33/bd/de33bd9eeaef16dd9099e03328775975.jpg",
        type: "jpg",
      },
      {
        name: "Sun",
        url: "https://i.pinimg.com/1200x/6e/16/db/6e16db2add718165828197650335205b.jpg",
        type: "jpg",
      },
      {
        name: "Beauty",
        url: "https://i.pinimg.com/736x/41/0b/fb/410bfb25db71448d4450e21d5dd26071.jpg",
        type: "jpg",
      },
    ],
    home: [
      {
        name: "Home",
        url: "https://i.pinimg.com/originals/16/21/07/1621070fa183947ff867f16589d07bc2.gif",
        type: "gif",
      },
      {
        name: "Fire",
        url: "https://i.pinimg.com/originals/92/97/74/929774b033a66c070f5da21ef21c0090.gif",
        type: "gif",
      },
      {
        name: "Modern",
        url: "https://i.pinimg.com/originals/c8/62/c8/c862c87e516623f5cef099600a619d39.gif",
        type: "gif",
      },
      {
        name: "Pancake",
        url: "https://i.pinimg.com/originals/15/c3/8f/15c38f7c473d6447e45ad04c9d43460e.gif",
        type: "gif",
      },
      {
        name: "Sweet",
        url: "https://i.pinimg.com/originals/1a/83/07/1a83079a9e8435f9b24abd485e8b181d.gif",
        type: "gif",
      },
      {
        name: "Sweet Home",
        url: "https://i.pinimg.com/originals/5f/be/16/5fbe1685b1f7d617361fdb63e0c94a7e.gif",
        type: "gif",
      },
    ],
    music: [
      {
        name: "Music",
        url: "https://i.pinimg.com/originals/c4/15/be/c415be334309ccf0b19a2c0a44c73331.gif",
        type: "gif",
      },
      {
        name: "Sing",
        url: "https://i.pinimg.com/originals/f4/ae/33/f4ae3333af52cfda26b28aa548328e91.gif",
        type: "gif",
      },
      {
        name: "Radio",
        url: "https://i.pinimg.com/originals/cf/9e/24/cf9e247ffdc5999611685dbe2b924c9a.gif",
        type: "gif",
      },
      {
        name: "Phone",
        url: "https://i.pinimg.com/originals/df/2d/cd/df2dcd5422be4e87f7af2bb41cc66c3f.gif",
        type: "gif",
      },
    ],
    train: [
      {
        name: "Train",
        url: "https://i.pinimg.com/originals/31/dc/fc/31dcfc27200b25f96e4b90804f2bc19c.gif",
        type: "gif",
      },
      {
        name: "Speed",
        url: "https://i.pinimg.com/originals/13/7a/80/137a80a88f450c00cea75d96c18e5501.gif",
        type: "gif",
      },
      {
        name: "Moving",
        url: "https://i.pinimg.com/originals/5d/2b/4f/5d2b4f5f28851f32fede7de204528b2c.gif",
        type: "gif",
      },
      {
        name: "Japan",
        url: "https://i.pinimg.com/originals/ad/94/2a/ad942add935e194727cb0fe1eeb45c23.gif",
        type: "gif",
      },
      {
        name: "Racing",
        url: "https://i.pinimg.com/originals/44/e0/fa/44e0fa1d064522cbf1983a3e1a700f63.gif",
        type: "gif",
      },
      {
        name: "Drift",
        url: "https://i.pinimg.com/originals/20/e2/70/20e270a8df468a10644b4a9fc1024023.gif",
        type: "gif",
      },
      {
        name: "Bike",
        url: "https://i.pinimg.com/originals/b3/0e/52/b30e526a30fbb8f5c5c6393e7fc6cb5d.gif",
        type: "gif",
      },
    ],
    animals: [
      {
        name: "Cat",
        url: "https://i.pinimg.com/736x/25/de/19/25de194db80d2d10f503d263dad12d09.jpg",
        type: "jpg",
      },
      {
        name: "Dog",
        url: "https://i.pinimg.com/originals/00/d5/f6/00d5f6b33d9d90b59dd007a939eb6378.gif",
        type: "gif",
      },
      {
        name: "Eating",
        url: "https://i.pinimg.com/originals/89/b2/2e/89b22ed50509f67e538bbfdd5f6b6dbe.gif",
        type: "gif",
      },
      {
        name: "Chill",
        url: "https://i.pinimg.com/originals/d0/a1/ed/d0a1ed17b9eb59692dc17bd17275abd5.gif",
        type: "gif",
      },
    ],
  };

  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value);
    setPreviewUrl(e.target.value);
  };

  const handleApplyCustom = () => {
    onBackgroundChange(customUrl);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewUrl(result);
        onBackgroundChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectBackground = (url: string) => {
    setPreviewUrl(url);
    onBackgroundChange(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-40">
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          height: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
      `}</style>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 w-96 max-h-96 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-lg font-bold">Settings</h3>
          <div className="flex gap-2">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="px-3 py-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer text-sm"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth?.();
                  onClose();
                }}
                className="px-3 py-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer text-sm"
              >
                Login
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
            >
              <svg
                width="16"
                height="16"
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
        </div>

        {/* Tabs */}
        <div className="flex mb-3 overflow-x-auto">
          {Object.keys(backgrounds).map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`flex-1 py-2 px-2 text-sm font-medium transition-all cursor-pointer rounded-2xl mx-1 ${
                activeTab === category
                  ? "bg-teal-500/80 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setActiveTab("custom")}
            className={`flex-1 py-2 px-2 text-sm font-medium transition-all cursor-pointer rounded-2xl mx-1 ${
              activeTab === "custom"
                ? "bg-teal-500/80 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Custom
          </button>
        </div>

        {/* Content */}
        {activeTab === "custom" ? (
          <div>
            <div className="mb-3">
              <label className="text-white text-sm font-medium mb-1 block">
                Background URL
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={handleCustomUrlChange}
                placeholder="Enter image URL"
                className="w-full bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 border border-white/30 mb-2"
              />
              <button
                onClick={handleApplyCustom}
                className="w-full bg-teal-500/80 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-teal-500 transition-all"
              >
                Apply
              </button>
            </div>
            <div className="mb-3">
              <label className="text-white text-sm font-medium mb-1 block">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {backgrounds[activeTab as keyof typeof backgrounds].map((bg) => (
              <div
                key={bg.name}
                onClick={() => handleSelectBackground(bg.url)}
                className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-teal-400 transition-all"
              >
                <img
                  src={bg.url}
                  alt={bg.name}
                  className="w-full h-20 object-cover"
                />
                <div className="flex items-center justify-between p-1">
                  <p className="text-white text-xs">{bg.name}</p>
                  {bg.type === "gif" && (
                    <span className="text-green-400 text-xs font-bold">
                      GIF
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
