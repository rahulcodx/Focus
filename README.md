# 🎯 Focus - Your Productivity Hub

A beautiful, modern productivity application built with Next.js, featuring a clean paper-cutting design aesthetic.

## ✨ Features

### 🏠 Homepage
- Clean, modern landing page with gradient effects
- Paper-cutting inspired design with layered shadows
- Responsive navigation and hero section
- Feature showcase with animated cards
- Call-to-action sections

### 🔐 Authentication
- Login and Signup pages with clean UI
- Form validation
- Guest/demo access available
- Beautiful background gradients

### 📊 Dashboard
Complete productivity workspace with:
- **Overview**: Quick stats and overview of all tools
- **Timer**: Pomodoro timer with work/break modes and study logs
- **Tasks**: Full task management system with priorities
- **Syllabus Tracker**: Track subjects with chapter progress and completion
- **Study Logs**: Daily study session logging with duration tracking
- **Background Customization**: Personalize dashboard with custom backgrounds
- **Streaks**: Daily streak tracking with activity calendar
- **Leaderboard**: Competitive rankings with points system
- **Notes**: Quick note-taking with color-coded cards
- **Goals**: Goal tracking with progress bars
- **Focus Mode**: Distraction blocker for deep work

## 🎨 Design System

### Paper-Cutting Aesthetic
- Layered card design with depth
- Soft, subtle shadows
- Smooth animations and transitions
- Glass-morphism effects
- Gradient accents

### Color Palette
- **Blue**: `#4299e1` - Primary actions
- **Purple**: `#9f7aea` - Secondary accents
- **Green**: `#48bb78` - Success/health
- **Orange**: `#ed8936` - Energy/streaks
- **Pink**: `#ed64a6` - Creative/highlights

### Typography
- Primary: Geist Sans
- Monospace: Geist Mono

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd Focus
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## 📁 Project Structure

