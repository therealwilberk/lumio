import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { MascotDuck } from '@/components/ui/MascotDuck';
import { PlayfulFloatingElements } from '@/components/ui/FloatingElements';
import { cn } from '@/lib/utils';

// Helper component for bottom gradient effect on buttons
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

// Helper component for label/input container
const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, pin);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-4 relative overflow-hidden">
      {/* Animated background blur effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] rounded-full blur-3xl opacity-30" />

      {/* Playful background elements */}
      <PlayfulFloatingElements className="opacity-40" />

      {/* Mascot Duck Peeking */}
      <div className="absolute -bottom-6 -left-6 z-20 pointer-events-none">
        <MascotDuck className="scale-75 md:scale-100 opacity-80" delay={0.6} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md z-10 relative"
      >
        {/* Gradient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2.5rem] blur-xl opacity-50" />

        <div className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-white/20 dark:border-zinc-800">
          <div className="max-w-md w-full mx-auto">
            <h2 className="font-bold text-4xl text-neutral-800 dark:text-neutral-200 text-center mb-2">
              Welcome to Lumio! 👋
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center mx-auto">
              Ready for your math adventure? 🚀
            </p>

            {error && (
              <Alert className="border-red-500/50 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl mt-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="my-8 space-y-5">
              <LabelInputContainer>
                <Label htmlFor="username" className="text-neutral-800 dark:text-neutral-200">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your cool name"
                  className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-400 dark:focus:border-blue-500 h-12 rounded-xl"
                  required
                  disabled={loading}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="pin" className="text-neutral-800 dark:text-neutral-200">
                  PIN
                </Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-400 dark:focus:border-blue-500 h-12 rounded-xl pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  >
                    {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </LabelInputContainer>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={loading}
                  className="rounded-md border-gray-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="remember" className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Remember me
                </Label>
              </div>

              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-12 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Starting...
                  </div>
                ) : (
                  "Let's Go! 🚀"
                )}
                <BottomGradient />
              </button>
            </form>

            <div className="text-center space-y-3">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-bold underline"
                >
                  Join the fun!
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
