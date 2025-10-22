# 🎯 Planly - Your Productivity Hub

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
- **Timer**: Pomodoro timer with work/break modes
- **Tasks**: Full task management system with priorities
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
cd Planly
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
Planly/
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
│   │   └── layout.tsx        # Root layout
│   └── components/
│       ├── Timer.tsx         # Pomodoro timer component
│       ├── Tasks.tsx         # Task manager component
│       ├── Streaks.tsx       # Streak tracker component
│       ├── Leaderboard.tsx   # Leaderboard component
│       ├── Notes.tsx         # Quick notes component
│       ├── Goals.tsx         # Goals tracker component
│       └── FocusMode.tsx     # Focus mode component
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
- [ ] Backend API integration
- [ ] Real authentication system
- [ ] Data persistence with database
- [ ] User profile customization
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Dark mode toggle
- [ ] Export data functionality
- [ ] Integration with calendar apps
- [ ] Notification system

## 🛠️ Tech Stack
- **Framework**: Next.js 15.5.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI**: Custom components with paper-cutting design
- **Icons**: Emoji + SVG

## 📝 License
This project is open source and available under the MIT License.

## 👨‍💻 Development
Created with ❤️ for productivity enthusiasts

---

**Note**: This is currently a frontend-only demo. Authentication is simulated using localStorage. For production use, implement proper backend authentication and data persistence.

## 🎉 Getting Started Guide

1. **First Visit**: Land on the beautiful homepage
2. **Sign Up**: Click "Get Started" or use "View Demo"
3. **Explore Dashboard**: Navigate through different productivity tools
4. **Start Timer**: Begin a focus session with the Pomodoro timer
5. **Add Tasks**: Create and manage your to-do list
6. **Track Progress**: Monitor your streaks and goals
7. **Compete**: Check your rank on the leaderboard
8. **Stay Focused**: Use Focus Mode to block distractions

Enjoy your productivity journey with Planly! 🚀

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
