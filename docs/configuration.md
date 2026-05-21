# 配置指南 (Configuration Guide)

> **版本**: 1.1.0

---

## 概述

Hex4Code 采用三层配置级联机制，支持系统级、项目级和用户级配置，高优先级配置覆盖低优先级配置。

---

## 配置优先级

```
高优先级 ─────────────────────────────────────────────
  ~/.hex4code/settings.json          (用户全局配置)
          │ 覆盖
  ./.hex4code/settings.json          (项目级配置)
          │ 覆盖
  HEX4CODE_* 环境变量                 (系统环境变量)
          │ 覆盖
  ＜内置默认值＞                       (代码硬编码默认值)
低优先级 ─────────────────────────────────────────────
```

---

## 配置文件位置

| 层级 | 路径 | 作用域 | 说明 |
|------|------|--------|------|
| 系统 | `HEX4CODE_*` | 全局 | 环境变量，适用于自动化部署 |
| 项目 | `./.hex4code/settings.json` | 当前项目 | 随项目版本控制（可选加入 .gitignore） |
| 用户 | `~/.hex4code/settings.json` | 当前用户 | 用户个人偏好，适用所有项目 |

---

## 完整配置参考

### settings.json

```json
{
  // ── API 配置 ──────────────────────────────────
  "apiKey": "your-api-key-here",
  "baseURL": "https://api.deepseek.com",
  "model": "deepseek-chat",
  "provider": "deepseek",

  // ── 生成参数 ──────────────────────────────────
  "maxTokens": 4096,
  "temperature": 0.7,
  "topP": 1.0,
  "reasoningEffort": "medium",
  "thinkingEnabled": false,

  // ── 多模型路由 ────────────────────────────────
  "modelRouting": {
    "enabled": true,
    "strategies": {
      "completion": {
        "model": "deepseek-v4-flash",
        "provider": "deepseek"
      },
      "generation": {
        "model": "deepseek-reasoner",
        "provider": "deepseek"
      },
      "analysis": {
        "model": "gpt-4o",
        "provider": "openai"
      },
      "review": {
        "model": "deepseek-chat",
        "provider": "deepseek"
      },
      "chat": {
        "model": "deepseek-v4-flash",
        "provider": "deepseek"
      }
    }
  },

  // ── 代理模式 ──────────────────────────────────
  "agentMode": "hex4",

  // ── 语义缓存 ──────────────────────────────────
  "cache": {
    "enabled": true,
    "threshold": 0.85,
    "maxEntries": 200,
    "ttl": 3600
  },

  // ── MCP 服务器 ────────────────────────────────
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"],
      "env": {}
    }
  },

  // ── 通知 ──────────────────────────────────────
  "notify": {
    "enabled": false,
    "webhook": "https://your-webhook-url.com/notify"
  },

  // ── Skills 目录 ───────────────────────────────
  "skillsDir": "~/.agents/skills",

  // ── 高级 ──────────────────────────────────────
  "debug": false,
  "compactThreshold": 0.8,
  "maxConversationTurns": 50
}
```

---

## 配置项详解

### API 配置

| 配置项 | 类型 | 默认值 | 环境变量 | 说明 |
|--------|------|--------|----------|------|
| `apiKey` | `string` | — | `HEX4CODE_API_KEY` | API 密钥 |
| `baseURL` | `string` | — | `HEX4CODE_BASE_URL` | API 端点地址 |
| `model` | `string` | `"deepseek-chat"` | `HEX4CODE_MODEL` | 默认使用的模型 |
| `provider` | `string` | `"deepseek"` | `HEX4CODE_PROVIDER` | 默认供应商 |

### 生成参数

| 配置项 | 类型 | 默认值 | 范围 | 说明 |
|--------|------|--------|------|------|
| `maxTokens` | `number` | `4096` | 1 - 128000 | 单次最大输出 Token 数 |
| `temperature` | `number` | `0.7` | 0 - 2.0 | 随机性控制 |
| `topP` | `number` | `1.0` | 0 - 1.0 | 核采样参数 |
| `reasoningEffort` | `string` | `"medium"` | `"low"` / `"medium"` / `"high"` | 推理深度 |
| `thinkingEnabled` | `boolean` | `false` | — | 是否启用思考模式（仅 DeepSeek） |

### 多模型路由

```typescript
interface ModelRouting {
  enabled: boolean;
  strategies: {
    completion: RouteStrategy;   // 代码补全
    generation: RouteStrategy;    // 代码生成
    analysis: RouteStrategy;      // 代码分析
    review: RouteStrategy;        // 代码审查
    chat: RouteStrategy;          // 通用对话
  };
}

interface RouteStrategy {
  model: string;
  provider: string;
  apiKey?: string;
  baseURL?: string;
}
```

**任务类型说明**：

| 任务类型 | 优先级 | 适用场景 |
|----------|--------|----------|
| `completion` | 低延迟、低成本 | 内联代码补全 |
| `generation` | 高质量推理 | 代码生成、重构 |
| `analysis` | 深度分析 | 代码审查、架构分析 |
| `review` | 中推理 | 代码审查、Diff 检查 |
| `chat` | 通用对话 | 问答、解释 |

