import { CommunityQueryParams } from '../../types/community'

export interface DirectoryFilterParams extends CommunityQueryParams {
  category?: string
  location?: string
  eventType?: string
  audienceSize?: string
}
