# PROMPT: Aceternity UI Component Overhaul - Complete Lumio Redesign

## Context
Lumio currently uses basic Tailwind styling. We want to elevate the entire UI using Aceternity UI's modern, animated components to create a next-level learning platform that feels premium and engaging.

**Aceternity UI**: https://ui.aceternity.com/components

## Current Lumio Structure

Based on progress.md:
1. **HomePage** - Hero + Subject Cards
2. **LoginPage** - Glassmorphic auth form
3. **SignupPage** - Registration form
4. **DashboardPage** - Stats + Charts
5. **MathHub** - Subject selection
6. **AdditionPage** - Practice interface
7. **RegularPracticePage** - Level-based practice
8. **LightningRoundPage** - Speed drill

---

## 🎨 Design System First

### Install Aceternity Components

```bash
# Aceternity uses Tailwind + Framer Motion (already installed)
# Copy components from https://ui.aceternity.com/components

# Create aceternity components directory
mkdir -p src/components/ui/aceternity
```

### Color Palette (Update Tailwind Config)

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // Lumio brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          pink: '#ec4899',
          purple: '#a855f7',
          orange: '#f97316',
          green: '#10b981',
          yellow: '#fbbf24',
        },
        // Dark mode
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(120deg, #667eea 0%, #764ba2 100%)',
      }
    }
  }
}
```

---

## 📱 Page-by-Page Overhaul

### 1. HomePage Overhaul

**Components to Use:**
- Background Beams (https://ui.aceternity.com/components/background-beams)
- Animated Cards (https://ui.aceternity.com/components/3d-card-effect)
- Sparkles (https://ui.aceternity.com/components/sparkles)
- Moving Border (https://ui.aceternity.com/components/moving-border)

**Implementation:**

```tsx
// src/pages/HomePage.tsx
import { BackgroundBeams } from '@/components/ui/aceternity/background-beams';
import { CardContainer, CardBody, CardItem } from '@/components/ui/aceternity/3d-card';
import { SparklesCore } from '@/components/ui/aceternity/sparkles';
import { motion } from 'framer-motion';

