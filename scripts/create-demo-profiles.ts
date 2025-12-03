import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY when running this script.'
  )
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

type DemoAccountResult = {
  type: 'brand' | 'organizer'
  email: string
  userId: string
}

type ProductSeed = {
  name: string
  goals: string
  quantity: number
  unit: string
  details: string
  status: 'online' | 'offline'
  images: Array<{ url: string; alt: string }>
  order_index: number
}

type EventSeed = {
  name: string
  event_type: string
  elevator_pitch: string
  frequency: string
  start_date: string
  location: string
  attendee_count: string
  audience_description: string
  audience_demographics: string[]
  sponsorship_needs: string
  seeking_financial_sponsorship: boolean
  financial_sponsorship_amount: string
  financial_sponsorship_offers: string
  offering_types: string[]
  brand_visibility: string
  content_creation: string
  lead_generation: string
  product_feedback: string
  bonus_value: string[]
  bonus_value_details: string
  additional_info: string
  media_files: string[]
}

type BrandSeed = {
  email: string
  password: string
  type: 'brand'
  name: string
  extra: Record<string, string>
  brandData: {
    company_name: string
    contact_name: string
    contact_title: string
    email: string
    phone: string
    website: string
    industry: string
    product_name: string
    product_description: string
    product_quantity: string
    target_audience: string
    age_range: string
    sponsorship_type: string[]
    marketing_goals: string
    budget: string
    event_marketing_budget: string
    interested_in_financial_sponsorship: boolean
    financial_sponsorship_amount: string
    success_metrics: string
    interested_in_sampling_tools: boolean
    has_test_panels: boolean
    test_panel_details: string
    additional_info: string
  }
  products: ProductSeed[]
}

type OrganizerSeed = {
  email: string
  password: string
  type: 'organizer'
  name: string
  extra: Record<string, string>
  organizerData: {
    organizer_name: string
    contact_name: string
    email: string
    phone: string
    website: string
    address: string
    postal_code: string
    city: string
  }
  events: EventSeed[]
}

type MatchSeed = {
  brandEmail: string
  organizerEmail: string
  score: number
  match_reasons: string[]
  status: 'pending' | 'accepted' | 'rejected'
}

type ContractSeed = {
  brandEmail: string
  organizerEmail: string
  sponsorship_amount: string
  sponsorship_type: string
  deliverables: string
  start_date: string
  end_date: string
  payment_terms: string
  cancellation_policy: string
  additional_terms?: string
  brand_approved?: boolean
  organizer_approved?: boolean
  status: 'pending' | 'approved' | 'cancelled'
}

type DemoAccount = BrandSeed | OrganizerSeed

type SeededAccount = {
  account: DemoAccount
  result: DemoAccountResult
}

