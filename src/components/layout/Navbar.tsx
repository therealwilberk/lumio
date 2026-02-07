import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, Home, BookOpen, LayoutDashboard, TrendingUp, Settings, LogOut, User, Moon, Sun } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Force re-render on route change - reset scroll state
  useEffect(() => {
    setScrolled(window.scrollY > 50);
  }, [location.pathname]);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/subjects', label: 'Subjects', icon: BookOpen },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  // Determine navbar background style based on route and scroll
  const getNavbarClasses = () => {
    // High-quality glassmorphism for all states
    if (!isHomePage || scrolled) {
      return {
        background: 'bg-white/70 dark:bg-midnight/60',
        border: 'border border-white/40 dark:border-white/10',
        shadow: 'shadow-glass',
        text: 'text-midnight dark:text-white',
        textHover: 'hover:text-blue-600 dark:hover:text-blue-400',
        linkBg: 'hover:bg-white/40 dark:hover:bg-white/10',
        activeLinkBg: 'bg-blue-100/60 dark:bg-blue-900/40',
        activeLinkText: 'text-blue-600 dark:text-blue-400',
      };
    }
    
    // On home page at top, use more transparent "super-glass"
    return {
      background: 'bg-white/40 dark:bg-midnight/30',
      border: 'border border-white/30 dark:border-white/10',
      shadow: 'shadow-md',
      text: 'text-midnight dark:text-white',
      textHover: 'hover:text-blue-600 dark:hover:text-blue-400',
      linkBg: 'hover:bg-white/30 dark:hover:bg-white/10',
      activeLinkBg: 'bg-blue-500/20 dark:bg-blue-500/20',
      activeLinkText: 'text-blue-600 dark:text-blue-400',
    };
  };

  const style = getNavbarClasses();

  return (
    <>
      {/* Desktop Navigation - Floating Glassmorphic */}
      <nav 
        className={cn(
          // Positioning
          'fixed top-4 left-1/2 -translate-x-1/2',
          'w-[90%] max-w-6xl',
          'z-50',
          
          // Background & Blur - always visible
          style.background,
          'backdrop-blur-xl',
          
          // Border & Shadow
          style.border,
          style.shadow,
          'rounded-2xl',
          
          // Transitions
          'transition-all duration-300 ease-in-out'
        )}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className={cn('text-xl font-bold', style.text)}>
                Lumio
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.href);
              
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200',
                    isActive
                      ? cn(style.activeLinkBg, style.activeLinkText, 'font-semibold')
                      : cn(style.text, style.textHover, style.linkBg)
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-xl transition-all duration-200',
                !isHomePage || scrolled
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  : 'bg-white/30 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/20'
              )}
              aria-label="Toggle theme"
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
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user?.username} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Progress Badge */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                      <span className="text-[10px] text-white font-bold">25%</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" 
                  align="end" 
                  forceMount
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gray-900 dark:text-white">{user?.username}</p>
                      <p className="w-[200px] truncate text-sm text-gray-500 dark:text-gray-400">{user?.id}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('/dashboard')} 
                    className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('/settings')} 
                    className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="ghost"
                  onClick={() => handleNavigation('/login')}
                  className={cn(
                    'px-4 py-2 rounded-xl transition-all duration-200',
                    !isHomePage || scrolled
                      ? 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10'
                  )}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => handleNavigation('/signup')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            className={cn(
              'md:hidden',
              !isHomePage || scrolled
                ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-white/10'
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation - Glassmorphic */}
      <AnimatePresence mode="wait">
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
              className="fixed right-4 top-4 h-[calc(100vh-2rem)] w-80 bg-white/90 dark:bg-midnight/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Lumio</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                            isActive
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-base font-medium">{link.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
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
                    <div className="space-y-4 p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 px-4 py-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" alt={user?.username} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user?.username}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <button
                          onClick={() => handleNavigation('/dashboard')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </button>
                        <button
                          onClick={() => handleNavigation('/settings')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 p-4 border-t border-gray-200 dark:border-gray-700">
                      <Button 
                        variant="outline"
                        onClick={() => handleNavigation('/login')}
                        className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
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
