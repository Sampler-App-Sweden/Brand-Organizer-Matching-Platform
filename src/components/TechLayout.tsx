import React from 'react';
import { Link } from 'react-router-dom';
import { HandshakeIcon } from 'lucide-react';
import { TechBackground, TechDataStream } from './TechEffects';
interface TechLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}
export function TechLayout({
  children,
  showHeader = true,
  showFooter = true
}: TechLayoutProps) {
  return <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Tech background effects */}
      <TechBackground />
      <TechDataStream className="opacity-30" />
      {showHeader && <header className="bg-white bg-opacity-90 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-blue-600 p-2 rounded-md relative overflow-hidden tech-pulse">
                  <HandshakeIcon className="h-6 w-6 text-white relative z-10" />
                </div>
                <span className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  SponsrAI
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/brands" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
                  For Brands
                </Link>
                <Link to="/organizers" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
                  For Organizers
                </Link>
                <Link to="/community" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
                  Community
                </Link>
                <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors relative overflow-hidden group">
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Link>
              </nav>
              <button className="md:hidden text-gray-600 relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>}
      <main className="flex-grow relative z-10">{children}</main>
      {showFooter && <footer className="bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-100 py-8 relative z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-blue-600 p-1.5 rounded-md mr-2 relative overflow-hidden">
                  <HandshakeIcon className="h-4 w-4 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-70"></div>
                </div>
                <span className="text-gray-900 font-medium">SponsrAI</span>
              </div>
              <div className="flex space-x-6">
                <Link to="/about" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  About
                </Link>
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Privacy
                </Link>
                <Link to="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Terms
                </Link>
                <Link to="/contact" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </div>
              <div className="text-sm text-gray-400 mt-4 md:mt-0">
                © {new Date().getFullYear()} SponsrAI
              </div>
            </div>
          </div>
        </footer>}
    </div>;
}