const brandSeeds: BrandSeed[] = [
  {
    email: 'brand@demo.com',
    password: 'demo123',
    type: 'brand',
    name: 'Demo Brand',
    extra: {
      company_name: 'Demo Brand Co.',
      short_description: 'Creator-forward beverage brand',
      description:
        'Samples mission-driven products to sustainability events and partners with creators to tell transparent sourcing stories.',
      website: 'https://brand.demo',
      phone: '555-010-1001'
    },
    brandData: {
      company_name: 'Demo Brand Co.',
      contact_name: 'Demo Brand',
      contact_title: 'Founder',
      email: 'brand@demo.com',
      phone: '555-010-1001',
      website: 'https://brand.demo',
      industry: 'Beverage',
      product_name: 'Mission Sparkling Water',
      product_description:
        'Effervescent still water made with circular packaging and locally sourced botanicals.',
      product_quantity: '1200 cases',
      target_audience: 'Conscious event goers and boutique retailers',
      age_range: '21-45',
      sponsorship_type: ['Sampling', 'Product Placement'],
      marketing_goals:
        'Showcase sustainability story, collect creator-generated content',
      budget: '$18,000',
      event_marketing_budget: '$6,000',
      interested_in_financial_sponsorship: true,
      financial_sponsorship_amount: '$10,000',
      success_metrics:
        'Samples distributed, newsletter signups, social mentions',
      interested_in_sampling_tools: true,
      has_test_panels: true,
      test_panel_details: 'Monthly tasting panels with 15 climate writers',
      additional_info:
        'Open to workshops and co-branded sustainability pledges.'
    },
    products: [
      {
        name: 'Sustainable Sampler Box',
        goals:
          'Place premium samples with sustainability-led events and co-create tasting experiences.',
        quantity: 400,
        unit: 'boxes',
        details:
          'Each box contains three sparkling water flavors with botanicals from Scandinavian farms.',
        status: 'online',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1481391342980-27a34c8bde2d',
            alt: 'Sparkling water in glass with citrus'
          },
          {
            url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
            alt: 'Bottles on a wooden table'
          }
        ],
        order_index: 0
      },
      {
        name: 'Event Hydration Cart',
        goals: 'Support outdoor summits with a mobile hydration station.',
        quantity: 1200,
        unit: 'cans',
        details:
          'Curated hydration cart with compostable cups, mixers, and brand ambassadors.',
        status: 'online',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
            alt: 'Refreshments on a cart'
          }
        ],
        order_index: 1
      }
    ]
  },
  {
    email: 'northspark@demo.com',
    password: 'demo123',
    type: 'brand',
    name: 'Northspark Distillers',
    extra: {
      company_name: 'Northspark Distillers',
      short_description: 'Artisanal gin & tonic experiences',
      description:
        'Architects of Nordic gin rituals that highlight regenerative grain sourcing and partner with chef-led gatherings.',
      website: 'https://northspark.demo',
      phone: '555-030-3030'
    },
    brandData: {
      company_name: 'Northspark Distillers',
      contact_name: 'Lina Broman',
      contact_title: 'Head of Partnerships',
      email: 'northspark@demo.com',
      phone: '555-030-3030',
      website: 'https://northspark.demo',
      industry: 'Spirits',
      product_name: 'Fjord Gin Flights',
      product_description:
        'Curated gin flight served with botanical tonics that draw inspiration from the Baltic coast.',
      product_quantity: '800 cases',
      target_audience: 'Boutique bars, private dining clubs',
      age_range: '25-55',
      sponsorship_type: ['Sampling', 'Co-branded Content'],
      marketing_goals:
        'Illuminate gin rituals to sustainability-minded travelers',
      budget: '$22,000',
      event_marketing_budget: '$7,000',
      interested_in_financial_sponsorship: true,
      financial_sponsorship_amount: '$12,000',
      success_metrics: 'Taste guide downloads, bartender leads',
      interested_in_sampling_tools: true,
      has_test_panels: false,
      test_panel_details: 'Tasting nights hosted with hospitality partners',
      additional_info: 'Looking for immersive tasting lounges.'
    },
    products: [
      {
        name: 'Fjord Gin Flight',
        goals: 'Stage-led tasting pairing gin with Nordic botanicals.',
        quantity: 240,
        unit: 'flights',
        details:
          'Each flight pairs three gin profiles with citrus tonics from Swedish orchards.',
        status: 'online',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1510626176961-4b57a0b400c6',
            alt: 'Gin flight on slate board'
          }
        ],
        order_index: 0
      },
      {
        name: 'Glassware + Guide',
        goals: 'Equip VIP lounges with branded glassware and tasting notes.',
        quantity: 180,
        unit: 'kits',
        details:
          'Comes with engraved goblets, tasting cards, and QR-linked botanist stories.',
        status: 'online',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1514361892636-ccd0c5ad75458',
            alt: 'Glasses on wooden shelf'
          }
        ],
        order_index: 1
      }
    ]
  },
  {
    email: 'clearwave@demo.com',
    password: 'demo123',
    type: 'brand',
    name: 'Clearwave Botanics',
    extra: {
      company_name: 'Clearwave Botanics',
      short_description: 'Functional beverage curators',
      description:
        'Crafts wellness spritzers that blend adaptogenic herbs, aquatic botanicals, and storytelling for mindful events.',
      website: 'https://clearwave.demo',
      phone: '555-040-4040'
    },
    brandData: {
      company_name: 'Clearwave Botanics',
      contact_name: 'Sana Orr',
      contact_title: 'Creative Director',
      email: 'clearwave@demo.com',
      phone: '555-040-4040',
      website: 'https://clearwave.demo',
      industry: 'Functional Beverages',
      product_name: 'Botanical Mist',
      product_description:
        'A sparkling adaptogenic mist focused on clarity, delivered in compostable packaging.',
      product_quantity: '950 cases',
      target_audience: 'Wellness festivals, studios, and retreats',
      age_range: '24-60',
      sponsorship_type: ['Sampling', 'Employee Wellness'],
      marketing_goals: 'Highlight ritualized wellness moments',
      budget: '$16,000',
      event_marketing_budget: '$5,500',
      interested_in_financial_sponsorship: false,
      financial_sponsorship_amount: '$0',
      success_metrics: 'Social stories, retreat bookings',
      interested_in_sampling_tools: true,
      has_test_panels: true,
      test_panel_details: 'Morning ritual sessions with 20 curated guests',
      additional_info: 'Can provide staff to guide tasting ceremonies.'
    },
    products: [
      {
        name: 'Botanical Mist Bar',
        goals: 'Offer mindful hydration at lounge areas.',
        quantity: 500,
        unit: 'servings',
        details: 'Served with chilled botanicals and QR-led breathing cues.',
        status: 'online',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0',
            alt: 'Aerial view of a botanical drink'
          }
        ],
        order_index: 0
      },
      {
        name: 'Reset Tonic Kit',
        goals: 'Bring at-home tasting rituals to virtual audiences.',
        quantity: 300,
        unit: 'kits',
        details:
          'Delivers adaptogenic blooms, tasting notes, and artist collaborations.',
        status: 'online',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1524592091176-ccdc5ad75458',
            alt: 'Tonic round bottles'
          }
        ],
        order_index: 1
      }
    ]
  },
  {
    email: 'glowco@demo.com',
    password: 'demo123',
    type: 'brand',
    name: 'GlowCo Beauty',
    extra: {
      company_name: 'GlowCo Beauty',
      short_description: 'Beauty ritual experiences with clean science',
      description:
        'GlowCo pairs dermatologist-backed skincare with immersive launch experiences in salons and wellness festivals.',
      website: 'https://glowco.demo',
      phone: '555-070-7070'
    },
    brandData: {
      company_name: 'GlowCo Beauty',
      contact_name: 'Ivy Soderholm',
      contact_title: 'VP Partnerships',
      email: 'glowco@demo.com',
      phone: '555-070-7070',
      website: 'https://glowco.demo',
      industry: 'beauty_cosmetics',
      product_name: 'Glow Serum',
      product_description:
        'A targeted barrier-repair serum that blends barrier peptides with Nordic botanicals.',
      product_quantity: '1,500 units',
      target_audience:
        'Beauty editors, salon guests, and wellness studio members',
      age_range: '25-40',
      sponsorship_type: ['Sampling', 'Content Collaboration'],
      marketing_goals:
        'Secure salon lounge placements and collect creator testimonial reels',
      budget: '$18,000',
      event_marketing_budget: '$7,500',
      interested_in_financial_sponsorship: true,
      financial_sponsorship_amount: '$12,000',
      success_metrics: 'Stocking invitations, social mentions, waitlist spikes',
      interested_in_sampling_tools: true,
      has_test_panels: true,
      test_panel_details: 'Weekly panel with 20 Nordic skincare advocates',
      additional_info: 'Can bring mini facial stations and editorial kits.'
    },
    products: [
      {
        name: 'Glow Serum Hospitality Kits',
        goals:
          'Place ritual kits in premium pop-up salons and concierge lounges.',
        quantity: 300,
        unit: 'kits',
        details:
          'Each kit includes a full-size serum, mini mist, and QR story about the glow ritual.',
        status: 'online',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
            alt: 'Skincare bottles on marble'
          },
          {
            url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
            alt: 'Beauty serum with flowers'
          }
        ],
        order_index: 0
      },
      {
        name: 'Radiant Experience Stations',
        goals: 'Deliver guided glow rituals with licensed aestheticians.',
        quantity: 15,
        unit: 'stations',
        details:
          'Mobile stations include pampering stylists, custom playlists, and photo-ready backdrops.',
        status: 'online',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
            alt: 'Glowing beauty station'
          }
        ],
        order_index: 1
      }
    ]
  },
  {
    email: 'lumen@demo.com',
    password: 'demo123',
    type: 'brand',
    name: 'Lumen Collective',
    extra: {
      company_name: 'Lumen Collective',
      short_description: 'Experiential lighting and stage craft for events',
      description:
        'Lumen Collective partners with experiential organizers to deliver programmable light sculptures and ambient artistry for product launches.',
      website: 'https://lumen.demo',
      phone: '555-080-8080'
    },
    brandData: {
      company_name: 'Lumen Collective',
      contact_name: 'Marcus Eklund',
      contact_title: 'Experience Director',
      email: 'lumen@demo.com',
      phone: '555-080-8080',
      website: 'https://lumen.demo',
      industry: 'entertainment',
      product_name: 'Immersive Light Bars',
      product_description:
        'Modular programmable light bars that adapt to brand palettes and respond to live audio.',
      product_quantity: '120 units',
      target_audience: 'Live stage producers, festivals, and tech showcases',
      age_range: '30-55',
      sponsorship_type: [
        'Event Sponsorship',
        'Content Collaboration',
        'Retail Experience'
      ],
      marketing_goals:
        'Place installations at flagship events and capture cinematic footage',
      budget: '$30,000',
      event_marketing_budget: '$12,000',
      interested_in_financial_sponsorship: true,
      financial_sponsorship_amount: '$15,000',
      success_metrics: 'Cinematic coverage, live reactions, social tags',
      interested_in_sampling_tools: false,
      has_test_panels: false,
      test_panel_details: 'N/A',
      additional_info: 'Offers integration with AV partners and designers.'
    },
    products: [
      {
        name: 'Aurora Bar Set',
        goals: 'Deliver ambient installations for main stages and lounges.',
        quantity: 24,
        unit: 'bars',
        details:
          'Each bar is programmable, stackable, and includes touch-reactive effects.',
        status: 'online',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
            alt: 'Colorful light installation'
          }
        ],
        order_index: 0
      },
      {
        name: 'Lumen Story Kit',
        goals:
          'Equip VIP activations with storytelling light cues tied to brand launches.',
        quantity: 12,
        unit: 'kits',
        details:
          'Includes curated light scripts, sensors, and mini light bars.',
        status: 'online',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
            alt: 'Event lighting script'
          }
        ],
        order_index: 1
      }
    ]
  }
]

