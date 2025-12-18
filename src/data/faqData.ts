export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  keywords: string[]
  relatedQuestions?: string[]
}

export interface FAQCategory {
  id: string
  name: string
  icon: string
  description: string
}

export const faqCategories: FAQCategory[] = [
  {
    id: 'contracts',
    name: 'Contracts & Agreements',
    icon: 'FileText',
    description: 'Questions about sponsorship contracts and agreements'
  },
  {
    id: 'matching',
    name: 'Matching',
    icon: 'Users',
    description: 'How matching works on the platform'
  },
  {
    id: 'profile',
    name: 'Profile & Account',
    icon: 'User',
    description: 'Manage your profile and settings'
  },
  {
    id: 'payment',
    name: 'Payment & Pricing',
    icon: 'CreditCard',
    description: 'Payment terms and pricing models'
  },
  {
    id: 'events',
    name: 'Events & Sampling',
    icon: 'Calendar',
    description: 'Event arrangements and product sampling'
  },
  {
    id: 'technical',
    name: 'Technical Support',
    icon: 'Settings',
    description: 'Technical questions and troubleshooting'
  }
]

export const faqData: FAQItem[] = [
  // Contracts & Agreements
  {
    id: 'contract-create',
    question: 'How do I create a sponsorship agreement?',
    answer:
      'To create an agreement, first accept a match from your dashboard. Then click "Create Sponsorship Agreement" in the match card. Fill in the agreement details including budget, deliverables, and terms. Both parties must approve the agreement for it to be activated.',
    category: 'contracts',
    keywords: ['agreement', 'contract', 'create', 'sponsorship', 'approve'],
    relatedQuestions: ['contract-approve', 'contract-edit']
  },
  {
    id: 'contract-approve',
    question: 'What happens after both parties approve the agreement?',
    answer:
      'When both parties have signed the agreement, it is automatically activated. You will both receive a confirmation email and can then begin collaborating. The agreement becomes available in your "Active Agreements" section where you can track deliverables and deadlines.',
    category: 'contracts',
    keywords: ['approve', 'sign', 'activate', 'agreement', 'confirmation'],
    relatedQuestions: ['contract-create', 'contract-cancel']
  },
  {
    id: 'contract-edit',
    question: 'Can I modify an agreement after it has been created?',
    answer:
      'Yes, before the agreement is approved by both parties, you can edit it freely. After both parties have signed, mutual consent is required to make changes. Contact your matched partner via messages to discuss modifications.',
    category: 'contracts',
    keywords: ['modify', 'edit', 'agreement', 'update', 'change'],
    relatedQuestions: ['contract-create', 'contract-cancel']
  },
  {
    id: 'contract-cancel',
    question: 'How do I terminate an agreement?',
    answer:
      'To terminate an agreement, go to "Active Agreements" and select the agreement you want to end. Click "Terminate Agreement" and provide a reason. The other party will receive a notification. Please carefully review the termination terms in your specific agreement.',
    category: 'contracts',
    keywords: ['terminate', 'end', 'agreement', 'cancellation', 'cancel'],
    relatedQuestions: ['contract-approve', 'contract-edit']
  },

  // Matching
  {
    id: 'matching-algorithm',
    question: 'How does the matching algorithm work?',
    answer:
      'Our AI algorithm analyzes over 50 data points to find the best matches. We compare target audiences, industry, geographic location, budget, event size, values, and historical data. The more complete your profile, the better the matches.',
    category: 'matching',
    keywords: ['match', 'matching', 'algorithm', 'AI', 'how works'],
    relatedQuestions: ['matching-improve', 'matching-accept']
  },
  {
    id: 'matching-improve',
    question: 'How can I get better matches?',
    answer:
      'To improve your matches: 1) Complete your profile as thoroughly as possible, 2) Add detailed target audience information, 3) Specify your sponsorship preferences and budget, 4) Regularly update with new events or products, 5) Be active and respond quickly to matches.',
    category: 'matching',
    keywords: ['improve', 'better', 'matching', 'optimize', 'tips'],
    relatedQuestions: ['matching-algorithm', 'profile-complete']
  },
  {
    id: 'matching-accept',
    question: 'What happens when I accept a match?',
    answer:
      'When you accept a match, the other party receives a notification. If they also accept, you become "mutually matched" and can start chatting directly. You can then create a sponsorship agreement or continue discussing collaboration opportunities.',
    category: 'matching',
    keywords: ['accept', 'match', 'approve', 'mutual'],
    relatedQuestions: ['matching-algorithm', 'contract-create']
  },
  {
    id: 'matching-decline',
    question: 'Can I see declined matches again?',
    answer:
      'Yes, declined matches are saved in a "Declined" tab under Matches. You can undo a decline at any time and send a match request again. The algorithm also learns from your declines to improve future suggestions.',
    category: 'matching',
    keywords: ['decline', 'reject', 'undo', 'matching', 'again'],
    relatedQuestions: ['matching-accept', 'matching-improve']
  },

  // Profile & Account
  {
    id: 'profile-complete',
    question: 'What information should I include in my profile?',
    answer:
      'For best matches, include: basic company information, detailed target audience description, previous collaborations, budget and preferences, images and media kit, contact persons, and your values. Brands should also add product information and sampling opportunities.',
    category: 'profile',
    keywords: ['profile', 'fill', 'information', 'complete', 'what'],
    relatedQuestions: ['matching-improve', 'profile-visibility']
  },
  {
    id: 'profile-visibility',
    question: 'Who can see my profile?',
    answer:
      'Your basic profile (name, industry, type of events/products) is visible to all users. Detailed information such as contact details, budget, and sensitive documents are only shown to mutually matched partners. You can adjust visibility settings under "Privacy".',
    category: 'profile',
    keywords: ['visibility', 'profile', 'private', 'who', 'see'],
    relatedQuestions: ['profile-complete', 'account-delete']
  },
  {
    id: 'profile-edit',
    question: 'How often should I update my profile?',
    answer:
      'Update your profile whenever there are changes in your company, new events, product launches, or budget changes. Active profiles with regular updates receive higher priority in the matching algorithm. We recommend at least a quarterly review.',
    category: 'profile',
    keywords: ['update', 'profile', 'change', 'often', 'edit'],
    relatedQuestions: ['profile-complete', 'matching-improve']
  },
  {
    id: 'account-delete',
    question: 'How do I delete my account?',
    answer:
      'Go to Settings > Account > Delete Account. NOTE: This will permanently delete all your data including matches, agreements, and messages. Active agreements must be terminated first. You will receive a confirmation email before deletion is completed.',
    category: 'profile',
    keywords: ['delete', 'remove', 'account', 'terminate', 'close'],
    relatedQuestions: ['profile-visibility', 'contract-cancel']
  },

  // Payment & Pricing
  {
    id: 'payment-terms',
    question: 'How does payment work between brands and organizers?',
    answer:
      'Payment terms are determined directly between the brand and organizer and documented in the sponsorship agreement. Parties choose their own payment method (invoice, direct payment, etc.) and schedule. SponsrAI currently does not handle payments directly, only matching and agreement documentation.',
    category: 'payment',
    keywords: ['pay', 'payment', 'terms', 'how', 'invoice'],
    relatedQuestions: ['payment-platform', 'contract-create']
  },
  {
    id: 'payment-platform',
    question: 'Does it cost to use the platform?',
    answer:
      'Currently, SponsrAI is completely free to use for both brands and organizers. You pay no registration fee, no annual fee, and no commission on matches. We may introduce premium features in the future, but basic matching will remain free.',
    category: 'payment',
    keywords: ['price', 'cost', 'free', 'fee', 'charge'],
    relatedQuestions: ['payment-terms', 'payment-invoice']
  },
  {
    id: 'payment-invoice',
    question: 'Can I get an invoice for the sponsorship?',
    answer:
      'Yes, you arrange invoicing directly with your matched partner. Include invoicing details (organization number, address, reference number) in the sponsorship agreement. Many users also use external invoicing systems like Fortnox or Bokio.',
    category: 'payment',
    keywords: ['invoice', 'receipt', 'payment', 'billing'],
    relatedQuestions: ['payment-terms', 'contract-create']
  },

  // Events & Sampling
  {
    id: 'event-sampling',
    question: 'How does product sampling at events work?',
    answer:
      'Brands can specify sampling opportunities in their profile: product type, number of samples, target audience, and event requirements. Organizers see this in matches and can plan sampling activities. Details such as logistics, booth/space, and staff are documented in the agreement.',
    category: 'events',
    keywords: ['sampling', 'test', 'panel', 'product', 'sample'],
    relatedQuestions: ['event-requirements', 'profile-complete']
  },
  {
    id: 'event-requirements',
    question: 'What requirements can I specify for an event?',
    answer:
      'As a brand, you can specify: target audience demographics, event size (number of participants), geographic location, type of event, exposure opportunities (logos, booths, mentions), and exclusivity terms (e.g., no competing brands). Discuss specific requirements early with the organizer.',
    category: 'events',
    keywords: ['event', 'requirements', 'terms', 'specific', 'preferences'],
    relatedQuestions: ['event-sampling', 'contract-create']
  },
  {
    id: 'event-promotion',
    question: 'How will my brand be visible at the event?',
    answer:
      'Exposure varies depending on sponsorship level and is documented in the agreement. Common forms: logo on marketing materials, mentions on social media, physical booth/table, product sampling, speaking time, or naming of event sections. Discuss preferences with the organizer.',
    category: 'events',
    keywords: ['exposure', 'visibility', 'marketing', 'logo', 'event'],
    relatedQuestions: ['event-requirements', 'contract-create']
  },

  // Technical Support
  {
    id: 'tech-login',
    question: "I can't log in, what should I do?",
    answer:
      'Try the following: 1) Check that you are using the correct email address, 2) Click "Forgot password" to reset, 3) Clear your browser cache and cookies, 4) Try a different browser, 5) Check that you have verified your email. Contact support if the problem persists.',
    category: 'technical',
    keywords: ['log in', 'login', 'problem', 'password', 'sign in'],
    relatedQuestions: ['tech-password', 'tech-email']
  },
  {
    id: 'tech-password',
    question: 'How do I reset my password?',
    answer:
      'Click "Forgot password" on the login page. Enter your registered email address and we will send a reset link. The link is valid for 24 hours. If you don\'t receive the email, check your spam folder or contact support.',
    category: 'technical',
    keywords: ['password', 'reset', 'forgot', 'recover', 'change'],
    relatedQuestions: ['tech-login', 'tech-email']
  },
  {
    id: 'tech-email',
    question: "I'm not receiving email notifications, why?",
    answer:
      'Check: 1) Notification settings under Settings > Notifications, 2) Your spam folder, 3) That your email address is correctly verified, 4) That info@sponsrai.se is not blocked in your email client. You can also update your email address under Settings.',
    category: 'technical',
    keywords: ['email', 'notification', 'not receiving', 'mail', 'missing'],
    relatedQuestions: ['tech-login', 'profile-edit']
  },
  {
    id: 'tech-upload',
    question: "Why can't I upload images/files?",
    answer:
      'Check that: 1) The file is under 10MB, 2) The file format is allowed (JPG, PNG, PDF for most documents), 3) Your internet connection is stable, 4) You have enough storage space left on your account. Try compressing large images before uploading.',
    category: 'technical',
    keywords: ['upload', 'image', 'file', 'not working', 'cannot'],
    relatedQuestions: ['profile-edit', 'profile-complete']
  },
  {
    id: 'tech-mobile',
    question: 'Is there a mobile app?',
    answer:
      'Currently, SponsrAI is a responsive web application that works excellently on mobile devices. We plan to launch dedicated iOS and Android apps in 2026. You can add the website as a shortcut on your home screen for an app-like experience.',
    category: 'technical',
    keywords: ['mobile app', 'app', 'mobile', 'ios', 'android'],
    relatedQuestions: ['tech-browser', 'tech-notifications']
  },
  {
    id: 'tech-browser',
    question: 'Which browsers are supported?',
    answer:
      'SponsrAI works best in the latest versions of Chrome, Firefox, Safari, and Edge. We recommend always using the latest version of your browser for best security and performance. Internet Explorer is not supported.',
    category: 'technical',
    keywords: ['browser', 'chrome', 'safari', 'compatible', 'support'],
    relatedQuestions: ['tech-mobile', 'tech-login']
  },
  {
    id: 'tech-notifications',
    question: 'How do I enable push notifications?',
    answer:
      'To enable push notifications in your browser: 1) Go to Settings > Notifications, 2) Click "Enable push notifications", 3) Approve when the browser asks for permission. You can choose which types of notifications you want to receive (matches, messages, agreement updates, etc.).',
    category: 'technical',
    keywords: ['notifications', 'push', 'enable', 'alerts', 'warnings'],
    relatedQuestions: ['tech-email', 'tech-browser']
  }
]

