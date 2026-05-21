# 架构概览 (Architecture Overview)

> **版本**: 1.1.0

---

## 高层架构

Hex4Code 采用 **Monorepo + npm workspaces** 架构，分为三个独立包：

```
┌─────────────────────────────────────────────────────┐
│                    Hex4Code                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  @hex4code/  │  │  @hex4code/  │  │ hex4code-   │ │
│  │  core        │  │  cli         │  │ vscode      │ │
│  │              │  │              │  │             │ │
│  │ 会话管理      │  │ Ink 终端 TUI  │  │ VS Code 扩展│ │
│  │ 模型路由      │  │ Slash 命令   │  │ WebView UI  │ │
│  │ 工具执行      │  │ Markdown 渲染│  │ 内联补全     │ │
│  │ 语义缓存      │  │ 图片粘贴     │  │ 命令面板     │ │
│  │ 流水线编排    │  │ 会话管理     │  │ 状态栏      │ │
│  │ MCP 协议     │  │              │  │             │ │
│  │ RAG 知识库   │  │              │  │             │ │
│  │ Skills 系统  │  │              │  │             │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
│         │                 │                 │         │
│         └─────────────────┼─────────────────┘         │
│                           │                            │
│              直接引用TypeScript源码                     │
│           (@hex4code/core → ../packages/core/src)      │
└─────────────────────────────────────────────────────┘
```

### 包依赖关系

```
@hex4code/core (no deps on other hex4 packages)
      ↑                          ↑
      │                          │
@hex4code/cli             hex4code-vscode
(引用 core 源码)           (引用 core 源码)
```

- `@hex4code/core` 是**纯逻辑库**，不依赖任何 Hex4Code 内部包，仅依赖 `openai`、`zod`、`ejs` 等第三方库
- CLI 和 VS Code 扩展到 core 的引用是**编译时路径别名**，在打包时由 esbuild 统一处理

---

## 核心引擎架构 (`@hex4code/core`)

```
@hex4code/core/src/
│
├── session.ts          ← 核心入口：SessionManager
├── session-types.ts    ← 类型定义
├── session-message.ts  ← 消息 CRUD
├── session-skill.ts    ← 技能加载
├── session-store.ts    ← JSONL 持久化
├── settings.ts         ← 配置解析与级联
├── agent-mode.ts       ← HEX4/General 双代理模式
├── prompt.ts           ← 系统 Prompt 与工具定义
│
├── models/             ← 多模型管理
│   ├── model-router.ts       ← 任务感知路由引擎
│   ├── provider-registry.ts  ← Provider/Model 注册表
│   └── provider-client.ts    ← OpenAI 兼容客户端工厂
│
├── tools/              ← 工具执行
│   ├── executor.ts           ← ToolExecutor 调度器
│   ├── bash-handler.ts       ← Shell 执行
│   ├── read-handler.ts       ← 文件读取
│   ├── write-handler.ts      ← 文件写入
│   ├── edit-handler.ts       ← 文件编辑
│   ├── build-handler.ts      ← 构建
│   ├── test-handler.ts       ← 测试
│   ├── git-handler.ts        ← Git 操作
│   ├── code-index-handler.ts ← 代码索引
│   ├── web-search-handler.ts ← 网络搜索
│   └── ask-user-question-handler.ts ← 用户提问
│
├── cache/              ← 缓存
│   └── semantic-cache.ts     ← 语义相似度缓存
│
├── compression/        ← 压缩
│   └── dual-trit.ts          ← 三元紧凑编码
│
├── orchestration/      ← 流水线
│   └── hex4code-pipeline.ts       ← 流水线编排
│
├── mcp/                ← MCP 协议
│   ├── mcp-client.ts         ← MCP 客户端
│   └── mcp-manager.ts        ← MCP 管理器
│
├── knowledge/          ← 知识库
│   ├── kb-loader.ts          ← 知识库加载器
│   └── session-rag.ts        ← RAG 检索增强
│
├── completion/         ← 代码补全
│   ├── unified-completion.ts
│   └── general-autocomplete.ts
│
└── common/             ← 工具模块
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

## 数据流

### 会话交互流程

```
用户输入 (CLI / VS Code WebView)
         │
         ▼
