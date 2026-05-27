# Architecture Overview

> **Version**: 1.1.0

---

## High-Level Architecture

Hex4Code uses a **Monorepo + npm workspaces** architecture with three separate packages:

```
┌─────────────────────────────────────────────────────┐
│                    Hex4Code                          │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  @hex4code/  │  │  @hex4code/  │  │ hex4code-   │ │
│  │  core        │  │  cli         │  │ vscode      │ │
│  │              │  │              │  │             │ │
│  │ Session Mgmt │  │ Ink Terminal │  │ VS Code Ext │ │
│  │ Model Router │  │ Slash Cmds   │  │ WebView UI  │ │
│  │ Tool Execute │  │ Markdown Rend│  │ Inline Comp │ │
│  │ Semantic Cache│  │ Image Paste │  │ Cmd Palette │ │
│  │ Pipeline     │  │ Session Mgmt │  │ Status Bar  │ │
│  │ MCP Protocol │  │              │  │             │ │
│  │ RAG KB       │  │              │  │             │ │
│  │ Skills System│  │              │  │             │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
│         │                 │                 │         │
│         └─────────────────┼─────────────────┘         │
│                           │                            │
│             Direct TS source references                │
│       (@hex4code/core → ../packages/core/src)         │
└─────────────────────────────────────────────────────┘
```

### Package Dependencies

```
@hex4code/core (no deps on other hex4 packages)
      ↑                          ↑
      │                          │
@hex4code/cli             hex4code-vscode
(references core src)     (references core src)
```

- `@hex4code/core` is a **pure logic library** with no dependencies on other Hex4Code internal packages, only depending on third-party libraries such as `openai`, `zod`, `ejs`
- References from CLI and VS Code extensions to core are **compile-time path aliases**, handled uniformly by esbuild during bundling

---

## Core Engine Architecture (`@hex4code/core`)

```
@hex4code/core/src/
│
├── session.ts          ← Core entry: SessionManager
├── session-types.ts    ← Type definitions
├── session-message.ts  ← Message CRUD
├── session-skill.ts    ← Skill loading
├── session-store.ts    ← JSONL persistence
├── settings.ts         ← Config parsing & cascading
├── agent-mode.ts       ← HEX4/General dual agent modes
├── prompt.ts           ← System prompt & tool definitions
│
├── models/             ← Multi-model management
│   ├── model-router.ts       ← Task-aware routing engine
│   ├── provider-registry.ts  ← Provider/Model registry
│   └── provider-client.ts    ← OpenAI-compatible client factory
│
├── tools/              ← Tool execution
│   ├── executor.ts           ← ToolExecutor dispatcher
│   ├── bash-handler.ts       ← Shell execution
│   ├── read-handler.ts       ← File reading
│   ├── write-handler.ts      ← File writing
│   ├── edit-handler.ts       ← File editing
│   ├── build-handler.ts      ← Build
│   ├── test-handler.ts       ← Test
│   ├── git-handler.ts        ← Git operations
│   ├── code-index-handler.ts ← Code index
│   ├── web-search-handler.ts ← Web search
│   └── ask-user-question-handler.ts ← User questioning
│
├── cache/              ← Cache
│   └── semantic-cache.ts     ← Semantic similarity cache
│
├── compression/        ← Compression
│   └── dual-trit.ts          ← DualTrit compact encoding
│
├── orchestration/      ← Pipeline
│   └── hex4code-pipeline.ts    ← Pipeline orchestration
│
├── mcp/                ← MCP protocol
│   ├── mcp-client.ts         ← MCP client
│   └── mcp-manager.ts        ← MCP manager
│
├── knowledge/          ← Knowledge base
│   ├── kb-loader.ts          ← KB loader
│   └── session-rag.ts        ← RAG retrieval augmentation
│
├── completion/         ← Code completion
│   ├── unified-completion.ts
│   └── general-autocomplete.ts
│
└── common/             ← Utility modules
    ├── debug-logger.ts
    ├── diff-viewer.ts
    ├── error-logger.ts
    ├── file-referencer.ts
    ├── file-utils.ts
    ├── model-capabilities.ts
    ├── notify.ts
    ├── openai-thinking.ts
    ├── runtime.ts
    ├── shell-utils.ts
    └── state.ts
```

