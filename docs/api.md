# API Reference

> **Version**: 1.1.0  
> **Package**: `@hex4code/core`

---

## Overview

`@hex4code/core` is the core engine of Hex4Code, providing session management, multi-model routing, semantic cache, tool execution, pipeline orchestration, and more. All APIs are written in TypeScript and support ES Module imports.

---

## Table of Contents

- [SessionManager](#sessionmanager)
- [SessionStore](#sessionstore)
- [ModelRouter](#modelrouter)
- [ProviderRegistry](#providerregistry)
- [ToolExecutor](#toolexecutor)
- [SemanticCache](#semanticcache)
- [DualTrit](#dualtrit)
- [PipelineOrchestration](#pipelineorchestration)
- [McpManager](#mcpmanager)
- [RAG Knowledge Base](#rag-knowledge-base)
- [Skills System](#skills-system)

---

## SessionManager

Session management is the core engine responsible for the complete interaction loop with LLMs (send → receive → tool call → continue).

### Import

```typescript
import { SessionManager } from "@hex4code/core/session";
```

### Constructor

```typescript
new SessionManager(projectRoot: string)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectRoot` | `string` | Project root directory path |

### Main Methods

#### `run()`

Start a conversation interaction loop.

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

Compress session context to reduce token usage.

```typescript
compact(messages: SessionMessage[], maxTokens: number): SessionMessage[]
```

### Related Types

```typescript
// SessionEntry — session entry
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

## SessionStore

Responsible for reading and writing session data to the filesystem.

### Import

```typescript
import { SessionStore } from "@hex4code/core/session-store";
```

### Main Methods

```typescript
class SessionStore {
  constructor(projectRoot: string);

  // Load session index
  loadSessionsIndex(): SessionsIndex;

  // Save session index
  saveSessionsIndex(index: SessionsIndex): void;

  // Append a message to a JSONL file
  appendSessionMessage(sessionId: string, message: SessionMessage): void;

  // Batch save session messages
  saveSessionMessages(sessionId: string, messages: SessionMessage[]): void;

  // Delete session message files
  removeSessionMessages(sessionIds: string[]): void;

  // Get storage path info
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

## ModelRouter

Automatically selects the optimal model based on task type, sorted by capability + cost.

### Import

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
  reason: string;  // Routing reason
}
```

### calculateCost()

```typescript
function calculateCost(
  inputTokens: number,
  outputTokens: number,
  modelId: string
): number  // Returns USD amount
```

### getContextWindow()

```typescript
function getContextWindow(modelId: string): number  // Returns token count
```

### detectConfiguredProviders()

```typescript
function detectConfiguredProviders(): string[]
// Detects which Providers are configured via environment variables
```

---

## ProviderRegistry

Pre-registered model provider information management, pure data layer with zero external dependencies.

### Import

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
// All pre-registered Provider configs
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

### Query Functions

```typescript
// Find by model ID
getModelDef(modelId: string): ModelDef | undefined

// Find by Provider ID
getProvider(providerId: ModelProvider): ProviderConfig | undefined

// Find provider by model
getProviderByModel(modelId: string): ProviderConfig | undefined

// Filter models by capability (sorted by input price ascending)
getModelsByCapability(capability: ModelCapability): ModelDef[]
// capability: "code" | "reasoning" | "analysis" | "chat" | "fast"

// Get all models under a Provider
getModelsByProvider(providerId: ModelProvider): string[]

// Check if model has a capability
modelHasCapability(modelId: string, capability: ModelCapability): boolean

// Get recommended models for a task
getRecommendedModels(task: "completion" | "generation" | "analysis" | "review" | "chat"): ModelDef[]

// Get default model for task
getDefaultModelForTask(task: "completion" | "generation" | "analysis" | "review" | "chat"): string
```

### Supported Models

| Provider | Model | Context Window | Input Price | Output Price |
|----------|-------|---------------|-------------|--------------|
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

*Prices in USD per million tokens*

---

## ToolExecutor

Executes tool calls issued by the LLM (bash/read/write/edit/build/test/git/codeIndex/WebSearch/AskUserQuestion).

### Import

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

  // Execute tool calls in batch
  async executeToolCalls(
    sessionId: string,
    toolCalls: unknown[],
    hooks?: ToolExecutionHooks
  ): Promise<ToolCallExecution[]>
}
```

### Built-in Tools

| Tool | Handler | Description |
|------|---------|-------------|
| `bash` | `bash-handler` | Execute shell commands |
| `read` | `read-handler` | Read file contents |
| `write` | `write-handler` | Write/create files |
| `edit` | `edit-handler` | Edit files (precise replacement) |
| `build` | `build-handler` | Execute build commands |
| `test` | `test-handler` | Execute tests |
| `git` | `git-handler` | Git operations |
| `codeIndex` | `code-index-handler` | Code index search |
| `WebSearch` | `web-search-handler` | Web search |
| `AskUserQuestion` | `ask-user-question-handler` | Ask user questions |

### Trust Chain (TC)

```typescript
type TCType = "TC_NONE" | "TC_CARRY" | "TC_UNCERTAIN" | "TC_MIXED";

// Merge multiple TC states
function mergeTC(states: TCType[]): TCType

// Propagate upstream TC to downstream tool results
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

### Execution Hooks

```typescript
interface ToolExecutionHooks {
  onProcessStart?: (processId: string | number, command: string) => void;
  onProcessExit?: (processId: string | number) => void;
  shouldStop?: () => boolean;
}
```

---

## SemanticCache

LLM response cache based on n-gram cosine similarity, with TTL expiration and LRU eviction.

### Import

```typescript
import { SemanticCache, getGlobalCache, resetGlobalCache } from "@hex4code/core/cache/semantic-cache";
```

### SemanticCache

```typescript
class SemanticCache {
  constructor(config?: SemanticCacheConfig);

  // Look up cache hit
  find(query: string, model: string): { hit: true; entry: CacheEntry } | { hit: false };

  // Write to cache
  set(query: string, response: string, model: string, ttl?: number): void;

  // Look up and auto-record hit rate
  findWithStats(query: string, model: string): { hit: true; entry: CacheEntry } | { hit: false };

  // Cache stats
  stats(): { totalEntries: number; totalModels: string[]; hitRate: number; hits: number; misses: number };

  // Clear cache
  clear(): void;

  // Evict expired entries
  evictExpired(): number;

  // LRU eviction
  evictLRU(targetCount: number): number;

  // Release resources
  dispose(): void;
}

interface SemanticCacheConfig {
  threshold?: number;     // Similarity threshold, default 0.85
  maxEntries?: number;    // Max entries, default 200
  defaultTtl?: number;    // Default TTL (ms), default 3600000
  persistPath?: string;   // Persistence path
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

### Global Singleton

```typescript
// Get global cache (auto-sets default persistence path ~/.hex4code/cache/semantic-cache.json)
getGlobalCache(config?: SemanticCacheConfig): SemanticCache

// Reset global cache (mainly for testing)
resetGlobalCache(): void
```

---

## DualTrit

Compresses tool result JSON into a compact format, saving approximately 40% on tokens.

### Import

```typescript
import { dualTritCompress, dualTritDecompress, estimateCompression } from "@hex4code/core/compression/dual-trit";
```

### Functions

```typescript
// Compress: convert standard JSON to compact format
function dualTritCompress(payload: Record<string, unknown>): Record<string, unknown>

// Decompress: restore to standard JSON
function dualTritDecompress(payload: Record<string, unknown>): Record<string, unknown>

// Estimate compression ratio
function estimateCompression(payload: Record<string, unknown>): {
  before: number;
  after: number;
  saved: number;
  percent: number;
}
```

### Field Mapping

| Original Field | Compressed | Description |
|----------------|------------|-------------|
| `ok` | `k` | Status |
| `name` | `n` | Tool name |
| `output` | `o` | Output |
| `error` | `e` | Error |
| `tcState` | `t` | Trust state |
| `tcChain` | `c` | Trust chain |

---

## PipelineOrchestration

Pipeline orchestration system that detects pipeline patterns in tool call sequences.

### Import

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

### Pipeline Stages

| Stage | Tool Call |
|-------|-----------|
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

## McpManager

Model Context Protocol external tool server management.

### Import

```typescript
import { McpManager, McpServerStatus } from "@hex4code/core/mcp/mcp-manager";
```

### McpManager

```typescript
class McpManager {
  // Prepare server configuration
  prepare(servers?: Record<string, McpServerConfig>): void;

  // Initialize and connect all servers
  async initialize(servers?: Record<string, McpServerConfig>): Promise<void>;

  // Get MCP tool definitions (for generating OpenAI tool schema)
  getMcpToolDefinitions(): Array<{ type: "function"; function: { ... } }>;

  // Check if a tool is an MCP tool
  isMcpTool(name: string): boolean;

  // Execute MCP tool
  async executeMcpTool(name: string, args: Record<string, unknown>): Promise<{ ok: boolean; name: string; output?: string; error?: string }>;

  // Get all server statuses
  getStatus(): McpServerStatus[];

  // Disconnect all connections
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

## RAG Knowledge Base

Retrieval-augmented generation based on historical sessions.

### Import

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

### Functions

```typescript
// Rebuild knowledge base from all historical JSONL sessions
rebuildKnowledgeBase(): { chunks: number; sessions: number }

// Search relevant knowledge
searchKnowledge(query: string, topK?: number): Array<{ chunk: KnowledgeChunk; score: number }>

// Format search results
formatKnowledgeResults(results: Array<{ chunk: KnowledgeChunk; score: number }>): string

// Extract error→fix patterns
extractErrorPatterns(): ErrorPattern[]

// Search error patterns
searchPatterns(query: string, topK?: number): ErrorPattern[]

// Get knowledge base stats
getKnowledgeStats(): { chunks: number; sessions: number }
```

---

## Skills System

User-level and project-level custom skill configuration.

### Import

```typescript
import {
  resolveSkillPath,
  readSkillInfo,
  getSkillKey,
  getSkillKeyByName,
  dedupeSkills,
} from "@hex4code/core/session-skill";
```

### Functions

```typescript
// Resolve skill path (supports ~/  ./  absolute paths)
resolveSkillPath(skillPath: string, projectRoot: string): string

// Read skill metadata (from gray-matter YAML front matter)
readSkillInfo(skillPath: string, displayPath: string, fallbackName: string): SkillInfo

// Get skill unique key
getSkillKey(skill: Pick<SkillInfo, "path">): string
getSkillKeyByName(name: string): string

// Deduplicate skill list
dedupeSkills(skills?: SkillInfo[]): SkillInfo[] | undefined

interface SkillInfo {
  name: string;
  path: string;
  description: string;
}
```

---

## ProviderClient

OpenAI-compatible client factory.

### Import

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
