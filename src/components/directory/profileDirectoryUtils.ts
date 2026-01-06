import { ProfileOverview } from '../../services/profileService'
import { DirectoryFilterParams } from './directoryFilterTypes'

const includesText = (value?: string | null, term?: string) =>
  term ? value?.toLowerCase().includes(term) ?? false : true

const includesArray = (value?: string[], term?: string) =>
  term ? value?.some((entry) => entry.toLowerCase().includes(term)) ?? false : true

/**
 * Check if a profile is complete enough to show in the directory
 * Requirements:
 * - Must have a description (required)
 * - For Brands: sponsorship types, budget range, and audience tags
 * - For Organizers: event types and audience demographics
 * - Logo is optional
 */
export function isProfileComplete(profile: ProfileOverview): boolean {
  // Check if profile has a description (required by user)
  if (!profile.description || profile.description.trim() === '') {
    return false
  }

  // Check core whatTheySeek fields
  const whatTheySeek = profile.whatTheySeek
  if (!whatTheySeek) {
    return false
  }

  if (profile.role === 'Brand') {
    // For brands, check:
    // - Has sponsorship types
    // - Has budget range
    // - Has audience tags
    const hasSponsorshipTypes =
      !!whatTheySeek.sponsorshipTypes &&
      whatTheySeek.sponsorshipTypes.length > 0
    const hasBudget = !!whatTheySeek.budgetRange
    const hasAudienceTags =
      !!whatTheySeek.audienceTags &&
      whatTheySeek.audienceTags.length > 0

    return hasSponsorshipTypes && hasBudget && hasAudienceTags
  } else if (profile.role === 'Organizer') {
    // For organizers, check:
    // - Has audience tags (demographics) - REQUIRED
    // - Event types are optional (will show if added to profile later)
    const hasAudienceTags =
      !!whatTheySeek.audienceTags &&
      whatTheySeek.audienceTags.length > 0

    return hasAudienceTags
  }

  return false
}

export function filterProfilesByRole(
  profiles: ProfileOverview[],
  filters: DirectoryFilterParams,
  role: 'Brand' | 'Organizer'
) {
  const searchTerm = filters.search?.toLowerCase().trim()
  const categoryTerm = filters.category?.toLowerCase().trim()
  const locationTerm = filters.location?.toLowerCase().trim()
  const eventTypeTerm = filters.eventType?.toLowerCase().trim()
  const audienceSizeTerm = filters.audienceSize?.toLowerCase().trim()

  return profiles.filter((profile) => {
    if (profile.role !== role) {
      return false
    }

    // Filter out incomplete profiles
    if (!isProfileComplete(profile)) {
      return false
    }

    if (
      searchTerm &&
      !(
        includesText(profile.name, searchTerm) ||
        includesText(profile.description, searchTerm) ||
        includesText(profile.whatTheySeek?.notes, searchTerm) ||
        includesArray(profile.whatTheySeek?.audienceTags, searchTerm) ||
        includesArray(profile.whatTheySeek?.eventTypes, searchTerm)
      )
    ) {
      return false
    }

    if (
      !includesText(profile.description, categoryTerm) &&
      !includesArray(profile.whatTheySeek?.audienceTags, categoryTerm)
    ) {
      return false
    }

    if (!includesText(profile.whatTheySeek?.notes, locationTerm)) {
      return false
    }

    if (!includesArray(profile.whatTheySeek?.eventTypes, eventTypeTerm)) {
      return false
    }

    if (!includesArray(profile.whatTheySeek?.audienceTags, audienceSizeTerm)) {
      return false
    }

    return true
  })
}