### 代理模式

| 值 | 说明 |
|------|------|
| `"hex4"` | 流水线模式 — 强制 构建→测试→索引→Git 流程，启用 TC 信任链 |
| `"general"` | 通用代理模式 — 无流水线限制，自由工具调用 |

### 语义缓存

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `cache.enabled` | `boolean` | `true` | 是否启用缓存 |
| `cache.threshold` | `number` | `0.85` | 语义相似度阈值 (0-1) |
| `cache.maxEntries` | `number` | `200` | 最大缓存条目数 |
| `cache.ttl` | `number` | `3600` | 缓存有效期（秒） |

### MCP 服务器

```typescript
interface McpServerConfig {
  command: string;          // 启动命令
  args?: string[];          // 命令参数
  env?: Record<string, string>;  // 环境变量
}
```

### 通知

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `notify.enabled` | `boolean` | `false` | 是否启用通知 |
| `notify.webhook` | `string` | — | Webhook 通知地址 |

---

## 环境变量完整列表

| 环境变量 | 对应配置项 | 说明 |
|----------|-----------|------|
| `HEX4CODE_API_KEY` | `apiKey` | API 密钥 |
| `HEX4CODE_BASE_URL` | `baseURL` | API 端点 |
| `HEX4CODE_MODEL` | `model` | 默认模型 |
| `HEX4CODE_PROVIDER` | `provider` | 默认供应商 |
| `DEEPSEEK_API_KEY` | — | DeepSeek API 密钥（Provider 专用） |
| `OPENAI_API_KEY` | — | OpenAI API 密钥 |
| `QWEN_API_KEY` | — | 通义千问 API 密钥 |
| `GEMINI_API_KEY` | — | Gemini API 密钥 |
| `ANTHROPIC_API_KEY` | — | Claude API 密钥 |
| `ERNIE_API_KEY` | — | 文心一言 API 密钥 |
| `MINIMAX_API_KEY` | — | MiniMax API 密钥 |
| `GLM_API_KEY` | — | 智谱 GLM API 密钥 |
| `GROQ_API_KEY` | — | Groq API 密钥 |
| `HEX4CODE_MAX_TOKENS` | `maxTokens` | 最大 Token 数 |
| `HEX4CODE_TEMPERATURE` | `temperature` | 温度参数 |
| `HEX4CODE_AGENT_MODE` | `agentMode` | 代理模式 |

---

## 常见配置场景

### 场景一：DeepSeek + 多模型路由

```json
{
  "apiKey": "sk-xxxxxxxxxxxxxxxx",
  "baseURL": "https://api.deepseek.com",
  "provider": "deepseek",
  "model": "deepseek-chat",
  "modelRouting": {
    "enabled": true,
    "strategies": {
      "completion": { "model": "deepseek-v4-flash", "provider": "deepseek" },
      "generation": { "model": "deepseek-v4-pro", "provider": "deepseek" },
      "analysis": { "model": "deepseek-v4-pro", "provider": "deepseek" },
      "review": { "model": "deepseek-chat", "provider": "deepseek" },
      "chat": { "model": "deepseek-v4-flash", "provider": "deepseek" }
    }
  },
  "cache": { "enabled": true, "threshold": 0.8, "ttl": 7200 }
}
```

### 场景二：混合 Provider 部署

```json
{
  "provider": "deepseek",
  "model": "deepseek-chat",
  "modelRouting": {
    "enabled": true,
    "strategies": {
      "completion": { "model": "deepseek-v4-flash", "provider": "deepseek" },
      "generation": { "model": "claude-sonnet-4", "provider": "anthropic" },
      "analysis": { "model": "gpt-4o", "provider": "openai" },
      "review": { "model": "qwen-max", "provider": "qwen" },
      "chat": { "model": "deepseek-v4-flash", "provider": "deepseek" }
    }
  }
}
```

### 场景三：MCP 集成

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
      "env": {}
    },
    "database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "/tmp/mydb"],
      "env": {}
    }
  }
}
```

---

## Skills 目录配置

Skills 使用文件系统目录而非 JSON 配置：

```
~/.agents/skills/          ← 用户级技能（所有项目生效）
├── code-review.md
├── docker-helper.md
└── security-audit.md

./.agents/skills/          ← 项目级技能（仅当前项目）
└── project-conventions.md
```

每个 Skill 文件为 Markdown 格式，含 YAML front matter：

```markdown
---
name: code-review
description: 代码审查助手 - 检查代码质量、安全漏洞和最佳实践
---

# 代码审查规则

- 检查空指针引用
- 确保异常处理完整
...
```

---

## 配置文件模板

### 最小配置

```json
{
  "apiKey": "sk-xxxxxxxxxxxxxxxx",
  "baseURL": "https://api.deepseek.com"
}
```

### 推荐生产配置

```json
{
  "apiKey": "sk-xxxxxxxxxxxxxxxx",
  "baseURL": "https://api.deepseek.com",
  "provider": "deepseek",
  "model": "deepseek-chat",
  "maxTokens": 8192,
  "modelRouting": { "enabled": true },
  "cache": { "enabled": true },
  "agentMode": "hex4",
  "debug": false
}
```

---
