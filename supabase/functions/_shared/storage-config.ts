// ============================================
// Storage Configuration - Single Source of Truth
// Update limits here and they'll apply everywhere
// ============================================

export const STORAGE_CONFIG = {
  buckets: {
    avatars: {
      name: 'avatars',
      public: true,
      maxSize: 1 * 1024 * 1024, // 1MB
      maxSizeLabel: '1MB',
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
      description: 'User profile pictures'
    },
    'brand-logos': {
      name: 'brand-logos',
      public: true,
      maxSize: 2 * 1024 * 1024, // 2MB
      maxSizeLabel: '2MB',
      allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.svg', '.webp'],
      description: 'Brand and company logos'
    },
    'event-media': {
      name: 'event-media',
      public: true,
      maxSize: 5 * 1024 * 1024, // 5MB
      maxSizeLabel: '5MB',
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
      description: 'Event photos and documents'
    },
    'support-attachments': {
      name: 'support-attachments',
      public: false,
      maxSize: 3 * 1024 * 1024, // 3MB
      maxSizeLabel: '3MB',
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
        'text/plain'
      ],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.txt'],
      description: 'Support ticket attachments'
    }
  }
} as const

// Type helpers
export type BucketName = keyof typeof STORAGE_CONFIG.buckets
export type BucketConfig = typeof STORAGE_CONFIG.buckets[BucketName]

// Helper to get config for a bucket
export function getBucketConfig(bucketName: string): BucketConfig | null {
  return STORAGE_CONFIG.buckets[bucketName as BucketName] || null
}

// Helper to format size in human-readable format
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// SQL generation helper (for documentation)
export function generateSQLInsert(): string {
  const buckets = Object.values(STORAGE_CONFIG.buckets)
  const values = buckets.map(bucket => `  (
    '${bucket.name}',
    '${bucket.name}',
    ${bucket.public},
    ${bucket.maxSize},
    ARRAY[${bucket.allowedTypes.map(t => `'${t}'`).join(', ')}]
  )`).join(',\n')

  return `INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
${values}
ON CONFLICT (id) DO NOTHING;`
}

// Get all bucket names as array
export const BUCKET_NAMES = Object.keys(STORAGE_CONFIG.buckets) as BucketName[]

// Quick reference for frontend
export const STORAGE_LIMITS = Object.fromEntries(
  Object.entries(STORAGE_CONFIG.buckets).map(([key, config]) => [
    key,
    {
      maxSize: config.maxSize,
      maxSizeLabel: config.maxSizeLabel,
      allowedTypes: config.allowedTypes,
      allowedExtensions: config.allowedExtensions
    }
  ])
)
