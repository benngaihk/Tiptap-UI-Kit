/**
 * AI Shared Components and Utilities
 * @description Shared components, utilities, and styles for AI features
 */

// Export AI Highlight Mark (used by custom-ai)
export * from './AiHighlightMark';

// Export AI Suggestion Manager (used by summarize, translation, etc.)
export * from './aiSuggestionManager';

// Export shared components
export { default as CustomAiPopover } from './CustomAiPopover.vue';
export { default as AiSuggestionPopover } from './AiSuggestionPopover.vue';

// Import styles
import './ai-highlight.css';

