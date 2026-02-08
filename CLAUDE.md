# Tiptap UI Kit - Project Guide for AI Assistants

## Overview

This is a commercial Vue 3 rich text editor UI kit built on Tiptap 3. It provides a production-ready, feature-rich editor with AI capabilities, multiple themes, and internationalization support.

**Key Technologies:**
- Vue 3.5 with Composition API (TypeScript)
- Tiptap 3 (ProseMirror-based editor)
- Ant Design Vue (UI components)
- Vite (build tool)
- pnpm (package manager)

## Project Structure

```
src/
├── ai/                    # AI Features
│   ├── components/        # AI UI components (AiToolbarMenu, AiSettingsModal)
│   ├── config/            # User AI configuration (localStorage-based)
│   ├── continue-writing/  # AI continuation extension
│   ├── polish/            # Text polishing extension
│   ├── summarize/         # Summarization extension
│   ├── translation/       # Translation extension
│   ├── custom-ai/         # Custom AI commands
│   └── shared/            # Shared AI utilities
│
├── api/                   # API Services
│   ├── ai.ts              # AI API client (OpenAI-compatible)
│   └── websocket.ts       # WebSocket for collaboration
│
├── core/                  # Core Editor Components
│   ├── TiptapProEditor.vue    # Main editor component
│   ├── EditorToolbar.vue      # Toolbar container
│   ├── EditorContent.vue      # Content area
│   └── editorTypes.ts         # TypeScript types
│
├── extensions/            # Tiptap Extensions
│   ├── coreExtensions.ts      # Extension registration
│   └── [extension-name]/      # Individual extensions
│
├── features/              # Toolbar Features
│   ├── basic/             # Basic features (heading, list, align)
│   └── advanced/          # Advanced features (code, table, font)
│
├── locales/               # Internationalization
│   ├── zh-CN.ts           # Simplified Chinese
│   ├── zh-TW.ts           # Traditional Chinese
│   ├── en-US.ts           # English
│   └── manager.ts         # i18n implementation
│
├── tools/                 # Optional Tools
│   ├── collaboration/     # Yjs-based real-time collaboration
│   └── device-switcher/   # Responsive preview
│
├── themes/                # Theme Presets
│   ├── default/
│   ├── notion/
│   ├── word/
│   ├── github/
│   └── typora/
│
├── ui/                    # Reusable UI Components
│   ├── ToolbarButton.vue
│   ├── ToolbarDropdownButton.vue
│   └── BaseTooltip.vue
│
└── utils/                 # Utilities
    ├── editorState.ts     # Editor state helpers
    └── prosemirrorUtils.ts # ProseMirror utilities
```

## Key Files

| File | Purpose |
|------|---------|
| `src/core/TiptapProEditor.vue` | Main editor component - start here for editor customization |
| `src/core/EditorToolbar.vue` | Toolbar - add new features here |
| `src/extensions/coreExtensions.ts` | Extension registration - add new Tiptap extensions |
| `src/api/ai.ts` | AI streaming API - modify AI provider integration |
| `src/ai/config/` | User AI configuration system (API key storage) |
| `src/locales/types.ts` | Translation types - update when adding new strings |

## Common Tasks

### Add a New Toolbar Feature

1. Create component in `src/features/basic/` or `src/features/advanced/`
2. Export from the feature folder's `index.ts`
3. Import and add to `src/core/EditorToolbar.vue`
4. Add feature key to `src/core/toolbarConfig.ts`

### Add a New Translation Key

1. Add type to `src/locales/types.ts`
2. Add translations to all locale files: `zh-CN.ts`, `zh-TW.ts`, `en-US.ts`

### Add a New AI Feature

1. Create folder in `src/ai/[feature-name]/`
2. Create Tiptap extension file (see existing patterns)
3. Export from `src/ai/index.ts`
4. Add to AI menu in `src/ai/components/AiToolbarMenu.vue`

### Modify Theme Styles

Theme CSS variables are in `src/themes/[theme-name]/variables.scss`

## Architecture Patterns

### Tiptap Extensions
Extensions follow the pattern:
```typescript
import { Extension } from '@tiptap/core'

export const MyExtension = Extension.create({
  name: 'myExtension',
  addCommands() { ... },
  addKeyboardShortcuts() { ... },
})
```

### Vue Composables
Used for stateful logic:
```typescript
export function useMyFeature(editor: Ref<Editor | null>) {
  const state = ref(...)
  return { state, ...methods }
}
```

### AI Streaming
AI features use streaming responses:
```typescript
aiApiService.continueWriting(content, prompt, {
  onStart: () => {},
  onMessage: ({ content }) => {},
  onStop: () => {},
  onError: (error) => {},
})
```

## Development Commands

```bash
pnpm dev          # Start dev server at localhost:5173
pnpm build        # Build library to dist/
pnpm build:demo   # Build demo site
pnpm typecheck    # Run TypeScript check
pnpm lint         # Run ESLint
pnpm test         # Run Vitest tests
```

## Environment Variables

For AI features, create `.env`:
```
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=sk-xxx
VITE_AI_BASE_URL=https://api.openai.com/v1
VITE_AI_MODEL=gpt-4o-mini
```

Or users can configure via the AI Settings modal in the toolbar.

## Notes for AI Assistants

1. **Prefer editing existing files** over creating new ones
2. **Follow existing patterns** - check similar features before implementing
3. **Update all locale files** when adding new strings
4. **Run `pnpm typecheck`** after making changes
5. The codebase uses **Chinese comments** for internal documentation
6. **Ant Design Vue** is used for UI components - prefer its components over custom implementations
7. **Don't modify** files in `dist/` or `node_modules/`
