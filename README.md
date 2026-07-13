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

### ⚡ v0.2: 94% smaller bundle

The v0.2 release cut the shipped library from **2.4 MB JS + 1.5 MB CSS** down to **249 KB JS (63 KB gzip) + 96 KB CSS (15 KB gzip)** — roughly **78 KB total gzipped, a 94% reduction**. How:

- **Lazy loading** — KaTeX (math), mammoth / docx / file-saver (Word import/export) are only downloaded when the feature is first used
- **Tiered extension loading** — the default `version="basic"` loads only lightweight extensions; heavy ones (tables, math, AI) load with `version="premium"`
- **Externalized peers** — Ant Design Vue and the collaboration stack (Yjs) are peer dependencies instead of being bundled

See [Migrating to 0.2](#-migrating-to-02) if you are upgrading.

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
- ⚡ **Tiny Footprint** — ~78 KB gzipped total, heavy features lazy-loaded on demand
- 🤖 **AI-Powered Features** — Continue writing, polish text, translate, summarize, custom AI commands (OpenAI-compatible)
- 🌓 **Perfect Dark Mode** — Seamless light/dark theme switching across all themes
- 🛠️ **Modular Architecture** — Tiered versions and per-feature flags, load only what you need
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

- **Modular Architecture** - Tiered editor versions (`minimal` / `basic` / `premium`) plus per-feature flags keep the bundle small

- **Internationalization** - Built-in support for:
  - 简体中文 (Simplified Chinese)
  - 繁體中文 (Traditional Chinese)
  - English

- **Keyboard Navigation** - Productivity-focused shortcuts for power users

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
- **Math Formulas** - KaTeX-powered inline and block math equations (KaTeX is lazy-loaded on first use)

### 🤖 AI-Powered Features

**Note:** AI features work with any OpenAI-compatible API. Users configure their own API key via the built-in AI Settings modal, or the host app supplies `VITE_AI_*` environment variables. See [AI Configuration](#ai-configuration).

- **⚡ AI Assistant (agent)** - Describe any edit in plain words — "add a 3x3 table at the end", "rewrite the second paragraph" — and the AI edits the document for you via tool calls
- **✨ Continue Writing** - AI completes your sentences and paragraphs intelligently
- **📝 Polish Text** - Improve grammar, clarity, and style automatically
- **🌐 Translation** - Translate to 14+ languages with one click
- **📄 Summarize** - Extract key points from long text
- **🤖 Custom AI Commands** - Define your own AI transformations

**Supported AI Providers:**
- OpenAI (GPT-4o, GPT-4o-mini)
- DeepSeek (DeepSeek-V3, DeepSeek-R1)
- Anthropic (Claude, via OpenAI-compatible endpoint)
- 阿里云通义千问 (Aliyun Qwen)
- Ollama (local deployment)
- Custom — any OpenAI-compatible API

### 🚀 Advanced Features

- **Real-time Collaboration** - Multi-user editing powered by Yjs (optional peer dependencies)
- **Drag & Drop** - Intuitive content reordering with visual feedback
- **Slash Commands** - Type `/` to insert blocks, Notion-style
- **Word Import/Export** - Import `.docx` via mammoth, export via docx (both lazy-loaded on click)
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Preview Mode** - Read-only rendering for content review
- **Zoom Control** - Scale from 50% to 200%
- **Format Painter** - Copy formatting across content
- **Paste Support** - Smart paste from Word, Excel, and web pages

---

## 📦 Installation

```bash
# Using npm
npm install tiptap-ui-kit

# Using pnpm (recommended)
pnpm add tiptap-ui-kit

# Using yarn
yarn add tiptap-ui-kit
```

### Peer Dependencies

Tiptap UI Kit requires the following peer dependencies (npm 7+ and pnpm install them automatically; otherwise install them yourself):

```bash
pnpm add vue @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/vue-3 ant-design-vue @ant-design/icons-vue
```

**Optional peers — only needed for real-time collaboration:**

```bash
pnpm add yjs y-websocket @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor
```

**Optional CSS — only needed for math formulas:**

```ts
import 'katex/dist/katex.min.css'
```

---

## 🚀 Quick Start

### Basic Usage

```vue
<template>
  <TiptapProEditor
    v-model="content"
    version="premium"
    locale="en-US"
    :features="{ headerNav: true, footerNav: true }"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TiptapProEditor } from 'tiptap-ui-kit'
import 'tiptap-ui-kit/style.css'

// v-model with a string -> the editor emits HTML strings
const content = ref('<p>Hello Tiptap UI Kit!</p>')
</script>
```

Notes:

- `import 'tiptap-ui-kit/style.css'` is required — it contains the editor styles **and all 5 theme presets**.
- `:features="{ headerNav: true, footerNav: true }"` enables the toolbar and the footer (zoom / word count). They are **off by default**.
- If you omit `locale`, the editor auto-detects the browser language (`zh` → `zh-CN`/`zh-TW`, otherwise `en-US`).

### v-model: HTML or JSON

The type of the value you bind decides the output format:

```vue
<script setup>
// HTML mode: bind a string, receive HTML strings
const html = ref('<p>Hello</p>')

// JSON mode: bind an object, receive ProseMirror JSON
const json = ref({ type: 'doc', content: [{ type: 'paragraph' }] })
</script>

<template>
  <TiptapProEditor v-model="html" />
  <!-- or -->
  <TiptapProEditor v-model="json" />
</template>
```

Alternatively, use `initialContent` (HTML string or ProseMirror JSON) with the `@update` event if you don't need two-way binding:

```vue
<template>
  <TiptapProEditor
    :initial-content="'<p>Hello</p>'"
    version="premium"
    :features="{ headerNav: true }"
    @update="handleUpdate"
  />
</template>

<script setup>
// @update emits ProseMirror JSON, debounced by 200ms
const handleUpdate = (json) => {
  console.log('Document JSON:', json)
}
</script>
```

### Editor Versions

The `version` prop controls which Tiptap extensions are loaded — smaller versions download less code:

| `version` | What's included |
|-----------|-----------------|
| `minimal` | Basic text formatting, lists, undo/redo |
| `basic` (default) | `minimal` + colors, alignment, images, links, task lists — **no** tables, math, format painter, or AI |
| `advanced` / `premium` | Everything: tables, math formulas (KaTeX), code blocks, fonts, format painter, AI features |

```vue
<!-- Lightweight comment box -->
<TiptapProEditor v-model="content" version="minimal" />

<!-- Full-featured document editor -->
<TiptapProEditor v-model="content" version="premium" />
```

### Feature Flags

Fine-tune UI modules with the `features` prop (all off by default):

```vue
<template>
  <TiptapProEditor
    v-model="content"
    version="premium"
    :features="{
      headerNav: true,      // toolbar
      footerNav: true,      // footer with zoom & word count
      slashCommand: true,   // type / to insert blocks
      dragHandleMenu: true, // drag handle with block menu
      tableToolbar: true,   // floating table toolbar
      image: true,          // floating image toolbar
      linkBubbleMenu: true, // link preview bubble
      floatingMenu: true,   // selection floating menu
      collaboration: false, // Yjs collaboration (see Collaboration docs)
    }"
  />
</template>
```

### Full Props, Events & Methods

```vue
<template>
  <TiptapProEditor
    ref="editorRef"
    v-model="content"
    version="premium"
    locale="zh-CN"
    :readonly="false"
    :preview-mode="false"
    :features="{ headerNav: true, footerNav: true }"
    @update="onUpdate"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TiptapProEditor } from 'tiptap-ui-kit'
import 'tiptap-ui-kit/style.css'

const content = ref('')
const editorRef = ref(null)

const onUpdate = (json) => { /* ProseMirror JSON, debounced 200ms */ }

// Exposed methods via template ref:
// editorRef.value.getEditor() - the raw Tiptap Editor instance
// editorRef.value.getJSON()   - ProseMirror JSON
// editorRef.value.getHTML()   - HTML string
// editorRef.value.getText()   - plain text
</script>
```

---

## 📚 Documentation

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| object` | — | `v-model` binding. String → HTML in/out; object → ProseMirror JSON in/out |
| `initialContent` | `string \| object` | `''` | Initial content (HTML or ProseMirror JSON). Ignored if `modelValue` is set |
| `version` | `'minimal' \| 'basic' \| 'advanced' \| 'premium'` | `'basic'` | Extension tier — see [Editor Versions](#editor-versions) |
| `features` | `FeatureConfig` | — | Per-feature UI flags — see [Feature Flags](#feature-flags) |
| `locale` | `'en-US' \| 'zh-CN' \| 'zh-TW'` | auto-detected | UI language; falls back to browser language detection |
| `readonly` | `boolean` | `false` | Read-only mode |
| `previewMode` | `boolean` | `false` | Preview rendering: no toolbar/footer, not editable |
| `documentId` | `string` | — | Document ID, used as the collaboration room name |
| `zoomBarPlacement` | `'bottom' \| 'belowToolbar'` | `'bottom'` | Zoom bar position |
| `tableMenuShowMode` | `1 \| 2` | `2` | Table toolbar trigger: 1 = on focus, 2 = on cell selection |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update` | ProseMirror JSON | Content changed — **debounced 200ms** |
| `update:modelValue` | `string \| object` | v-model sync (HTML or JSON, matching what you bound) — not debounced |
| `collaboratorsChange` | `number` | Number of online collaborators changed |
| `collaboratorsListChange` | `Array<{ id, name, color }>` | Online collaborator list changed |

### Exposed Methods

Available on the component via template ref: `getEditor()`, `getJSON()`, `getHTML()`, `getText()`.

### Themes

All 5 theme presets ship inside `tiptap-ui-kit/style.css` — no extra CSS imports. Switch themes with the `setTheme` function (it applies a `theme-*` class and `data-theme` attribute on `<html>`):

```ts
import { setTheme, toggleThemeMode, getTheme } from 'tiptap-ui-kit'

// setTheme(preset, mode) — mode defaults to 'light'
setTheme('notion', 'dark')   // Notion theme, dark mode
setTheme('word')             // Word theme, light mode
setTheme('github', 'auto')   // follow system preference

toggleThemeMode()            // toggle light <-> dark
getTheme()                   // { preset: 'github', mode: 'auto' }
```

| Theme | Description | Best For |
|-------|-------------|----------|
| `default` | Clean and minimal design | General purpose editing |
| `word` | Microsoft Word-like with A4 pages | Formal documents, reports |
| `notion` | Modern, distraction-free | Note-taking, knowledge base |
| `github` | Developer-friendly markdown | Technical documentation |
| `typora` | Elegant reading/writing | Long-form content, blogs |

Dark mode is driven by `data-theme="dark"` on the document element. You can also register your own theme variables with `registerTheme('custom', { '--your-css-var': 'value' })` and apply them via `setTheme('custom')`.

### Localization

Supported languages: `en-US`, `zh-CN`, `zh-TW`.

```vue
<TiptapProEditor v-model="content" locale="zh-CN" />
```

If `locale` is not provided, the browser language is detected automatically: `zh-TW`/`zh-HK`/`zh-MO` → Traditional Chinese, other `zh` → Simplified Chinese, everything else → English.

### Math Formulas

Math rendering uses KaTeX, which is **lazy-loaded** the first time a formula is rendered — it costs nothing if you don't use it. You must import the KaTeX stylesheet yourself:

```ts
import 'katex/dist/katex.min.css'
```

### AI Assistant — edit documents with plain words

Once AI is configured (see [AI Configuration](#ai-configuration) below), a floating **⚡ AI** button appears at the bottom-right of the editor. Open it and describe what you want:

> 「在文档末尾加一个 3x3 的表格」 · "Rewrite the second paragraph to be more concise" · 「把所有出现的产品名加粗」

The AI reads the document and edits it directly through a set of structured tools (insert/replace/delete blocks, edit/format text). Every step is shown in the chat, edits apply live, and **Cmd/Ctrl+Z undoes them** like any other edit. Works with all supported providers via OpenAI-style function calling.

Disable the panel with `:features="{ aiChat: false }"`.

**Build your own integration** — the tool layer and agent loop are exported, so you can drive the same document tools from your own UI, backend, or agent framework:

```ts
import { documentTools, toOpenAiTools, runDocumentAgent } from 'tiptap-ui-kit'

// One-shot: run the built-in agent loop against the current editor
await runDocumentAgent({
  editor,
  instruction: 'Add a summary section at the end',
  callbacks: { onToolResult: (name) => console.log('step:', name) },
})

// Or take the raw tools (name/description/JSON-schema/execute) and wire them
// into any tool-calling loop — e.g. an Anthropic Messages API client or the
// Claude Agent SDK on your backend, proxying tool calls to the browser editor.
const tools = toOpenAiTools(documentTools)
```

### AI Configuration

There is **no AI prop on the component**. AI is configured in one of two ways:

**1. Built-in AI Settings modal (end-user configuration)**

Users open AI Settings from the editor toolbar, pick a provider, and paste their own API key. The configuration is persisted in the browser's `localStorage`.

**2. Environment variables (host-app configuration)**

Set `VITE_AI_*` variables in your app's `.env` (see [.env.example](.env.example)):

```bash
# openai | deepseek | anthropic | aliyun | ollama | custom
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=sk-...
VITE_AI_BASE_URL=https://api.openai.com/v1   # optional
VITE_AI_MODEL=gpt-4o-mini                     # optional
```

> **🔒 Security warning:** API keys entered in the AI Settings modal are stored in browser `localStorage` with **reversible obfuscation, not encryption**. Any script running on the page — an XSS payload, a malicious browser extension — can read them. Only use keys you own with a spending limit configured, and never embed organization-wide keys this way. For production apps, the recommended setup is a backend proxy that holds the real key server-side (point the editor at it with provider `custom` / `VITE_AI_BASE_URL`).

### Real-time Collaboration

Collaboration is opt-in and requires the optional peer dependencies plus a [y-websocket](https://github.com/yjs/y-websocket) server:

```bash
pnpm add yjs y-websocket @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor
```

```bash
# .env
VITE_COLLABORATION_WS_URL=wss://your-server.com/ws
```

```vue
<TiptapProEditor
  v-model="content"
  version="premium"
  document-id="doc-42"
  :features="{ headerNav: true, collaboration: true }"
  @collaborators-change="(n) => console.log(n, 'online')"
/>
```

`documentId` is used as the collaboration room name. If `collaboration` is enabled without `VITE_COLLABORATION_WS_URL`, a console warning is printed and collaboration stays off.

### API Reference

The [Props](#props), [Events](#events) and [Exposed Methods](#exposed-methods) tables above are the full public API of `TiptapProEditor`. Everything importable from `'tiptap-ui-kit'` is typed — check your editor's autocomplete for theme utilities (`setTheme`, `toggleThemeMode`, `registerTheme`, …) and locale utilities (`createI18n`, `detectDefaultLocale`, …).

---

## 🔄 Migrating to 0.2

v0.2 focuses on bundle size. Upgrading from 0.1 requires a few adjustments:

1. **New peer dependencies** — `ant-design-vue` and `@ant-design/icons-vue` are no longer bundled. npm 7+ / pnpm install peers automatically; with older tooling, install them manually.
2. **Collaboration peers are optional** — `yjs`, `y-websocket`, `@tiptap/extension-collaboration`, `@tiptap/extension-collaboration-cursor` are only needed if you enable collaboration.
3. **KaTeX CSS** — math styles are no longer bundled. If you use math formulas, add `import 'katex/dist/katex.min.css'` to your app. KaTeX itself lazy-loads on first formula render.
4. **`version` semantics changed** — `version="basic"` (the default) now loads only lightweight extensions (no tables, math, format painter, or AI). If you relied on the old everything-included behavior, pass `version="premium"`. A new `minimal` tier is available for the smallest builds.
5. **`@update` is debounced by 200ms** — it emits ProseMirror JSON at most once per 200ms pause. For synchronous updates use `v-model` / `@update:modelValue`.
6. **`v-model` is now supported** — bind a string for HTML or an object for ProseMirror JSON.
7. **Theme CSS is bundled** — all 5 theme presets are inside `tiptap-ui-kit/style.css`; remove any per-theme CSS imports.

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
├── api/                 # AI & WebSocket API clients
├── core/                # Core editor component (TiptapProEditor)
├── extensions/          # Tiptap extensions
├── features/            # Toolbar features (basic & advanced)
├── locales/             # Internationalization
├── styles/              # Base styles
├── themes/              # Theme presets & theme manager
├── tools/               # UI modules (toolbar, collaboration, menus, etc.)
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
