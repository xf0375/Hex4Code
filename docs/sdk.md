# SDK 使用指南 (SDK Guide)

> **版本**: 1.1.0

---

## 概述

Hex4Code SDK 面向希望在自有应用中集成 AI 编码能力的开发者。SDK 核心包 `@hex4code/core` 提供完整的会话管理、多模型路由、工具执行等能力。

---

## 目录

- [安装](#安装)
- [快速开始](#快速开始)
- [基础用法](#基础用法)
  - [创建会话](#创建会话)
  - [发送用户消息](#发送用户消息)
  - [处理工具调用](#处理工具调用)
  - [持久化存储](#持久化存储)
- [高级用法](#高级用法)
  - [多模型路由](#多模型路由)
  - [语义缓存](#语义缓存)
  - [知识库 (RAG)](#知识库-rag)
  - [MCP 协议集成](#mcp-协议集成)
  - [Skills 技能系统](#skills-技能系统)
  - [流水线编排](#流水线编排)
- [完整示例](#完整示例)
- [TypeScript 类型](#typescript-类型)

---

## 安装

### npm

```bash
npm install @hex4code/core
```

### 从源码使用（开发模式）

在 Hex4Code 的 monorepo 中，`@hex4code/core` 以 TypeScript 源码形式直接引用：

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@hex4code/core/*": ["../packages/core/src/*"]
    }
  }
}
```

---

## 快速开始

```typescript
import { SessionManager } from "@hex4code/core/session";
import { createClient } from "@hex4code/core/models/provider-client";

// 1. 创建 OpenAI 兼容客户端
const { client, model } = createClient("deepseek", "your-api-key");

// 2. 创建会话管理器
const session = new SessionManager("/path/to/project");

// 3. 发起对话
const result = await session.run({
  messages: [
    { role: "user", content: "请帮我创建一个 TypeScript 工具函数" }
  ],
  sessionId: crypto.randomUUID(),
  createOpenAIClient: () => ({ client, model }),
});

console.log(result.messages);
```

---

## 基础用法

### 创建会话

```typescript
import { SessionManager } from "@hex4code/core/session";
import { SessionStore } from "@hex4code/core/session-store";
import OpenAI from "openai";

// 初始化 SessionManager
const sessionManager = new SessionManager(projectRoot);

// 配置 OpenAI 客户端工厂
function createOpenAIClient() {
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });
  return {
    client,
    model: "deepseek-chat",
    baseURL: "https://api.deepseek.com",
    thinkingEnabled: false,
  };
}
```

### 发送用户消息

```typescript
// 调用 run() 启动交互循环
const result = await sessionManager.run({
  messages: [
    {
      role: "user",
      content: "写一个 Python 脚本读取 CSV 并输出统计信息"
    }
  ],
  sessionId: "session-001",
  createOpenAIClient,
});

// result 包含完整的对话历史
console.log("消息数:", result.messages.length);
console.log("Token 用量:", result.totalUsage);
```

### 处理工具调用

ToolExecutor 自动在 `run()` 内部处理工具调用循环。如需手动使用：

```typescript
import { ToolExecutor } from "@hex4code/core/tools/executor";
import type { McpManager } from "@hex4code/core/mcp/mcp-manager";

const executor = new ToolExecutor(projectRoot, createOpenAIClient, mcpManager);

const results = await executor.executeToolCalls(
  sessionId,
  toolCalls,
  {
    onProcessStart: (pid, cmd) => console.log(`启动: ${cmd}`),
    onProcessExit: (pid) => console.log(`进程退出: ${pid}`),
    shouldStop: () => false,
  }
);

for (const exec of results) {
  console.log(`工具: ${exec.result.name}, 成功: ${exec.result.ok}`);
}
```

### 持久化存储

```typescript
import { SessionStore } from "@hex4code/core/session-store";

const store = new SessionStore(projectRoot);

// 加载会话索引
const index = store.loadSessionsIndex();

// 保存消息（JSONL 格式）
store.saveSessionMessages("session-001", messages);

// 追加消息
store.appendSessionMessage("session-001", {
  role: "assistant",
  content: "这是新的回复",
});

// 删除会话
store.removeSessionMessages(["session-001"]);
```

---

## 高级用法

### 多模型路由

```typescript
import { routeTask, detectConfiguredProviders } from "@hex4code/core/models/model-router";

// 检测可用的 Provider
const providers = detectConfiguredProviders();
console.log("已配置:", providers); // ["deepseek", "qwen"]

// 按任务类型路由
const route = routeTask("generation", providers, settings);
console.log(`任务: generation → ${route.model} (${route.reason})`);

// 计算成本
const cost = calculateCost(10000, 2000, "deepseek-chat");
console.log(`预估成本: $${cost.toFixed(4)}`);
```

### 语义缓存

```typescript
import { getGlobalCache } from "@hex4code/core/cache/semantic-cache";

const cache = getGlobalCache({
  threshold: 0.85,
  maxEntries: 500,
  defaultTtl: 7200000,  // 2 小时
  persistPath: "./my-cache.json",
});

// 使用缓存
async function cachedCompletion(query: string): Promise<string> {
  const result = cache.findWithStats(query, "deepseek-chat");
  if (result.hit) {
    return result.entry.response;
  }

  const response = await callLLM(query);

  cache.set(query, response, "deepseek-chat");
  return response;
}

// 查看统计
const stats = cache.stats();
console.log(`命中率: ${(stats.hitRate * 100).toFixed(1)}%`);
```

### 知识库 (RAG)

```typescript
import {
  rebuildKnowledgeBase,
  searchKnowledge,
  formatKnowledgeResults,
} from "@hex4code/core/knowledge/session-rag";

// 构建知识库
const { chunks, sessions } = rebuildKnowledgeBase();
console.log(`加载 ${chunks} 个知识块 (${sessions} 个会话)`);

// 搜索相关知识
const results = searchKnowledge("如何配置多模型路由", 5);
console.log(formatKnowledgeResults(results));

// 错误模式搜索
import { extractErrorPatterns, searchPatterns } from "@hex4code/core/knowledge/session-rag";

const patterns = searchPatterns("TypeError undefined", 3);
for (const p of patterns) {
  console.log(`[${p.finalStatus}] ${p.errorType}`);
  console.log(`  修复: ${p.fixSequence.join(" → ")}`);
}
```

### MCP 协议集成

```typescript
import { McpManager } from "@hex4code/core/mcp/mcp-manager";

const mcpManager = new McpManager();

// 配置 MCP 服务器
const servers = {
  "filesystem": {
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
    env: {}
  },
  "database": {
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-sqlite", "/tmp/mydb"],
    env: {}
  }
};

// 初始化（连接所有服务器）
await mcpManager.initialize(servers);

// 获取可用工具
const tools = mcpManager.getMcpToolDefinitions();
console.log("MCP 工具:", tools.map(t => t.function.name));

// 查看状态
const status = mcpManager.getStatus();
for (const s of status) {
  console.log(`${s.name}: ${s.status} (${s.toolCount} tools)`);
}

// 断开连接
mcpManager.disconnect();
```

### Skills 技能系统

```typescript
import {
  resolveSkillPath,
  readSkillInfo,
  dedupeSkills,
} from "@hex4code/core/session-skill";

// 技能目录结构
// ~/.agents/skills/          ← 用户级
//   my-custom-skill.md
// ./.agents/skills/          ← 项目级
//   project-skill.md

const projectRoot = "/path/to/project";

// 读取技能元信息
const skillPath = resolveSkillPath("~/.agents/skills/my-custom-skill.md", projectRoot);
const skill = readSkillInfo(skillPath, "~/.agents/skills/my-custom-skill.md", "my-custom-skill");

console.log(`技能: ${skill.name}`);
console.log(`描述: ${skill.description}`);

// 去重
const allSkills = [skill1, skill2, duplicateSkill];
const unique = dedupeSkills(allSkills);
console.log(`去重后: ${unique?.length} 个技能`);
```

### 流水线编排

```typescript
import {
  detectPipeline,
  buildPipelineSummary,
} from "@hex4code/core/orchestration/hex4code-pipeline";

// 检测工具调用序列中的流水线模式
const pipeline = detectPipeline([
  { id: "1", type: "function", function: { name: "build", arguments: "{}" } },
  { id: "2", type: "function", function: { name: "test", arguments: "{}" } },
  { id: "3", type: "function", function: { name: "codeIndex", arguments: "{}" } },
  { id: "4", type: "function", function: { name: "git", arguments: "{}" } },
]);

if (pipeline) {
  for (const stage of pipeline) {
    console.log(`${stage.symbol} → ${stage.name}`);
  }
  // 输出:
  //   build → Build
  //   test → Test
  //   codeIndex → CodeIndex
  //   git → Git
}
```

---

## 完整示例

```typescript
import { SessionManager } from "@hex4code/core/session";
import { SessionStore } from "@hex4code/core/session-store";
import { McpManager } from "@hex4code/core/mcp/mcp-manager";
import { SemanticCache, getGlobalCache } from "@hex4code/core/cache/semantic-cache";
import { routeTask, detectConfiguredProviders } from "@hex4code/core/models/model-router";
import OpenAI from "openai";
import * as crypto from "crypto";

async function main() {
  const projectRoot = process.cwd();
  const sessionId = crypto.randomUUID();

  // 1. 检测可用 Provider
  const providers = detectConfiguredProviders();
  console.log(`可用 Provider: ${providers.join(", ")}`);

  // 2. 创建 OpenAI 客户端
  const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });

  const createClient = () => ({
    client: openai,
    model: "deepseek-chat",
    baseURL: "https://api.deepseek.com",
    thinkingEnabled: false,
  });

  // 3. 初始化 MCP (可选)
  const mcpManager = new McpManager();

  // 4. 初始化语义缓存
  const cache = getGlobalCache({ persistPath: undefined });

  // 5. 初始化 SessionManager
  const sessionManager = new SessionManager(projectRoot);

  // 6. 发起对话
  try {
    const result = await sessionManager.run({
      messages: [
        {
          role: "user",
          content: "分析项目中最大的 TypeScript 文件，并给出重构建议"
        }
      ],
      sessionId,
      createOpenAIClient: createClient,
      mcpManager,
      agentMode: "hex4",  // 使用流水线模式
    });

    // 7. 输出结果
    console.log(`\n=== 对话完成 ===`);
    console.log(`消息数: ${result.messages.length}`);

    // 8. 持久化
    const store = new SessionStore(projectRoot);
    store.saveSessionMessages(sessionId, result.messages);
    console.log(`已保存会话: ${sessionId}`);
  } catch (error) {
    console.error("会话出错:", error);
  } finally {
    cache.dispose();
    mcpManager.disconnect();
  }
}

main();
```

---

## TypeScript 类型

SDK 提供完整的 TypeScript 类型定义，主要类型包括：

```typescript
// 会话相关
import type {
  SessionEntry,
  SessionMessage,
  SessionStatus,
  SkillInfo,
  UserPromptContent,
  LlmStreamProgress,
  MessageMeta,
  SessionsIndex,
} from "@hex4code/core/session-types";

// 设置相关
import type {
  Hex4codeSettings,
  ResolvedHex4codeSettings,
  ModelRouting,
  TaskType,
} from "@hex4code/core/settings";

// 模型相关
import type {
  ModelProvider,
  ModelDef,
  ModelCapability,
  ProviderConfig,
  RouteResult,
} from "@hex4code/core/models/model-router";

// 工具执行
import type {
  ToolCall,
  ToolExecutionResult,
  ToolExecutionHooks,
  TCType,
  TCLink,
} from "@hex4code/core/tools/executor";

// MCP
import type { McpServerConfig } from "@hex4code/core/settings";
import type { McpServerStatus } from "@hex4code/core/mcp/mcp-manager";

// 缓存
import type { CacheEntry, SemanticCacheConfig } from "@hex4code/core/cache/semantic-cache";

// 知识库
import type { KnowledgeChunk, ErrorPattern } from "@hex4code/core/knowledge/session-rag";
```
