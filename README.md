# Focus - Your Ultimate Productivity Hub 🚀

Focus is a premium, open-source productivity application designed to help you stay in the zone. Built with a stunning glassmorphism aesthetic, it combines essential tools like a Pomodoro timer, task management, ambient sounds, and syllabus tracking into one seamless experience.

![GitHub](https://img.shields.io/github/license/friday2su/Focus)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### ⏱️ Intelligent Pomodoro Timer
- **Mode-Aware Resets**: Timer intelligently resets based on your current session (Focus, Short Break, or Long Break).
- **Auto-Switch**: Automatically transition between focus and break sessions to maintain your flow.
- **Notification Sounds**: Stay alerted with premium audio cues when your session ends.
- **Mini Timer Mode**: Keep your focus in a dedicated floating window.

### 🎵 Ambient Soundboard & Music
- **Clean Audio Switching**: High-performance audio engine prevents sound overlays and ensures instant transitions.
- **Diverse Soundscapes**: From "Rainy Cafe" to "Deep Space," choose the perfect background for your work.
- **Spotify Integration**: Embed your favorite productivity playlists directly into the dashboard.

### 📊 Study Tracking & Syllabus
- **Syllabus Tracker**: Manage your subjects and track chapter-wise progress with visual progress bars.
- **Study Logs**: Log your study hours and see your performance rankings (Beginner to Excellent).
- **Motivational Cues**: Daily rotating motivational quotes to keep you inspired.

### 🎨 Premium UI/UX
- **Glassmorphism Design**: High-end aesthetic with beautiful blurs and vibrant gradients.
- **Dynamic Backgrounds**: Choose from a curated list of anime, nature, and study-themed backgrounds, or upload your own.
- **Responsive & Fullscreen**: Optimized for different screen sizes with a dedicated distraction-free fullscreen mode.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: JWT-based auth with the `jose` library
- **Icons**: Custom SVG icons and Lucide-inspired components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (Atlas or local)

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/friday2su/Focus.git
   cd Focus
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   JWT_SECRET=your_strong_secret_here
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB=focus
   ```

4. **Run Development Mode**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to see it in action.

## 📖 Key Updates

- **Fixed**: Sound overlay bug where multiple ambient sounds would play simultaneously.
- **Fixed**: Timer reset logic now correctly follows the active mode's duration.
- **New**: Integrated **Open Source Announcement** modal for new users.
- **Improved**: Mobile responsiveness for the syllabus tracker and study logs.

## 🤝 Contributing

We love contributions! Whether it's fixing a bug, adding a new soundscape, or improving the UI.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [FRIDAY](https://github.com/friday2su)