/**
 * Search FAQ items based on query
 */
export const searchFAQ = (query: string): FAQItem[] => {
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) return faqData

  return faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(lowerQuery) ||
      item.answer.toLowerCase().includes(lowerQuery) ||
      item.keywords.some((keyword) =>
        keyword.toLowerCase().includes(lowerQuery)
      )
  )
}

/**
 * Get FAQ items by category
 */
export const getFAQByCategory = (categoryId: string): FAQItem[] => {
  return faqData.filter((item) => item.category === categoryId)
}

/**
 * Get FAQ item by ID
 */
export const getFAQById = (id: string): FAQItem | undefined => {
  return faqData.find((item) => item.id === id)
}

/**
 * Find best matching FAQ based on user message
 */
export const findBestMatchingFAQ = (message: string): FAQItem | null => {
  const lowerMessage = message.toLowerCase()

  // Try exact keyword matches first
  const exactMatch = faqData.find((item) =>
    item.keywords.some((keyword) =>
      lowerMessage.includes(keyword.toLowerCase())
    )
  )

  if (exactMatch) return exactMatch

  // Try partial matches in questions
  const questionMatch = faqData.find((item) =>
    item.question
      .toLowerCase()
      .split(' ')
      .some((word) => word.length > 3 && lowerMessage.includes(word))
  )

  return questionMatch || null
}