---

## Data Flow

### Session Interaction Flow

```
User Input (CLI / VS Code WebView)
         │
         ▼
┌─────────────────┐
│  SessionManager │ ← Session entry
│  .run()         │
└────────┬────────┘
         │
    ┌────▼────────────────────┐
    │ 1. Build request message │
    │ (System Prompt + Skills) │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 2. Semantic cache lookup │
    │ SemanticCache.find()     │
    └────┬────────────────────┘
         │  Hit → return cached response
         │  Miss ↓
    ┌────▼────────────────────┐
    │ 3. Select model          │
    │ ModelRouter.routeTask() │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 4. Call LLM API          │
    │ (OpenAI-compatible)      │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 5. Parse response        │
    │  ┌─ Plain text → return  │
    │  └─ Tool call ↓          │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 6. Tool execution        │
    │ ToolExecutor.execute()   │
    │  ┌─ built-in handlers    │
    │  └─ MCP tools            │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 7. Pipeline detection     │
    │ Pipeline.detect()        │
    │ (TC trust chain prop.)   │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 8. DualTrit compression  │
    │ → Return to LLM or done │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 9. Write semantic cache  │
    │ 10. Persist to JSONL     │
    └─────────────────────────┘
```

---

## Configuration Cascading

```
Higher priority ────────────────────────────────────────
  ~/.hex4code/settings.json          (User config)
          ↓ overrides
  ./.hex4code/settings.json          (Project config)
          ↓ overrides
  HEX4CODE_* environment variables   (System config)
          ↓ overrides
  <Built-in defaults>                (Code defaults)
Lower priority ─────────────────────────────────────────
```

---

## Dual Agent Mode Comparison

| Feature | HEX4 Mode | General Mode |
|---------|-----------|-------------|
| Pipeline enforced | ✅ Build→Test→Index→Git | ❌ Unlimited |
| TC trust chain | ✅ Stage-to-stage trust prop. | ❌ Disabled |
| DualTrit compression | ✅ Enabled | ❌ Disabled |
| Tool permissions | Restricted (within pipeline) | All available |
| Use case | Standardized dev workflow | Free-form coding exploration |

---

## Pipeline Lifecycle

```
  ┌──────┐    ┌──────┐    ┌────────┐    ┌──────┐
  │Build │ →  │Test  │ →  │Code    │ →  │ Git  │
  │      │    │      │    │Index   │    │      │
  └──┬───┘    └──┬───┘    └───┬────┘    └──┬───┘
     │           │            │            │
     TC_CARRY   TC_CARRY    TC_CARRY    TC_CARRY
     │           │            │            │
     └───────────┴────────────┴────────────┘
              Trust Chain
```

Each stage result carries a **TC (Trust Chain)** marker:
- `TC_NONE` — No uncertainty
- `TC_CARRY` — Warning propagation
- `TC_UNCERTAIN` — Semantic uncertainty
- `TC_MIXED` — Mixed signal

---

## Storage Structure

```
~/.hex4code/
├── projects/                      ← Persistent data
│   └── <project-code>/            ← Project identifier (path hash)
│       ├── sessions-index.json    ← Session index
│       └── <session-id>.jsonl     ← Session messages (JSONL format)
├── cache/
│   └── semantic-cache.json        ← Semantic cache
└── settings.json                  ← User global config
```

---

## Build System

```
TypeScript source
      │
      ▼
  esbuild bundling
      │
  ┌───┴──────────┐
  │              │
  ▼              ▼
cli/          vscode/
dist/cli.js   out/extension.js
(ESM)         (CJS)
shebang       activate export
```
