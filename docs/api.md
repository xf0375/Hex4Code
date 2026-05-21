# API 参考文档 (API Reference)

> **版本**: 1.1.0  
> **包**: `@hex4code/core`

---

## 概述

`@hex4code/core` 是 Hex4Code 的核心引擎，提供会话管理、多模型路由、语义缓存、工具执行、流水线编排等能力。所有 API 均以 TypeScript 编写，支持 ES Module 导入。

---

## 目录

- [SessionManager (会话管理)](#sessionmanager-会话管理)
- [SessionStore (会话持久化)](#sessionstore-会话持久化)
- [ModelRouter (多模型路由)](#modelrouter-多模型路由)
- [ProviderRegistry (供应商注册)](#providerregistry-供应商注册)
- [ToolExecutor (工具执行)](#toolexecutor-工具执行)
- [SemanticCache (语义缓存)](#semanticcache-语义缓存)
- [DualTrit (三元压缩)](#dualtrit-三元压缩)
- [PipelineOrchestration (流水线编排)](#pipelineorchestration-流水线编排)
- [McpManager (MCP 管理)](#mcpmanager-mcp-管理)
- [RAG 知识库](#rag-知识库)
- [Skills 技能系统](#skills-技能系统)

---

## SessionManager (会话管理)

会话管理是核心引擎，负责与 LLM 的完整交互循环（发送 → 接收 → 工具调用 → 继续）。

### 导入

```typescript
import { SessionManager } from "@hex4code/core/session";
```

### 构造函数

```typescript
new SessionManager(projectRoot: string)
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `projectRoot` | `string` | 项目根目录路径 |

### 主要方法

#### `run()`

启动一次对话交互循环。

```typescript
async run(options: {
  messages: SessionMessage[];
  sessionId: string;
  createOpenAIClient: CreateOpenAIClient;
  mcpManager?: McpManager;
  skills?: SkillInfo[];
  agentMode?: "hex4" | "general";
}): Promise<SessionResult>
```

#### `compact()`

压缩会话上下文，减少 Token 使用。

```typescript
compact(messages: SessionMessage[], maxTokens: number): SessionMessage[]
```

### 相关类型

```typescript
// SessionEntry — 会话条目
interface SessionEntry {
  id: string;
  summary: string | null;
  assistantReply: string | null;
  assistantThinking: string | null;
  assistantRefusal: string | null;
  toolCalls: unknown[] | null;
  status: SessionStatus;
  failReason: string | null;
  usage: unknown | null;
  totalCost: number;
  activeTokens: number;
  createTime: string;
  updateTime: string;
  processes: Map<string, { startTime: string; command: string }> | null;
}

// SessionStatus
type SessionStatus = "failed" | "pending" | "processing" | "waiting_for_user" | "completed" | "interrupted";

// SessionMessage
interface SessionMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | UserPromptContent[] | null;
  meta?: MessageMeta;
  tool_call_id?: string;
  tool_calls?: unknown[];
}

// UserPromptContent
interface UserPromptContent {
  type: "image" | "text" | "audio" | "file";
  text?: string;
  source?: { type: string; media_type: string; data: string };
}

// MessageMeta
interface MessageMeta {
  usage?: { input_tokens: number; output_tokens: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number };
  userPromptContent?: UserPromptContent[];
  agentMode?: "hex4" | "general";
  tokenCount?: number;
  cost?: number;
  name?: string;
  skills?: SkillInfo[];
  finishReason?: string;
}
```

---

## SessionStore (会话持久化)

负责会话数据的文件系统读写。

### 导入

```typescript
import { SessionStore } from "@hex4code/core/session-store";
```

### 主要方法

```typescript
class SessionStore {
  constructor(projectRoot: string);

  // 加载会话索引
  loadSessionsIndex(): SessionsIndex;

  // 保存会话索引
  saveSessionsIndex(index: SessionsIndex): void;

  // 追加一条消息到 JSONL 文件
  appendSessionMessage(sessionId: string, message: SessionMessage): void;

  // 批量保存会话消息
  saveSessionMessages(sessionId: string, messages: SessionMessage[]): void;

  // 删除会话消息文件
  removeSessionMessages(sessionIds: string[]): void;

  // 获取存储路径信息
  getProjectStorage(): { projectCode: string; projectDir: string; sessionsIndexPath: string };
}

// SessionsIndex
interface SessionsIndex {
  version: number;
  entries: SessionEntry[];
  originalPath: string;
}
```

---

## ModelRouter (多模型路由)

根据任务类型自动选择最优模型，按能力 + 成本排序。

### 导入

```typescript
import { routeTask, calculateCost, getContextWindow, detectConfiguredProviders } from "@hex4code/core/models/model-router";
```

### routeTask()

```typescript
function routeTask(
  taskType: TaskType,
  configuredProviders: string[],
  settings: Hex4codeSettings
): RouteResult

type TaskType = "completion" | "generation" | "analysis" | "review" | "chat";

interface RouteResult {
  model: string;
  provider: string;
  baseURL?: string;
  reason: string;  // 路由选择原因
}
```

### calculateCost()

```typescript
function calculateCost(
  inputTokens: number,
  outputTokens: number,
  modelId: string
): number  // 返回美元金额
```

### getContextWindow()

```typescript
function getContextWindow(modelId: string): number  // 返回 Token 数
```

### detectConfiguredProviders()

```typescript
function detectConfiguredProviders(): string[]
// 检测环境变量中配置了哪些 Provider
```

---

## ProviderRegistry (供应商注册)

预注册的模型供应商信息管理，纯数据层，零外部依赖。

### 导入

```typescript
import {
  PROVIDERS,
  getModelDef,
  getProvider,
  getProviderByModel,
  getModelsByCapability,
  getModelsByProvider,
  modelHasCapability,
  getRecommendedModels,
  getDefaultModelForTask,
} from "@hex4code/core/models/provider-registry";
```

### PROVIDERS

```typescript
// 所有预注册的 Provider 配置数组
const PROVIDERS: ProviderConfig[];

interface ProviderConfig {
  id: ModelProvider;
  name: string;
  apiKeyEnv: string;
  defaultBaseURL: string;
  supportsStreaming: boolean;
  supportsThinking: boolean;
  supportsMultimodal: boolean;
  models: ModelDef[];
}

type ModelProvider = "deepseek" | "openai" | "qwen" | "gemini" | "ernie" | "minimax" | "glm" | "anthropic" | "groq";
```

### 查询函数

```typescript
// 按模型 ID 查找
getModelDef(modelId: string): ModelDef | undefined

// 按 Provider ID 查找
getProvider(providerId: ModelProvider): ProviderConfig | undefined

// 按模型查找其所属 Provider
getProviderByModel(modelId: string): ProviderConfig | undefined

// 按能力过滤模型（按输入价格升序）
getModelsByCapability(capability: ModelCapability): ModelDef[]
// capability: "code" | "reasoning" | "analysis" | "chat" | "fast"

// 获取某 Provider 下的所有模型
getModelsByProvider(providerId: ModelProvider): string[]

// 判断模型是否具备某能力
modelHasCapability(modelId: string, capability: ModelCapability): boolean

// 获取推荐的模型列表
getRecommendedModels(task: "completion" | "generation" | "analysis" | "review" | "chat"): ModelDef[]

// 获取默认模型
getDefaultModelForTask(task: "completion" | "generation" | "analysis" | "review" | "chat"): string
```

### 支持的模型

| Provider | 模型 | 上下文窗口 | 输入价格 | 输出价格 |
|----------|------|-----------|---------|---------|
| DeepSeek | deepseek-v4-pro | 1M | $0.50 | $2.00 |
| DeepSeek | deepseek-v4-flash | 1M | $0.14 | $0.42 |
| DeepSeek | deepseek-chat | 128K | $0.14 | $0.28 |
| DeepSeek | deepseek-reasoner | 128K | $0.55 | $2.19 |
| OpenAI | gpt-4o | 128K | $2.50 | $10.00 |
| OpenAI | gpt-4o-mini | 128K | $0.15 | $0.60 |
| Qwen | qwen-max | 128K | $0.80 | $2.00 |
| Qwen | qwen-plus | 128K | $0.40 | $1.20 |
| Qwen | qwen-turbo | 128K | $0.20 | $0.60 |
| Anthropic | claude-opus-4 | 200K | $15.00 | $75.00 |
| Anthropic | claude-sonnet-4 | 200K | $3.00 | $15.00 |
| Anthropic | claude-haiku-4 | 200K | $0.80 | $4.00 |

*价格单位：美元/百万 Token*

---

## ToolExecutor (工具执行)

执行 LLM 发出的工具调用（bash/read/write/edit/build/test/git/codeIndex/WebSearch/AskUserQuestion）。

### 导入

```typescript
import { ToolExecutor, mergeTC, propagateTC } from "@hex4code/core/tools/executor";
```

### ToolExecutor

```typescript
class ToolExecutor {
  constructor(
    projectRoot: string,
    createOpenAIClient?: CreateOpenAIClient,
    mcpManager?: McpManager
  );

  // 批量执行工具调用
  async executeToolCalls(
    sessionId: string,
    toolCalls: unknown[],
    hooks?: ToolExecutionHooks
  ): Promise<ToolCallExecution[]>
}
```

### 内置工具

| 工具名 | 处理模块 | 说明 |
|--------|---------|------|
| `bash` | `bash-handler` | 执行 Shell 命令 |
| `read` | `read-handler` | 读取文件内容 |
| `write` | `write-handler` | 写入/创建文件 |
| `edit` | `edit-handler` | 编辑文件（精确替换） |
| `build` | `build-handler` | 执行构建命令 |
| `test` | `test-handler` | 执行测试 |
| `git` | `git-handler` | Git 操作 |
| `codeIndex` | `code-index-handler` | 代码索引搜索 |
| `WebSearch` | `web-search-handler` | 网络搜索 |
| `AskUserQuestion` | `ask-user-question-handler` | 向用户提问 |

### 信任链 (TC)

```typescript
type TCType = "TC_NONE" | "TC_CARRY" | "TC_UNCERTAIN" | "TC_MIXED";

// 合并多个 TC 状态
function mergeTC(states: TCType[]): TCType

// 传播上游 TC 到下游工具结果
function propagateTC(result: ToolExecutionResult, upstreamChain: TCLink[]): ToolExecutionResult

interface TCLink {
  source: string;
  tc: TCType;
  description?: string;
}

interface ToolExecutionResult {
  ok: boolean;
  name: string;
  output?: string;
  error?: string;
  metadata?: Record<string, unknown>;
  awaitUserResponse?: boolean;
  followUpMessages?: ToolExecutionFollowUpMessage[];
  tcState?: TCType;
  tcChain?: TCLink[];
}
```

### 执行钩子

```typescript
interface ToolExecutionHooks {
  onProcessStart?: (processId: string | number, command: string) => void;
  onProcessExit?: (processId: string | number) => void;
  shouldStop?: () => boolean;
}
```

---

## SemanticCache (语义缓存)

基于 n-gram 余弦相似度的 LLM 响应缓存，支持 TTL 过期和 LRU 淘汰。

### 导入

```typescript
import { SemanticCache, getGlobalCache, resetGlobalCache } from "@hex4code/core/cache/semantic-cache";
```

### SemanticCache

```typescript
class SemanticCache {
  constructor(config?: SemanticCacheConfig);

  // 查找缓存命中
  find(query: string, model: string): { hit: true; entry: CacheEntry } | { hit: false };

  // 写入缓存
  set(query: string, response: string, model: string, ttl?: number): void;

  // 查找并自动记录命中率
  findWithStats(query: string, model: string): { hit: true; entry: CacheEntry } | { hit: false };

  // 缓存统计
  stats(): { totalEntries: number; totalModels: string[]; hitRate: number; hits: number; misses: number };

  // 清空缓存
  clear(): void;

  // 清理过期条目
  evictExpired(): number;

  // LRU 淘汰
  evictLRU(targetCount: number): number;

  // 释放资源
  dispose(): void;
}

interface SemanticCacheConfig {
  threshold?: number;     // 相似度阈值，默认 0.85
  maxEntries?: number;    // 最大条目数，默认 200
  defaultTtl?: number;    // 默认 TTL (ms)，默认 3600000
  persistPath?: string;   // 持久化路径
}

interface CacheEntry {
  query: string;
  response: string;
  model: string;
  createdAt: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  fingerprint: Record<string, number>;
}
```

### 全局单例

```typescript
// 获取全局缓存（自动设置默认持久化路径 ~/.hex4code/cache/semantic-cache.json）
getGlobalCache(config?: SemanticCacheConfig): SemanticCache

// 重置全局缓存（主要用于测试）
resetGlobalCache(): void
```

---

## DualTrit (三元压缩)

将工具结果 JSON 压缩为紧凑格式，约节省 40% Token。

### 导入

```typescript
import { dualTritCompress, dualTritDecompress, estimateCompression } from "@hex4code/core/compression/dual-trit";
```

### 函数

```typescript
// 压缩：将标准 JSON 转为紧凑格式
function dualTritCompress(payload: Record<string, unknown>): Record<string, unknown>

// 解压缩：还原为标准 JSON
function dualTritDecompress(payload: Record<string, unknown>): Record<string, unknown>

// 估算压缩率
function estimateCompression(payload: Record<string, unknown>): {
  before: number;
  after: number;
  saved: number;
  percent: number;
}
```

### 字段映射

| 原字段 | 压缩后 | 说明 |
|--------|--------|------|
| `ok` | `k` | 状态 |
| `name` | `n` | 工具名 |
| `output` | `o` | 输出 |
| `error` | `e` | 错误 |
| `tcState` | `t` | 信任状态 |
| `tcChain` | `c` | 信任链 |

---

## PipelineOrchestration (流水线编排)

流水线编排系统，感知工具调用序列中的流水线模式。

### 导入

```typescript
import {
  detectPipeline,
  buildPipelineSummary,
  getPipelineTcContext,
  isBuildStage,
  isTestStage,
  isCodeIndexStage,
  isGitStage,
} from "@hex4code/core/orchestration/hex4code-pipeline";
```

### 流水线阶段

| 阶段 | 工具调用 |
|------|---------|
| Build | `build` |
| Test | `test` |
| CodeIndex | `codeIndex` |
| Git | `git` |

```typescript
function detectPipeline(toolCalls: ToolCall[]): PipelineStage[] | null

interface PipelineStage {
  symbol: "build" | "test" | "codeIndex" | "git";
  name: string;
  toolCall: ToolCall;
  result?: ToolExecutionResult;
}
```

---

## McpManager (MCP 管理)

Model Context Protocol 外部工具服务器管理。

### 导入

```typescript
import { McpManager, McpServerStatus } from "@hex4code/core/mcp/mcp-manager";
```

### McpManager

```typescript
class McpManager {
  // 准备服务器配置
  prepare(servers?: Record<string, McpServerConfig>): void;

  // 初始化并连接所有服务器
  async initialize(servers?: Record<string, McpServerConfig>): Promise<void>;

  // 获取 MCP 工具定义（用于生成 OpenAI tool schema）
  getMcpToolDefinitions(): Array<{ type: "function"; function: { ... } }>;

  // 判断是否为 MCP 工具
  isMcpTool(name: string): boolean;

  // 执行 MCP 工具
  async executeMcpTool(name: string, args: Record<string, unknown>): Promise<{ ok: boolean; name: string; output?: string; error?: string }>;

  // 获取所有服务器状态
  getStatus(): McpServerStatus[];

  // 断开所有连接
  disconnect(): void;
}

interface McpServerStatus {
  name: string;
  status: "starting" | "ready" | "failed";
  connected: boolean;
  error?: string;
  toolCount: number;
  tools: string[];
}
```

---

## RAG 知识库

基于历史会话的检索增强生成。

### 导入

```typescript
import {
  rebuildKnowledgeBase,
  searchKnowledge,
  formatKnowledgeResults,
  extractErrorPatterns,
  searchPatterns,
  getKnowledgeStats,
} from "@hex4code/core/knowledge/session-rag";
```

### 函数

```typescript
// 从所有历史 JSONL 会话重建知识库
rebuildKnowledgeBase(): { chunks: number; sessions: number }

// 搜索相关知识
searchKnowledge(query: string, topK?: number): Array<{ chunk: KnowledgeChunk; score: number }>

// 格式化搜索结果
formatKnowledgeResults(results: Array<{ chunk: KnowledgeChunk; score: number }>): string

// 提取错误→修复模式
extractErrorPatterns(): ErrorPattern[]

// 搜索错误模式
searchPatterns(query: string, topK?: number): ErrorPattern[]

// 获取知识库统计
getKnowledgeStats(): { chunks: number; sessions: number }
```

---

## Skills 技能系统

用户级和项目级自定义技能配置。

### 导入

```typescript
import {
  resolveSkillPath,
  readSkillInfo,
  getSkillKey,
  getSkillKeyByName,
  dedupeSkills,
} from "@hex4code/core/session-skill";
```

### 函数

```typescript
// 解析技能路径（支持 ~/  ./  绝对路径）
resolveSkillPath(skillPath: string, projectRoot: string): string

// 读取技能元信息（从 gray-matter YAML front matter）
readSkillInfo(skillPath: string, displayPath: string, fallbackName: string): SkillInfo

// 获取技能唯一键
getSkillKey(skill: Pick<SkillInfo, "path">): string
getSkillKeyByName(name: string): string

// 去重技能列表
dedupeSkills(skills?: SkillInfo[]): SkillInfo[] | undefined

interface SkillInfo {
  name: string;
  path: string;
  description: string;
}
```

---

## ProviderClient (客户端工厂)

OpenAI 兼容客户端工厂。

### 导入

```typescript
import { createClient } from "@hex4code/core/models/provider-client";
```

```typescript
function createClient(
  provider: ModelProvider,
  apiKey: string,
  baseURL?: string
): OpenAI | null
```

---
