/**
 * AI Adapter Factory
 * Automatically creates the correct adapter based on config
 */
import type { AiAdapter, AiConfig, AiProvider } from './types';
/**
 * Create AI adapter from environment variables
 * Reads VITE_AI_PROVIDER, VITE_AI_API_KEY, etc.
 */
export declare function createAiAdapterFromEnv(): AiAdapter;
/**
 * Create AI adapter from config
 */
export declare function createAiAdapter(configInput: Partial<AiConfig>): AiAdapter;
/**
 * Create specific provider adapter
 */
export declare function createProviderAdapter(provider: AiProvider, apiKey: string, options?: Partial<Omit<AiConfig, 'provider' | 'apiKey'>>): AiAdapter;
//# sourceMappingURL=factory.d.ts.map