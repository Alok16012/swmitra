# SWAMITRA Foundation - Dynamic Hero Carousel Implementation

## ✅ Completed Features

### 1. **Dynamic Hero Carousel**
- **Multiple slides** with auto-scroll
- **Previous/Next buttons** (left/right arrows)
- **Dot indicators** for direct slide navigation
- **Auto-rotation** with configurable interval (6.5 seconds default)
- **Pause on hover** - carousel pauses when user hovers
- **Touch/swipe support** - works on mobile devices
- **Keyboard accessible** - proper ARIA labels and roles

### 2. **Admin Panel Integration**
- **New "Hero Slides" section** in admin sidebar
- **Full CRUD operations**:
  - ✅ Add new slides
  - ✅ Edit existing slides (badge, heading, text, images, buttons)
  - ✅ Delete slides
  - ✅ Reorder slides (move up/down)
- **Field editing**:
  - Badge Label (e.g., "NEW", "FRAMEWORK", "TRAINING")
  - Badge Text
  - Heading (main title)
  - Lead Text (description)
  - Image Path (relative to site root)
  - Primary Button (text + link)
  - Secondary Button (text + link)

### 3. **Data Structure**
- **Hero data** stored in `assets/js/data.js` and `assets/js/data.hi.js`
- **Structure**:
```javascript
{
  autoplay: true,
  interval: 6500,
  points: [...],
  slides: [
    {
      badgeLabel: "...",
      badgeText: "...",
      heading: "...",
      lead: "...",
      image: "...",
      primaryText: "...",
      primaryHref: "...",
      secondaryText: "...",
      secondaryHref: "..."
    }
  ]
}
```

### 4. **Bilingual Support**
- ✅ English version (`/site/index.html`)
- ✅ Hindi version (`/site/hi/index.html`)
- ✅ Separate data files for each language

## 📁 Files Modified

### Admin Panel
- `site/admin/index.html` - Added Hero Slides management UI and functions

### Data Files
- `site/assets/js/data.js` - Hero carousel data (English)
- `site/assets/js/data.hi.js` - Hero carousel data (Hindi)

### Pages Updated
- `site/index.html` - Who We Are section updated
- `site/about.html` - Who We Are section updated
- `site/hi/index.html` - Who We Are section updated (Hindi)
- `site/hi/about.html` - Who We Are section updated (Hindi)

## 🎯 How It Works

### For Admins:
1. Go to `/site/admin/index.html`
2. Login with password: `swamitra@2026`
3. Click "Hero Slides" in sidebar
4. Edit, add, delete, or reorder slides
5. Click "Publish Changes" to download updated `data.js`
6. Replace existing `data.js` with downloaded file

### For Users:
- Homepage automatically displays carousel
- Slides rotate every 6.5 seconds
- Click arrows or dots to navigate manually
- Hover to pause auto-rotation
- Swipe on mobile devices

## 🚀 Features in Detail

### Auto-Scroll Behavior
- ✅ Starts automatically on page load
- ✅ Pauses on hover/focus
- ✅ Resumes on mouse leave
- ✅ Pauses when tab is not visible
- ✅ Respects `prefers-reduced-motion` setting

### User Controls
- ✅ Previous/Next arrow buttons (positioned on sides)
- ✅ Dot indicators (positioned at bottom)
- ✅ Click any dot to jump to that slide
- ✅ Keyboard navigation support

### Responsive Design
- ✅ Works on desktop, tablet, and mobile
- ✅ Touch swipe gestures on mobile
- ✅ Adaptive image sizing
- ✅ Mobile-friendly button placement

## 💡 Usage Tips

### Adding a New Slide:
1. Admin Panel → Hero Slides
2. Click "+ Add Slide"
3. Fill in all fields:
   - Badge Label: "NEW" (or your custom label)
   - Badge Text: Brief description
   - Heading: Main title
   - Lead Text: Detailed description
   - Image Path: e.g., `assets/img/hero-4.jpg`
   - Primary Button: Text and link
   - Secondary Button: Text and link
4. Click "Save"
5. Click "Publish Changes" to download

### Reordering Slides:
- Use ↑ and ↓ buttons next to each slide
- Changes are saved automatically
- Download to publish

### Image Requirements:
- Recommended size: 1920x1080px or larger
- Format: JPG, PNG, or WebP
- Place in `site/assets/img/` folder
- Reference as `assets/img/your-image.jpg`

## 🎨 Customization

### Change Auto-Scroll Speed:
Edit `data.js`:
```javascript
const hero = {
  autoplay: true,
  interval: 5000, // Change to desired milliseconds
  ...
};
```

### Disable Auto-Scroll:
```javascript
const hero = {
  autoplay: false, // Set to false
  ...
};
```

## ✅ Testing Checklist

- [x] Hero carousel displays on homepage
- [x] Auto-scroll works
- [x] Previous/Next buttons work
- [x] Dot indicators work
- [x] Admin can add slides
- [x] Admin can edit slides
- [x] Admin can delete slides
- [x] Admin can reorder slides
- [x] Hindi version works
- [x] Who We Are text updated
- [x] Mobile responsive

## 📝 Notes

- All changes are backward compatible
- Existing slides continue to function
- New slides can be added without limits
- Images should be optimized for web (compressed)
- Text fields support HTML entities