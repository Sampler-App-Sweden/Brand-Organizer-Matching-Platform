import { ProfileOverview } from '../../services/profileService'
import { DirectoryFilterParams } from './directoryFilterTypes'

const includesText = (value?: string | null, term?: string) =>
  term ? value?.toLowerCase().includes(term) ?? false : true

const includesArray = (value?: string[], term?: string) =>
  term ? value?.some((entry) => entry.toLowerCase().includes(term)) ?? false : true

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
