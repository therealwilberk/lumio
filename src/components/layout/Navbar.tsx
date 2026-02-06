import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, Home, BookOpen, LayoutDashboard, TrendingUp, Settings, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

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
      {/* Desktop Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span 
              className={`text-xl font-bold transition-colors ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              Lumio
            </span>
          </motion.div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.href);
              
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : scrolled
                      ? 'text-gray-600 hover:text-gray-900'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-base font-medium">{link.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user?.username} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.username}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.id}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
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
                  className={`${
                    scrolled 
                      ? 'text-gray-600 hover:text-gray-900' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => handleNavigation('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation - Slide-out Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Lumio</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
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
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-50 text-blue-600 font-semibold'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-base font-medium">{link.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile User Section */}
                  <div className="mt-8 pt-8 border-t">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 px-4 py-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="" alt={user?.username} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
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
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </button>
                          <button
                            onClick={() => handleNavigation('/settings')}
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </button>
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Log out</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button 
                          variant="outline"
                          onClick={() => handleNavigation('/login')}
                          className="w-full"
                        >
                          Sign In
                        </Button>
                        <Button 
                          onClick={() => handleNavigation('/signup')}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Get Started
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
