# Tiptap UI Kit

<div align="center">

![Tiptap UI Kit](https://img.shields.io/badge/Tiptap-3.0-blue?style=flat-square)
![Vue](https://img.shields.io/badge/Vue-3.5-green?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![NPM](https://img.shields.io/npm/v/tiptap-ui-kit?style=flat-square)

**The best open-source Tiptap rich text editor template for Vue 3 — production-ready, AI-powered, with 5 themes**

Built on [Tiptap 3](https://tiptap.dev/) + [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/) + [ProseMirror](https://prosemirror.net/)

[🌐 Live Demo](https://tiptap-ui-kit.vercel.app) · [📚 Documentation](#-documentation) · [✨ Features](#-features) · [🤝 Contributing](#-contributing)

---

⭐ **Star us on GitHub — it motivates us a lot!**

[![GitHub stars](https://img.shields.io/github/stars/benngaihk/Tiptap-UI-Kit?style=social)](https://github.com/benngaihk/Tiptap-UI-Kit)
[![GitHub forks](https://img.shields.io/github/forks/benngaihk/Tiptap-UI-Kit?style=social)](https://github.com/benngaihk/Tiptap-UI-Kit)

</div>

---

> **Looking for a Tiptap Vue 3 template?** Tiptap UI Kit is an open-source, drop-in Vue 3 rich text editor component with Notion-like / Word-like themes, built-in AI writing assistance, real-time collaboration, and full TypeScript support. If you need a WYSIWYG editor for your Vue project — CMS, knowledge base, note-taking app, or document editor — this is the template to start with.

## 🌟 Why Tiptap UI Kit?

Tiptap UI Kit is a **fully open-source**, production-ready rich text editor UI kit that brings together the best of modern web technologies. It is the most feature-complete Tiptap + Vue 3 editor template available.

### Compared to alternatives

| Feature | Tiptap UI Kit | Raw Tiptap | Other Vue Editors |
|---------|:------------:|:----------:|:-----------------:|
| Ready-to-use Vue 3 component | Yes | No (headless) | Varies |
| Multiple theme presets (Notion/Word/GitHub) | 5 themes | None | 0-1 |
| Built-in AI writing assistance | Yes | No | No |
| Real-time collaboration (Yjs) | Yes | Paid add-on | Rare |
| Dark mode | Yes | DIY | Varies |
| i18n (EN/ZH-CN/ZH-TW) | Yes | No | Rare |
| TypeScript support | Full | Full | Partial |
| MIT License | Yes | Yes | Varies |

### Key highlights

- 🎨 **5 Beautiful Theme Presets** — Notion-like, Word-like (A4 pagination), GitHub, Typora, and Default
- 🤖 **AI-Powered Features** — Continue writing, polish text, translate, summarize, custom AI commands (OpenAI-compatible)
- 🌓 **Perfect Dark Mode** — Seamless light/dark theme switching across all themes
- 🛠️ **Modular Architecture** — Use only what you need, tree-shakeable
- 🌍 **i18n Ready** — Chinese (Simplified/Traditional) and English support
- 💯 **100% Free & Open Source** — MIT licensed, free for commercial use

Perfect for building modern document editors, content management systems, note-taking apps, knowledge bases, or any Vue 3 application requiring rich text editing capabilities.

---

## ✨ Features

### 🎨 Core Features

- **Premium Themes** - 5 professionally designed theme presets:
  - Default - Clean and minimal
  - **Word** - Microsoft Word-like professional layout with A4 pages
  - **Notion** - Modern, distraction-free editing experience
  - GitHub - Developer-friendly markdown style
  - Typora - Elegant reading and writing

- **Dark Mode** - Full light/dark mode support with smooth transitions

- **Word Mode** - Professional A4 paper layout with automatic pagination

- **Modular Architecture** - Enable only the features you need, keep bundle size small

- **Internationalization** - Built-in support for:
  - 简体中文 (Simplified Chinese)
  - 繁體中文 (Traditional Chinese)
  - English

- **Accessible** - WCAG compliant with full keyboard navigation

### ✏️ Rich Text Editing

- **Text Formatting** - Bold, italic, underline, strikethrough, code, highlight
- **Headings** - H1-H6 with custom styles per theme
- **Lists** - Ordered, unordered, and task lists with nested support
- **Text Alignment** - Left, center, right, justify
- **Colors** - Text color, background color, and highlight with color picker
- **Images** - Upload, resize, drag-to-adjust with intuitive controls
- **Links** - Smart link editing with preview bubble
- **Tables** - Full-featured table support with merge, split, and styling
- **Code Blocks** - Syntax highlighting powered by Lowlight
- **Typography** - Font family, size, line height control
- **Special Formats** - Subscript, superscript, format painter
- **Math Formulas** - KaTeX-powered inline and block math equations

### 🤖 AI-Powered Features

**Note:** AI features work with any OpenAI-compatible API. Configure your own API key in the AI Settings.

- **✨ Continue Writing** - AI completes your sentences and paragraphs intelligently
- **📝 Polish Text** - Improve grammar, clarity, and style automatically
- **🌐 Translation** - Translate to 14+ languages with one click
- **📄 Summarize** - Extract key points from long text
- **🤖 Custom AI Commands** - Define your own AI transformations

**Supported AI Providers:**
- OpenAI (GPT-4, GPT-3.5)
- 阿里云通义千问 (Aliyun Qianwen)
- DeepSeek
- Ollama (local deployment)
- Any OpenAI-compatible API

### 🚀 Advanced Features

- **Real-time Collaboration** - Multi-user editing powered by Yjs
- **Drag & Drop** - Intuitive content reordering with visual feedback
- **Search & Replace** - Find and replace text across the document
- **Keyboard Shortcuts** - Productivity-focused shortcuts for power users
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Preview Mode** - Read-only rendering for content review
- **Zoom Control** - Scale from 50% to 200%
- **Version History** - Track and restore previous versions
- **Format Painter** - Copy formatting across content
- **Paste Support** - Smart paste from Word, Excel, and web pages

---

## 📦 Installation

### From npm

```bash
# Using npm
npm install tiptap-ui-kit

# Using pnpm (recommended)
pnpm add tiptap-ui-kit

# Using yarn
yarn add tiptap-ui-kit
```

### Peer Dependencies

Tiptap UI Kit requires the following peer dependencies:

```bash
pnpm add @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/vue-3 vue
```

---

## 🚀 Quick Start

### Basic Usage

```vue
<template>
  <TiptapProEditor
    v-model="content"
    :theme="theme"
    :locale="locale"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TiptapProEditor } from 'tiptap-ui-kit'
import 'tiptap-ui-kit/style.css'

const content = ref('<p>Hello Tiptap UI Kit!</p>')
const theme = ref('notion')  // default | word | notion | github | typora
const locale = ref('en-US')   // en-US | zh-CN | zh-TW
</script>
```

### With AI Features

```vue
<template>
  <TiptapProEditor
    v-model="content"
    :ai-config="{
      provider: 'openai',
      apiKey: 'your-api-key',
      model: 'gpt-4o-mini'
    }"
  />
</template>
```

**🔒 Security Note:** Never hardcode API keys in production. Use environment variables or let users configure their own keys via the AI Settings modal.

### Advanced Configuration

```vue
<template>
  <TiptapProEditor
    v-model="content"
    :theme="theme"
    :locale="locale"
    :readonly="false"
    :word-mode="true"
    :dark-mode="isDark"
    :show-toolbar="true"
    :show-footer="true"
    :placeholder="'Start writing...'"
    @update:modelValue="handleUpdate"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TiptapProEditor } from 'tiptap-ui-kit'
import 'tiptap-ui-kit/style.css'

const content = ref('')
const theme = ref('word')
const locale = ref('zh-CN')
const isDark = ref(false)

const handleUpdate = (newContent) => {
  console.log('Content updated:', newContent)
}
</script>
```

---

## 📚 Documentation

### Themes

Tiptap UI Kit comes with 5 professionally designed themes:

| Theme | Description | Best For |
|-------|-------------|----------|
| **default** | Clean and minimal design | General purpose editing |
| **word** | Microsoft Word-like with A4 pages | Formal documents, reports |
| **notion** | Modern, distraction-free | Note-taking, knowledge base |
| **github** | Developer-friendly markdown | Technical documentation |
| **typora** | Elegant reading/writing | Long-form content, blogs |

```vue
<TiptapProEditor theme="notion" />
```

### Localization

Supported languages: `en-US`, `zh-CN`, `zh-TW`

```vue
<TiptapProEditor locale="zh-CN" />
```

### AI Configuration

Configure AI features via props or the built-in settings modal:

```typescript
interface AiConfig {
  provider: 'openai' | 'aliyun' | 'deepseek' | 'ollama'
  apiKey: string
  baseUrl?: string  // Optional custom endpoint
  model?: string    // Optional model name
}
```

### API Reference

Full API documentation is available in the [API.md](API.md) file.

---


## 💡 Use Cases

Tiptap UI Kit is ideal for:

- **CMS / Content Management Systems** — Drop-in editor component for admin panels (similar to WordPress Gutenberg, but Vue-native)
- **Knowledge Base / Wiki** — Notion-like editing experience with collaboration support
- **Note-Taking Applications** — Rich text editing with AI-powered writing assistance
- **Document Editors** — Word-like A4 pagination mode for formal documents and reports
- **Blog Platforms** — Typora/GitHub-style markdown editing with live preview
- **SaaS Applications** — Any Vue 3 app that needs embedded rich text editing
- **Educational Platforms** — Math formula support (KaTeX) and collaborative editing
- **Email Composers** — Rich formatting with clean HTML output

### Searching for...?

If you're looking for any of the following, Tiptap UI Kit is a great fit:

- Tiptap Vue 3 template / boilerplate / starter kit
- Vue 3 rich text editor component
- Vue WYSIWYG editor with AI
- Notion-like editor for Vue
- Word-like document editor for Vue
- ProseMirror Vue 3 wrapper
- Open-source alternative to Tiptap Editor (paid)
- Vue 3 collaborative text editor
- Tiptap dark mode theme
- Tiptap Chinese / i18n support

---

## 🛠️ Development

### Setup

```bash
# Clone the repository
git clone https://github.com/benngaihk/Tiptap-UI-Kit.git
cd Tiptap-UI-Kit

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build

```bash
# Build library
pnpm build

# Build demo site
pnpm build:demo

# Run type checking
pnpm typecheck

# Run tests
pnpm test
```

### Project Structure

```
src/
├── ai/                  # AI features (continue writing, polish, etc.)
├── core/                # Core editor components
├── extensions/          # Tiptap extensions
├── features/            # Toolbar features (basic & advanced)
├── locales/             # Internationalization
├── themes/              # Theme presets
├── tools/               # Optional tools (collaboration, etc.)
└── ui/                  # Reusable UI components
```

---

## 🤝 Contributing

We love contributions! Whether it's bug reports, feature requests, or pull requests - all contributions are welcome.

### How to Contribute

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🎉 Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for more details.

### Development Guidelines

- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style
- Ensure all tests pass before submitting

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request?

- 🐛 [Report a Bug](https://github.com/benngaihk/Tiptap-UI-Kit/issues/new?template=bug_report.md)
- 💡 [Request a Feature](https://github.com/benngaihk/Tiptap-UI-Kit/issues/new?template=feature_request.md)

---

## 💖 Support the Project

If you find Tiptap UI Kit useful, please consider:

- ⭐ **Star the repository** - It helps others discover the project!
- 🐦 **Share on social media** - Spread the word!
- ☕ **Buy me a coffee** - Your support keeps me motivated!

<div align="center">

### ☕ 请作者喝杯咖啡 | Buy Me a Coffee

[![Sponsor](https://img.shields.io/badge/☕_Sponsor_Me-FF813F?style=for-the-badge&logo=buy-me-a-coffee&logoColor=white)](https://tiptap-ui-kit.vercel.app/sponsor.html)

**您的支持是我创作的动力！Your support motivates my creation!**

</div>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR:** You can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software. Free for commercial and personal use! 🎉

---

## 🙏 Acknowledgments

Built with these amazing technologies:

- [Tiptap](https://tiptap.dev/) - The headless editor framework
- [Vue 3](https://vuejs.org/) - The progressive JavaScript framework
- [ProseMirror](https://prosemirror.net/) - The powerful editing toolkit
- [Ant Design Vue](https://antdv.com/) - High-quality UI components
- [Yjs](https://github.com/yjs/yjs) - Real-time collaboration
- [KaTeX](https://katex.org/) - Math rendering
- [Lowlight](https://github.com/wooorm/lowlight) - Syntax highlighting

Special thanks to all our [contributors](https://github.com/benngaihk/Tiptap-UI-Kit/graphs/contributors)!

---

## 📮 Contact

- **Author**: benngaihk
- **GitHub**: [@benngaihk](https://github.com/benngaihk)
- **Issues**: [GitHub Issues](https://github.com/benngaihk/Tiptap-UI-Kit/issues)

---

<div align="center">

**Made with ❤️ by the open source community**

If you like this project, please give it a ⭐!

[⬆ Back to Top](#tiptap-ui-kit)

</div>
