import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, Home, BookOpen, LayoutDashboard, TrendingUp, Settings, LogOut, User, Moon, Sun } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/subjects', label: 'Subjects', icon: BookOpen },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/progress', label: 'Progress', icon: TrendingUp },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation - Floating Glassmorphic */}
      <nav 
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          scrolled 
            ? 'backdrop-blur-xl bg-white/20 border-white/30 shadow-2xl' 
            : 'backdrop-blur-md bg-white/10 border-white/20 shadow-lg'
        }`}
        style={{
          borderRadius: '20px',
          maxWidth: '1200px',
          width: 'calc(100% - 2rem)',
        }}
      >
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span 
              className={`text-xl font-bold ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              Lumio
            </span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.href);
              
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold'
                      : scrolled
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-white/10'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-base font-medium">{link.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-200 ${
                scrolled
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user?.username} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/90 backdrop-blur-md border border-white/20" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gray-900">{user?.username}</p>
                      <p className="w-[200px] truncate text-sm text-gray-600">{user?.id}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="border-gray-200" />
                  <DropdownMenuItem onClick={() => handleNavigation('/dashboard')} className="text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('/settings')} className="text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-gray-200" />
                  <DropdownMenuItem onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost"
                  onClick={() => handleNavigation('/login')}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                    scrolled
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-white/10'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => handleNavigation('/signup')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Glassmorphic */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-4 top-4 h-[calc(100vh-2rem)] w-80 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Lumio</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = isActiveLink(link.href);
                      
                      return (
                        <button
                          key={link.href}
                          onClick={() => handleNavigation(link.href)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-500/20 text-blue-600 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-base font-medium">{link.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Theme</span>
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {theme === 'dark' ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Mobile User Section */}
                  {isAuthenticated ? (
                    <div className="space-y-4 p-6 border-t border-gray-200">
                      <div className="flex items-center gap-3 px-4 py-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" alt={user?.username} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user?.username}</p>
                          <p className="text-sm text-gray-500">Student</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <button
                          onClick={() => handleNavigation('/dashboard')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </button>
                        <button
                          onClick={() => handleNavigation('/settings')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 p-6 border-t border-gray-200">
                      <Button 
                        variant="outline"
                        onClick={() => handleNavigation('/login')}
                        className="w-full"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => handleNavigation('/signup')}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
