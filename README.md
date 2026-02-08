# Tiptap UI Kit

<div align="center">

![Tiptap UI Kit](https://img.shields.io/badge/Tiptap-3.0-blue?style=flat-square)
![Vue](https://img.shields.io/badge/Vue-3.5-green?style=flat-square)
![License](https://img.shields.io/badge/License-Commercial-orange?style=flat-square)
![NPM](https://img.shields.io/badge/npm-v0.1.0-red?style=flat-square)

**A beautiful, AI-powered rich text editor for Vue 3**

[🌐 Live Demo](https://tiptap-ui-kit.vercel.app) · [📚 Documentation](#-documentation) · [✨ Features](#-features) · [💰 Get License](https://benngai.gumroad.com/l/tiptap-ui-kit-solo)

---

## 🎉 Early Bird Special - Limited Time!

<div align="center">

### **HK$49** ~~HK$380~~ - Save 87%!

**First 50 customers only** | Lifetime license | 30-day money-back guarantee

[**🛒 Get Solo License Now →**](https://benngai.gumroad.com/l/tiptap-ui-kit-solo)

*✅ Complete source code | ✅ 6 months updates | ✅ Email support*

</div>

---

## 🌟 Overview

Tiptap UI Kit is a premium, production-ready rich text editor built on top of [Tiptap 3](https://tiptap.dev/) and [Vue 3](https://vuejs.org/). It provides a beautiful, customizable editing experience with AI-powered features, multiple theme presets, and comprehensive internationalization support.

Perfect for building modern document editors, content management systems, note-taking apps, or any application requiring rich text editing capabilities.

## ✨ Features

### Core Features
- 🎨 **Premium Themes** - 5 beautiful theme presets (Default, Word, Notion, GitHub, Typora)
- 🌓 **Dark Mode** - Full light/dark mode support with smooth transitions
- 📝 **Word Mode** - Professional A4 paper layout with automatic pagination
- 🛠️ **Modular Architecture** - Enable only the features you need
- 🌍 **i18n Ready** - Built-in Chinese (Simplified/Traditional) and English support
- ♿ **Accessible** - WCAG compliant with keyboard navigation

### Editing Features
- ✏️ **Rich Text Formatting** - Bold, italic, underline, strikethrough, code, highlight
- 📑 **Headings** - H1-H6 with custom styles
- 📊 **Lists** - Ordered, unordered, and task lists
- 🎯 **Text Alignment** - Left, center, right, justify
- 🎨 **Colors** - Text color, background color, and highlight
- 🖼️ **Images** - Upload, resize, and drag-to-adjust
- 🔗 **Links** - Smart link editing with preview
- 📋 **Tables** - Full-featured table support with toolbar
- 💻 **Code Blocks** - Syntax highlighting with Lowlight
- 🔤 **Typography** - Font family, size, line height control
- 🎭 **Special Formats** - Subscript, superscript, format painter

### AI-Powered Features
- ✨ **Continue Writing** - AI completes your sentences and paragraphs
- 📝 **Polish Text** - Improve grammar, clarity, and style
- 🌐 **Translation** - Translate to 14+ languages
- 📄 **Summarize** - Extract key points from long text
- 🤖 **Custom AI** - Define your own AI transformations

### Advanced Features
- 🤝 **Real-time Collaboration** - Multi-user editing with Yjs
- 🖱️ **Drag & Drop** - Intuitive content reordering
- 🔍 **Search & Replace** - Find and replace text
- ⌨️ **Keyboard Shortcuts** - Productivity-focused shortcuts
- 📱 **Responsive** - Mobile, tablet, and desktop optimized
- 🎬 **Preview Mode** - Read-only rendering mode
- 📏 **Zoom Control** - Scale from 50% to 200%

## 📦 Installation

### Using npm

```bash
npm install tiptap-ui-kit
```

### Using pnpm

```bash
pnpm add tiptap-ui-kit
```

### Using yarn

```bash
yarn add tiptap-ui-kit
```

### Peer Dependencies

Tiptap UI Kit requires the following peer dependencies:

```bash
npm install @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/vue-3 vue
```

## 🚀 Quick Start

### Basic Usage

```vue
<template>
  <div class="editor-container">
    <TiptapProEditor
      v-model="content"
      :features="features"
      :locale="'en-US'"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { TiptapProEditor } from 'tiptap-ui-kit'
import 'tiptap-ui-kit/dist/tiptap-ui-kit.css'

const content = ref('')
const features = {
  heading: true,
  textFormat: true,
  list: true,
  align: true,
  link: true,
  image: true,
  table: true,
  codeBlock: true
}

const handleUpdate = ({ editor }) => {
  content.value = editor.getHTML()
  console.log('Content updated:', content.value)
}
</script>

<style>
.editor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
```

### Using Presets

For quick setup, use one of our preset configurations:

```vue
<script setup>
import { TiptapProEditor, PRESET_CONFIGS } from 'tiptap-ui-kit'
import 'tiptap-ui-kit/dist/tiptap-ui-kit.css'

// Available presets: minimal, basic, advanced, full
const features = PRESET_CONFIGS.advanced.features
</script>

<template>
  <TiptapProEditor :features="features" />
</template>
```

**Preset Levels:**
- `minimal` - Basic text formatting only (bold, italic, lists)
- `basic` - Common features (headings, alignment, links)
- `advanced` - All editing features (tables, code blocks, fonts)
- `full` - Everything including AI features

## 🎨 Theming

Tiptap UI Kit includes 5 beautiful theme presets that can be easily switched:

### Setting a Theme

```typescript
import { setTheme } from 'tiptap-ui-kit'

// Switch theme and mode
setTheme('notion', 'dark')  // Theme: notion, Mode: dark
setTheme('word', 'light')   // Theme: word, Mode: light
```

### Available Themes

| Theme | Description | Best For |
|-------|-------------|----------|
| `default` | Modern and clean | General purpose |
| `notion` | Minimalist Notion-style | Note-taking apps |
| `word` | Microsoft Word-like | Document editors |
| `github` | GitHub Markdown style | Developer tools |
| `typora` | Typora editor style | Writing apps |

### Custom Theming

Customize colors using CSS variables:

```css
:root {
  --tp-color-primary: #3b82f6;
  --tp-color-text: #1f2937;
  --tp-color-bg: #ffffff;
  --tp-color-border: #e5e7eb;
  --tp-menu-bg: #ffffff;
  --tp-menu-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dark {
  --tp-color-text: #f9fafb;
  --tp-color-bg: #1f2937;
  --tp-color-border: #374151;
  --tp-menu-bg: #111827;
}
```

## 🤖 AI Features

Enable powerful AI capabilities to enhance the writing experience.

### Setup

Create a `.env` file in your project root:

```bash
# Choose your AI provider
VITE_AI_PROVIDER=openai  # Options: openai, aliyun, deepseek, anthropic, ollama

# API Configuration
VITE_AI_API_KEY=sk-xxx
VITE_AI_BASE_URL=https://api.openai.com/v1  # Optional: custom endpoint
VITE_AI_MODEL=gpt-4o-mini  # Optional: specify model

# For Aliyun (阿里云)
VITE_AI_API_SECRET=your_secret  # Required for Aliyun
```

### Enabling AI Features

```vue
<script setup>
import { TiptapProEditor } from 'tiptap-ui-kit'

const features = {
  // ... other features
  ai: true,  // Enable all AI features
  continueWriting: true,  // Or enable individually
  polish: true,
  translation: true,
  summarize: true,
  customAi: true
}
</script>

<template>
  <TiptapProEditor :features="features" />
</template>
```

### Available AI Features

#### 1. Continue Writing
AI automatically completes your text based on context.

```typescript
// Triggered by: Select text → AI menu → Continue Writing
// Or use keyboard shortcut
```

#### 2. Polish Text
Improve grammar, clarity, and writing style.

```typescript
// Use cases:
// - Fix grammar mistakes
// - Improve sentence structure
// - Enhance readability
```

#### 3. Translation
Translate selected text to 14+ languages.

Supported languages:
- English, Chinese (Simplified/Traditional)
- Japanese, Korean, French, German
- Spanish, Portuguese, Russian, Arabic
- Italian, Dutch, Thai, Vietnamese

#### 4. Summarize
Extract key points from long text.

```typescript
// Perfect for:
// - Long articles
// - Meeting notes
// - Research papers
```

#### 5. Custom AI
Define your own AI transformations with custom prompts.

```typescript
// Example: Transform text tone
// "Make this more professional"
// "Simplify for beginners"
// "Add more technical details"
```

### Supported AI Providers

| Provider | Models | Notes |
|----------|--------|-------|
| OpenAI | GPT-4, GPT-4-Turbo, GPT-3.5 | Recommended |
| Anthropic | Claude 3, Claude 2 | High quality |
| DeepSeek | DeepSeek-V2 | Cost-effective |
| Aliyun | Qwen models | China users |
| Ollama | Local models | Privacy-focused |

## 📚 Documentation

### Component API

#### TiptapProEditor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| object` | `''` | Editor content (HTML or JSON) |
| `features` | `FeatureFlags` | `{}` | Enable/disable features |
| `locale` | `'zh-CN' \| 'zh-TW' \| 'en-US'` | `'en-US'` | Interface language |
| `readonly` | `boolean` | `false` | Read-only mode |
| `previewMode` | `boolean` | `false` | Preview mode (hides toolbar) |
| `placeholder` | `string` | `''` | Placeholder text |
| `initialContent` | `string \| object` | `''` | Initial editor content |
| `tableMenuShowMode` | `1 \| 2` | `1` | Table menu display mode |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update` | `{ editor }` | Content changed |
| `focus` | `{ editor, event }` | Editor focused |
| `blur` | `{ editor, event }` | Editor blurred |
| `ready` | `{ editor }` | Editor initialized |

### Feature Flags

```typescript
interface FeatureFlags {
  // Basic features
  heading?: boolean
  textFormat?: boolean
  list?: boolean
  align?: boolean
  color?: boolean
  image?: boolean
  link?: boolean

  // Advanced features
  table?: boolean
  codeBlock?: boolean
  font?: boolean
  formatPainter?: boolean
  subscriptSuperscript?: boolean
  zoom?: boolean

  // Tools
  headerNav?: boolean
  footerNav?: boolean
  floatingMenu?: boolean
  dragHandleMenu?: boolean
  linkBubbleMenu?: boolean

  // AI features
  ai?: boolean
  continueWriting?: boolean
  polish?: boolean
  translation?: boolean
  summarize?: boolean
  customAi?: boolean

  // Collaboration
  collaboration?: boolean
}
```

## 💡 Examples

### Word Document Mode

Create a professional document editor with A4 layout:

```vue
<template>
  <TiptapProEditor
    :features="{
      heading: true,
      textFormat: true,
      list: true,
      align: true,
      table: true,
      image: true,
      footerNav: true,  // Shows page numbers
      zoom: true  // Allow zoom control
    }"
    :locale="'en-US'"
    class="word-mode"
  />
</template>

<style>
.word-mode {
  /* A4 paper layout is built-in */
  /* Automatic pagination */
}
</style>
```

### Notion-Style Editor

Minimal interface with floating menus:

```vue
<template>
  <TiptapProEditor
    :features="{
      ...PRESET_CONFIGS.notion.features,
      floatingMenu: true,
      dragHandleMenu: true,
      linkBubbleMenu: true
    }"
  />
</template>

<script setup>
import { onMounted } from 'vue'
import { setTheme, PRESET_CONFIGS } from 'tiptap-ui-kit'

onMounted(() => {
  setTheme('notion', 'dark')
})
</script>
```

### Collaborative Editor

Enable real-time multi-user editing:

```vue
<template>
  <TiptapProEditor
    :features="{
      ...PRESET_CONFIGS.advanced.features,
      collaboration: true
    }"
    :document-id="documentId"
  />
</template>

<script setup>
import { ref } from 'vue'

const documentId = ref('unique-document-id')
</script>
```

### Read-Only Preview

Display content without editing:

```vue
<template>
  <TiptapProEditor
    :initial-content="content"
    :preview-mode="true"
    :readonly="true"
  />
</template>
```

## 🗺️ Roadmap

- [ ] Plugin marketplace
- [ ] More AI providers (Gemini, Cohere)
- [ ] Block-based editor mode
- [ ] Comments and annotations
- [ ] Version history
- [ ] Export to PDF/Word
- [ ] Mobile app components
- [ ] VSCode extension

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/benngaihk/Tiptap-UI-Kit.git
cd Tiptap-UI-Kit

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run type checking
pnpm typecheck
```

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## ⭐ Support

If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs via [GitHub Issues](https://github.com/benngaihk/Tiptap-UI-Kit/issues)
- 💡 Suggesting features
- 🔀 Submitting pull requests

## 🔗 Links

- [Demo](https://tiptap-ui-kit.vercel.app) (Coming soon)
- [Documentation](https://github.com/benngaihk/Tiptap-UI-Kit)
- [Changelog](CHANGELOG.md)
- [Tiptap Official](https://tiptap.dev)
- [Vue 3](https://vuejs.org)

## 📄 License

This project is licensed under a Commercial License. See [LICENSE](LICENSE) for details.

For licensing inquiries, please contact the author.

---

<div align="center">

**Built with ❤️ using [Tiptap](https://tiptap.dev) and [Vue 3](https://vuejs.org)**

[⬆ Back to Top](#tiptap-ui-kit)

</div>
