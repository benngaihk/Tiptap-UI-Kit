# Changelog

All notable changes to this project are documented here. This project adheres to [Semantic Versioning](https://semver.org/).

## 0.2.0

A major overhaul: a full AI document assistant, a 94% smaller bundle, and a rebuilt interaction layer.

### Added

- **AI document assistant (agent).** A floating **⚡ AI** panel lets users describe an edit in plain words — "add a 3x3 table at the end", "rewrite the second paragraph", "bold every product name" — and the AI edits the document directly through a set of structured tools (read / insert / replace / delete blocks, edit / format text). Every step is shown in the chat, edits apply live, and each is undoable with Cmd/Ctrl+Z. Works with all supported providers via OpenAI-style function calling.
- **Exported agent API.** `documentTools`, `toOpenAiTools`, and `runDocumentAgent` are public, so you can drive the same document tools from your own UI, backend, or agent framework (e.g. the Anthropic Messages API or Claude Agent SDK).
- **AI takeover visuals.** While the agent edits, a breathing overlay covers the document (blocking concurrent typing) and a large ⚡ AI cursor flies to each change, flashing the edited region and scrolling it into view.
- **Demo mode.** When no AI is configured, the assistant runs a local simulation that really edits the document (all undoable) instead of dead-ending with an error — so the live demo works with no API key.
- **Reactive toolbar.** Toolbar state (active marks, current font/size/color) now follows the cursor in real time via a shared `useReactiveEditor` composable.
- **`v-model` support** on `TiptapProEditor` (HTML string or JSON), plus a `features.aiChat` flag to toggle the assistant.
- **Anthropic and custom providers** in the AI configuration, alongside OpenAI, DeepSeek, Aliyun, and Ollama.

### Changed

- **~94% smaller bundle.** The shipped library dropped from ~2.4 MB JS + 1.5 MB CSS to ~273 KB JS + 102 KB CSS (about 89 KB total gzipped). KaTeX, mammoth, docx, and file-saver are now lazy-loaded on first use; heavy extensions load only with `version="premium"`; Ant Design Vue and the Yjs collaboration stack are peer dependencies instead of being bundled. See [Migrating to 0.2](./README.md#-migrating-to-02).
- **Production minification is now actually applied** to the published bundle (it was silently skipped before).
- **Smart default locale** — the editor auto-detects the browser language instead of always defaulting to Chinese.
- **Dark mode unified** across all themes and floating components (`[data-theme="dark"]` now works everywhere, not just `.dark`).
- Input handling debounced; page-count recalculation batched with `requestAnimationFrame` and a `ResizeObserver`.

### Fixed

- Toolbar buttons no longer go stale when moving the cursor across formatted text.
- The `@update` event no longer drops the last keystrokes when the editor unmounts mid-typing.
- Demo landing page: feature badges now float above the editor preview instead of being clipped behind it.
- Numerous correctness fixes from a multi-agent code review (v-model edge cases, table-cell false matches in text search, replace-all safety, provider endpoint routing, and more).

### Removed

- Committed build artifacts (`src/**/*.d.ts`), dead `moltbook` scripts, and the unused obfuscator/lucide dependencies.

## 0.1.1

Initial public releases: Tiptap 3 + Vue 3 editor with 5 theme presets, dark mode, i18n (EN / ZH-CN / ZH-TW), and basic AI writing features.
