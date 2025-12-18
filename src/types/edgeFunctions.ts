// Type definitions for Edge Function requests and responses

import type { Match } from './match'
import type { Brand, Organizer } from './index'

// ============================================
// Generate Matches
// ============================================

export interface GenerateMatchesResponse {
  success: boolean
  matchCount: number
  matches: Match[]
}

// ============================================
// Send Email
// ============================================

export type EmailTemplate = 'welcome' | 'new_match' | 'match_accepted' | 'support_ticket' | 'custom'

export interface SendEmailParams {
  to: string
  subject: string
  template: EmailTemplate
  data?: Record<string, string | number | boolean>
  html?: string
}

export interface SendEmailResponse {
  success: boolean
  emailId?: string
  message: string
}

// ============================================
// Process Payment
// ============================================

export interface ProcessPaymentParams {
  amount: number // in cents
  currency: string
  userId: string
  description: string
  metadata?: Record<string, string | number | boolean>
}

export interface ProcessPaymentResponse {
  success: boolean
  paymentIntentId?: string
  clientSecret?: string
  status?: string
  message?: string
}

// ============================================
// AI Assistant
// ============================================

export type AIAssistantType = 'detect-intent' | 'extract-profile' | 'generate-questions' | 'generate-suggestions'

export type UserRole = 'brand' | 'organizer' | 'community'

export interface ConversationMessage {
  role: string
  content: string
  timestamp: string
}

export interface AIAssistantContext {
  role?: UserRole
  draftProfile?: Partial<Brand | Organizer>
  conversation?: ConversationMessage[]
}

export interface AIAssistantParams {
  type: AIAssistantType
  input: string
  context?: AIAssistantContext
}

export interface IntentDetectionResult {
  role: UserRole | null
  confidence: number
  reasoning: string
}

export interface ProfileExtractionResult {
  extractedData: Partial<Brand | Organizer>
  confidence: number
  fields: string[]
}

export interface GeneratedQuestion {
  question: string
  field: string
  priority: 'high' | 'medium' | 'low'
}

export interface GeneratedSuggestion {
  suggestion: string
  field: string
  value: string | string[]
}

export type AIAssistantResult =
  | IntentDetectionResult
  | ProfileExtractionResult
  | GeneratedQuestion[]
  | GeneratedSuggestion[]

export interface AIAssistantResponse {
  success: boolean
  result: AIAssistantResult
}

// ============================================
// Track Analytics
// ============================================

export type AnalyticsEventType = 'event' | 'error'

export interface AnalyticsEventData {
  event?: string
  userId?: string
  sessionId?: string
  properties?: Record<string, string | number | boolean>
}

export interface AnalyticsErrorData {
  type?: string
  message?: string
  stack?: string
  metadata?: Record<string, string | number | boolean>
}

export type AnalyticsData = AnalyticsEventData | AnalyticsErrorData

export interface TrackEventParams {
  type: AnalyticsEventType
  data: AnalyticsData
}

export interface TrackEventResponse {
  success: boolean
  message: string
}

// ============================================
// Admin Operations
// ============================================

export type AdminAction =
  | 'get-users'
  | 'update-user-role'
  | 'delete-user'
  | 'ban-user'
  | 'bulk-delete'
  | 'get-stats'
  | 'purge-old-data'

export interface UpdateUserRoleData {
  userId: string
  role: 'Admin' | 'Brand' | 'Organizer' | 'Community'
}

export interface DeleteUserData {
  userId: string
}

export interface BanUserData {
  userId: string
  reason: string
}

export interface BulkDeleteData {
  userIds: string[]
}

export interface PurgeOldDataData {
  olderThanDays: number
  tables?: string[]
}

export type AdminOperationData =
  | UpdateUserRoleData
  | DeleteUserData
  | BanUserData
  | BulkDeleteData
  | PurgeOldDataData

export interface AdminOperationParams {
  action: AdminAction
  data?: AdminOperationData
}

export interface UserInfo {
  id: string
  email: string
  name: string
  role: string
  type: string
  createdAt: string
  lastLogin?: string
}

export interface SystemStats {
  totalUsers: number
  totalBrands: number
  totalOrganizers: number
  totalMatches: number
  activeContracts: number
}

export type AdminOperationResult =
  | UserInfo[]
  | UserInfo
  | SystemStats
  | { deletedCount: number }
  | { message: string }

export interface AdminOperationResponse {
  success: boolean
  result: AdminOperationResult
}

// ============================================
// Export Data
// ============================================

export type ExportType = 'user-data' | 'admin-report' | 'gdpr-request'
export type ExportFormat = 'json' | 'csv'

export interface ExportFilters {
  dateFrom?: string
  dateTo?: string
  includeDeleted?: boolean
  tables?: string[]
}

export interface ExportDataParams {
  type: ExportType
  format: ExportFormat
  userId?: string
  filters?: ExportFilters
}

// ============================================
// Upload File
// ============================================

export type BucketName = 'avatars' | 'brand-logos' | 'event-media' | 'support-attachments'

export interface UploadURLParams {
  fileName: string
  fileType: string
  fileSize: number
  bucket: BucketName
}

export interface UploadURLResponse {
  success: boolean
  uploadUrl: string
  filePath: string
  publicUrl: string
  expiresIn: number
}
