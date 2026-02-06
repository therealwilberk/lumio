
Project Overview
Gamified learning platform for Grade 6 student focusing on math fundamentals with future expansion to other subjects (Kiswahili, Agriculture, English etc).
Design Aesthetic: Clean, modern, sophisticated with playful elements. Think: professional dashboard meets friendly learning app. NOT dark gamer terminal, NOT overly childish.
Reference Images:
Design Aesthetic: Clean, modern, sophisticated with playful elements. Think: professional dashboard meets friendly learning app. NOT dark gamer terminal, NOT overly childish.
Login: Glassmorphic blue design with soft shapes
Dashboard: Light, colorful, clean data visualization
NOTE: Name change to "Lumio" Remove all instances of 'Number Nexus'
Tech Stack
Frontend
Framework: React 18+ with Vite
Styling: Tailwind CSS
Animations: Framer Motion
Charts: Recharts
Icons: Lucide React
Fonts:
Display: Playfair Display or similar serif (for hero text)
Body: Inter or similar clean sans-serif
Mono: JetBrains Mono (for numbers)
Backend
Platform: Cloudflare Workers
Storage: Cloudflare Durable Objects
Auth: Simple custom implementation (name + PIN)
Deployment: Cloudflare Pages
File Structure
numbernexus/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   └── Footer.jsx
│   │   ├── dashboard/
│   │   │   ├── ProgressCard.jsx
│   │   │   ├── StatsChart.jsx
│   │   │   ├── StreakTracker.jsx
│   │   │   └── TroubleSpots.jsx
│   │   ├── math/
│   │   │   ├── TopicsGrid.jsx
│   │   │   ├── SpeedDrill.jsx
│   │   │   ├── ProblemDisplay.jsx
│   │   │   └── PracticeMode.jsx
│   │   └── subjects/
│   │       └── SubjectCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MathHub.jsx
│   │   └── subjects/
│   │       └── math/
│   │           ├── Addition.jsx
│   │           ├── Subtraction.jsx
│   │           ├── Multiplication.jsx
│   │           └── Division.jsx
│   ├── lib/
│   │   ├── auth.js
│   │   ├── api.js
│   │   └── storage.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useProgress.js
│   │   └── useGameState.js
│   └── styles/
│       └── globals.css
├── workers/
│   ├── auth.js
│   ├── progress.js
│   └── durable-objects/
│       └── UserSession.js
└── public/
    └── assets/

PHASE 1: Authentication & Core Layout
Task 1.1: Authentication System
Priority: CRITICAL 
Deliverables:
Login Page
Glassmorphic design (reference image 2)
Blue color scheme with soft shapes
Background: Animated blob shapes (CSS or SVG)
Form fields:
Username input
Password input
"Remember me" checkbox
"Forgot password?" link (can be placeholder)
No social logins, just username & password/pin
"Sign in" button with hover effects
"Don't have an account? Register for free" link
Signup Flow
Same glassmorphic design
Fields:
Username (check if exists)
Password (show strength indicator)
Confirm password
Validation:
Username: 3-20 chars, alphanumeric + underscore
Password: min 8 chars, 1 uppercase, PIN since this is for kids
Check username uniqueness
Backend Auth Worker
Cloudflare Worker endpoints:
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/verify
Password hashing (bcrypt)
JWT token generation
Session management with Durable Objects
Protected Routes
React component to wrap protected pages
Redirect to login if not authenticated
Store auth state in React Context
Technical Specs:
Login Form Component:
jsx
// Key features:
- Glassmorphic card (backdrop-blur-xl, bg-white/10)
- Smooth animations on mount
- Error handling with friendly messages
- Loading states
- Auto-focus on username field
Auth Context:
jsx
// Provide globally:
- user: { username, id, createdAt }
- isAuthenticated: boolean
- login(username, PIN): Promise
- signup(username, pin): Promise
- logout(): void
Security Requirements:
Hash passwords with bcrypt (10 rounds)
Store JWT in httpOnly cookie (if possible) or localStorage
CSRF protection
Rate limiting on login attempts (5 per minute)
Input sanitization
Design Specs:
Colors:
css
--auth-bg: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
--text-primary: #ffffff;
--text-secondary: rgba(255, 255, 255, 0.8);
--accent: #60a5fa;
--error: #ef4444;
--success: #10b981;
Blob Animation (Background):
3-4 floating blob shapes
Soft colors (blue shades with transparency)
Slow movement (20-40s animation)
Blur effect

Your Canon Phase 1 Scope
Only build:

Auth
Home
Dashboard
One math topic
One practice mode

Not four operations.
 Not streaks.
 Not leaderboards.
One topic.
Example:
Addition only.

Your Canon Gameplay Loop
Student logs in
 → Sees dashboard
 → Clicks Addition
 → Solves problems
 → Gets score
 → Progress saved
