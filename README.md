# Lumio 🎓

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/your-username/lumio)

A modern gamified learning platform designed for Grade 6 students, focusing on math fundamentals with beautiful animations, progress tracking, and engaging challenges. Built with React, Cloudflare Workers, and modern web technologies.

## 🎯 What Lumio Does

**Lumio transforms learning into an adventure!** Students master mathematics through:

- 🧮 **Interactive Math Practice** - Addition, Subtraction, Multiplication, Division
- ⚡ **Lightning Round Speed Drills** - Build muscle memory for 1-10 addition
- 🏆 **Progress Tracking & Achievements** - Unlock new topics as you advance
- 🎨 **Beautiful Modern UI** - Glassmorphic design with dark mode support
- 📊 **Personalized Learning** - Adaptive challenges based on skill level
- 🔓 **Topic Unlock System** - Progress through subjects at your own pace

## ✨ Key Features

### 🎮 Gamified Learning Experience
- **Hero Section**: Animated mountain landscape with personalized greetings
- **Subject Cards**: Interactive cards with progress tracking and unlock states
- **Math Hub**: Central hub for all math topics with unlock logic
- **Lightning Round**: Speed drill mode for rapid mastery (1-10 addition)
- **Achievement System**: Badges, streaks, and performance tracking

### 🎨 Modern Design & UX
- **Glassmorphic Navigation**: Floating navbar with backdrop blur effects
- **Dark Mode Support**: Complete theme toggle with persistent preferences
- **Responsive Design**: Perfect experience on all devices
- **Smooth Animations**: Framer Motion powered interactions throughout
- **Professional Aesthetics**: Clean, modern interface that students love

### 🔐 Authentication & Progress
- **Secure Authentication**: PIN-based login/signup with JWT tokens
- **Progress Persistence**: All progress saved to Cloudflare Durable Objects
- **User Profiles**: Personalized learning journeys
- **Performance Analytics**: Detailed stats and improvement tracking

### 📚 Subject Structure
- **Mathematics**: Complete with 4 operations and progressive difficulty
- **Kiswahili**: Language learning (coming soon)
- **Agriculture**: Practical farming concepts (coming soon)
- **English**: Reading and writing skills (coming soon)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for beautiful animations
- **shadcn/ui** for modern UI components
- **Lucide Icons** for consistent iconography
- **TanStack Query** for data management

### Backend
- **Cloudflare Workers** for serverless deployment
- **Hono** framework for fast API development
- **Durable Objects** for persistent storage
- **JWT Authentication** for secure sessions

### Infrastructure
- **Cloudflare Pages** for frontend hosting
- **Cloudflare Workers** for backend API
- **Durable Objects** for database storage
- **Global CDN** for fast content delivery

## 🚀 Quick Start

1. **Clone and Install**:
   ```bash
   git clone <your-repo-url>
   cd lumio
   bun install
   ```