const organizerSeeds: OrganizerSeed[] = [
  {
    email: 'organizer@demo.com',
    password: 'demo123',
    type: 'organizer',
    name: 'Demo Organizer',
    extra: {
      organizer_name: 'Demo Organizer Collective',
      phone: '555-020-2002',
      website: 'https://organizer.demo',
      description: 'Builds community festivals focused on sustainability.'
    },
    organizerData: {
      organizer_name: 'Demo Organizer Collective',
      contact_name: 'Demo Organizer',
      email: 'organizer@demo.com',
      phone: '555-020-2002',
      website: 'https://organizer.demo',
      address: 'Norrlandsgatan 10',
      postal_code: '111 22',
      city: 'Stockholm'
    },
    events: [
      {
        name: 'Sustainability Sampler Summit',
        event_type: 'Festival',
        elevator_pitch:
          'A multi-day showcase where conscious creators introduce mission-forward beverage partners to sustainability-minded communities.',
        frequency: 'Annual',
        start_date: '2026-09-18',
        location: 'Stockholm, Sweden',
        attendee_count: '3,500',
        audience_description:
          'Brand-forward fans, eco-conscious professionals, and experience curators.',
        audience_demographics: [
          '25-45',
          'Creative professionals',
          'Nordic + EU'
        ],
        sponsorship_needs:
          'Sampling partners, immersive lounge builders, and content collaborations.',
        seeking_financial_sponsorship: true,
        financial_sponsorship_amount: '$8,000',
        financial_sponsorship_offers:
          'Stage visibility, digital co-creation, and community highlights.',
        offering_types: ['Sampling', 'Co-branded Content', 'Workshop'],
        brand_visibility:
          'Main stage, lounge, digital verticals, and VIP networking pods.',
        content_creation: 'In-house film crew, live reels, and recap stories.',
        lead_generation:
          'QR scan list, sustainable pledge cards, and newsletter opt-ins.',
        product_feedback:
          'Structured tasting panel around sustainability credentials.',
        bonus_value: [
          'Hosts private community dinner',
          'Features brand in monthly newsletter'
        ],
        bonus_value_details:
          'Dinner invites top 30 creators and newsletter reaches 68k subscribers.',
        additional_info:
          'Venue certified carbon-neutral with local catering partners.',
        media_files: [
          'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7'
        ]
      }
    ]
  },
  {
    email: 'community@demo.com',
    password: 'demo123',
    type: 'organizer',
    name: 'Community Growers Fest',
    extra: {
      organizer_name: 'Community Growers Fest',
      phone: '555-050-5050',
      website: 'https://community.demo',
      description: 'Urban agriculture celebrations + hands-on learning.'
    },
    organizerData: {
      organizer_name: 'Community Growers Fest',
      contact_name: 'Maja Leijn',
      email: 'community@demo.com',
      phone: '555-050-5050',
      website: 'https://community.demo',
      address: 'Sveavägen 76',
      postal_code: '113 59',
      city: 'Stockholm'
    },
    events: [
      {
        name: 'Harvest Futures Expo',
        event_type: 'Pop-up Market',
        elevator_pitch:
          'Showcases food, beverage, and wellness brands that practice circular supply chains.',
        frequency: 'Bi-annual',
        start_date: '2026-07-02',
        location: 'Stockholm, Sweden',
        attendee_count: '1,200',
        audience_description:
          'Community members, chefs, and sustainability pioneers.',
        audience_demographics: [
          '30-55',
          'Creative professionals',
          'Nordics + EU'
        ],
        sponsorship_needs:
          'Sampling partners, stage experiences, and educator booths.',
        seeking_financial_sponsorship: true,
        financial_sponsorship_amount: '$5,000',
        financial_sponsorship_offers:
          'Featured in community newsletter and stage interviews.',
        offering_types: ['Sampling', 'Educational Sessions'],
        brand_visibility: 'Community stage and demo kitchens.',
        content_creation: 'Video recaps and community spotlights.',
        lead_generation: 'Guest list opt-ins and local retailer introductions.',
        product_feedback: 'Informal tasting tables and chef pairings.',
        bonus_value: ['Community garden tour', 'VIP mentor hours'],
        bonus_value_details:
          'Mentor hours pair brands with local growers for R&D.',
        additional_info: 'Venue on reclaimed waterfront.',
        media_files: [
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
        ]
      }
    ]
  },
  {
    email: 'aurora@demo.com',
    password: 'demo123',
    type: 'organizer',
    name: 'Aurora Cultural Events',
    extra: {
      organizer_name: 'Aurora Cultural Events',
      phone: '555-060-6060',
      website: 'https://aurora.demo',
      description: 'Immersive cultural festivals with creative leaders.'
    },
    organizerData: {
      organizer_name: 'Aurora Cultural Events',
      contact_name: 'Mikkel Strand',
      email: 'aurora@demo.com',
      phone: '555-060-6060',
      website: 'https://aurora.demo',
      address: 'Folkungagatan 112',
      postal_code: '116 30',
      city: 'Stockholm'
    },
    events: [
      {
        name: 'Midwinter Craft Summit',
        event_type: 'Summit',
        elevator_pitch:
          'Invites design, flavor, and creative practitioners to co-create limited experiences.',
        frequency: 'Annual',
        start_date: '2026-12-05',
        location: 'Stockholm, Sweden',
        attendee_count: '1,900',
        audience_description:
          'Creative directors, cultural producers, and experiential brands.',
        audience_demographics: ['28-50', 'Scandinavia & EU'],
        sponsorship_needs:
          'Sampling partners, interactive lounges, and immersive crafts.',
        seeking_financial_sponsorship: true,
        financial_sponsorship_amount: '$9,000',
        financial_sponsorship_offers:
          'Featured lounges, runway integrations, and digital programs.',
        offering_types: [
          'Sampling',
          'Immersive Experience',
          'Content Collaboration'
        ],
        brand_visibility:
          'Main atrium, immersive lounges, and digital storytelling lounges.',
        content_creation:
          'Artist-led films, live-streamed panels, and recap zines.',
        lead_generation: 'Curated guest list and community match-making.',
        product_feedback: 'Branded testing labs with creative producers.',
        bonus_value: ['Invites to artists dinner', 'Inclusion in Summit zine'],
        bonus_value_details:
          'Dinner connects brands with 40 cultural producers and zine reaches 120k readers.',
        additional_info: 'Venue rotates among design studios.',
        media_files: [
          'https://images.unsplash.com/photo-1482192597420-4817fdd3f01a'
        ]
      }
    ]
  },
  {
    email: 'urbanwellness@demo.com',
    password: 'demo123',
    type: 'organizer',
    name: 'Urban Wellness Week',
    extra: {
      organizer_name: 'Urban Wellness Week',
      phone: '555-090-9090',
      website: 'https://urbanwellness.demo',
      description:
        'City-wide experiences that highlight mindful movement, botanical tastings, and cultural riffing.'
    },
    organizerData: {
      organizer_name: 'Urban Wellness Week',
      contact_name: 'Noor Badi',
      email: 'urbanwellness@demo.com',
      phone: '555-090-9090',
      website: 'https://urbanwellness.demo',
      address: 'Kungsgatan 28',
      postal_code: '111 35',
      city: 'Stockholm'
    },
    events: [
      {
        name: 'Urban Wellness Week',
        event_type: 'Festival Week',
        elevator_pitch:
          'A layered series of rooftop lounges, sound baths, and mindful market pop-ups that pair brands with movement lovers.',
        frequency: 'Annual',
        start_date: '2026-05-17',
        location: 'Stockholm, Sweden',
        attendee_count: '2,200',
        audience_description:
          'Wellness professionals, creative founders, and culturally curious locals.',
        audience_demographics: ['25-45', 'Wellness creators', 'Nordic + EU'],
        sponsorship_needs:
          'Sampling partners, workshop leaders, and immersive storytelling teams.',
        seeking_financial_sponsorship: true,
        financial_sponsorship_amount: '$10,000',
        financial_sponsorship_offers:
          'Digital content suite, wellness guide inclusion, and elevated dwell moments.',
        offering_types: [
          'Sampling',
          'Content Collaboration',
          'Immersive Experience'
        ],
        brand_visibility:
          'Pop-up markets, rooftop lounges, and digital festival map placements.',
        content_creation:
          'In-house mini documentaries, live social reels, and community spotlights.',
        lead_generation:
          'Email opt-ins, workshop bookings, and wellness passport scans.',
        product_feedback: 'Guided tasting tables and workshop reflections.',
        bonus_value: [
          'Sound bath performance feature',
          'Wellness Week guide inclusion'
        ],
        bonus_value_details:
          'Guide reaches 25k attendees and offers shoutouts on closing night.',
        additional_info:
          'Works with Nordic design houses to build floating lounge architecture.',
        media_files: [
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773'
        ]
      }
    ]
  },
  {
    email: 'lumenstages@demo.com',
    password: 'demo123',
    type: 'organizer',
    name: 'Lumen Stages Collective',
    extra: {
      organizer_name: 'Lumen Stages Collective',
      phone: '555-110-1101',
      website: 'https://lumenstages.demo',
      description:
        'Immersive stage producers blending programmable lighting with brand storytelling.'
    },
    organizerData: {
      organizer_name: 'Lumen Stages Collective',
      contact_name: 'Sofia Leclerc',
      email: 'lumenstages@demo.com',
      phone: '555-110-1101',
      website: 'https://lumenstages.demo',
      address: 'Götgatan 85',
      postal_code: '116 62',
      city: 'Stockholm'
    },
    events: [
      {
        name: 'Immersive Voltage Series',
        event_type: 'Immersive Series',
        elevator_pitch:
          'Quarterly curated evenings where programmable light, sonic sets, and tasting concepts collide.',
        frequency: 'Quarterly',
        start_date: '2026-11-01',
        location: 'Stockholm, Sweden',
        attendee_count: '1,000',
        audience_description:
          'Design-forward tastemakers, brand storytellers, and experiential producers.',
        audience_demographics: ['30-50', 'Creative directors', 'Nordic + EU'],
        sponsorship_needs:
          'Light installations, immersive lounges, and content collab partners.',
        seeking_financial_sponsorship: true,
        financial_sponsorship_amount: '$14,000',
        financial_sponsorship_offers:
          'Brand takeover nights, curated VIP lounges, and digital film packages.',
        offering_types: [
          'Immersive Experience',
          'Sampling',
          'Content Collaboration'
        ],
        brand_visibility:
          'Main stage, sculptural lounges, and pre-show receptions.',
        content_creation:
          'Short films, live-streamed lighting cues, and DJ sets captured for social.',
        lead_generation: 'VIP list, lounge RSVPs, and brand match cards.',
        product_feedback: 'Live demos within immersive lounges.',
        bonus_value: [
          'Lighting-focused creative consult',
          'Feature in Lumen reel'
        ],
        bonus_value_details:
          'Consult pairs designers with the brand for bespoke cues, reel hits 40k views.',
        additional_info: 'Partners with AV studios for technical support.',
        media_files: [
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
        ]
      }
    ]
  }
]