export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <BackgroundBeams />
      
      {/* Sparkles effect */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Good morning, Kamaa!
          </h1>
          
          <p className="text-2xl text-white/70 mt-6">
            Ready to level up your math skills? 🚀
          </p>
        </motion.div>

        {/* Subject Cards with 3D Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {subjects.map((subject, i) => (
            <CardContainer key={i} className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {subject.icon} {subject.name}
                </CardItem>
                
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
                >
                  {subject.description}
                </CardItem>

                <CardItem translateZ="100" className="w-full mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    />
                  </div>
                </CardItem>

                <div className="flex justify-between items-center mt-6">
                  <CardItem
                    translateZ={20}
                    className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  >
                    {subject.progress}% Complete
                  </CardItem>
                  
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold"
                  >
                    Let's Go! →
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### 2. Login/Signup Pages

**Components to Use:**
- Background Gradient (https://ui.aceternity.com/components/background-gradient)
- Input with Label (https://ui.aceternity.com/components/label)
- Moving Border Button (https://ui.aceternity.com/components/moving-border)

**Implementation:**

```tsx
// src/pages/LoginPage.tsx
import { BackgroundGradient } from '@/components/ui/aceternity/background-gradient';
import { Label } from '@/components/ui/aceternity/label';
import { Input } from '@/components/ui/aceternity/input';
import { MovingBorder } from '@/components/ui/aceternity/moving-border';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <BackgroundGradient className="rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900">
          <div className="max-w-md w-full mx-auto">
            <h2 className="font-bold text-4xl text-neutral-800 dark:text-neutral-200 text-center">
              Welcome to Lumio! 👋
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center">
              Ready for your math adventure? 🚀
            </p>

            <form className="my-8">
              <LabelInputContainer className="mb-4">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="Kamaa" 
                  type="text" 
                />
              </LabelInputContainer>
              
              <LabelInputContainer className="mb-4">
                <Label htmlFor="pin">PIN</Label>
                <Input 
                  id="pin" 
                  placeholder="••••" 
                  type="password" 
                />
              </LabelInputContainer>

              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
              >
                Let's Go! →
                <BottomGradient />
              </button>
            </form>
          </div>
        </BackgroundGradient>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
```

---

### 3. Math Hub (Subject Selection)

**Components to Use:**
- Lamp Effect (https://ui.aceternity.com/components/lamp)
- Hover Border Gradient (https://ui.aceternity.com/components/hover-border-gradient)
- Floating Dock (https://ui.aceternity.com/components/floating-dock)

**Implementation:**

```tsx
// src/pages/MathHub.tsx
import { LampContainer } from '@/components/ui/aceternity/lamp';
import { HoverBorderGradient } from '@/components/ui/aceternity/hover-border-gradient';
import { motion } from 'framer-motion';

export function MathHub() {
  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Hero with Lamp Effect */}
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Pick Your Math Adventure! 🎯
        </motion.h1>
      </LampContainer>

      {/* Math Topics Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mathTopics.map((topic, i) => (
            <HoverBorderGradient
              key={i}
              containerClassName="rounded-3xl"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-4"
            >
              <div className="p-8 w-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{topic.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold">{topic.name}</h3>
                    <p className="text-sm text-gray-500">{topic.description}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm font-bold">{topic.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${topic.progress}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm mb-4">
                  <div>⭐ Level {topic.level}</div>
                  <div>🎯 {topic.accuracy}% accurate</div>
                  <div>⚡ {topic.avgTime}s avg</div>
                </div>

                {topic.locked ? (
                  <button 
                    disabled
                    className="w-full py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                  >
                    🔒 Complete {topic.unlockRequirement} first
                  </button>
                ) : (
                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-shadow">
                    Let's Practice! →
                  </button>
                )}
              </div>
            </HoverBorderGradient>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### 4. Practice Pages (Addition/Regular Practice)

**Components to Use:**
- Spotlight (https://ui.aceternity.com/components/spotlight)
- Animated Tooltip (https://ui.aceternity.com/components/animated-tooltip)
- Meteors (https://ui.aceternity.com/components/meteors)

**Implementation:**

```tsx
// src/pages/RegularPracticePage.tsx
import { Spotlight } from '@/components/ui/aceternity/spotlight';
import { AnimatedTooltip } from '@/components/ui/aceternity/animated-tooltip';
import { Meteors } from '@/components/ui/aceternity/meteors';

export function RegularPracticePage() {
  return (
    <div className="h-screen w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <div className="relative z-10 container mx-auto px-4 pt-20">
        {/* Level Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Level {currentLevel}
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            {levelDescription}
          </p>
        </div>

        {/* Problem Card with Meteors */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] rounded-full blur-3xl" />
          <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-8 py-12 overflow-hidden rounded-2xl flex flex-col justify-end items-start">
            <Meteors number={20} />
            
            {/* Problem */}
            <div className="text-center w-full mb-8">
              <div className="text-7xl font-bold text-white mb-8">
                {problem.num1} + {problem.num2} = ?
              </div>

              {/* Visual Helpers */}
              {showVisuals && (
                <div className="flex justify-center gap-8 mb-8">
                  <DotGroup count={problem.num1} color="blue" />
                  <DotGroup count={problem.num2} color="purple" />
                </div>
              )}

              {/* Answer Input */}
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-32 h-20 text-4xl text-center bg-white/10 border-2 border-white/20 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 w-full justify-center">
              <AnimatedTooltip items={[{ name: "Hint", designation: "-5 points" }]}>
                <button className="px-6 py-3 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition">
                  💡 Hint
                </button>
              </AnimatedTooltip>

              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition">
                Check Answer! ✓
              </button>
            </div>

            {/* Stats Bar */}
            <div className="flex justify-between w-full mt-8 text-white/70">
              <div>Score: {score}</div>
              <div>Streak: {streak} 🔥</div>
              <div>Accuracy: {accuracy}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DotGroup({ count, color }) {
  return (
    <motion.div className="grid grid-cols-5 gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className={`w-6 h-6 rounded-full ${
            color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
          }`}
        />
      ))}
    </motion.div>
  );
}
```

---

### 5. Components to Install

**Copy these from Aceternity UI:**

1. **Background Beams** - https://ui.aceternity.com/components/background-beams
2. **3D Card Effect** - https://ui.aceternity.com/components/3d-card-effect
3. **Sparkles** - https://ui.aceternity.com/components/sparkles
4. **Moving Border** - https://ui.aceternity.com/components/moving-border
5. **Background Gradient** - https://ui.aceternity.com/components/background-gradient
6. **Label & Input** - https://ui.aceternity.com/components/label
7. **Lamp Effect** - https://ui.aceternity.com/components/lamp
8. **Hover Border Gradient** - https://ui.aceternity.com/components/hover-border-gradient
9. **Spotlight** - https://ui.aceternity.com/components/spotlight
10. **Animated Tooltip** - https://ui.aceternity.com/components/animated-tooltip
11. **Meteors** - https://ui.aceternity.com/components/meteors

**Installation process for each:**
1. Visit component page on Aceternity UI
2. Click "Copy Code"
3. Create file in `src/components/ui/aceternity/[component-name].tsx`
4. Paste code
5. Install any dependencies listed

---

## 🎨 Gradient Enhancements

### Add these gradient classes to Tailwind:

```js
// tailwind.config.js - extend with custom gradients
backgroundImage: {
  // Mesh gradients
  'mesh-purple': 'linear-gradient(120deg, #667eea 0%, #764ba2 100%)',
  'mesh-blue': 'linear-gradient(120deg, #2563eb 0%, #7c3aed 100%)',
  'mesh-pink': 'linear-gradient(120deg, #ec4899 0%, #f97316 100%)',
  
  // Radial gradients
  'radial-blue': 'radial-gradient(circle at 50% 50%, #3b82f6, #1e40af)',
  'radial-purple': 'radial-gradient(circle at 50% 50%, #a855f7, #6b21a8)',
  
  // Animated gradients (use with animate-gradient)
  'gradient-animated': 'linear-gradient(270deg, #3b82f6, #8b5cf6, #ec4899)',
}
```

### Add gradient animation:

```css
/* Add to globals.css */
@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}
```

---

## 📋 Implementation Checklist

### Phase 1: Setup (1 hour)
- [ ] Update Tailwind config with custom colors and gradients
- [ ] Create `/src/components/ui/aceternity/` directory
- [ ] Install Aceternity dependencies (if any)

### Phase 2: Install Components (2-3 hours)
- [ ] Copy 11 Aceternity components listed above
- [ ] Test each component in isolation
- [ ] Fix any TypeScript errors

### Phase 3: HomePage (2 hours)
- [ ] Add Background Beams
- [ ] Add Sparkles
- [ ] Convert subject cards to 3D Card Effect
- [ ] Test animations

### Phase 4: Auth Pages (1 hour)
- [ ] Update Login with Background Gradient
- [ ] Add Moving Border to buttons
- [ ] Update Signup similarly

### Phase 5: Math Hub (2 hours)
- [ ] Add Lamp Effect
- [ ] Convert topic cards to Hover Border Gradient
- [ ] Add lock/unlock animations

### Phase 6: Practice Pages (3 hours)
- [ ] Add Spotlight to practice & math interface
- [ ] Add Meteors to problem cards
- [ ] Add Animated Tooltips to hints
- [ ] Test all interactions

### Phase 7: Dashboard (see separate prompt)
- [ ] Use Tremor + Aceternity combo
- [ ] Create premium data viz

### Phase 8: Polish (2 hours)
- [ ] Consistent animations throughout
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Final testing

**Total Time: 15-18 hours**

---

## 🚀 Quick Wins

If short on time, prioritize these:

1. **Background Beams** on HomePage (30 min)
2. **3D Card Effect** on subject cards (1 hour)
3. **Moving Border** on all primary buttons (30 min)
4. **Lamp Effect** on Math Hub (1 hour)

**Result**: 3 hours → 80% visual improvement

---

## Success Criteria

✅ All pages use Aceternity components
✅ Animations run smoothly (60fps)
✅ Dark mode fully supported
✅ Mobile responsive
✅ Consistent design language
✅ Modern, premium feel
✅ Kids find it exciting
✅ Parents impressed

## Resources

- Aceternity UI: https://ui.aceternity.com/components
- Installation Guide: https://ui.aceternity.com/docs/installation
- Framer Motion Docs: https://www.framer.com/motion/
- Tailwind Gradients: https://tailwindcss.com/docs/gradient-color-stops

## Expected Result

A completely transformed Lumio with modern, animated UI that feels like a premium SaaS product while maintaining kid-friendly vibes. Every interaction delights, every page transition is smooth, and the overall aesthetic screams "next-level learning platform."