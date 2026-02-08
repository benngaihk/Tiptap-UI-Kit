/**
 * AI Configuration Types
 * @description AI 用户配置系统类型定义
 */

/** 支持的 AI 提供商 */
export type AiProvider =
  | 'openai'
  | 'deepseek'
  | 'anthropic'
  | 'aliyun'
  | 'ollama'
  | 'custom'

/** AI 提供商信息 */
export interface AiProviderInfo {
  /** 提供商 ID */
  id: AiProvider
  /** 显示名称 */
  name: string
  /** 描述 */
  description: string
  /** 默认 API 端点 */
  defaultEndpoint: string
  /** 默认模型 */
  defaultModel: string
  /** 是否需要 API Key */
  requiresApiKey: boolean
  /** 文档链接 */
  docsUrl?: string
}

/** 用户 AI 配置 */
export interface AiUserConfig {
  /** 选择的提供商 */
  provider: AiProvider
  /** API Key（加密存储） */
  apiKey: string
  /** API 端点（可选，用于自定义或代理） */
  endpoint?: string
  /** 模型名称 */
  model: string
  /** 请求超时（毫秒） */
  timeout: number
  /** 是否启用 */
  enabled: boolean
  /** 最后更新时间 */
  updatedAt: number
}

/** AI 配置状态 */
export interface AiConfigState {
  /** 用户配置 */
  config: AiUserConfig | null
  /** 是否已初始化 */
  initialized: boolean
  /** 连接测试状态 */
  testStatus: 'idle' | 'testing' | 'success' | 'error'
  /** 测试错误信息 */
  testError: string | null
}

/** AI 配置存储接口 */
export interface AiConfigStore {
  /** 获取配置 */
  getConfig: () => AiUserConfig | null
  /** 保存配置 */
  saveConfig: (config: AiUserConfig) => void
  /** 清除配置 */
  clearConfig: () => void
  /** 获取 API Key（解密） */
  getApiKey: () => string | null
  /** 检查是否已配置 */
  isConfigured: () => boolean
}

/** 连接测试结果 */
export interface ConnectionTestResult {
  success: boolean
  message: string
  latency?: number
}

/** 默认配置值 */
export const DEFAULT_CONFIG: Omit<AiUserConfig, 'apiKey' | 'updatedAt'> = {
  provider: 'openai',
  endpoint: '',
  model: 'gpt-4o-mini',
  timeout: 60000,
  enabled: true,
}

/** 提供商列表 */
export const AI_PROVIDERS: AiProviderInfo[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, GPT-4o-mini 等模型',
    defaultEndpoint: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    requiresApiKey: true,
    docsUrl: 'https://platform.openai.com/docs',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek-V3, DeepSeek-R1 等模型',
    defaultEndpoint: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
    requiresApiKey: true,
    docsUrl: 'https://platform.deepseek.com/docs',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3.5 Sonnet, Claude 3 Opus 等模型',
    defaultEndpoint: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-5-sonnet-20241022',
    requiresApiKey: true,
    docsUrl: 'https://docs.anthropic.com',
  },
  {
    id: 'aliyun',
    name: '阿里云通义千问',
    description: 'Qwen-Max, Qwen-Plus 等模型',
    defaultEndpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
    requiresApiKey: true,
    docsUrl: 'https://help.aliyun.com/zh/dashscope/',
  },
  {
    id: 'ollama',
    name: 'Ollama (本地)',
    description: '本地运行的开源模型',
    defaultEndpoint: 'http://localhost:11434/api',
    defaultModel: 'llama3.2',
    requiresApiKey: false,
    docsUrl: 'https://ollama.com/docs',
  },
  {
    id: 'custom',
    name: '自定义',
    description: '自定义 OpenAI 兼容接口',
    defaultEndpoint: '',
    defaultModel: '',
    requiresApiKey: true,
  },
]

/** 根据 provider ID 获取提供商信息 */
export function getProviderInfo(provider: AiProvider): AiProviderInfo | undefined {
  return AI_PROVIDERS.find(p => p.id === provider)
}
