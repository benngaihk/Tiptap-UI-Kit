# Screenshots & Demo Media Guide

This guide explains how to create high-quality screenshots and demo videos for Tiptap UI Kit.

## 📸 Screenshot Requirements

### What to Capture

1. **Hero Screenshot** - Main editor view
   - Full editor with toolbar
   - Sample content showing various formatting
   - Light mode, clean background
   - Resolution: 1920x1080 or higher

2. **Theme Variations** - Each theme preset
   - Default theme (light & dark)
   - Word theme
   - Notion theme
   - GitHub theme
   - Typora theme

3. **Feature Highlights**
   - AI features in action
   - Table editing
   - Code block with syntax highlighting
   - Image handling
   - Collaboration cursors
   - Word mode (A4 layout)

4. **UI Components**
   - Toolbar (expanded)
   - Floating menu
   - Drag handle menu
   - Link bubble menu
   - Table toolbar
   - Settings panel

## 🎬 Demo Video Ideas

### Quick Feature Demo (30-60 seconds)
- Show editor initialization
- Basic text formatting
- AI feature (continue writing or polish)
- Theme switching
- Export/preview

### Full Walkthrough (2-3 minutes)
- Introduction
- Installation process
- Configuration options
- All major features
- Customization examples

## 🛠️ Tools for Screenshots

### macOS

**Built-in Screenshot Tool**
```bash
# Full screen
Cmd + Shift + 3

# Selected area
Cmd + Shift + 4

# Window
Cmd + Shift + 4, then Space
```