┌─────────────────┐
│  SessionManager │ ← 会话入口
│  .run()         │
└────────┬────────┘
         │
    ┌────▼────────────────────┐
    │ 1. 构造请求消息            │
    │ (含系统Prompt + Skills)   │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 2. 语义缓存查找            │
    │ SemanticCache.find()     │
    └────┬────────────────────┘
         │  命中 → 直接返回缓存响应
         │  未命中 ↓
    ┌────▼────────────────────┐
    │ 3. 选择模型               │
    │ ModelRouter.routeTask()  │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 4. 调用 LLM API          │
    │ (OpenAI 兼容接口)         │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 5. 解析响应               │
    │  ┌── 纯文本 → 返回        │
    │  └── 工具调用 ↓           │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 6. 工具执行               │
    │ ToolExecutor.execute()   │
    │  ┌── built-in handlers   │
    │  └── MCP tools           │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 7. 流水线检测              │
    │ Pipeline.detect()        │
    │ (TC 信任链传播)            │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 8. DualTrit 压缩结果      │
    │ → 返回 LLM 继续或结束      │
    └────┬────────────────────┘
         │
    ┌────▼────────────────────┐
    │ 9. 写入语义缓存            │
    │ 10. 持久化到 JSONL        │
    └─────────────────────────┘
```

---

## 配置级联

```
高优先级 ──────────────────────────────────────────
  ~/.hex4code/settings.json          (用户配置)
          ↓ 覆盖
  ./.hex4code/settings.json          (项目配置)
          ↓ 覆盖
  HEX4CODE_* 环境变量                 (系统配置)
  ＜内置默认值＞                       (代码默认值)
低优先级 ──────────────────────────────────────────
```

---

## 双代理模式对比

| 特性 | HEX4 模式 | General 模式 |
|------|-----------|-------------|
| 流水线强制 | ✅ 构建→测试→索引→Git | ❌ 无限制 |
| TC 信任链 | ✅ 阶段间信任传播 | ❌ 不启用 |
| DualTrit 压缩 | ✅ 启用 | ❌ 不启用 |
| 工具权限 | 受限（流水线内） | 全部可用 |
| 适用场景 | 规范化开发流程 | 自由编码探索 |

---

## 流水线生命周期

```
  ┌──────┐    ┌──────┐    ┌────────┐    ┌──────┐
  │Build │ →  │Test  │ →  │Code    │ →  │ Git  │
  │      │    │      │    │Index   │    │      │
  └──┬───┘    └──┬───┘    └───┬────┘    └──┬───┘
     │           │            │            │
     TC_CARRY   TC_CARRY    TC_CARRY    TC_CARRY
     │           │            │            │
     └───────────┴────────────┴────────────┘
              信任链 (Trust Chain)
```

每个阶段的结果携带 **TC (Trust Chain)** 标记：
- `TC_NONE` — 无不确定性
- `TC_CARRY` — 警告传播
- `TC_UNCERTAIN` — 语义不确定
- `TC_MIXED` — 混合信号

---

## 存储结构

```
~/.hex4code/
├── projects/                      ← 持久化数据
│   └── <project-code>/            ← 项目标识（路径哈希）
│       ├── sessions-index.json    ← 会话索引
│       └── <session-id>.jsonl     ← 会话消息（JSONL 格式）
├── cache/
│   └── semantic-cache.json        ← 语义缓存
└── settings.json                  ← 用户全局配置
```

---

## 构建系统

```
TypeScript 源码
      │
      ▼
  esbuild 打包
      │
  ┌───┴──────────┐
  │              │
  ▼              ▼
cli/          vscode/
dist/cli.js   out/extension.js
(ESM)         (CJS)
shebang       activate导出
```
