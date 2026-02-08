/**
 * AI Features for TiptapPro Tenant
 * @description Collection of AI-powered text processing features
 */

// Export Custom AI extension
export { CustomAiExtension } from './custom-ai';
export type { CustomAiOptions } from './custom-ai';

// Export Continue Writing extension
export { ContinueWritingExtension } from './continue-writing';
export type { ContinueWritingOptions } from './continue-writing';

// Export Polish extension
export { PolishExtension } from './polish';
export type { PolishOptions } from './polish';

// Export Summarize extension
export { SummarizeExtension } from './summarize';
export type { SummarizeOptions } from './summarize';

// Export Translation extension
export { TranslationExtension } from './translation';
export type { TranslationOptions } from './translation';

// Export AI Highlight Mark (used by custom-ai, continue-writing, and polish)
export { AiHighlightMark } from './shared';
export type { AiSuggestionData } from './shared';

// Export AI Suggestion Manager (used by summarize, translation, etc.)
export { aiSuggestionManager } from './shared';
export type { AiSuggestionState } from './shared';

// Export shared components
export { default as CustomAiPopover } from './shared/CustomAiPopover.vue';
export { default as AiSuggestionPopover } from './shared/AiSuggestionPopover.vue';

// Export AI menu button component
export { default as AiMenuButton } from './AiMenuButton.vue';

// Export AI components
export { AiToolbarMenu, AiSettingsModal } from './components';

// Export useAi composable
export { useAi } from './useAi';
export type { UseAiOptions, UseAiReturn } from './useAi';

// Export types
export type { AiAdapter, AiMessage, AiStreamCallbacks } from './types';

// Export AI config
export { useAiConfig, getAiRequestConfig } from './config/useAiConfig';
export { AI_PROVIDERS, DEFAULT_CONFIG, getProviderInfo } from './config/types';
export type { AiProvider, AiProviderInfo, AiUserConfig, AiConfigState } from './config/types';

