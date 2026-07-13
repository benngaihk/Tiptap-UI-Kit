/**
 * AI Document Agent - 文字指令编辑文档
 * @description 把编辑器基本操作封装为结构化工具集，AI 通过 tool-use 循环
 * 按用户的自然语言指令编写和修改文档。
 */

export {
  documentTools,
  getDocumentTool,
  getDocumentOutline,
  toOpenAiTools,
} from './documentTools'
export type { DocumentTool } from './documentTools'

export { runDocumentAgent, AgentNotConfiguredError } from './agentLoop'
export type {
  AgentCallbacks,
  AgentChatMessage,
  DocumentAgentResult,
  RunDocumentAgentOptions,
} from './agentLoop'

export { default as AiChatPanel } from './AiChatPanel.vue'
