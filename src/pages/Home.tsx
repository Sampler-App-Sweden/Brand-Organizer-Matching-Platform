import React, { useState, Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TechLayout } from '../components/TechLayout';
import { TechHero } from '../components/TechHero';
import { TechFeatureSection } from '../components/TechFeatureSection';
import { TechCard } from '../components/TechCard';
import { PackageIcon, UsersIcon, SparklesIcon, TrendingUpIcon, MessageSquareIcon, SearchIcon, ArrowRightIcon, CalendarIcon, BarChartIcon, ZapIcon } from 'lucide-react';
export function Home() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Navigate to AI onboarding with the search query
      navigate(`/onboarding?q=${encodeURIComponent(searchInput)}`);
    }
  };
  const features = [{
    icon: <SparklesIcon className="h-6 w-6" />,
    title: 'AI-Powered Matching',
    description: 'Our intelligent algorithms connect brands with the perfect event organizers based on your specific goals and audience.'
  }, {
    icon: <TrendingUpIcon className="h-6 w-6" />,
    title: 'Increased Exposure',
    description: 'Gain valuable exposure to your target audience through carefully matched events and partnerships.'
  }, {
    icon: <MessageSquareIcon className="h-6 w-6" />,
    title: 'Streamlined Communication',
    description: 'Direct messaging and collaboration tools make it easy to connect and finalize partnerships.'
  }, {
    icon: <CalendarIcon className="h-6 w-6" />,
    title: 'Event Management',
    description: 'Organize and track all your sponsorship activities in one centralized dashboard.'
  }, {
    icon: <BarChartIcon className="h-6 w-6" />,
    title: 'Performance Analytics',
    description: 'Measure the impact of your sponsorships with detailed reporting and insights.'
  }, {
    icon: <ZapIcon className="h-6 w-6" />,
    title: 'Quick Setup',
    description: 'Get started in minutes with our intuitive onboarding process and AI assistant.'
  }];
  return <TechLayout>
      <TechHero title="Connect Brands with Event Organizers Effortlessly" subtitle="SponsrAI is the perfect platform for brands to find sampling opportunities and for event organizers to secure valuable sponsorships." ctaText="Get Started with AI" ctaLink="/onboarding" secondaryCtaText="Explore Community" secondaryCtaLink="/community" />
      {/* Search Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Tell us what you're looking to achieve
            </h2>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex flex-col sm:flex-row">
                <div className="relative flex-grow mb-3 sm:mb-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SparklesIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <input type="text" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500" placeholder="I want to launch my new drink at events..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg sm:rounded-l-none font-medium transition-colors flex items-center justify-center">
                  <SearchIcon className="h-5 w-5 mr-1" />
                  Search
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Try: "I need sponsors for my tech conference" or "Looking for
                food festivals to showcase our products"
              </p>
            </form>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <TechFeatureSection title="Platform Benefits" subtitle="Discover how SponsrAI makes brand-organizer connections seamless and effective" features={features} />
      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <TechCard title="For Brands" icon={<PackageIcon className="h-6 w-6" />} description="Connect with the right events to showcase your products and reach your target audience." footer={<div>
                  <ol className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                        1
                      </span>
                      <span className="text-gray-700">
                        List your products and sponsorship offerings
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                        2
                      </span>
                      <span className="text-gray-700">
                        Specify your target audience and goals
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                        3
                      </span>
                      <span className="text-gray-700">
                        Get matched with relevant events
                      </span>
                    </li>
                  </ol>
                  <Link to="/onboarding" className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                    Get Started
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>} />
            <TechCard title="For Organizers" icon={<UsersIcon className="h-6 w-6" />} description="Find the perfect brand sponsors for your events and provide value to your attendees." footer={<div>
                  <ol className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                        1
                      </span>
                      <span className="text-gray-700">
                        Share details about your event and audience
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                        2
                      </span>
                      <span className="text-gray-700">
                        Describe sponsorship opportunities
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                        3
                      </span>
                      <span className="text-gray-700">
                        Connect with relevant brands
                      </span>
                    </li>
                  </ol>
                  <Link to="/onboarding" className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                    Get Started
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>} />
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your sponsorship strategy?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join SponsrAI today and start connecting with the perfect partners
            for your brand or event.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors">
              Create Account
            </Link>
            <Link to="/login" className="bg-blue-700 text-white hover:bg-blue-800 px-6 py-3 rounded-md font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </TechLayout>;
}