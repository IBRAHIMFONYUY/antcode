# Quick Setup: Professional Images for AntCodeHub

## 🚀 5-Minute Setup

### Step 1: Choose Your Image Source
Pick one of these free services:

**Option A: Unsplash (Easiest)**
- Website: https://unsplash.com
- No API key needed for basic URLs
- No attribution required
- Highest quality

**Option B: Pexels (API)**
- Get API key: https://www.pexels.com/api/
- Add to `.env.local`:
  ```
  NEXT_PUBLIC_PEXELS_API_KEY=your_key_here
  ```

**Option C: Pixabay**
- Get API key: https://pixabay.com/api/
- Similar to Pexels

### Step 2: Update Expert Data

**Before:**
```javascript
// src/lib/data.ts or Firebase
{
  imageUrl: 'https://picsum.photos/seed/user1/500/500'
}
```

**After:**
```javascript
{
  imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop'
}
```

### Step 3: Test Images
1. Save your changes
2. Run `npm run dev`
3. Go to `/experts` page
4. Verify images display correctly

---

## 🎯 Recommended Images by Section

### Expert Portraits
Use these search terms on Unsplash:
- "professional headshot"
- "tech expert"
- "software engineer"
- "career mentor"

**Example URL:**
```
https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&q=80
```

### Hero/Banner Images
- "professional team"
- "tech career"
- "mentorship"
- "coding collaboration"

**Example URL:**
```
https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=800&fit=crop
```

### Course Thumbnails
- "learning"
- "coding"
- "development"
- "javascript" (or specific tech)

---

## 💻 Code Examples

### 1. Static Professional Images

**Update data.ts:**
```typescript
// src/lib/data.ts
export const experts = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Senior Software Engineer',
    company: 'Google',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    expertise: ['React', 'Node.js', 'TypeScript'],
    bio: '10+ years experience in full-stack development'
  },
  // ... more experts
];
```

### 2. API Integration (Dynamic)

**Create utils/images.ts:**
```typescript
export async function getUnsplashImages(query: string, count = 10) {
  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=${count}`,
    {
      headers: {
        'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_KEY}`
      }
    }
  );
  
  const data = await response.json();
  return data.results.map(photo => ({
    url: photo.urls.regular,
    alt: photo.alt_description,
    author: photo.user.name
  }));
}
```

**Use in Components:**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { getUnsplashImages } from '@/utils/images';

export function ExpertGrid() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getUnsplashImages('professional tech expert').then(setImages);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <img
          key={image.url}
          src={image.url}
          alt={image.alt}
          className="rounded-2xl shadow-lg object-cover"
        />
      ))}
    </div>
  );
}
```

### 3. Environment Setup

**Create .env.local:**
```bash
# Unsplash (optional)
NEXT_PUBLIC_UNSPLASH_KEY=your_access_key

# Pexels
NEXT_PUBLIC_PEXELS_API_KEY=your_api_key

# Pixabay
NEXT_PUBLIC_PIXABAY_API_KEY=your_api_key
```

---

## 🖼️ Image Dimensions Guide

### Standard Sizes
```
Profile Pictures:     500x500px   (1:1)
Expert Cards:         500x625px   (4:5)
Hero Banner:          1920x600px  (16:5)
Course Card:          300x200px   (3:2)
Background:           1920x1080px (16:9)
Thumbnail:            400x300px   (4:3)
```

### Implementation
```typescript
// Use these in Image component
<Image
  src={url}
  alt={description}
  width={500}
  height={625}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}
  priority={false}
/>
```

---

## ✅ Quality Checklist

- [ ] Images load without 404 errors
- [ ] Images display at correct aspect ratio
- [ ] Images are centered properly
- [ ] Hover effects work smoothly
- [ ] Images load on mobile
- [ ] Dark mode images are visible
- [ ] Loading is fast (<2s per image)
- [ ] No broken images on refresh

---

## 🔧 Troubleshooting

### Images Not Loading
```typescript
// Check URL format
// ✅ https://images.unsplash.com/...?w=500&h=500
// ❌ https://images.unsplash.com/... (no params)

// Verify quality parameter
// ?w=500&h=500&fit=crop&q=80
```

### CORS Issues
```typescript
// Use crossOrigin attribute
<img crossOrigin="anonymous" src={url} />
// Or in Next.js Image
<Image crossOrigin="anonymous" src={url} />
```

### Performance Issues
```typescript
// Add quality reduction
// ?q=80 (default 75-85)

// Add loading strategy
loading="lazy"  // For below-fold

// Implement blur effect
placeholder="blur"
blurDataURL={...}
```

---

## 📝 File Updates Needed

1. **src/lib/data.ts**
   - Update expert imageUrl fields
   - Update course thumbnail URLs
   - Update company/mentor images

2. **Create utils/images.ts** (optional)
   - Add API functions
   - Add image cache
   - Add error handling

3. **.env.local**
   - Add API keys
   - Add configuration

---

## 🎨 Pro Image Tips

### 1. Use Consistent Filters
Apply same filter to all images:
```
?w=500&h=500&fit=crop&q=80&auto=format
```

### 2. Add Overlays
```html
<div className="relative">
  <img src={url} />
  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
</div>
```

### 3. Lazy Load Images
```typescript
<Image
  loading="lazy"
  quality={80}
/>
```

### 4. Fallback Images
```typescript
<img 
  src={expertImage} 
  onError={(e) => {
    e.currentTarget.src = '/default-avatar.png'
  }}
/>
```

---

## 📚 Resources

### APIs & Services
- [Unsplash API](https://unsplash.com/developers)
- [Pexels API](https://www.pexels.com/api/)
- [Pixabay API](https://pixabay.com/api/docs/)

### Next.js
- [Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Image Component](https://nextjs.org/docs/app/api-reference/components/image)

### Performance
- [Web.dev Images](https://web.dev/images/)
- [Image Optimization Tools](https://web.dev/optimizing-content-efficiency-images/)

---

## 🎯 Next: Implement Now

1. Pick an image source (I recommend Unsplash)
2. Copy 3-5 professional image URLs
3. Update `src/lib/data.ts` with real URLs
4. Run `npm run dev`
5. Check `/experts` page
6. Iterate with more images

**Estimated Time: 10 minutes**

---

**Last Updated:** May 28, 2026