const matchSeeds: MatchSeed[] = [
  {
    brandEmail: 'brand@demo.com',
    organizerEmail: 'organizer@demo.com',
    score: 93,
    match_reasons: [
      'Shared sustainability mission',
      'Sampling-heavy staging aligns with brand offerings'
    ],
    status: 'accepted'
  },
  {
    brandEmail: 'northspark@demo.com',
    organizerEmail: 'organizer@demo.com',
    score: 85,
    match_reasons: [
      'Botanical cinema lounges need paired spirits',
      'Organizers value premium co-branded content'
    ],
    status: 'pending'
  },
  {
    brandEmail: 'clearwave@demo.com',
    organizerEmail: 'community@demo.com',
    score: 78,
    match_reasons: [
      'Wellness-focused pop-up needs mindful hydration',
      'Community venue loves storytelling partners'
    ],
    status: 'pending'
  },
  {
    brandEmail: 'glowco@demo.com',
    organizerEmail: 'urbanwellness@demo.com',
    score: 88,
    match_reasons: [
      'Rooftop lounges and mindful workshops need premium skincare sampling',
      'Organizers prioritize content storytelling and creator testimonials'
    ],
    status: 'pending'
  },
  {
    brandEmail: 'lumen@demo.com',
    organizerEmail: 'lumenstages@demo.com',
    score: 91,
    match_reasons: [
      'Programmable light bars amplify curated VIP experiences',
      'Organizers co-create cinematic reels and immersive lounges'
    ],
    status: 'pending'
  }
]

