import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, ArrowRightIcon } from 'lucide-react';
import { TechCircuitLines } from './TechEffects';
interface TechHeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}
export function TechHero({
  title,
  subtitle,
  ctaText = 'Get Started',
  ctaLink = '/register',
  secondaryCtaText,
  secondaryCtaLink
}: TechHeroProps) {
  return <div className="bg-white relative overflow-hidden">
      {/* Tech background elements */}
      <div className="absolute inset-0 opacity-10">
        <TechCircuitLines />
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
            AI-Powered Matching Technology
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight relative">
            {title}
            <div className="absolute -left-6 -top-6 w-12 h-12 opacity-20 animate-spin-slow">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
              </svg>
            </div>
            <div className="absolute -right-6 -bottom-6 w-12 h-12 opacity-20 animate-spin-slow" style={{
            animationDirection: 'reverse'
          }}>
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
              </svg>
            </div>
          </h1>
          <p className="text-xl text-gray-600 mb-8 relative">
            {subtitle}
            <span className="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={ctaLink} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors relative overflow-hidden group tech-pulse">
              <span className="relative z-10 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                {ctaText}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            {secondaryCtaText && secondaryCtaLink && <Link to={secondaryCtaLink} className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-6 py-3 rounded-md font-medium flex items-center justify-center transition-all hover:shadow-md group">
                <span>{secondaryCtaText}</span>
                <ArrowRightIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>}
          </div>
        </div>
      </div>
      {/* Animated tech pattern */}
      <div className="h-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-20"></div>
        {/* Animated data points */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => <div key={i} className="absolute rounded-full bg-blue-400" style={{
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.5 + 0.25,
          animation: `pulse-data ${Math.random() * 3 + 2}s infinite alternate`
        }}></div>)}
        </div>
        {/* Horizontal data lines */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent top-4 animate-pulse"></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent top-8 animate-pulse" style={{
        animationDelay: '0.5s'
      }}></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent top-12 animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
      </div>
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse-data {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0.7;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>;
}