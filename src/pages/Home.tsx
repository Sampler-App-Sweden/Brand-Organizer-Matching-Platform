import {
  ArrowRightIcon,
  BarChartIcon,
  CalendarIcon,
  MessageSquareIcon,
  PackageIcon,
  SparklesIcon,
  TrendingUpIcon,
  UsersIcon,
  ZapIcon
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { TechCard, TechFeatureSection, TechHero } from '../components/landing'
import { TechLayout } from '../components/layout'

export function Home() {
  const features = [
    {
      icon: <SparklesIcon className='h-6 w-6' />,
      title: 'AI-Powered Matching',
      description:
        'Our intelligent algorithms connect brands with the perfect event organizers based on your specific goals and audience.'
    },
    {
      icon: <TrendingUpIcon className='h-6 w-6' />,
      title: 'Increased Exposure',
      description:
        'Gain valuable exposure to your target audience through carefully matched events and partnerships.'
    },
    {
      icon: <MessageSquareIcon className='h-6 w-6' />,
      title: 'Streamlined Communication',
      description:
        'Direct messaging and collaboration tools make it easy to connect and finalize partnerships.'
    },
    {
      icon: <CalendarIcon className='h-6 w-6' />,
      title: 'Event Management',
      description:
        'Organize and track all your sponsorship activities in one centralized dashboard.'
    },
    {
      icon: <BarChartIcon className='h-6 w-6' />,
      title: 'Performance Analytics',
      description:
        'Measure the impact of your sponsorships with detailed reporting and insights.'
    },
    {
      icon: <ZapIcon className='h-6 w-6' />,
      title: 'Quick Setup',
      description:
        'Get started in minutes with our intuitive onboarding process and AI assistant.'
    }
  ]
  return (
    <TechLayout>
      <TechHero
        title='Connect Brands with Event Organizers Effortlessly'
        subtitle='SponsrAI is the perfect platform for brands to find sampling opportunities and for event organizers to secure valuable sponsorships.'
        videoSrc='./hero-video.mp4'
        ctaText='Get Started'
        ctaLink='/register'
        secondaryCtaText='Explore Community'
        secondaryCtaLink='/explore'
      />

      {/* Search Section */}
      {/* <Search /> */}

      {/* Features Section */}
      <TechFeatureSection
        title='Platform Benefits'
        subtitle='Discover how SponsrAI makes brand-organizer connections seamless and effective'
        features={features}
      />

      {/* CTA Section with animated glassy blobs */}
      <div className='relative overflow-hidden py-16 bg-indigo-900'>
        {/* Animated glassy blobs */}
        <div className='absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-blue-300/20 rounded-full blur-3xl animate-float1 pointer-events-none' />
        <div className='absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tr from-indigo-500/30 via-blue-400/20 to-purple-300/20 rounded-full blur-3xl animate-float2 pointer-events-none' />
        <div className='container mx-auto px-4 text-center relative z-10'>
          <h2 className='text-3xl font-bold text-white mb-4'>
            Ready to transform your sponsorship strategy?
          </h2>
          <p className='text-blue-100 mb-8 max-w-2xl mx-auto'>
            Join SponsrAI today and start connecting with the perfect partners
            for your brand or event.
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <Link
              to='/register'
              className='bg-white text-indigo-700 px-6 py-3 rounded-md font-medium transition-all duration-300 shadow-[0_4px_24px_0_rgba(30,41,59,0.18)] hover:shadow-[0_8px_32px_0_rgba(30,41,59,0.32)] hover:-translate-y-1 border border-indigo-100 hover:bg-indigo-50 group relative overflow-hidden backdrop-blur-sm'
            >
              <span className='relative z-10'>Create Account</span>
              <span className='absolute inset-0 bg-gradient-to-br from-indigo-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></span>
            </Link>
            <Link
              to='/login'
              className='bg-brand-primary text-white px-6 py-3 rounded-md font-medium transition-all duration-300 shadow-[0_4px_24px_0_rgba(30,41,59,0.18)] hover:shadow-[0_8px_32px_0_rgba(30,41,59,0.32)] hover:-translate-y-1 border border-indigo-700/30 hover:bg-indigo-800 group relative overflow-hidden backdrop-blur-sm'
            >
              <span className='relative z-10'>Sign In</span>
              <span className='absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity'></span>
            </Link>
          </div>
        </div>
        <style>{`
          @keyframes float1 {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          @keyframes float2 {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(20px) scale(1.07); }
          }
          .animate-float1 { animation: float1 8s ease-in-out infinite; }
          .animate-float2 { animation: float2 10s ease-in-out infinite; }
        `}</style>
      </div>

      {/* How It Works - Modernized */}
      <section className='relative py-20 bg-gradient-to-br from-white via-indigo-50 to-blue-100 overflow-hidden'>
        <div className='absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-300/20 rounded-full blur-3xl animate-float1' />
        <div className='absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-400/30 to-purple-300/20 rounded-full blur-3xl animate-float2' />
        <div className='container mx-auto px-4 relative z-10'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 tracking-tight relative inline-block'>
              <span className='relative z-10'>How It Works</span>
              <span className='absolute -z-10 w-full h-2 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bottom-1 left-1/2 -translate-x-1/2 rounded-lg blur-sm opacity-80' />
            </h2>
          </div>
          <div className='grid md:grid-cols-2 gap-10 mb-12'>
            <TechCard
              title='For Brands'
              icon={<PackageIcon className='h-6 w-6' />}
              description='Connect with the right events to showcase your products and reach your target audience.'
              className='bg-white/70 backdrop-blur-md border border-indigo-100 shadow-xl hover:shadow-2xl'
              footer={
                <div>
                  <ol className='space-y-2 mb-4'>
                    <li className='flex items-start'>
                      <span className='bg-indigo-100 text-indigo-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5'>
                        1
                      </span>
                      <span className='text-gray-700'>
                        List your products and sponsorship offerings
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <span className='bg-indigo-100 text-indigo-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5'>
                        2
                      </span>
                      <span className='text-gray-700'>
                        Specify your target audience and goals
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <span className='bg-indigo-100 text-indigo-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5'>
                        3
                      </span>
                      <span className='text-gray-700'>
                        Get matched with relevant events
                      </span>
                    </li>
                  </ol>
                  <Link
                    to='/onboarding'
                    className='text-indigo-700 font-medium hover:text-indigo-900 flex items-center'
                  >
                    Get Started
                    <ArrowRightIcon className='h-4 w-4 ml-1' />
                  </Link>
                </div>
              }
            />
            <TechCard
              title='For Organizers'
              icon={<UsersIcon className='h-6 w-6' />}
              description='Find the perfect brand sponsors for your events and provide value to your attendees.'
              className='bg-white/70 backdrop-blur-md border border-indigo-100 shadow-xl hover:shadow-2xl'
              footer={
                <div>
                  <ol className='space-y-2 mb-4'>
                    <li className='flex items-start'>
                      <span className='bg-indigo-100 text-indigo-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5'>
                        1
                      </span>
                      <span className='text-gray-700'>
                        Share details about your event and audience
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <span className='bg-indigo-100 text-indigo-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5'>
                        2
                      </span>
                      <span className='text-gray-700'>
                        Describe sponsorship opportunities
                      </span>
                    </li>
                    <li className='flex items-start'>
                      <span className='bg-indigo-100 text-indigo-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5'>
                        3
                      </span>
                      <span className='text-gray-700'>
                        Connect with relevant brands
                      </span>
                    </li>
                  </ol>
                  <Link
                    to='/onboarding'
                    className='text-indigo-700 font-medium hover:text-indigo-900 flex items-center'
                  >
                    Get Started
                    <ArrowRightIcon className='h-4 w-4 ml-1' />
                  </Link>
                </div>
              }
            />
          </div>
        </div>
        <style>{`
          @keyframes float1 {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          @keyframes float2 {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(20px) scale(1.07); }
          }
          .animate-float1 { animation: float1 8s ease-in-out infinite; }
          .animate-float2 { animation: float2 10s ease-in-out infinite; }
        `}</style>
      </section>
    </TechLayout>
  )
}