const contractSeeds: ContractSeed[] = [
  {
    brandEmail: 'glowco@demo.com',
    organizerEmail: 'urbanwellness@demo.com',
    sponsorship_amount: '$12,000',
    sponsorship_type: 'Sampling & Content',
    deliverables:
      'Glow Serum Hospitality kits, guided lounge rituals, and creator interviews captured for Urban Wellness Week.',
    start_date: '2026-05-01',
    end_date: '2026-05-20',
    payment_terms: '50% upfront, 50% upon delivery of content plan',
    cancellation_policy:
      '30-day notice required with penalty equal to 30% of the sponsorship amount.',
    additional_terms:
      'Urban Wellness Week supplies premium lounge space and floating architecture for the brand.',
    brand_approved: true,
    organizer_approved: false,
    status: 'pending'
  },
  {
    brandEmail: 'lumen@demo.com',
    organizerEmail: 'lumenstages@demo.com',
    sponsorship_amount: '$22,000',
    sponsorship_type: 'Experiential Lighting',
    deliverables:
      'Aurora Bar sets, Lumen Story Kits, and technical staff for Immersive Voltage Series lounges.',
    start_date: '2026-10-15',
    end_date: '2027-02-01',
    payment_terms: 'Net 30 after final event invoice',
    cancellation_policy: 'Cancellation within 15 days triggers a 40% fee.',
    additional_terms:
      'Organizer covers lodging and transportation for the Lumen technical team.',
    brand_approved: true,
    organizer_approved: true,
    status: 'approved'
  }
]