\`\`\`
Focus/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Homepage/Landing page
│   │   ├── login/
│   │   │   └── page.tsx      # Login page
│   │   ├── signup/
│   │   │   └── page.tsx      # Signup page
│   │   ├── dashboard/
│   │   │   └── page.tsx      # Main dashboard
│   │   ├── globals.css       # Global styles & design system
│   │   ├── layout.tsx        # Root layout
│   │   └── api/              # API routes
│   │       ├── auth/        # Authentication routes
│   │       ├── tasks/        # Task management routes
│   │       ├── syllabus/     # Syllabus tracking routes
│   │       ├── background/   # Background customization routes
│   │       ├── studylogs/    # Study logs routes
│   │       └── user/         # User management routes
│   └── components/
│       ├── Timer.tsx         # Pomodoro timer component
│       ├── Tasks.tsx         # Task manager component
│       ├── Streaks.tsx       # Streak tracker component
│       ├── Leaderboard.tsx   # Leaderboard component
│       ├── Notes.tsx         # Quick notes component
│       ├── Goals.tsx         # Goals tracker component
│       ├── FocusMode.tsx     # Focus mode component
│       ├── MusicModal.tsx    # Spotify integration modal
│       ├── SoundModal.tsx    # Sound effects modal
│       ├── SettingsModal.tsx # Background customization modal
│       └── ShareModal.tsx    # Share functionality modal
│   └── lib/
│       ├── models/          # Database schemas
│       │   ├── User.ts       # User model
│       │   ├── Task.ts       # Task model
│       │   ├── Syllabus.ts   # Syllabus model
│       │   ├── Background.ts # Background model
│       │   └── StudyLog.ts   # Study log model
│       ├── mongodb.ts       # MongoDB connection
│       ├── auth.ts           # Authentication utilities
│       └── api-client.ts     # API client utilities
├── public/                   # Static assets
├── package.json
└── README.md
\`\`\`

## 🎯 Key Features Explained

### Timer Component
- Pomodoro technique (25/5/15 minute sessions)
- Visual circular progress indicator
- Start/Pause/Reset controls
- Session statistics
- Compact and full view modes

### Tasks Component
- Add, complete, and delete tasks
- Priority levels (high, medium, low)
- Category tags
- Filter by status (all, active, completed)
- Visual completion tracking

### Streaks Component
- Daily activity tracking
- 7-week activity calendar
- Current and longest streak display
- Completion rate statistics
- Visual heatmap

### Leaderboard Component
- Competitive rankings
- Points, streaks, and task completion
- Top 3 podium display
- Timeframe filters (day, week, month, all-time)
- User highlighting

### Notes Component
- Quick note creation
- Color-coded notes
- Grid layout
- Delete functionality
- Timestamp tracking

### Goals Component
- Goal creation with targets
- Progress tracking with visual bars
- Category tagging
- Deadline management
- Increment controls

### Focus Mode Component
- Distraction blocking
- Multiple focus types (work, study, meditation)
- App/website blocking toggles
- Session statistics
- Focus tips

### Music Integration
- Spotify playlist integration with embed display
- Toggle visibility of music embed
- Custom playlist URL input
- Background music for focus sessions

### Background Customization
- Personalize dashboard background
- Preloaded themes (Anime, Nature, Study, etc.)
- Custom URL input and file upload
- Real-time preview
- Persistent user preferences

### Syllabus Tracker
- Track multiple subjects with chapter progress
- Visual progress bars for completion
- Add/edit total and completed chapters
- Integrated into timer mode for study sessions

### Study Logs
- Daily study session logging
- Duration tracking per subject
- Date-based organization
- Reset functionality for daily tracking

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `src/app/globals.css`:

\`\`\`css
:root {
  --accent-blue: #4299e1;
  --accent-purple: #9f7aea;
  --accent-green: #48bb78;
  /* ... more colors */
}
\`\`\`

### Adding New Tools
1. Create a new component in `src/components/`
2. Add the tool to the `tools` array in `src/app/dashboard/page.tsx`
3. Import and configure the component

## 🌐 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design
Fully responsive across:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🔮 Future Enhancements
- [x] Backend API integration with MongoDB
- [x] Real authentication system
- [x] Data persistence with database
- [x] User profile customization with background settings
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Dark mode toggle
- [ ] Export data functionality
- [ ] Integration with calendar apps
- [ ] Notification system
- [ ] Advanced analytics and reporting
- [ ] Integration with productivity tools (Todoist, Notion, etc.)

## 🛠️ Tech Stack
- **Framework**: Next.js 15.5.6
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose schemas
- **Styling**: Tailwind CSS 4
- **UI**: Custom components with paper-cutting design
- **Icons**: Emoji + SVG
- **Authentication**: JWT-based auth system

## 📝 License
This project is open source and available under the MIT License.

## 👨‍💻 Development
Created with ❤️ for productivity enthusiasts

---

**Note**: This application now includes full backend integration with MongoDB for data persistence. Authentication uses JWT tokens, and all user data is stored securely in the database.

## 🎉 Getting Started Guide

1. **First Visit**: Land on the beautiful homepage
2. **Sign Up**: Click "Get Started" or use "View Demo"
3. **Explore Dashboard**: Navigate through different productivity tools
4. **Customize Background**: Click settings to personalize your dashboard background
5. **Start Timer**: Begin a focus session with the Pomodoro timer
6. **Add Tasks**: Create and manage your to-do list
7. **Track Syllabus**: Add subjects and monitor chapter progress
8. **Log Study Sessions**: Track daily study time and subjects
9. **Listen to Music**: Integrate Spotify playlists for focus music
10. **Track Progress**: Monitor your streaks and goals
11. **Compete**: Check your rank on the leaderboard
12. **Stay Focused**: Use Focus Mode to block distractions

Enjoy your productivity journey with Focus! 🚀

## Deploy to Vercel

1. Create a Vercel account and install the Vercel CLI:
```bash
npm i -g vercel
```
2. Add environment variables in your Vercel project (same as your local .env.local):
- MONGODB_URI
- MONGODB_DB_NAME
- JWT_SECRET

3. From the project root, deploy:
```bash
vercel
```
Follow the prompts to create/link the project.

4. For production deployments:
```bash
vercel --prod
```

This repo ships with `vercel.json` configured for the Next.js app and API routes.
