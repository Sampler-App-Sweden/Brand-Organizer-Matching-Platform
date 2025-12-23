import { Link } from 'react-router-dom'
import { SparklesIcon, ArrowRightIcon } from 'lucide-react'
interface TechHeroProps {
  title: string
  subtitle: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  videoSrc?: string
  videoPoster?: string
  videoSpeed?: number
}
export function TechHero({
  title,
  subtitle,
  ctaText = 'Get Started',
  ctaLink = '/register',
  secondaryCtaText,
  secondaryCtaLink,
  videoSrc,
  videoPoster,
  videoSpeed = 0.5
}: TechHeroProps) {
  return (
    <div className='bg-white relative overflow-hidden min-h-screen flex items-center justify-center'>
      {/* Background Video */}
      {videoSrc && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={videoPoster}
            className='absolute inset-0 w-full h-full object-cover'
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = videoSpeed
            }}
          >
            <source src={videoSrc} type='video/mp4' />
          </video>
          {/* Video overlay for better text readability */}
          <div className='absolute inset-0 backdrop-blur-md bg-black/10'></div>
        </>
      )}
      <div className='container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col justify-center min-h-screen'>
        <div className='max-w-3xl mx-auto text-center'>
          <div className='inline-block mb-3 bg-indigo-100 text-brand-secondary px-3 py-1 rounded-full text-sm font-medium animate-pulse'>
            AI-Powered Matching Technology
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-6 leading-tight relative drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]'>
            {title}
          </h1>
          <p className='text-xl text-gray-100 mb-8 relative drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]'>
            {subtitle}
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <Link
              to={ctaLink}
              className='bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors relative overflow-hidden group tech-pulse'
            >
              <span className='relative z-10 flex items-center'>
                <SparklesIcon className='h-5 w-5 mr-2' />
                {ctaText}
              </span>
              <span className='absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity'></span>
            </Link>
            {secondaryCtaText && secondaryCtaLink && (
              <Link
                to={secondaryCtaLink}
                className='border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-6 py-3 rounded-md font-medium flex items-center justify-center transition-all hover:shadow-md group'
              >
                <span>{secondaryCtaText}</span>
                <ArrowRightIcon className='h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform' />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