const accounts: DemoAccount[] = [...brandSeeds, ...organizerSeeds]

async function createOrUpdateAccount(
  account: DemoAccount
): Promise<DemoAccountResult> {
  const { data: existingProfile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', account.email)
    .maybeSingle()

  if (profileError) {
    throw new Error(
      `Failed to fetch profile for ${account.email}: ${profileError.message}`
    )
  }

  if (existingProfile?.id) {
    await supabase.auth.admin.deleteUser(existingProfile.id)
  } else {
    const { data: userList, error: listUsersError } =
      await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })

    if (listUsersError) {
      throw new Error(
        `Failed to inspect existing auth users: ${listUsersError.message}`
      )
    }

    const existingUser = userList.users.find(
      (user) => user.email?.toLowerCase() === account.email.toLowerCase()
    )

    if (existingUser?.id) {
      await supabase.auth.admin.deleteUser(existingUser.id)
    }
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: {
      type: account.type,
      name: account.name,
      role: account.type === 'brand' ? 'Brand' : 'Organizer'
    }
  })

  if (error) {
    throw new Error(`Failed to create ${account.email}: ${error.message}`)
  }

  const userId = data?.user?.id

  if (!userId) {
    throw new Error('Expected user id after signup but none was returned.')
  }

  console.log(`Created ${account.type} account: ${account.email}`)

  const profilePayload: Record<string, string | undefined> = {
    id: userId,
    role: account.type === 'brand' ? 'Brand' : 'Organizer',
    name: account.name,
    email: account.email
  }

  const allowedProfileExtraKeys = ['phone', 'logo_url', 'description'] as const

  for (const key of allowedProfileExtraKeys) {
    if (key === 'description') {
      const description = account.extra.description ?? account.extra.short_description
      if (description) {
        profilePayload.description = description
      }
      continue
    }

    const value = account.extra[key]
    if (value) {
      profilePayload[key] = value
    }
  }

  const { error: profileUpsertError } = await supabase
    .from('profiles')
    .upsert(profilePayload)

  if (profileUpsertError) {
    throw new Error(
      `Failed to upsert profile for ${account.email}: ${profileUpsertError.message}`
    )
  }

  console.log(`Synced profile for ${account.email}`)

  return { type: account.type, email: account.email, userId }
}

