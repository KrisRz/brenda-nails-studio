# Video Background Instructions

## How to add nail polish/manicure video background

### Step 1: Download a video
Visit one of these free video sources:

1. **Pexels** (Recommended)
   - Go to: https://www.pexels.com/search/videos/nail%20polish/
   - Choose a video you like
   - Click "Free Download" 
   - Select "HD" or "Full HD" quality
   - Save as `nail-polish-background.mp4`

2. **Pixabay**
   - Go to: https://pixabay.com/videos/search/manicure/
   - Download in MP4 format
   - Rename to `nail-polish-background.mp4`

3. **Coverr**
   - Go to: https://coverr.co/search?q=beauty
   - Find nail/beauty related videos
   - Download and rename

### Step 2: Place the video file
- Put the downloaded `nail-polish-background.mp4` file in this folder: `apps/frontend/public/videos/`

### Step 3: Video specifications
For best performance:
- **Format**: MP4
- **Duration**: 10-30 seconds (it will loop)
- **Resolution**: 1920x1080 or smaller
- **File size**: Under 10MB for fast loading

### Step 4: Update the code (if needed)
The video will automatically be used as background. If you want to use a different filename, update the source in `Hero.tsx`:

```tsx
<source src="/videos/your-video-name.mp4" type="video/mp4" />
```

### Current setup:
- ✅ Video background structure is ready
- ✅ Animated gradient fallback
- ✅ Text overlay for readability
- ✅ Mobile responsive
- 📁 Just add your `nail-polish-background.mp4` file here!

### Recommended videos to search for:
- "nail polish application"
- "manicure process"
- "colorful nail polish bottles"
- "hands with nail art"
- "beauty salon manicure"