**CleanShot X** (Recommended)
- Clean backgrounds
- Annotations
- Scrolling capture
- [Download](https://cleanshot.com)

### Windows

**Snipping Tool**
```
Win + Shift + S
```

**ShareX** (Free, Powerful)
- Screen recording
- Annotations
- Auto-upload
- [Download](https://getsharex.com)

### Browser Extensions

**Awesome Screenshot**
- Full page capture
- Annotations
- Chrome/Firefox

**Fireshot**
- Capture entire page
- Edit in browser

## 🎥 Tools for Screen Recording

### macOS

**QuickTime Player** (Built-in)
```
File → New Screen Recording
```

**Screen Studio** (Professional)
- Automatic zoom
- Cursor highlighting
- [Download](https://www.screen.studio)

### Windows

**OBS Studio** (Free)
- Professional recording
- Live streaming
- [Download](https://obsproject.com)

**Camtasia** (Paid)
- Recording + Editing
- Annotations

### Cross-Platform

**Loom**
- Quick recordings
- Instant sharing
- [Website](https://loom.com)

**ScreenFlow** (macOS)
**Screencast-O-Matic** (All platforms)

## 📝 Screenshot Checklist

Before taking screenshots:

- [ ] Run the demo app (`pnpm dev`)
- [ ] Set browser zoom to 100%
- [ ] Use incognito mode (no extensions)
- [ ] Clear browser cache
- [ ] Close unnecessary tabs
- [ ] Hide bookmarks bar
- [ ] Use a clean background
- [ ] Prepare sample content

### Sample Content

Use this content for screenshots:

```markdown
# Welcome to Tiptap UI Kit

A **beautiful**, *AI-powered* rich text editor for Vue 3.

## Features

- Rich text formatting
- AI-powered writing assistance
- Multiple theme presets
- Real-time collaboration

### Code Example

\`\`\`typescript
import { TiptapProEditor } from 'tiptap-ui-kit'

const editor = new TiptapProEditor({
  features: {
    ai: true,
    collaboration: true
  }
})
\`\`\`

> This is a beautiful editor with amazing features!
```

## 🎨 Screenshot Composition

### Good Screenshot Practices

✅ **Clear and focused**
- One main subject per screenshot
- Remove distractions
- Good lighting/contrast

✅ **Consistent style**
- Same browser
- Same theme
- Same dimensions
- Same font size

✅ **Show real use**
- Realistic content
- Actual UI state
- No Lorem Ipsum (use meaningful text)

✅ **High resolution**
- At least 1920x1080
- Retina display preferred
- PNG format for quality

### Bad Screenshot Practices

❌ Blurry or low resolution
❌ Too much empty space
❌ Inconsistent styling
❌ Cluttered background
❌ Debug tools visible
❌ Personal information visible

## 📐 Recommended Dimensions

| Type | Dimensions | Use Case |
|------|------------|----------|
| Hero | 1920x1080 | README, website hero |
| Feature | 1280x720 | Feature highlights |
| UI Detail | 800x600 | Component closeups |
| Mobile | 375x812 | Mobile responsive |
| Social | 1200x630 | Social media cards |

## 🖼️ Organizing Screenshots

Create a `screenshots/` directory:

```
screenshots/
├── hero.png                 # Main hero image
├── themes/
│   ├── default-light.png
│   ├── default-dark.png
│   ├── word.png
│   ├── notion.png
│   ├── github.png
│   └── typora.png
├── features/
│   ├── ai-writing.png
│   ├── collaboration.png
│   ├── tables.png
│   ├── code-blocks.png
│   └── word-mode.png
└── ui/
    ├── toolbar.png
    ├── floating-menu.png
    ├── drag-handle.png
    └── settings.png
```

## 🎞️ Video Guidelines

### Best Practices

1. **Keep it short** - 30-60 seconds for features, max 3 minutes for full demos
2. **Show, don't tell** - Let the UI speak for itself
3. **Smooth motion** - No jerky mouse movements
4. **Clear audio** - If narrating, use a good mic
5. **Add captions** - Make it accessible

### Recording Checklist

- [ ] Close all other applications
- [ ] Disable notifications
- [ ] Set display to 1080p
- [ ] Record at 60fps
- [ ] Use a clean profile/workspace
- [ ] Plan your actions beforehand
- [ ] Do a practice run
- [ ] Edit out mistakes

### Video Formats

- **MP4** - Best compatibility
- **WebM** - Good for web
- **GIF** - Short loops (< 10 seconds)

### Compression

Use [HandBrake](https://handbrake.fr/) to compress videos:
- Target size: < 10MB for README
- Format: H.264, MP4
- Quality: 20-23 RF

## 🌐 Hosting Media

### Images

**GitHub**
- Store in repository (`/screenshots` or `/media`)
- Reference in README
- Free, version controlled

**Imgur** (Free)
- Quick uploads
- Direct links
- No account needed

**Cloudinary** (Free tier)
- CDN delivery
- Image transformations
- Fast loading

### Videos

**YouTube**
- Long-form demos
- Unlisted option available
- Good for tutorials

**Vimeo**
- Professional look
- Ad-free
- Better for demos

**GitHub Releases**
- Attach to releases
- Version specific
- Reliable hosting

**GIF for Loops**
- Convert short videos to GIF
- Use [ezgif.com](https://ezgif.com/)
- Keep under 5MB

## 📋 Media Checklist

Before publishing:

- [ ] All screenshots are high quality
- [ ] Consistent theme across images
- [ ] Videos are compressed
- [ ] Alt text added to all images
- [ ] Media properly organized
- [ ] File names are descriptive
- [ ] Images optimized for web
- [ ] No sensitive information visible

## 🔗 Adding to README

### Images

```markdown
![Hero Image](screenshots/hero.png)

## Features

### AI-Powered Writing

![AI Writing](screenshots/features/ai-writing.png)

### Beautiful Themes

<div align="center">
  <img src="screenshots/themes/default-light.png" width="45%" alt="Light Theme" />
  <img src="screenshots/themes/default-dark.png" width="45%" alt="Dark Theme" />
</div>
```

### Videos

```markdown
## Demo

[Watch the demo video](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

Or view a quick GIF:

![Quick Demo](screenshots/demo.gif)
```

## 📊 Example Screenshot

Here's the recommended flow for creating screenshots:

1. Start the dev server
   ```bash
   pnpm dev
   ```

2. Navigate to http://localhost:5173

3. Open browser DevTools and set to desired viewport

4. Insert sample content

5. Apply desired theme

6. Take screenshots using Cmd+Shift+4 (macOS) or Win+Shift+S (Windows)

7. Save to `screenshots/` directory

8. Optimize images
   ```bash
   # Using imagemagick
   magick convert input.png -quality 85 output.png

   # Or use online tools like tinypng.com
   ```

9. Commit and push
   ```bash
   git add screenshots/
   git commit -m "docs: add screenshots"
   git push
   ```

## 🎯 Next Steps

1. Create screenshots following this guide
2. Record a demo video
3. Update README.md with media
4. Add to GitHub repository
5. Share on social media

---

**Need inspiration?** Check out these projects:
- [Tiptap Examples](https://tiptap.dev/examples)
- [Notion](https://notion.so)
- [Linear](https://linear.app)

**Questions?** [Open an issue](https://github.com/benngaihk/Tiptap-UI-Kit/issues)
