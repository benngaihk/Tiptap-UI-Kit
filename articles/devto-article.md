---
title: "I Built a Notion-like Editor for Vue 3 with AI, 5 Themes, and Real-time Collaboration — It's 100% Free"
published: true
description: "Tiptap UI Kit: an open-source, production-ready rich text editor component for Vue 3 with Notion/Word themes, AI writing assistance, Yjs collaboration, dark mode, and i18n. MIT licensed."
tags: vue, javascript, opensource, webdev
cover_image: https://tiptap-ui-kit.vercel.app/og-image.png
canonical_url: https://github.com/benngaihk/Tiptap-UI-Kit
---

If you've ever tried to build a rich text editor in Vue, you know the pain.

Tiptap is amazing — but it's **headless**. You get a powerful ProseMirror engine with zero UI. That means you spend weeks building toolbars, menus, themes, and handling edge cases before you can even show it to your users.

I spent months solving this problem, and today I'm releasing **[Tiptap UI Kit](https://github.com/benngaihk/Tiptap-UI-Kit)** — a fully-featured, production-ready editor component for Vue 3. Think of it as what Tiptap would look like if it shipped with a complete UI out of the box.

**[Live Demo](https://tiptap-ui-kit.vercel.app)** | **[GitHub](https://github.com/benngaihk/Tiptap-UI-Kit)** | **[npm](https://www.npmjs.com/package/tiptap-ui-kit)**

---

## The Problem

Here's what building a Tiptap editor from scratch looks like:

1. Set up Tiptap with Vue 3 ✅ (easy, 30 min)
2. Build a toolbar with 20+ formatting buttons 😅 (2 days)
3. Handle active state tracking for every button 😰 (1 day)
4. Make it look good 😤 (3 days)
5. Add dark mode 🫠 (1 day)
6. Make it responsive 💀 (1 day)
7. Add i18n support ☠️ (1 day)
8. Add AI features... 💸 (good luck)

By the time you're done, you've written 5,000+ lines of UI code and your editor still doesn't look as polished as Notion or Google Docs.

## The Solution

```bash
pnpm add tiptap-ui-kit
```

```vue
<template>
  <TiptapProEditor
    v-model="content"
    theme="notion"
    locale="en-US"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TiptapProEditor } from 'tiptap-ui-kit'
import 'tiptap-ui-kit/style.css'

const content = ref('<p>Hello World!</p>')
</script>
```

That's it. You get a full-featured editor with a Notion-like theme in 10 lines of code.

---

## What's Included

### 1. Five Professional Themes

Every theme comes with full dark mode support:

| Theme | Inspired By | Best For |
|-------|-------------|----------|
| **Notion** | Notion.so | Note-taking, knowledge bases |
| **Word** | Microsoft Word | Formal documents with A4 pagination |
| **GitHub** | GitHub markdown | Technical documentation |
| **Typora** | Typora editor | Long-form writing, blogs |
| **Default** | Clean minimal | General purpose |

The Word theme is particularly interesting — it renders your content on actual A4-sized pages with proper margins, headers, and page breaks. Perfect for document management systems.

Switching themes is a single prop change:

```vue
<TiptapProEditor theme="word" />
<!-- or -->
<TiptapProEditor theme="notion" />
```

All themes are implemented with CSS variables, so you can easily customize colors, fonts, and spacing without touching the component internals.

### 2. AI-Powered Writing Assistance

This is the feature I'm most proud of. The editor has built-in AI capabilities:

- **Continue Writing** — Select text and AI continues your thought
- **Polish** — Improve grammar, clarity, and style
- **Translate** — 14+ languages with one click
- **Summarize** — Extract key points from long text
- **Custom Commands** — Define your own AI prompts

The AI works with **any OpenAI-compatible API**:

```vue
<TiptapProEditor
  v-model="content"
  :ai-config="{
    provider: 'openai',
    apiKey: 'your-key',
    model: 'gpt-4o-mini'
  }"
/>
```

Supported providers out of the box:
- **OpenAI** (GPT-4, GPT-4o)
- **DeepSeek**
- **Aliyun Qianwen** (阿里云通义千问)
- **Ollama** (run models locally!)

The AI suggestions appear inline with a clean accept/reject UI — no modal popups, no context switching. It feels native.

Under the hood, it uses streaming responses so you see the AI "type" in real-time:

```typescript
// How AI streaming works internally
aiApiService.continueWriting(selectedText, context, {
  onStart: () => showHighlight(),
  onMessage: ({ content }) => appendToSuggestion(content),
  onStop: () => showAcceptRejectUI(),
  onError: (error) => handleGracefully(error),
})
```

Users can also configure their own API keys through a built-in settings modal — no environment variables needed.

### 3. Real-time Collaboration

Multi-user editing powered by [Yjs](https://github.com/yjs/yjs), the battle-tested CRDT library:

- Multiple users editing simultaneously
- Live cursor positions with user names and colors
- Online user presence indicator
- Conflict-free resolution (CRDT, not OT)
- Smart document initialization that handles race conditions

The collaboration system intelligently decides how to initialize content based on the current state:

```
Is document empty? → Use initial content
Only one user online? → Use initial content
Multiple users online? → Preserve Yjs state (don't overwrite!)
```

This prevents the classic "user A's content overwrites user B's edits" problem that plagues naive collaboration implementations.

### 4. Everything Else

The editor also includes:

- **Rich text formatting** — Bold, italic, underline, strikethrough, highlight, subscript, superscript
- **Structure** — Headings (H1-H6), ordered/unordered lists, task lists, blockquotes
- **Tables** — Full table support with merge, split, and cell styling
- **Code blocks** — Syntax highlighting powered by Lowlight
- **Math formulas** — KaTeX-powered inline and block equations
- **Images** — Upload, resize, and drag-to-adjust
- **Links** — Smart editing with preview bubbles
- **Search & Replace** — Find and replace across the document
- **Format Painter** — Copy formatting like in Word
- **Drag & Drop** — Reorder content blocks visually
- **Keyboard Shortcuts** — Full set of productivity shortcuts
- **Zoom** — 50% to 200% scaling
- **Word Import/Export** — Import `.docx` files and export back

---

## Architecture Decisions

A few design choices worth sharing:

### Modular by Default

You don't have to use everything. Features are controlled via props:

```vue
<TiptapProEditor
  :features="{
    table: true,
    collaboration: false,
    ai: true,
    dragHandle: true
  }"
/>
```

This keeps your bundle size reasonable — unused features don't ship to the client.

### CSS Variables for Theming

Instead of CSS-in-JS or scoped styles, all theming is done through CSS custom properties:

```css
/* Notion theme uses warm grays */
--tiptap-text: #37352f;
--tiptap-primary: #2eaadc;
--tiptap-border: rgba(55, 53, 47, 0.09);

/* Word theme uses Microsoft blue */
--tiptap-text: #333333;
--tiptap-primary: #0078d4;
--tiptap-font-family: 'Calibri', 'Segoe UI', Arial;
```

This means you can create your own theme in minutes by overriding a handful of variables.

### Type-Safe i18n

All translations are fully typed with TypeScript. Add a new translation key and the compiler will yell at you if you miss a language:

```typescript
// Supports: en-US, zh-CN, zh-TW
<TiptapProEditor locale="zh-CN" />
```

---

## Who Is This For?

I built this for developers who need a **production-ready editor** without spending weeks on UI work:

- Building a **CMS** or admin panel
- Building a **knowledge base** (like Notion)
- Building a **document management system** (like Google Docs)
- Building a **note-taking app**
- Building a **blog platform**
- Any **Vue 3 app** that needs rich text editing

If you're starting a project and thinking "I need a Tiptap Vue 3 template" — this is it.

---

## Getting Started

### Install

```bash
pnpm add tiptap-ui-kit

# Peer dependencies
pnpm add @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/vue-3 vue
```

### Basic Usage

```vue
<template>
  <TiptapProEditor
    v-model="content"
    :theme="theme"
    :locale="locale"
    :dark-mode="isDark"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TiptapProEditor } from 'tiptap-ui-kit'
import 'tiptap-ui-kit/style.css'

const content = ref('<p>Start writing...</p>')
const theme = ref('notion')
const locale = ref('en-US')
const isDark = ref(false)
</script>
```

### With AI

```vue
<TiptapProEditor
  v-model="content"
  theme="notion"
  :ai-config="{
    provider: 'openai',
    apiKey: import.meta.env.VITE_AI_API_KEY,
    model: 'gpt-4o-mini'
  }"
/>
```

---

## Comparison with Alternatives

| Feature | Tiptap UI Kit | Raw Tiptap | Quill | TinyMCE |
|---------|:---:|:---:|:---:|:---:|
| Vue 3 native | Yes | Yes | Plugin | Plugin |
| Theme presets | 5 | 0 | 1 | 3+ |
| AI writing | Yes | No | No | Paid |
| Collaboration | Yes (free) | Paid | No | Paid |
| Dark mode | Yes | DIY | No | Yes |
| i18n | 3 langs | No | No | Yes |
| MIT License | Yes | Yes | BSD | LGPL/Paid |
| Price | **Free** | Free | Free | Free/Paid |

---

## What's Next

This is v0.1.0. Here's what's coming:

- More themes (Google Docs, Confluence)
- More languages (Japanese, Korean, Spanish, French)
- Plugin system for third-party extensions
- Vue component slots for toolbar customization
- Mobile-optimized UI
- Export to PDF

---

## Try It Out

**[Live Demo](https://tiptap-ui-kit.vercel.app)** — Try all 5 themes and AI features

**[GitHub](https://github.com/benngaihk/Tiptap-UI-Kit)** — Star the repo if you find it useful!

```bash
pnpm add tiptap-ui-kit
```

The entire project is **MIT licensed** — free for personal and commercial use. No catch, no freemium, no "contact sales."

If this saves you time, consider giving it a star on GitHub. It really helps with discoverability and motivates me to keep improving it.

---

*Built with Vue 3, Tiptap 3, TypeScript, and a lot of coffee.*

*Have questions or feedback? [Open an issue](https://github.com/benngaihk/Tiptap-UI-Kit/issues) or find me on [GitHub](https://github.com/benngaihk).*
