# Hex4Code

<p align="center">
  <strong>AI-powered coding assistant — Multi-model routing · Semantic cache · Pipeline orchestration</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.1.0-blue" alt="version" />
  <img src="https://img.shields.io/badge/license-Apache--2.0-green" alt="license" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="node" />
</p>


## 🎉 1,000 Downloads on AtomGit!

Hex4Code has reached **1,000 downloads** on China's [AtomGit](https://atomgit.com/zzwgbdt/Hex4Code) open-source platform!

Thank you to everyone who downloaded, tested, and shared the project. Your support keeps us building. Here's to the next milestone!

⭐ Star the repo · 🐛 Report issues · 🤝 Contributions welcome.

---

## About the Company

**Zhengzhou Weiguang Semiconductor Co., Ltd.** is a high-tech enterprise specializing in semiconductor technology and intelligent software development. The company is committed to deeply integrating cutting-edge AI technologies with engineering practices, building a new generation of intelligent coding tools for developers.

Hex4Code is the company's open-source AI programming assistant project, built around a built-in pipeline engine (Build → Test → Index → Version Control), providing developers with a full-scenario intelligent coding experience from terminal CLI to VS Code extension.

- **Source Repository**: [https://atomgit.com/zzwgbdt/Hex4Code](https://atomgit.com/zzwgbdt/Hex4Code)
- **Copyright**: Copyright © 2026 Zhengzhou Weiguang Semiconductor Co., Ltd.

---

## Introduction

Hex4Code is a multi-product AI coding assistant ecosystem consisting of three core packages:

| Package                | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| **`@hex4code/core`**   | Shared core engine — session management, multi-model routing, semantic cache, pipeline orchestration |
| **`@hex4code/cli`**    | Terminal TUI application (Ink/React-based) — chat with AI models in the command line |
| **`hex4code-vscode`**  | VS Code extension — sidebar WebView chat interface, deeply integrated with the IDE |

### Pipeline

Built-in development pipeline engine connecting Build → Test → Code Index → Version Control:

| Stage     | Description                           |
| --------- | ------------------------------------- |
| Build     | Project compilation and build         |
| Test      | Automated testing                     |
| CodeIndex | Codebase indexing and search          |
| Git       | Git operations and version control    |

### Key Features

- **Multi-model intelligent routing** — Automatically selects the optimal model based on task type, supporting DeepSeek, OpenAI, Qwen, Doubao, and more
- **Semantic cache** — Reduces duplicate API calls, saving token costs
- **Dual agent mode** — Pipeline mode vs. general agent mode, flexibly switchable
- **DualTrit compression** — Efficient context compression, extending effective conversation windows
- **RAG knowledge base** — Retrieval-augmented generation based on project code
- **MCP protocol** — Supports Model Context Protocol for external tool integration
- **Skills system** — User-level and project-level custom skill extensions

---

## Project Structure

```
hex4_code_v1.1/
├── packages/
│   ├── core/          # @hex4code/core — Core engine
│   │   └── src/       # TypeScript source code
│   └── cli/           # @hex4code/cli — Terminal application
│       └── src/       # React (Ink) source code
├── vscode/            # VS Code extension
│   ├── src/           # Extension source code
│   ├── resources/     # Frontend WebView UI
│   └── docs/          # VS Code extension documentation
├── AGENTS.md          # Project instructions
├── LICENSE            # Apache-2.0 license
├── NOTICE             # Copyright notice
├── package.json       # Root workspace configuration
└── tsconfig.base.json # Shared TypeScript configuration
```

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **TypeScript** ^6.0.3

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://atomgit.com/zzwgbdt/Hex4Code.git
cd Hex4Code
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build

This project uses npm workspaces and supports sequential builds:

```bash
# Build all packages (core → vscode → cli)
npm run build

# Or build individually
npm run build:core        # Build @hex4code/core
npm run build:vscode      # Build VS Code extension
npm run build:cli         # Build CLI application
```

Build tool: **esbuild**

- CLI: ESM output to `packages/cli/dist/cli.js`
- VS Code: CJS output to `vscode/out/extension.js`

### 4. Run the CLI

```bash
# Development mode (via tsx)
npx tsx packages/cli/src/cli.tsx

# Production mode (after build)
node packages/cli/dist/cli.js

# Or via npm bin
npx hex4code
```

### 5. Install VS Code Extension

```bash
# Option 1: Install pre-built .vsix directly
code --install-extension vscode/hex4code-vscode-1.1.0.vsix

# Option 2: Manual install in VS Code
# 1. Open VS Code
# 2. Press Ctrl+Shift+P to open the command palette
# 3. Select "Extensions: Install from VSIX..."
# 4. Choose vscode/hex4code-vscode-1.1.0.vsix
```

---

## Packaging

### CLI Packaging

The CLI is bundled by esbuild into a single executable script:

```bash
npm run build:cli
# Output: packages/cli/dist/cli.js
# Contains shebang (#!), runnable directly
```

### VS Code Extension Packaging

```bash
# Build the extension first
npm run build:vscode

# Package as .vsix
cd vscode
npx vsce package --baseImagesUrl=https://atomgit.com/zzwgbdt/Hex4Code
# Output: vscode/hex4code-vscode-<version>.vsix
```

---

## Usage Guide

### CLI Mode

After launching, enter the interactive terminal with the following commands:

| Command    | Description                               |
| ---------- | ----------------------------------------- |
| `/new`     | Start a new conversation                  |
| `/init`    | Initialize project workflow               |
| `/resume`  | Resume the last session                   |
| `/exit`    | Exit the application                      |
| Text input | Send coding questions or instructions to AI |

### VS Code Mode

After installing the extension, click the **Hex4Code** icon in the sidebar to open the chat panel:

- Select code, then use the right-click menu to analyze with Hex4Code
- Supports inline code completion (context-aware)
- Use the VS Code command palette (`Ctrl+Shift+P`) and search for `Hex4Code` to access all features

### Slash Commands

Two sets of built-in command modes:

**In-agent commands** (type `/` in the chat dialog):

- `/compact` — Compress session context
- `/config` — Show current configuration
- `/context` — Show context usage
- `/cost` — Show token cost statistics
- `/doctor` — Run diagnostic checks
- `/init` — Initialize project configuration files
- `/memory` — Manage long-term memory
- `/release-notes` — View release notes
- `/status` — Show connection status

**VS Code command palette** (via `Ctrl+Shift+P`):

- `Hex4Code: Open` — Open chat panel
- `Hex4Code: Select Model` — Select AI model
- `Hex4Code: Configure Provider` — Configure model providers
- `Hex4Code: Run Benchmarks` — Run performance benchmarks
- `Hex4Code: View Cache Stats` — View cache statistics
- `Hex4Code: Toggle Agent Mode` — Toggle agent mode
- `Hex4Code: Reset All Settings` — Reset all settings

---

## Configuration

> It is recommended to use the model dropdown and gear button in the VS Code sidebar for configuration. Below is the recommended JSON configuration format; the legacy `env.API_KEY` syntax is still supported but not recommended for multi-provider switching.

### Recommended Configuration Format

```json
{
  "providers": {
    "deepseek": {
      "apiKey": "sk-...",
      "baseURL": "https://api.deepseek.com"
    },
    "openai": {
      "apiKey": "sk-...",
      "baseURL": "https://api.openai.com/v1"
    }
  },
  "model": "deepseek-v4-flash",
  "thinkingEnabled": true,
  "reasoningEffort": "max"
}
```

Each provider has its own API Key. When switching models, Hex4Code reads the corresponding key from the model's provider — it will never send DeepSeek's key to OpenAI, or vice versa.

### Configuration Priority

Project-level configuration overrides user-level configuration:

```text
Environment variable HEX4CODE_*
> Project-level ./.hex4code/settings.json
> User-level ~/.hex4code/settings.json
> Defaults
```

For example, if the user-level config uses `deepseek-v4-flash` but the project-level config uses `deepseek-v4-pro`, the current project will use `deepseek-v4-pro`.

### API Key Resolution Order

Built-in provider API keys are resolved in the following order:

```text
providers.<provider>.apiKey
> env.<PROVIDER_API_KEY>
> System environment variable <PROVIDER_API_KEY>
> legacy API_KEY (only when ownership is explicit)
```

If you must continue using the legacy universal `API_KEY` / `BASE_URL`, explicitly declare ownership:

```json
{
  "env": {
    "API_KEY": "sk-...",
    "BASE_URL": "https://api.deepseek.com"
  },
  "legacyApiKeyProvider": "deepseek",
  "legacyBaseURLProvider": "deepseek",
  "model": "deepseek-v4-flash"
}
```

Provider-specific environment variables are also supported, e.g., `DEEPSEEK_API_KEY`, `OPENAI_API_KEY`, `QWEN_API_KEY`, `GEMINI_API_KEY`.

### Configuration File Locations

Hex4Code supports three tiers of cascading configuration (priority from lowest to highest):

| Tier         | Path                         | Description                        |
| ------------ | ---------------------------- | ---------------------------------- |
| System env   | `HEX4CODE_*` environment variables | Global configuration          |
| Project      | `./.hex4code/settings.json`  | Configuration in the project root  |
| User         | `~/.hex4code/settings.json`  | Configuration in the user home dir |

### Configuration File Example

```json
{
"env":{
 "MODEL":"deepseek-v4-pro",
 "BASE_URL":"https://api.deepseek.com",
 "API_KEY":"sk-......."
},
"thinkingEnabled":true,
"reasoningEffort":"max"
}

```

### Key Configuration Options

| Setting                | Type    | Default            | Description                                           |
| ---------------------- | ------- | ------------------ | ----------------------------------------------------- |
| `model`                | string  | `"deepseek-chat"`  | Default model name                                    |
| `provider`             | string  | `"deepseek"`       | Model provider                                        |
| `apiKey`               | string  | —                  | API key                                               |
| `baseURL`              | string  | —                  | API endpoint URL                                      |
| `maxTokens`            | number  | `4096`             | Maximum generated tokens                              |
| `temperature`          | number  | `0.7`              | Generation temperature (0-2)                          |
| `modelRouting.enabled` | boolean | `true`             | Enable multi-model routing                            |
| `agentMode`            | string  | `"hex4"`           | Agent mode: `"hex4"` (pipeline) or `"general"` (general) |
| `cache.enabled`        | boolean | `true`             | Enable semantic cache                                 |
| `cache.ttl`            | number  | `3600`             | Cache TTL (seconds)                                   |

### Environment Variables

| Variable              | Description             |
| --------------------- | ----------------------- |
| `HEX4CODE_API_KEY`    | API key                 |
| `HEX4CODE_BASE_URL`   | API endpoint URL        |
| `HEX4CODE_MODEL`      | Default model           |
| `HEX4CODE_PROVIDER`   | Default provider        |

### Skills Configuration

Skills support two directory levels for file extension:

- **User-level**: `~/.agents/skills/` — applies to all projects
- **Project-level**: `./.agents/skills/` — applies only to the current project

Skills files are in Markdown format and can include custom instructions, context, and tool configurations.

---

## Supported Model Providers

| Provider           | ID         | Description                             |
| ------------------ | ---------- | --------------------------------------- |
| DeepSeek           | `deepseek` | Supports Context Caching and Thinking Mode |
| OpenAI             | `openai`   | Standard OpenAI-compatible API          |
| Qwen               | `qwen`     | Alibaba Cloud Tongyi Qwen               |
| Doubao             | `doubao`   | ByteDance Doubao                        |

---

## Testing

```bash
# Run all tests
npm test

# Run individual package tests
npm run test:core
npm run test:cli
npm run test:vscode
```

The test framework uses Node.js native test runner, executed via `tsx --test`.

---

## License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](./LICENSE) file for details.

```
Copyright 2026 Zhengzhou Weiguang Semiconductor Co., Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

---

## Code of Conduct

We are committed to providing a friendly, respectful, and inclusive community environment for everyone. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

---

## Contributing

We welcome community contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) to learn about:

- How to submit Issues and Pull Requests
- Code style and conventions
- Development environment setup
- Commit message conventions

---

## Documentation

| Document                                | Description                          |
| --------------------------------------- | ------------------------------------ |
| [API Reference](./docs/api.md)          | Core API interface documentation     |
| [SDK Guide](./docs/sdk.md)              | SDK integration and usage guide      |
| [Architecture Overview](./docs/architecture.md) | System architecture design     |
| [Configuration Guide](./docs/configuration.md)  | Detailed configuration guide   |
| [Security Policy](./SECURITY.md)        | Security vulnerability reporting     |
| [Changelog](./CHANGELOG.md)             | Version release notes                |

---

## Community & Support

- **Source Code**: [https://atomgit.com/zzwgbdt/Hex4Code](https://atomgit.com/zzwgbdt/Hex4Code)
- **Bug Reports**: Submit via [AtomGit Issues](https://atomgit.com/zzwgbdt/Hex4Code/issues)
- **Discussions**: Join via [AtomGit Discussions](https://atomgit.com/zzwgbdt/Hex4Code/discussions)

---
