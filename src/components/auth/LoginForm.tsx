import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { MascotDuck } from '@/components/ui/MascotDuck';
import { PlayfulFloatingElements } from '@/components/ui/FloatingElements';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 p-4 relative overflow-hidden">
      {/* Playful background elements */}
      <PlayfulFloatingElements className="opacity-60" />

      {/* Mascot Duck Peeking */}
      <div className="absolute -bottom-6 -left-6 z-20 pointer-events-none">
        <MascotDuck className="scale-75 md:scale-100 opacity-80" delay={0.6} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md z-10"
      >
        <Card className="backdrop-blur-md bg-white/90 border-white/50 shadow-2xl overflow-hidden rounded-3xl">
          <CardHeader className="text-center pb-6 bg-blue-50/50">
            <CardTitle className="text-4xl font-extrabold text-blue-600 mb-2 tracking-tight">
              Lumio
            </CardTitle>
            <p className="text-blue-500 font-medium">Ready for your math adventure? 🚀</p>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            {error && (
              <Alert className="border-red-500/50 bg-red-50 text-red-600 rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-600 text-sm font-semibold ml-1">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your cool name"
                  className="bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400 h-12 rounded-xl"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin" className="text-gray-600 text-sm font-semibold ml-1">PIN</Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Secret PIN"
                    className="bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400 h-12 rounded-xl pr-10"
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
              </div>

              <div className="flex items-center space-x-2 ml-1">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={loading}
                  className="rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="remember" className="text-gray-500 text-sm font-medium">Remember me</Label>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-2xl text-lg font-bold transition-all shadow-lg hover:shadow-blue-500/40 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Starting...
                    </div>
                  ) : (
                    'Let\'s Go! 🚀'
                  )}
                </Button>
              </motion.div>
            </form>
            
            <div className="text-center space-y-3 pt-2">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-blue-500 hover:text-blue-600 font-bold underline"
                >
                  Join the fun!
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
