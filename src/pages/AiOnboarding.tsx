import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import {
  SendIcon,
  RefreshCwIcon,
  SparklesIcon,
  BuildingIcon,
  CalendarIcon,
  ArrowRightIcon,
  LightbulbIcon,
  TargetIcon,
  TrendingUpIcon,
} from 'lucide-react'
export function AiOnboarding() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userInput, setUserInput] = useState('')
  const [conversation, setConversation] = useState<
    {
      role: 'user' | 'assistant'
      content: string
      timestamp: Date
    }[]
  >([
    {
      role: 'assistant',
      content:
        "Welcome to SponsrAI! I'm here to help you understand what's possible on our platform. Tell me whether you're a brand looking to sponsor events or an event organizer seeking sponsors, and I'll show you how to succeed.",
      timestamp: new Date(),
    },
  ])
  const [suggestions, setSuggestions] = useState<string[]>([
    'What makes a brand attractive to event organizers?',
    'How can I make my event appealing to sponsors?',
    'What are successful sponsorship strategies?',
    'What metrics should I track for sponsorship success?',
    'How do I set realistic sponsorship goals?',
  ])
  const [detectedRole, setDetectedRole] = useState<
    'brand' | 'organizer' | null
  >(null)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // Parse query parameters on load
  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const q = query.get('q')
    if (q) {
      handleSubmit(null, q)
    }
  }, [])
  // Scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [conversation])
  // Update suggestions based on detected role
  useEffect(() => {
    if (detectedRole === 'brand') {
      setSuggestions([
        'What makes my product attractive to event organizers?',
        'How to measure ROI on event sponsorships?',
        'What types of events match my target audience?',
        'How to negotiate better sponsorship deals?',
        'What sponsorship activations are most effective?',
      ])
    } else if (detectedRole === 'organizer') {
      setSuggestions([
        'How to create attractive sponsorship packages?',
        'What do brands look for in event partnerships?',
        'How to price my sponsorship opportunities?',
        'What metrics should I share with potential sponsors?',
        'How to build long-term relationships with sponsors?',
      ])
    }
  }, [detectedRole])
  const handleSubmit = async (
    e: React.FormEvent | null,
    initialInput?: string,
  ) => {
    if (e) e.preventDefault()
    const input = initialInput || userInput
    if (!input.trim()) return
    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    }
    setConversation((prev) => [...prev, userMessage])
    setUserInput('')
    setLoading(true)
    try {
      // Detect role if not already set
      if (!detectedRole) {
        const role = detectRoleFromInput(input)
        if (role) {
          setDetectedRole(role)
        }
      }
      // Generate AI response
      const response = generateResponse(input, detectedRole)
      setTimeout(() => {
        setConversation((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response,
            timestamp: new Date(),
          },
        ])
        setLoading(false)
      }, 1000) // Simulate API delay
    } catch (error) {
      console.error('Error processing input:', error)
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm sorry, I had trouble processing that. Could you try rephrasing or providing more details?",
          timestamp: new Date(),
        },
      ])
      setLoading(false)
    }
  }
  const handleRoleSelection = (role: 'brand' | 'organizer') => {
    setDetectedRole(role)
    // Add assistant message acknowledging the role
    const roleMessages = {
      brand:
        "Great! As a brand, you're looking to connect with events that can showcase your products or services. I'll help you understand what makes for successful sponsorships and how to set effective goals.",
      organizer:
        "Perfect! As an event organizer, you're looking to attract sponsors that align with your audience and event values. I'll help you understand what brands are looking for and how to create attractive opportunities.",
    }
    setConversation((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: roleMessages[role],
        timestamp: new Date(),
      },
    ])
  }
  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion)
  }
  const detectRoleFromInput = (input: string): 'brand' | 'organizer' | null => {
    const lowerInput = input.toLowerCase()
    // Brand signals
    const brandKeywords = [
      'brand',
      'sponsor',
      'product',
      'company',
      'sampling',
      'promote',
      'marketing',
      'sell',
      'advertise',
      'showcase',
      'launch',
    ]
    // Organizer signals
    const organizerKeywords = [
      'event',
      'organize',
      'festival',
      'conference',
      'expo',
      'exhibition',
      'hosting',
      'venue',
      'attendees',
      'planning',
      'running',
    ]
    let brandScore = 0
    let organizerScore = 0
    brandKeywords.forEach((keyword) => {
      if (lowerInput.includes(keyword)) brandScore += 1
    })
    organizerKeywords.forEach((keyword) => {
      if (lowerInput.includes(keyword)) organizerScore += 1
    })
    if (brandScore > organizerScore && brandScore > 0) {
      return 'brand'
    } else if (organizerScore > brandScore && organizerScore > 0) {
      return 'organizer'
    }
    return null
  }
  const generateResponse = (
    input: string,
    role: 'brand' | 'organizer' | null,
  ): string => {
    const lowerInput = input.toLowerCase()
    // Generic responses if role is not detected
    if (!role) {
      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        return "Hello! To help you better, could you tell me if you're representing a brand looking to sponsor events, or an event organizer seeking sponsors?"
      }
      if (lowerInput.includes('what') && lowerInput.includes('do')) {
        return "SponsrAI helps connect brands with event organizers for mutually beneficial partnerships. Brands can find events to showcase their products, and organizers can secure valuable sponsorships. To give you more specific guidance, could you tell me if you're a brand or an event organizer?"
      }
      return "To provide the most relevant advice, I'd like to know if you're representing a brand looking to sponsor events, or if you're an event organizer seeking sponsors. This will help me tailor my recommendations to your specific needs."
    }
    // Brand-specific responses
    if (role === 'brand') {
      if (lowerInput.includes('attractive') || lowerInput.includes('appeal')) {
        return "Brands that appeal to event organizers typically offer more than just financial support. The most attractive sponsors provide: 1) Products or services that genuinely interest the event's audience, 2) Engaging activation ideas that enhance the attendee experience, 3) Marketing support to promote the event to their own audience, and 4) A collaborative approach to partnership. Consider how your brand can add value beyond just funding."
      }
      if (
        lowerInput.includes('roi') ||
        lowerInput.includes('measure') ||
        lowerInput.includes('metrics')
      ) {
        return 'To measure sponsorship ROI effectively: 1) Set clear objectives before the event (brand awareness, leads, sales), 2) Track appropriate metrics (impressions, engagement, lead quality, conversion rate), 3) Use unique promo codes or landing pages to attribute sales, 4) Collect both quantitative data and qualitative feedback, 5) Calculate your cost per acquisition or impression, and 6) Compare results against other marketing channels. What specific goals are you hoping to achieve through event sponsorships?'
      }
      if (lowerInput.includes('negotiate') || lowerInput.includes('deal')) {
        return "When negotiating sponsorship deals: 1) Research the event thoroughly (past sponsors, audience demographics, pricing), 2) Clearly define your objectives and what you're willing to pay for them, 3) Ask for metrics from previous events, 4) Request a customized package rather than standard tiers, 5) Negotiate for added value (data sharing, extended promotion periods), and 6) Consider multi-event or multi-year deals for better rates. What type of events are you most interested in sponsoring?"
      }
      if (
        lowerInput.includes('activation') ||
        lowerInput.includes('idea') ||
        lowerInput.includes('creative')
      ) {
        return 'Effective sponsorship activations include: 1) Interactive product demonstrations, 2) Exclusive VIP experiences for attendees, 3) Useful giveaways that provide value beyond the event, 4) Photo opportunities or social media moments, 5) Gamified experiences with prizes, 6) Co-created content with event speakers or performers, and 7) Solving a pain point for attendees (charging stations, comfortable seating areas, etc.). The most successful activations align with both your brand values and the event experience.'
      }
      return 'As a brand looking to sponsor events, focus on finding opportunities that align with your target audience and marketing objectives. The most successful sponsorships create authentic connections rather than just logo placement. What specific aspects of event sponsorship are you interested in learning more about?'
    }
    // Organizer-specific responses
    if (role === 'organizer') {
      if (lowerInput.includes('package') || lowerInput.includes('attractive')) {
        return 'Creating attractive sponsorship packages requires: 1) Tiered options at different price points, 2) Clear articulation of audience demographics and engagement levels, 3) Tangible benefits beyond logo placement (speaking opportunities, data sharing, direct audience engagement), 4) Exclusivity options where appropriate, 5) Flexibility for customization, and 6) Testimonials from previous sponsors. The most compelling packages solve specific marketing challenges for brands.'
      }
      if (
        lowerInput.includes('price') ||
        lowerInput.includes('cost') ||
        lowerInput.includes('charge')
      ) {
        return "When pricing sponsorship opportunities: 1) Research comparable events in your industry, 2) Calculate your cost per attendee, 3) Consider the purchasing power and decision authority of your audience, 4) Quantify the value of each benefit you're offering, 5) Create different tiers with clear value differentiation, and 6) Leave room for negotiation and customization. Remember that unique access to your specific audience is often your most valuable asset."
      }
      if (
        lowerInput.includes('metrics') ||
        lowerInput.includes('data') ||
        lowerInput.includes('share')
      ) {
        return 'Key metrics to share with potential sponsors include: 1) Detailed audience demographics (age, income, job titles, purchasing authority), 2) Attendance numbers with year-over-year growth, 3) Engagement statistics from previous events, 4) Results achieved by past sponsors, 5) Social media reach and engagement rates, 6) Email open rates and audience size, and 7) Post-event survey results highlighting attendee satisfaction. The more specific data you can provide, the easier it is for brands to justify their investment.'
      }
      if (
        lowerInput.includes('relationship') ||
        lowerInput.includes('long-term') ||
        lowerInput.includes('retain')
      ) {
        return "Building long-term sponsor relationships requires: 1) Setting clear expectations and over-delivering, 2) Providing comprehensive post-event reports with actionable insights, 3) Seeking feedback and implementing improvements, 4) Maintaining communication between events, 5) Creating multi-year packages with increasing value, 6) Offering first right of refusal for key opportunities, and 7) Connecting sponsors with each other when beneficial. The most successful event organizers become true partners in achieving their sponsors' business objectives."
      }
      return 'As an event organizer, your success in attracting sponsors depends on clearly communicating your audience value and creating opportunities that help brands achieve their marketing objectives. Focus on understanding what makes your event unique and how you can create meaningful connections between sponsors and attendees. What specific aspects of sponsorship attraction are you interested in learning more about?'
    }
    // Fallback response
    return "That's an interesting question. To provide more specific guidance, could you share more details about what you're hoping to achieve on our platform?"
  }
  return (
    <Layout>
      <div className="min-h-screen w-full bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              <span className="text-indigo-600">AI</span> Inspiration Engine
            </h1>
            <p className="text-xl text-gray-600">
              Discover what's possible and set effective partnership goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main conversation area */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-indigo-600 mr-2" />
                  <h3 className="font-medium text-gray-800">
                    SponsrAI Advisor
                  </h3>
                </div>
                {detectedRole && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      Perspective:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        detectedRole === 'brand'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {detectedRole === 'brand' ? 'Brand' : 'Event Organizer'}
                    </span>
                  </div>
                )}
              </div>
              {/* Conversation messages */}
              <div className="p-4 h-96 overflow-y-auto bg-gray-50">
                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === 'user'
                        ? 'flex justify-end'
                        : 'flex justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-3/4 rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.role === 'user'
                            ? 'text-indigo-200'
                            : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                {!detectedRole && !loading && conversation.length < 3 && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">
                        I can provide more tailored insights if you tell me your
                        role:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleRoleSelection('brand')}
                          className="flex items-center px-3 py-1.5 rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          <BuildingIcon className="h-4 w-4 mr-1" />
                          I'm a Brand / Sponsor
                        </button>
                        <button
                          onClick={() => handleRoleSelection('organizer')}
                          className="flex items-center px-3 py-1.5 rounded-md bg-green-100 text-green-800 hover:bg-green-200"
                        >
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          I'm an Event Organizer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Input area */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about sponsorship strategies, goals, or best practices..."
                    className="flex-1 rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCwIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <SendIcon className="h-4 w-4" />
                    )}
                  </button>
                </form>
                {/* Suggestions */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Try asking about:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-xs text-gray-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Value proposition sidebar */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-800">Platform Benefits</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <TargetIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">
                        Targeted Connections
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Our matching algorithm connects brands with events that
                        align with their target audience and marketing goals.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <LightbulbIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">
                        Strategic Insights
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Get data-driven recommendations to optimize your
                        sponsorship strategy and maximize ROI.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <TrendingUpIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">
                        Growth Opportunities
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Discover new markets, audiences, and partnership models
                        to scale your business.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center"
                    onClick={() => navigate('/register')}
                  >
                    Create Your Account
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                  {detectedRole === 'brand' ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/organizers')}
                    >
                      Browse Event Organizers
                    </Button>
                  ) : detectedRole === 'organizer' ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/brands')}
                    >
                      Browse Potential Sponsors
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/community')}
                    >
                      Explore Our Community
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        .typing-indicator span {
          height: 8px;
          width: 8px;
          margin: 0 2px;
          background-color: #a0aec0;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes typing {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </Layout>
  )
}
function LightbulbIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}
function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
