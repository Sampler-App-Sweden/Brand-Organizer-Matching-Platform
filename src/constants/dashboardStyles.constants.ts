/**
 * Centralized dashboard spacing and styling constants
 * Mobile-first approach: 16px base, scaling up for larger screens
 */

export const DASHBOARD_SPACING = {
  // Content padding (applied to main content wrapper)
  // 16px mobile, 24px tablet, 32px desktop
  contentPadding: 'p-4 md:p-6 lg:p-8',

  // Section margins (between major sections)
  // 24px spacing between sections
  sectionMargin: 'mb-6',

  // Grid gaps (for card grids)
  // 16px mobile, 24px tablet/desktop
  gridGap: 'gap-4 md:gap-6',

  // Header margin (page title section)
  headerMargin: 'mb-6',

  // Card padding (inside cards/panels)
  // 16px mobile, 24px tablet/desktop
  cardPadding: 'p-4 md:p-6',

  // Form section spacing
  formSectionSpacing: 'space-y-6',

  // Stats grid columns
  statsGrid: 'grid grid-cols-1 md:grid-cols-3',
  adminStatsGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6',
} as const

/**
 * Common className combinations for dashboard components
 */
export const DASHBOARD_CLASSES = {
  // Main page header (title + description)
  pageHeader: 'mb-6',

  // Section header (subsection titles)
  sectionHeader: 'text-xl font-bold text-gray-900 mb-4',

  // Card container
  card: 'bg-white rounded-lg shadow-sm',

  // Card with padding
  cardWithPadding: 'bg-white rounded-lg shadow-sm p-4 md:p-6',

  // Stats grid container
  statsGrid: 'grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6',

  // Admin stats grid container
  adminStatsGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 mb-6',

  // Content section
  section: 'mb-6',
} as const
