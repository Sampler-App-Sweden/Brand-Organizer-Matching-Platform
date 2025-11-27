import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, HandshakeIcon, LogInIcon, UserIcon, UsersIcon, StarIcon, PackageIcon, CalendarIcon, SparklesIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CommunityDropdown } from './community/CommunityDropdown';
interface NavbarProps {
  transparent?: boolean;
}
export function Navbar({
  transparent = false
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const {
    currentUser
  } = useAuth();
  const navigate = useNavigate();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('community-dropdown');
      const trigger = document.getElementById('community-trigger');
      if (dropdown && trigger && !dropdown.contains(event.target as Node) && !trigger.contains(event.target as Node)) {
        setIsCommunityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Determine dashboard link based on user type
  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    switch (currentUser.type) {
      case 'brand':
        return '/dashboard/brand';
      case 'organizer':
        return '/dashboard/organizer';
      case 'admin':
        return '/admin';
      default:
        return '/login';
    }
  };
  return <nav className="bg-white bg-opacity-90 backdrop-blur-sm shadow-sm border-b border-gray-100 relative z-30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-2 rounded-md relative overflow-hidden tech-pulse">
              <HandshakeIcon className="h-6 w-6 text-white relative z-10" />
            </div>
            <span className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              SponsrAI
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/community" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
              <UsersIcon className="h-4 w-4 mr-1" />
              <span>Our Community</span>
            </Link>
            <Link to="/brands" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
              <PackageIcon className="h-4 w-4 mr-1" />
              <span>For Brands</span>
            </Link>
            <Link to="/organizers" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>For Organizers</span>
            </Link>
            {currentUser && <Link to="/dashboard/saved" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
                <StarIcon className="h-4 w-4 mr-1" />
                <span>Saved</span>
              </Link>}
            {currentUser && <Link to="/dashboard/inspiration" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
                <SparklesIcon className="h-4 w-4 mr-1" />
                <span>Inspiration</span>
              </Link>}
            <Link to={getDashboardLink()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center relative overflow-hidden group">
              <span className="relative z-10 flex items-center">
                {currentUser ? <>
                    <UserIcon className="h-4 w-4 mr-1" />
                    Dashboard
                  </> : <>
                    <LogInIcon className="h-4 w-4 mr-1" />
                    Login
                  </>}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-2 space-y-1">
            <Link to="/community" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
              <UsersIcon className="h-4 w-4 mr-2" />
              Our Community
            </Link>
            <Link to="/brands" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
              <PackageIcon className="h-4 w-4 mr-2" />
              For Brands
            </Link>
            <Link to="/organizers" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              For Organizers
            </Link>
            {currentUser && <Link to="/dashboard/saved" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                <StarIcon className="h-4 w-4 mr-2" />
                Saved Items
              </Link>}
            {currentUser && <Link to="/dashboard/inspiration" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                <SparklesIcon className="h-4 w-4 mr-2" />
                Inspiration
              </Link>}
            <Link to={getDashboardLink()} className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
              {currentUser ? <>
                  <UserIcon className="h-4 w-4 mr-2" />
                  Dashboard
                </> : <>
                  <LogInIcon className="h-4 w-4 mr-2" />
                  Login
                </>}
            </Link>
          </div>
        </div>}
    </nav>;
}