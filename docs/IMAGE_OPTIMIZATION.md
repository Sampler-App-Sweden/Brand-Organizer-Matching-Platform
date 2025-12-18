# Image Optimization

All images uploaded through the platform are automatically optimized to WebP format on the client-side before upload.

## Benefits

- **Smaller File Sizes**: 25-35% reduction in file size
- **Faster Uploads**: Less data to transfer
- **Better Performance**: Smaller images load faster for users
- **Lower Costs**: Reduced storage and bandwidth usage
- **Automatic**: No user action required

## How It Works

When a user uploads an image:

1. **Client-side optimization** converts the image to WebP using Canvas API
2. **Quality settings** are applied based on bucket type:
   - Avatars: 85% quality, max 512x512px
   - Brand Logos: 90% quality, max 1024x1024px
   - Event Media: 80% quality, max 2048x2048px
   - Support Attachments: 75% quality, max 1600x1600px
3. **Optimized image** is uploaded to Supabase Storage
4. **Original dimensions** are maintained (aspect ratio preserved)

## Usage

### Basic Upload (with automatic optimization)

```typescript
import { uploadFile } from '@/services/edgeFunctions'

// Images are automatically optimized
const publicUrl = await uploadFile(imageFile, 'avatars')
```

### Upload with Optimization Callback

```typescript
import { uploadFile } from '@/services/edgeFunctions'

const publicUrl = await uploadFile(imageFile, 'brand-logos', {
  onOptimizationComplete: (result) => {
    console.log(`Original: ${result.originalSize} bytes`)
    console.log(`Optimized: ${result.optimizedSize} bytes`)
    console.log(`Savings: ${result.savings.toFixed(1)}%`)
  }
})
```

### Skip Optimization (if needed)

```typescript
import { uploadFile } from '@/services/edgeFunctions'

// Upload original image without optimization
const publicUrl = await uploadFile(imageFile, 'event-media', {
  skipOptimization: true
})
```

### Direct Optimization (without upload)

```typescript
import { optimizeImage } from '@/utils/imageOptimizer'

const result = await optimizeImage(file, {
  quality: 0.85,
  maxWidth: 1024,
  maxHeight: 1024
})

console.log(`Saved ${result.savings.toFixed(1)}%`)
// Use result.file for upload
```

## Optimization Settings

### Avatars
- Quality: 85%
- Max Dimensions: 512x512px
- Target: Profile pictures
- File Limit: 1MB

### Brand Logos
- Quality: 90% (higher quality for branding)
- Max Dimensions: 1024x1024px
- Target: Company logos
- File Limit: 512KB

### Event Media
- Quality: 80%
- Max Dimensions: 2048x2048px
- Target: Event photos, promotional images
- File Limit: 5MB

### Support Attachments
- Quality: 75%
- Max Dimensions: 1600x1600px
- Target: Support ticket screenshots
- File Limit: 3MB

## Browser Support

WebP is supported in all modern browsers:
- ✅ Chrome 23+
- ✅ Firefox 65+
- ✅ Safari 14+
- ✅ Edge 18+

If optimization fails (e.g., old browser), the original image is uploaded automatically.

## Example Results

### Avatar Upload
- Before: 1.2MB JPEG (1920x1920)
- After: 180KB WebP (512x512)
- **Savings: 85%**

### Brand Logo Upload
- Before: 850KB PNG (2000x2000)
- After: 220KB WebP (1024x1024)
- **Savings: 74%**

### Event Photo Upload
- Before: 3.5MB JPEG (4032x3024)
- After: 980KB WebP (2048x1536)
- **Savings: 72%**

## Troubleshooting

**Q: Will users notice quality loss?**
A: No. WebP at 80-90% quality is visually identical to original for most images.

**Q: What if a user uploads a WebP already?**
A: If already WebP and under 1MB, it's uploaded as-is. Otherwise, it's re-optimized.

**Q: Can users opt out of optimization?**
A: Yes, pass `skipOptimization: true` to the uploadFile function.

**Q: Does this work for PDFs or other files?**
A: No, only image files (JPEG, PNG, WebP) are optimized. Other files upload unchanged.

## Implementation Files

- **Optimizer Utility**: [`src/utils/imageOptimizer.ts`](../src/utils/imageOptimizer.ts)
- **Upload Function**: [`src/services/edgeFunctions.ts`](../src/services/edgeFunctions.ts)
- **Storage Config**: [`supabase/functions/_shared/storage-config.ts`](../supabase/functions/_shared/storage-config.ts)
