# Hex4Code

<p align="center">
  <strong>AI 驱动的编码助手 — 多模型路由 · 语义缓存 · 流水线编排</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.1.0-blue" alt="version" />
  <img src="https://img.shields.io/badge/license-Apache--2.0-green" alt="license" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="node" />
</p>

---

## 公司简介

**郑州威光半导体有限公司** (Zhengzhou Weiguang Semiconductor Co., Ltd.) 是一家专注于半导体技术与智能化软件开发的高科技企业。公司致力于将前沿 AI 技术与工程实践深度融合，打造面向开发者的新一代智能编码工具。

Hex4Code 是公司旗下的开源 AI 编程助手项目，以内置的流水线引擎（构建→测试→索引→版本管理）为核心，为开发者提供从终端 CLI 到 VS Code 插件的全场景智能编码体验。

- **开源仓库**：[https://atomgit.com/zzwgbdt/Hex4Code](https://atomgit.com/zzwgbdt/Hex4Code)
- **版权所有**：Copyright © 2026 郑州威光半导体有限公司

---

## 项目简介

Hex4Code 是一套多产品形态的 AI 编码助手生态系统，由三个核心包组成：

| 包名                  | 说明                                                      |
| --------------------- | --------------------------------------------------------- |
| **`@hex4code/core`**  | 共享核心引擎 — 会话管理、多模型路由、语义缓存、流水线编排 |
| **`@hex4code/cli`**   | 终端 TUI 应用 (基于 Ink/React) — 在命令行中与 AI 模型对话 |
| **`hex4code-vscode`** | VS Code 扩展 — 侧边栏 WebView 聊天界面，深度集成 IDE      |

### 流水线 (Pipeline)

内置开发流水线引擎，串联构建→测试→代码索引→版本管理的完整开发流程：

| 阶段      | 英文     | 说明               |
| --------- | -------- | ------------------ |
| Build     | 构建     | 项目编译构建       |
| Test      | 测试     | 自动化测试         |
| CodeIndex | 代码索引 | 代码库索引与搜索   |
| Git       | 版本管理 | Git 操作与版本控制 |

### 核心特性

- **多模型智能路由** — 根据任务类型自动选择最优模型，支持 DeepSeek、OpenAI、Qwen、Doubao 等
- **语义缓存** — 减少重复 API 调用，节省 Token 成本
- **双代理模式** — 流水线模式 vs. 通用代理模式，灵活切换
- **三元压缩 (DualTrit)** — 高效压缩上下文，拓展有效对话窗口
- **RAG 知识库** — 基于项目代码的检索增强生成
- **MCP 协议** — 支持 Model Context Protocol 外部工具集成
- **Skills 技能系统** — 用户级 + 项目级自定义技能扩展

---

## 项目结构

```
hex4_code_v1.1/
├── packages/
│   ├── core/          # @hex4code/core — 核心引擎
│   │   └── src/       # TypeScript 源码
│   └── cli/           # @hex4code/cli — 终端应用
│       └── src/       # React (Ink) 源码
├── vscode/            # VS Code 扩展
│   ├── src/           # 扩展源码
│   ├── resources/     # 前端 WebView UI
│   └── docs/          # VS Code 扩展文档
├── AGENTS.md          # 项目说明
├── LICENSE            # Apache-2.0 许可证
├── NOTICE             # 版权声明
├── package.json       # 根工作区配置
└── tsconfig.base.json # 共享 TypeScript 配置
```

---

## 环境要求

- **Node.js** >= 18
- **npm** >= 9
- **TypeScript** ^6.0.3

---

## 快速开始

### 1. 克隆仓库

```bash
git clone https://atomgit.com/zzwgbdt/Hex4Code.git
cd Hex4Code
```

### 2. 安装依赖

```bash
npm install
```

### 3. 编译

本项目使用 npm workspaces 管理，支持顺序构建：

```bash
# 编译所有包（core → vscode → cli）
npm run build

# 或分别编译
npm run build:core        # 编译 @hex4code/core
npm run build:vscode      # 编译 VS Code 扩展
npm run build:cli         # 编译 CLI 应用
```

构建工具为 **esbuild**：

- CLI：ESM 输出到 `packages/cli/dist/cli.js`
- VS Code：CJS 输出到 `vscode/out/extension.js`

### 4. 运行 CLI

```bash
# 开发模式（通过 tsx 直接运行）
npx tsx packages/cli/src/cli.tsx

# 生产模式（编译后运行）
node packages/cli/dist/cli.js

# 或通过 npm bin
npx hex4code
```

### 5. 安装 VS Code 扩展

```bash
# 方式一：直接安装预构建的 .vsix 文件
code --install-extension vscode/hex4code-vscode-1.1.0.vsix

# 方式二：在 VS Code 中手动安装
# 1. 打开 VS Code
# 2. 按 Ctrl+Shift+P 打开命令面板
# 3. 选择 "Extensions: Install from VSIX..."
# 4. 选择 vscode/hex4code-vscode-1.1.0.vsix
```

---

## 打包

### CLI 打包

CLI 使用 esbuild 打包为单文件可执行脚本：

```bash
npm run build:cli
# 输出: packages/cli/dist/cli.js
# 内含 shebang (#!), 可直接执行
```

### VS Code 扩展打包

```bash
# 先编译扩展
npm run build:vscode

# 打包为 .vsix
cd vscode
npx vsce package --baseImagesUrl=https://atomgit.com/zzwgbdt/Hex4Code
# 输出: vscode/hex4code-vscode-<version>.vsix
```

---

## 使用说明

### CLI 模式

启动后进入交互式终端，支持以下功能：

| 命令      | 说明                     |
| --------- | ------------------------ |
| `/new`    | 创建新会话               |
| `/init`   | 初始化项目工作流         |
| `/resume` | 恢复上次会话             |
| `/exit`   | 退出应用                 |
| 直接输入  | 向 AI 发送编码问题或指令 |

### VS Code 模式

安装扩展后，点击侧边栏 **Hex4Code** 图标打开聊天面板：

- 选中代码后，右键菜单可使用 Hex4Code 进行分析
- 支持内联代码补全（基于上下文感知）
- 通过 VS Code 命令面板 (`Ctrl+Shift+P`) 搜索 `Hex4Code` 访问所有功能

### Slash 命令

两组内置命令模式：

**Agent 内命令**（在聊天对话框中输入 `/`）：

- `/compact` — 压缩会话上下文
- `/config` — 显示当前配置
- `/context` — 显示上下文使用量
- `/cost` — 显示 Token 费用统计
- `/doctor` — 运行诊断检查
- `/init` — 初始化项目配置文件
- `/memory` — 管理长期记忆
- `/release-notes` — 查看版本更新
- `/status` — 显示连接状态

**VS Code 命令面板命令**（通过 `Ctrl+Shift+P`）：

- `Hex4Code: Open` — 打开聊天面板
- `Hex4Code: Select Model` — 选择 AI 模型
- `Hex4Code: Configure Provider` — 配置模型供应商
- `Hex4Code: Run Benchmarks` — 运行性能基准测试
- `Hex4Code: View Cache Stats` — 查看缓存统计
- `Hex4Code: Toggle Agent Mode` — 切换代理模式
- `Hex4Code: Reset All Settings` — 重置所有设置

---

## 配置说明

> 推荐优先使用 VS Code 侧边栏里的模型下拉和齿轮按钮完成配置。下面是当前推荐的 JSON 配置格式；旧版 `env.API_KEY` 写法仍兼容，但不推荐用于多 Provider 切换。

### 推荐配置格式

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

每个 Provider 拥有自己的 API Key。切换模型时，Hex4Code 会按模型所属 Provider 读取对应 Key，不会把 DeepSeek 的 Key 发送给 OpenAI，反之亦然。

### 配置优先级

项目级配置会覆盖用户级配置：

```text
环境变量 HEX4CODE_*
> 项目级 ./.hex4code/settings.json
> 用户级 ~/.hex4code/settings.json
> 默认值
```

例如，用户级配置选择 `deepseek-v4-flash`，但项目级配置选择 `deepseek-v4-pro`，则当前项目会使用 `deepseek-v4-pro`。

### API Key 解析顺序

内置 Provider 的 API Key 按以下顺序解析：

```text
providers.<provider>.apiKey
> env.<PROVIDER_API_KEY>
> 系统环境变量 <PROVIDER_API_KEY>
> legacy API_KEY（仅在归属明确时使用）
```

如果必须继续使用旧版通用 `API_KEY` / `BASE_URL`，建议显式声明归属：

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

Provider 专用环境变量也可使用，例如 `DEEPSEEK_API_KEY`、`OPENAI_API_KEY`、`QWEN_API_KEY`、`GEMINI_API_KEY`。

### 配置文件位置

Hex4Code 支持三层配置级联（优先级从低到高）：

| 层级         | 路径                        | 说明               |
| ------------ | --------------------------- | ------------------ |
| 系统环境变量 | `HEX4CODE_*` 环境变量       | 全局配置           |
| 项目级配置   | `./.hex4code/settings.json` | 项目根目录下的配置 |
| 用户级配置   | `~/.hex4code/settings.json` | 用户主目录下的配置 |

### 配置文件示例

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

### 关键配置项

| 配置项                 | 类型    | 默认值            | 说明                                                       |
| ---------------------- | ------- | ----------------- | ---------------------------------------------------------- |
| `model`                | string  | `"deepseek-chat"` | 默认使用的模型名称                                         |
| `provider`             | string  | `"deepseek"`      | 模型供应商                                                 |
| `apiKey`               | string  | —                 | API 密钥                                                   |
| `baseURL`              | string  | —                 | API 端点地址                                               |
| `maxTokens`            | number  | `4096`            | 最大生成 Token 数                                          |
| `temperature`          | number  | `0.7`             | 生成温度 (0-2)                                             |
| `modelRouting.enabled` | boolean | `true`            | 是否启用多模型路由                                         |
| `agentMode`            | string  | `"hex4"`          | 代理模式: `"hex4"`（流水线模式）或 `"general"`（通用模式） |
| `cache.enabled`        | boolean | `true`            | 是否启用语义缓存                                           |
| `cache.ttl`            | number  | `3600`            | 缓存有效期（秒）                                           |

### 环境变量

| 变量                | 说明         |
| ------------------- | ------------ |
| `HEX4CODE_API_KEY`  | API 密钥     |
| `HEX4CODE_BASE_URL` | API 端点地址 |
| `HEX4CODE_MODEL`    | 默认模型     |
| `HEX4CODE_PROVIDER` | 默认供应商   |

### Skills 技能配置

Skills 支持两个目录级别的文件扩展：

- **用户级**：`~/.agents/skills/` — 适用于所有项目
- **项目级**：`./.agents/skills/` — 仅适用于当前项目

Skills 文件为 Markdown 格式，可包含自定义指令、上下文和工具配置。

---

## 支持的模型供应商

| 供应商          | 标识       | 说明                                  |
| --------------- | ---------- | ------------------------------------- |
| DeepSeek        | `deepseek` | 支持 Context Caching 和 Thinking Mode |
| OpenAI          | `openai`   | 标准 OpenAI 兼容 API                  |
| 通义千问 (Qwen) | `qwen`     | 阿里云通义千问                        |
| 豆包 (Doubao)   | `doubao`   | 字节跳动豆包                          |

---

## 测试

```bash
# 运行所有测试
npm test

# 分别运行各包测试
npm run test:core
npm run test:cli
npm run test:vscode
```

测试框架使用 Node.js 原生 test runner，通过 `tsx --test` 执行。

---

## 许可证 (LICENSE)

本项目整体采用 **Apache License 2.0** 许可。详见 [LICENSE](./LICENSE) 文件。

```
Copyright 2026 郑州威光半导体有限公司 (Zhengzhou Weiguang Semiconductor Co., Ltd.)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

---

## 行为准则 (Code of Conduct)

我们致力于为所有人提供一个友好、尊重、包容的社区环境。详见 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)。

---

## 贡献指南

我们欢迎社区贡献！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解：

- 如何提交 Issue 和 Pull Request
- 代码风格与规范
- 开发环境搭建
- 提交信息规范

---

## 文档

| 文档                                | 说明               |
| ----------------------------------- | ------------------ |
| [API 参考](./docs/api.md)           | 核心 API 接口文档  |
| [SDK 指南](./docs/sdk.md)           | SDK 集成与使用说明 |
| [架构概览](./docs/architecture.md)  | 系统架构设计文档   |
| [配置指南](./docs/configuration.md) | 详细配置说明       |
| [安全策略](./SECURITY.md)           | 安全漏洞报告流程   |
| [更新日志](./CHANGELOG.md)          | 版本更新记录       |

---

## 社区与支持

- **代码仓库**：[https://atomgit.com/zzwgbdt/Hex4Code](https://atomgit.com/zzwgbdt/Hex4Code)
- **问题反馈**：通过 [AtomGit Issues](https://atomgit.com/zzwgbdt/Hex4Code/issues) 提交
- **讨论交流**：通过 [Discussions](https://atomgit.com/zzwgbdt/Hex4Code/discussions) 参与

---
