# 贡献指南 (Contributing Guide)

感谢你对 Hex4Code 的关注！我们欢迎所有形式的贡献。

## 行为准则

参与本项目即表示你同意遵守我们的[行为准则](./CODE_OF_CONDUCT.md)。请以专业和尊重的态度交流。

## 如何贡献

### 报告 Bug

1. 前往 [Issues 页面](https://atomgit.com/zzwgbdt/Hex4Code/issues)
2. 搜索是否已有相同问题
3. 如果没有，创建新 Issue，包含以下信息：
   - **环境信息**：OS、Node.js 版本、Hex4Code 版本
   - **复现步骤**：详细描述如何触发问题
   - **预期行为**：你期望的结果
   - **实际行为**：实际发生的结果
   - **日志/截图**：相关的错误日志或截图

### 功能请求

1. 在 Issues 页面使用 Feature Request 模板
2. 描述功能的使用场景和价值
3. 如有，附上设计思路或伪代码

### 提交 Pull Request

#### 开发环境搭建

```bash
# 1. Fork 并克隆仓库
git clone https://atomgit.com/zzwgbdt/Hex4Code.git
cd Hex4Code

# 2. 安装依赖
npm install

# 3. 验证构建
npm run build

# 4. 运行测试
npm test
```

#### 分支命名规范

| 类型     | 格式              | 示例                        |
| -------- | ----------------- | --------------------------- |
| 功能开发 | `feat/<描述>`     | `feat/add-syntax-highlight` |
| Bug 修复 | `fix/<描述>`      | `fix/session-leak`          |
| 文档更新 | `docs/<描述>`     | `docs/api-reference`        |
| 重构     | `refactor/<描述>` | `refactor/model-router`     |

#### 提交信息规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**类型说明**：

| 类型       | 说明                       |
| ---------- | -------------------------- |
| `feat`     | 新功能                     |
| `fix`      | Bug 修复                   |
| `docs`     | 文档更新                   |
| `style`    | 代码风格（不影响代码逻辑） |
| `refactor` | 重构                       |
| `perf`     | 性能优化                   |
| `test`     | 测试相关                   |
| `chore`    | 构建/工具/依赖更新         |
| `ci`       | CI/CD 配置                 |

**示例**：

```
feat(core): add multi-provider fallback in model router

Implements automatic fallback to secondary providers when
primary provider fails or exceeds rate limits.

Closes #42
```

#### 代码规范

- **语言**：TypeScript 严格模式
- **格式化**：Prettier（自动格式化）
- **Lint**：ESLint 9 + typescript-eslint
- **提交前**：Husky + lint-staged 自动检查

```bash
# 手动检查和格式化
npm run lint
npm run format
```

#### PR 流程

1. 确保代码通过所有测试：`npm test`
2. 确保代码通过 Lint 检查：`npm run lint`
3. 更新相关文档
4. 创建 PR，填写模板信息
5. 等待 Code Review

#### 代码审查标准

- 代码可读性：清晰的命名、适当的注释
- 测试覆盖：关键逻辑需要测试
- 类型安全：充分利用 TypeScript 类型系统
- 性能考量：避免不必要的开销
- 兼容性：向后兼容或明确标注 Breaking Changes

## 项目结构

```
packages/core/     # 核心引擎 — 会话管理、模型路由、工具执行
packages/cli/      # CLI 应用 — 基于 Ink 的终端 TUI
vscode/            # VS Code 扩展 — WebView 聊天面板
docs/              # 项目文档
```

详细架构说明请参考 [docs/architecture.md](./docs/architecture.md)。

## 开发工具

| 工具                | 用途         |
| ------------------- | ------------ |
| TypeScript ^6.0.3   | 编程语言     |
| esbuild             | 快速打包     |
| Ink (React)         | CLI TUI 框架 |
| ESLint + Prettier   | 代码质量     |
| Husky + lint-staged | Git 钩子     |
| Node.js Test Runner | 测试框架     |

## 问题与帮助

- **Issues**: [https://atomgit.com/zzwgbdt/Hex4Code/issues](https://atomgit.com/zzwgbdt/Hex4Code/issues)
- **Discussions**: [https://atomgit.com/zzwgbdt/Hex4Code/discussions](https://atomgit.com/zzwgbdt/Hex4Code/discussions)
