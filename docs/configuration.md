# Configuration Guide

> **Version**: 1.1.0

---

## Overview

Hex4Code uses a three-tier cascading configuration mechanism supporting system-level, project-level, and user-level configurations. Higher priority configurations override lower priority ones.

---

## Configuration Priority

```
Higher priority ──────────────────────────────────────────
  ~/.hex4code/settings.json          (User global config)
          │ overrides
  ./.hex4code/settings.json          (Project-level config)
          │ overrides
  HEX4CODE_* environment variables    (System environment)
          │ overrides
  <Built-in defaults>                (Code hardcoded defaults)
Lower priority ──────────────────────────────────────────
```

---

## Configuration File Locations

| Tier | Path | Scope | Description |
|------|------|-------|-------------|
| System | `HEX4CODE_*` | Global | Environment variables, suitable for automated deployment |
| Project | `./.hex4code/settings.json` | Current project | Can be version-controlled (optionally added to .gitignore) |
| User | `~/.hex4code/settings.json` | Current user | Personal preferences, applies to all projects |

---

## Full Configuration Reference

### settings.json

```json
{
  // ── API Configuration ─────────────────────────────
  "apiKey": "your-api-key-here",
  "baseURL": "https://api.deepseek.com",
  "model": "deepseek-chat",
  "provider": "deepseek",

  // ── Generation Parameters ─────────────────────────
  "maxTokens": 4096,
  "temperature": 0.7,
  "topP": 1.0,
  "reasoningEffort": "medium",
  "thinkingEnabled": false,

  // ── Multi-Model Routing ───────────────────────────
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

  // ── Agent Mode ────────────────────────────────────
  "agentMode": "hex4",

  // ── Semantic Cache ────────────────────────────────
  "cache": {
    "enabled": true,
    "threshold": 0.85,
    "maxEntries": 200,
    "ttl": 3600
  },

  // ── MCP Servers ───────────────────────────────────
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"],
      "env": {}
    }
  },

  // ── Notifications ─────────────────────────────────
  "notify": {
    "enabled": false,
    "webhook": "https://your-webhook-url.com/notify"
  },

  // ── Skills Directory ──────────────────────────────
  "skillsDir": "~/.agents/skills",

  // ── Advanced ──────────────────────────────────────
  "debug": false,
  "compactThreshold": 0.8,
  "maxConversationTurns": 50
}
```

---

## Configuration Details

### API Configuration

| Setting | Type | Default | Env Variable | Description |
|---------|------|---------|--------------|-------------|
| `apiKey` | `string` | — | `HEX4CODE_API_KEY` | API key |
| `baseURL` | `string` | — | `HEX4CODE_BASE_URL` | API endpoint URL |
| `model` | `string` | `"deepseek-chat"` | `HEX4CODE_MODEL` | Default model |
| `provider` | `string` | `"deepseek"` | `HEX4CODE_PROVIDER` | Default provider |

### Generation Parameters

| Setting | Type | Default | Range | Description |
|---------|------|---------|-------|-------------|
| `maxTokens` | `number` | `4096` | 1 - 128000 | Max output tokens per turn |
| `temperature` | `number` | `0.7` | 0 - 2.0 | Randomness control |
| `topP` | `number` | `1.0` | 0 - 1.0 | Nucleus sampling parameter |
| `reasoningEffort` | `string` | `"medium"` | `"low"` / `"medium"` / `"high"` | Reasoning depth |
| `thinkingEnabled` | `boolean` | `false` | — | Enable thinking mode (DeepSeek only) |

### Multi-Model Routing

```typescript
interface ModelRouting {
  enabled: boolean;
  strategies: {
    completion: RouteStrategy;   // Code completion
    generation: RouteStrategy;    // Code generation
    analysis: RouteStrategy;      // Code analysis
    review: RouteStrategy;        // Code review
    chat: RouteStrategy;          // General chat
  };
}

interface RouteStrategy {
  model: string;
  provider: string;
  apiKey?: string;
  baseURL?: string;
}
```

**Task type descriptions**:

| Task Type | Priority | Use Case |
|-----------|----------|----------|
| `completion` | Low latency, low cost | Inline code completion |
| `generation` | High quality reasoning | Code generation, refactoring |
| `analysis` | Deep analysis | Code review, architecture analysis |
| `review` | Medium reasoning | Code review, diff inspection |
| `chat` | General conversation | Q&A, explanation |

### Agent Mode

| Value | Description |
|-------|-------------|
| `"hex4"` | Pipeline mode — enforces Build→Test→Index→Git flow, enables TC trust chain |
| `"general"` | General agent mode — no pipeline restrictions, free tool calling |

### Semantic Cache

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `cache.enabled` | `boolean` | `true` | Enable cache |
| `cache.threshold` | `number` | `0.85` | Semantic similarity threshold (0-1) |
| `cache.maxEntries` | `number` | `200` | Max cache entries |
| `cache.ttl` | `number` | `3600` | Cache TTL (seconds) |

### MCP Servers

```typescript
interface McpServerConfig {
  command: string;          // Launch command
  args?: string[];          // Command arguments
  env?: Record<string, string>;  // Environment variables
}
```

### Notifications

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `notify.enabled` | `boolean` | `false` | Enable notifications |
| `notify.webhook` | `string` | — | Webhook notification URL |

---

## Complete Environment Variable List

| Environment Variable | Corresponding Config | Description |
|---------------------|---------------------|-------------|
| `HEX4CODE_API_KEY` | `apiKey` | API key |
| `HEX4CODE_BASE_URL` | `baseURL` | API endpoint |
| `HEX4CODE_MODEL` | `model` | Default model |
| `HEX4CODE_PROVIDER` | `provider` | Default provider |
| `DEEPSEEK_API_KEY` | — | DeepSeek API key (Provider-specific) |
| `OPENAI_API_KEY` | — | OpenAI API key |
| `QWEN_API_KEY` | — | Qwen API key |
| `GEMINI_API_KEY` | — | Gemini API key |
| `ANTHROPIC_API_KEY` | — | Claude API key |
| `ERNIE_API_KEY` | — | Ernie API key |
| `MINIMAX_API_KEY` | — | MiniMax API key |
| `GLM_API_KEY` | — | GLM API key |
| `GROQ_API_KEY` | — | Groq API key |
| `HEX4CODE_MAX_TOKENS` | `maxTokens` | Max tokens |
| `HEX4CODE_TEMPERATURE` | `temperature` | Temperature |
| `HEX4CODE_AGENT_MODE` | `agentMode` | Agent mode |

---

## Common Configuration Scenarios

### Scenario 1: DeepSeek + Multi-Model Routing

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

### Scenario 2: Mixed Provider Deployment

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

### Scenario 3: MCP Integration

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

## Skills Directory Configuration

Skills use a filesystem directory rather than JSON configuration:

```
~/.agents/skills/          ← User-level skills (apply to all projects)
├── code-review.md
├── docker-helper.md
└── security-audit.md

./.agents/skills/          ← Project-level skills (current project only)
└── project-conventions.md
```

Each Skill file is in Markdown format with YAML front matter:

```markdown
---
name: code-review
description: Code review assistant - check code quality, security vulnerabilities, and best practices
---

# Code Review Rules

- Check for null pointer references
- Ensure complete exception handling
...
```

---

## Configuration Templates

### Minimal Configuration

```json
{
  "apiKey": "sk-xxxxxxxxxxxxxxxx",
  "baseURL": "https://api.deepseek.com"
}
```

### Recommended Production Configuration

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
