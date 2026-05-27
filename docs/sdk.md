# SDK Guide

> **Version**: 1.1.0

---

## Overview

The Hex4Code SDK is designed for developers who want to integrate AI coding capabilities into their own applications. The core SDK package `@hex4code/core` provides complete session management, multi-model routing, tool execution, and more.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
  - [Creating a Session](#creating-a-session)
  - [Sending User Messages](#sending-user-messages)
  - [Handling Tool Calls](#handling-tool-calls)
  - [Persistent Storage](#persistent-storage)
- [Advanced Usage](#advanced-usage)
  - [Multi-Model Routing](#multi-model-routing)
  - [Semantic Cache](#semantic-cache)
  - [Knowledge Base (RAG)](#knowledge-base-rag)
  - [MCP Protocol Integration](#mcp-protocol-integration)
  - [Skills System](#skills-system)
  - [Pipeline Orchestration](#pipeline-orchestration)
- [Complete Example](#complete-example)
- [TypeScript Types](#typescript-types)

---

## Installation

### npm

```bash
npm install @hex4code/core
```

### From Source (Development Mode)

In the Hex4Code monorepo, `@hex4code/core` is referenced directly as TypeScript source:

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

## Quick Start

```typescript
import { SessionManager } from "@hex4code/core/session";
import { createClient } from "@hex4code/core/models/provider-client";

// 1. Create an OpenAI-compatible client
const { client, model } = createClient("deepseek", "your-api-key");

// 2. Create a session manager
const session = new SessionManager("/path/to/project");

// 3. Start a conversation
const result = await session.run({
  messages: [
    { role: "user", content: "Create a TypeScript utility function" }
  ],
  sessionId: crypto.randomUUID(),
  createOpenAIClient: () => ({ client, model }),
});

console.log(result.messages);
```

---

## Basic Usage

### Creating a Session

```typescript
import { SessionManager } from "@hex4code/core/session";
import { SessionStore } from "@hex4code/core/session-store";
import OpenAI from "openai";

// Initialize SessionManager
const sessionManager = new SessionManager(projectRoot);

// Configure OpenAI client factory
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

### Sending User Messages

```typescript
// Call run() to start the interaction loop
const result = await sessionManager.run({
  messages: [
    {
      role: "user",
      content: "Write a Python script to read a CSV and output statistics"
    }
  ],
  sessionId: "session-001",
  createOpenAIClient,
});

// result contains the full conversation history
console.log("Message count:", result.messages.length);
console.log("Token usage:", result.totalUsage);
```

### Handling Tool Calls

ToolExecutor automatically handles the tool call loop inside `run()`. To use it manually:

```typescript
import { ToolExecutor } from "@hex4code/core/tools/executor";
import type { McpManager } from "@hex4code/core/mcp/mcp-manager";

const executor = new ToolExecutor(projectRoot, createOpenAIClient, mcpManager);

const results = await executor.executeToolCalls(
  sessionId,
  toolCalls,
  {
    onProcessStart: (pid, cmd) => console.log(`Started: ${cmd}`),
    onProcessExit: (pid) => console.log(`Process exited: ${pid}`),
    shouldStop: () => false,
  }
);

for (const exec of results) {
  console.log(`Tool: ${exec.result.name}, Success: ${exec.result.ok}`);
}
```

### Persistent Storage

```typescript
import { SessionStore } from "@hex4code/core/session-store";

const store = new SessionStore(projectRoot);

// Load session index
const index = store.loadSessionsIndex();

// Save messages (JSONL format)
store.saveSessionMessages("session-001", messages);

// Append a message
store.appendSessionMessage("session-001", {
  role: "assistant",
  content: "This is a new reply",
});

// Delete session
store.removeSessionMessages(["session-001"]);
```

---

## Advanced Usage

### Multi-Model Routing

```typescript
import { routeTask, detectConfiguredProviders } from "@hex4code/core/models/model-router";

// Detect available providers
const providers = detectConfiguredProviders();
console.log("Configured:", providers); // ["deepseek", "qwen"]

// Route by task type
const route = routeTask("generation", providers, settings);
console.log(`Task: generation → ${route.model} (${route.reason})`);

// Calculate cost
const cost = calculateCost(10000, 2000, "deepseek-chat");
console.log(`Estimated cost: $${cost.toFixed(4)}`);
```

### Semantic Cache

```typescript
import { getGlobalCache } from "@hex4code/core/cache/semantic-cache";

const cache = getGlobalCache({
  threshold: 0.85,
  maxEntries: 500,
  defaultTtl: 7200000,  // 2 hours
  persistPath: "./my-cache.json",
});

// Using the cache
async function cachedCompletion(query: string): Promise<string> {
  const result = cache.findWithStats(query, "deepseek-chat");
  if (result.hit) {
    return result.entry.response;
  }

  const response = await callLLM(query);

  cache.set(query, response, "deepseek-chat");
  return response;
}

// View stats
const stats = cache.stats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
```

### Knowledge Base (RAG)

```typescript
import {
  rebuildKnowledgeBase,
  searchKnowledge,
  formatKnowledgeResults,
} from "@hex4code/core/knowledge/session-rag";

// Build the knowledge base
const { chunks, sessions } = rebuildKnowledgeBase();
console.log(`Loaded ${chunks} knowledge chunks (${sessions} sessions)`);

// Search related knowledge
const results = searchKnowledge("how to configure multi-model routing", 5);
console.log(formatKnowledgeResults(results));

// Error pattern search
import { extractErrorPatterns, searchPatterns } from "@hex4code/core/knowledge/session-rag";

const patterns = searchPatterns("TypeError undefined", 3);
for (const p of patterns) {
  console.log(`[${p.finalStatus}] ${p.errorType}`);
  console.log(`  Fix: ${p.fixSequence.join(" → ")}`);
}
```

### MCP Protocol Integration

```typescript
import { McpManager } from "@hex4code/core/mcp/mcp-manager";

const mcpManager = new McpManager();

// Configure MCP servers
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

// Initialize (connect all servers)
await mcpManager.initialize(servers);

// Get available tools
const tools = mcpManager.getMcpToolDefinitions();
console.log("MCP tools:", tools.map(t => t.function.name));

// View status
const status = mcpManager.getStatus();
for (const s of status) {
  console.log(`${s.name}: ${s.status} (${s.toolCount} tools)`);
}

// Disconnect
mcpManager.disconnect();
```

### Skills System

```typescript
import {
  resolveSkillPath,
  readSkillInfo,
  dedupeSkills,
} from "@hex4code/core/session-skill";

// Skill directory structure
// ~/.agents/skills/          ← User-level
//   my-custom-skill.md
// ./.agents/skills/          ← Project-level
//   project-skill.md

const projectRoot = "/path/to/project";

// Read skill metadata
const skillPath = resolveSkillPath("~/.agents/skills/my-custom-skill.md", projectRoot);
const skill = readSkillInfo(skillPath, "~/.agents/skills/my-custom-skill.md", "my-custom-skill");

console.log(`Skill: ${skill.name}`);
console.log(`Description: ${skill.description}`);

// Deduplicate
const allSkills = [skill1, skill2, duplicateSkill];
const unique = dedupeSkills(allSkills);
console.log(`After dedup: ${unique?.length} skills`);
```

### Pipeline Orchestration

```typescript
import {
  detectPipeline,
  buildPipelineSummary,
} from "@hex4code/core/orchestration/hex4code-pipeline";

// Detect pipeline patterns in tool call sequences
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
  // Output:
  //   build → Build
  //   test → Test
  //   codeIndex → CodeIndex
  //   git → Git
}
```

---

## Complete Example

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

  // 1. Detect available providers
  const providers = detectConfiguredProviders();
  console.log(`Available providers: ${providers.join(", ")}`);

  // 2. Create OpenAI client
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

  // 3. Initialize MCP (optional)
  const mcpManager = new McpManager();

  // 4. Initialize semantic cache
  const cache = getGlobalCache({ persistPath: undefined });

  // 5. Initialize SessionManager
  const sessionManager = new SessionManager(projectRoot);

  // 6. Start a conversation
  try {
    const result = await sessionManager.run({
      messages: [
        {
          role: "user",
          content: "Analyze the largest TypeScript file in the project and suggest refactoring"
        }
      ],
      sessionId,
      createOpenAIClient: createClient,
      mcpManager,
      agentMode: "hex4",  // Use pipeline mode
    });

    // 7. Output results
    console.log(`\n=== Conversation Complete ===`);
    console.log(`Message count: ${result.messages.length}`);

    // 8. Persist
    const store = new SessionStore(projectRoot);
    store.saveSessionMessages(sessionId, result.messages);
    console.log(`Session saved: ${sessionId}`);
  } catch (error) {
    console.error("Session error:", error);
  } finally {
    cache.dispose();
    mcpManager.disconnect();
  }
}

main();
```

---

## TypeScript Types

The SDK provides complete TypeScript type definitions. Key types include:

```typescript
// Session types
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

// Settings types
import type {
  Hex4codeSettings,
  ResolvedHex4codeSettings,
  ModelRouting,
  TaskType,
} from "@hex4code/core/settings";

// Model types
import type {
  ModelProvider,
  ModelDef,
  ModelCapability,
  ProviderConfig,
  RouteResult,
} from "@hex4code/core/models/model-router";

// Tool execution
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

// Cache
import type { CacheEntry, SemanticCacheConfig } from "@hex4code/core/cache/semantic-cache";

// Knowledge base
import type { KnowledgeChunk, ErrorPattern } from "@hex4code/core/knowledge/session-rag";
```