2. **Run Locally**:
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000`

3. **Create Account & Start Learning**:
   - Sign up with a username and PIN
   - Choose your learning path
   - Begin your math adventure!

## 📖 Learning Journey

### Phase 1: Fundamentals
1. **Sign Up** - Create your student account
2. **Explore Subjects** - Choose from available topics
3. **Start with Addition** - Master basic addition skills
4. **Lightning Round** - Build speed and accuracy

### Phase 2: Progression
1. **Unlock Subtraction** - Complete 80% of addition
2. **Master Multiplication** - Progress through subtraction
3. **Conquer Division** - Complete all operations
4. **Track Progress** - Monitor improvement and achievements

### Phase 3: Advanced Topics
- **Kiswahili Language** - Coming soon
- **Agriculture Science** - Coming soon  
- **English Skills** - Coming soon

## 🎮 Game Features

### Lightning Round Mode
- **20 Problems**: Rapid-fire addition challenges
- **Time Tracking**: Visual timer with color-coded urgency
- **Performance Badges**: Lightning Fast, Speed Star, Getting Quick
- **Streak System**: Build consecutive correct answers
- **Previous Attempts**: Compare your improvement over time

### Progress System
- **Unlock Logic**: Each topic unlocks at 80% completion of previous
- **Level Badges**: Track your mastery level (1-5)
- **Accuracy Tracking**: Monitor your success rate
- **Time Analytics**: See your average time per problem

## 🎨 Design Highlights

### Glassmorphic Navigation
- **Floating Design**: Not attached to top, centered with rounded corners
- **Backdrop Blur**: Modern blur effects with semi-transparent backgrounds
- **Theme Toggle**: Switch between light and dark modes
- **Mobile Responsive**: Hamburger menu with slide-out drawer

### Hero Section
- **Mountain Landscape**: Beautiful parallax scrolling background
- **Personalized Greetings**: Time-based messages with user names
- **Animated Elements**: Floating particles and decorative sparkles
- **Smooth Transitions**: Professional animations throughout

### Subject Cards
- **Interactive Hover Effects**: Scale and shadow animations
- **Progress Indicators**: Visual progress bars with gradients
- **Lock States**: Clear unlock requirements and progress tracking
- **Modern Card Design**: Clean, professional aesthetic

## 🔧 Development

### Local Development
```bash
bun dev          # Start development server
bun lint         # Lint code
bun build        # Build for production
bun deploy       # Deploy to Cloudflare
```

### API Structure
- **Authentication**: `/api/auth/*` - Login, signup, verification
- **Student Data**: `/api/student/*` - Progress, stats, achievements
- **Speed Drills**: `/api/drill/*` - Lightning round data and results
- **User Management**: Secure PIN-based authentication system

### Database Schema
- **Users**: PIN-based authentication with progress tracking
- **Progress**: Detailed solve logs and performance metrics
- **Achievements**: Badge system and streak tracking
- **Speed Drills**: Complete drill history and comparisons

## 📊 Analytics & Progress

### Student Dashboard
- **Total Problems Solved**: Track your learning volume
- **Current Streak**: Motivation through consecutive success
- **Weekly Score**: Monitor recent performance
- **Subject Progress**: Visual progress bars for each topic

### Performance Metrics
- **Accuracy Rates**: Track correct answer percentages
- **Time Analytics**: Average time per problem
- **Improvement Trends**: Compare with previous attempts
- **Achievement Unlocks**: Celebrate milestone achievements

## 🌟 Why Lumio?

### For Students
- **Engaging Learning**: Gamified approach makes math fun
- **Progressive Difficulty**: Start easy, build confidence
- **Instant Feedback**: Learn from mistakes immediately
- **Achievement System**: Earn badges and track progress

### For Parents & Teachers
- **Safe Environment**: PIN-based authentication, no personal data required
- **Progress Monitoring**: Detailed analytics on student performance
- **Structured Learning**: Clear progression path and objectives
- **Modern Technology**: Built with latest web standards for reliability

## 🚀 Deployment

Deploy to Cloudflare Workers + Pages:
```bash
bun deploy
```

**Features:**
- Global CDN for fast loading
- Serverless architecture for scalability
- Durable Objects for persistent storage
- Automatic SSL certificates
- Custom domain support

## 📱 Responsive Design

- **Desktop**: Full-featured experience with large screens
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with adapted navigation
- **Cross-browser**: Works on all modern browsers

## 🔒 Security & Privacy

- **PIN Authentication**: Secure, simple login system
- **No Personal Data**: Only username and PIN required
- **Encrypted Storage**: All data encrypted at rest
- **Secure API**: JWT tokens for session management
- **Privacy First**: No tracking or data collection

## 🎯 Future Roadmap

### Phase 2: Subject Expansion
- **Kiswahili Language**: Complete language learning module
- **Agriculture Science**: Interactive farming concepts
- **English Skills**: Reading comprehension and writing

### Phase 3: Advanced Features
- **Multiplayer Challenges**: Compete with friends
- **Classroom Mode**: Teacher dashboard and student management
- **Advanced Analytics**: Detailed learning insights
- **Mobile App**: Native iOS and Android applications

## 📞 Support

**Built with ❤️ for Grade 6 students everywhere.**

Lumio makes learning mathematics an adventure, not a chore. Join thousands of students discovering the joy of learning through gamification and modern technology.

---

## 📄 License

MIT License - Built with modern web technologies for the next generation of learners.

---

**Start your learning adventure today!** 🚀