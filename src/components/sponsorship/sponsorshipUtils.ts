// Utility functions for ProductSponsorshipManager

export function generateId(prefix: string = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateImage(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Only image files are allowed';
  }
  if (file.size > 2 * 1024 * 1024) {
    return 'Image size should not exceed 2MB';
  }
  return null;
}
