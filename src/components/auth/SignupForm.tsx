import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { MascotDuck } from '@/components/ui/MascotDuck';
import { PlayfulFloatingElements } from '@/components/ui/FloatingElements';

export function SignupForm() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Password strength indicators
  const pinRequirements = [
    { test: (pin: string) => pin.length >= 4, text: 'At least 4 numbers' },
    { test: (pin: string) => /\d/.test(pin), text: 'Contains numbers' }
  ];

  const usernameRequirements = [
    { test: (username: string) => username.length >= 3, text: 'At least 3 characters' },
    { test: (username: string) => username.length <= 20, text: '20 characters or less' },
    { test: (username: string) => /^[a-zA-Z0-9_]+$/.test(username), text: 'Letters, numbers, and underscores only' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signup(username, pin, confirmPin);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Signup failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-blue-400 to-indigo-400 p-4 relative overflow-hidden">
      {/* Playful background elements */}
      <PlayfulFloatingElements className="opacity-60" />

      {/* Mascot Duck Peeking */}
      <div className="absolute -bottom-6 -right-6 z-20 pointer-events-none">
        <MascotDuck className="scale-75 md:scale-100 opacity-80 scale-x-[-1]" delay={0.6} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md z-10"
      >
        <Card className="backdrop-blur-md bg-white/90 border-white/50 shadow-2xl overflow-hidden rounded-3xl">
          <CardHeader className="text-center pb-6 bg-teal-50/50">
            <CardTitle className="text-4xl font-extrabold text-teal-600 mb-2 tracking-tight">
              Join Lumio
            </CardTitle>
            <p className="text-teal-500 font-medium">Create your hero profile! 🌟</p>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            {error && (
              <Alert className="border-red-500/50 bg-red-50 text-red-600 rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-600 text-sm font-semibold ml-1">Hero Name</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose your hero name"
                  className="bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400 h-11 rounded-xl"
                  required
                  disabled={loading}
                />
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 ml-1">
                  {usernameRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold">
                      {req.test(username) ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-gray-300" />
                      )}
                      <span className={req.test(username) ? 'text-green-600' : 'text-gray-400'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin" className="text-gray-600 text-sm font-semibold ml-1">Secret PIN</Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Set a secret PIN"
                    className="bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400 h-11 rounded-xl pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    aria-label={showPin ? "Hide PIN" : "Show PIN"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500"
                  >
                    {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPin" className="text-gray-600 text-sm font-semibold ml-1">Repeat PIN</Label>
                <div className="relative">
                  <Input
                    id="confirmPin"
                    type={showConfirmPin ? 'text' : 'password'}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Repeat secret PIN"
                    className="bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400 h-11 rounded-xl pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    aria-label={showConfirmPin ? "Hide confirm PIN" : "Show confirm PIN"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500"
                  >
                    {showConfirmPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12 rounded-2xl text-lg font-bold transition-all shadow-lg hover:shadow-teal-500/40 disabled:opacity-50"
                  disabled={loading || !usernameRequirements.every(req => req.test(username)) || !pinRequirements.every(req => req.test(pin)) || pin !== confirmPin}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    'Start Adventure! ✨'
                  )}
                </Button>
              </motion.div>
            </form>
            
            <div className="text-center pt-2">
              <p className="text-gray-400 text-sm">
                Already a member?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-teal-500 hover:text-teal-600 font-bold underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