async function seedBrandContent(
  account: BrandSeed,
  userId: string
): Promise<string> {
  const { data: brandRecord, error } = await supabase
    .from('brands')
    .insert({
      user_id: userId,
      ...account.brandData
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(
      `Failed to insert brand data for ${account.email}: ${error.message}`
    )
  }

  const brandId = brandRecord.id
  console.log(`Seeded brand record for ${account.name}`)

  const products = account.products.map((product) => ({
    ...product,
    brand_id: brandId
  }))

  const { error: productsError } = await supabase
    .from('sponsorship_products')
    .insert(products)

  if (productsError) {
    throw new Error(
      `Failed to insert products for ${account.email}: ${productsError.message}`
    )
  }

  console.log(`Added products for ${account.name}`)
  return brandId
}

async function seedOrganizerContent(
  account: OrganizerSeed,
  userId: string
): Promise<string> {
  const { data: organizerRecord, error } = await supabase
    .from('organizers')
    .insert({
      user_id: userId,
      ...account.organizerData
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(
      `Failed to insert organizer data for ${account.email}: ${error.message}`
    )
  }

  const organizerId = organizerRecord.id
  console.log(`Seeded organizer record for ${account.name}`)

  const events = account.events.map((event) => ({
    ...event,
    organizer_id: organizerId
  }))

  const { error: eventsError } = await supabase.from('events').insert(events)

  if (eventsError) {
    throw new Error(
      `Failed to insert events for ${account.email}: ${eventsError.message}`
    )
  }

  console.log(`Added events for ${account.name}`)
  return organizerId
}

async function seedConversationAndMessages({
  brandId,
  organizerId,
  brandUserId,
  organizerUserId
}: {
  brandId: string
  organizerId: string
  brandUserId: string
  organizerUserId: string
}) {
  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert({
      brand_id: brandId,
      organizer_id: organizerId
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to insert conversation: ${error.message}`)
  }

  const messages = [
    {
      conversation_id: conversation.id,
      sender_id: brandUserId,
      sender_type: 'brand',
      content:
        'Love the vibe of Sustainability Sampler Summit. Curious how we can bring sampling carts to the VIP lounge.'
    },
    {
      conversation_id: conversation.id,
      sender_id: organizerUserId,
      sender_type: 'organizer',
      content:
        'Absolutely. We can reserve a lounge slot, and capture the experience with our content crew.'
    }
  ]

  const { error: messagesError } = await supabase
    .from('messages')
    .insert(messages)

  if (messagesError) {
    throw new Error(`Failed to insert messages: ${messagesError.message}`)
  }

  console.log('Created demo conversation with messages')
}

async function seedMatches(
  seeds: MatchSeed[],
  brandIds: Map<string, string>,
  organizerIds: Map<string, string>
) {
  const entries = seeds
    .map((seed) => {
      const brandId = brandIds.get(seed.brandEmail)
      const organizerId = organizerIds.get(seed.organizerEmail)

      if (!brandId || !organizerId) {
        console.warn(
          `Skipping match for ${seed.brandEmail} + ${seed.organizerEmail} because IDs are missing.`
        )
        return null
      }

      return {
        brand_id: brandId,
        organizer_id: organizerId,
        score: seed.score,
        match_reasons: seed.match_reasons,
        status: seed.status
      }
    })
    .filter(Boolean)

  if (entries.length === 0) {
    return
  }

  const { error } = await supabase.from('matches').insert(
    entries as Array<{
      brand_id: string
      organizer_id: string
      score: number
      match_reasons: string[]
      status: 'pending' | 'accepted' | 'rejected'
    }>
  )

  if (error) {
    throw new Error(`Failed to insert matches: ${error.message}`)
  }

  console.log('Seeded demo matches')
}

async function seedContracts(
  seeds: ContractSeed[],
  brandIds: Map<string, string>,
  organizerIds: Map<string, string>
) {
  const entries: Array<{
    match_id: string
    brand_id: string
    organizer_id: string
    sponsorship_amount: string
    sponsorship_type: string
    deliverables: string
    start_date: string
    end_date: string
    payment_terms: string
    cancellation_policy: string
    additional_terms: string | null
    brand_approved: boolean
    organizer_approved: boolean
    status: 'pending' | 'approved' | 'cancelled'
  }> = []

  for (const seed of seeds) {
    const brandId = brandIds.get(seed.brandEmail)
    const organizerId = organizerIds.get(seed.organizerEmail)

    if (!brandId || !organizerId) {
      console.warn(
        `Skipping contract for ${seed.brandEmail} + ${seed.organizerEmail} because IDs are missing.`
      )
      continue
    }

    const { data: matchRecord, error: matchError } = await supabase
      .from('matches')
      .select('id')
      .eq('brand_id', brandId)
      .eq('organizer_id', organizerId)
      .maybeSingle()

    if (matchError) {
      throw new Error(
        `Failed to fetch match for ${seed.brandEmail} + ${seed.organizerEmail}: ${matchError.message}`
      )
    }

    if (!matchRecord?.id) {
      console.warn(
        `No match found for ${seed.brandEmail} + ${seed.organizerEmail}, skipping contract.`
      )
      continue
    }

    entries.push({
      match_id: matchRecord.id,
      brand_id: brandId,
      organizer_id: organizerId,
      sponsorship_amount: seed.sponsorship_amount,
      sponsorship_type: seed.sponsorship_type,
      deliverables: seed.deliverables,
      start_date: seed.start_date,
      end_date: seed.end_date,
      payment_terms: seed.payment_terms,
      cancellation_policy: seed.cancellation_policy,
      additional_terms: seed.additional_terms ?? null,
      brand_approved: seed.brand_approved ?? false,
      organizer_approved: seed.organizer_approved ?? false,
      status: seed.status
    })
  }

  if (entries.length === 0) {
    return
  }

  const { error } = await supabase.from('contracts').insert(entries)

  if (error) {
    throw new Error(`Failed to insert contracts: ${error.message}`)
  }

  console.log('Seeded demo contracts')
}

async function main() {
  const seededAccounts: SeededAccount[] = []

  for (const account of accounts) {
    const result = await createOrUpdateAccount(account)
    seededAccounts.push({ account, result })
  }

  const brandAccounts = seededAccounts.filter(
    ({ account }) => account.type === 'brand'
  ) as Array<{ account: BrandSeed; result: DemoAccountResult }>

  const organizerAccounts = seededAccounts.filter(
    ({ account }) => account.type === 'organizer'
  ) as Array<{ account: OrganizerSeed; result: DemoAccountResult }>

  const brandIdByEmail = new Map<string, string>()
  const organizerIdByEmail = new Map<string, string>()

  const promises: Array<Promise<void>> = []

  for (const entry of brandAccounts) {
    promises.push(
      seedBrandContent(entry.account, entry.result.userId).then((id) => {
        brandIdByEmail.set(entry.account.email, id)
      })
    )
  }

  for (const entry of organizerAccounts) {
    promises.push(
      seedOrganizerContent(entry.account, entry.result.userId).then((id) => {
        organizerIdByEmail.set(entry.account.email, id)
      })
    )
  }

  await Promise.all(promises)

  const primaryMatch = matchSeeds[0]
  const primaryBrandId = brandIdByEmail.get(primaryMatch.brandEmail)
  const primaryOrganizerId = organizerIdByEmail.get(primaryMatch.organizerEmail)
  const primaryBrandUserId = brandAccounts.find(
    ({ account }) => account.email === primaryMatch.brandEmail
  )?.result.userId
  const primaryOrganizerUserId = organizerAccounts.find(
    ({ account }) => account.email === primaryMatch.organizerEmail
  )?.result.userId

  if (
    primaryBrandId &&
    primaryOrganizerId &&
    primaryBrandUserId &&
    primaryOrganizerUserId
  ) {
    await seedConversationAndMessages({
      brandId: primaryBrandId,
      organizerId: primaryOrganizerId,
      brandUserId: primaryBrandUserId,
      organizerUserId: primaryOrganizerUserId
    })
  }

  await seedMatches(matchSeeds, brandIdByEmail, organizerIdByEmail)

  await seedContracts(contractSeeds, brandIdByEmail, organizerIdByEmail)

  console.log('Demo profiles seeded.')
}

main().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
