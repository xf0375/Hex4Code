# Contributing Guide

Thank you for your interest in Hex4Code! We welcome all forms of contribution.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please engage with professionalism and respect.

## How to Contribute

### Report Bugs

1. Go to the [Issues page](https://atomgit.com/zzwgbdt/Hex4Code/issues)
2. Search for existing issues first
3. If none exists, create a new Issue with the following information:
   - **Environment**: OS, Node.js version, Hex4Code version
   - **Steps to reproduce**: Detailed description of how to trigger the issue
   - **Expected behavior**: What you expected to happen
   - **Actual behavior**: What actually happened
   - **Logs/screenshots**: Relevant error logs or screenshots

### Feature Requests

1. Use the Feature Request template on the Issues page
2. Describe the use case and value of the feature
3. Include design ideas or pseudocode if available

### Submitting a Pull Request

#### Development Setup

```bash
# 1. Fork and clone the repository
git clone https://atomgit.com/zzwgbdt/Hex4Code.git
cd Hex4Code

# 2. Install dependencies
npm install

# 3. Verify the build
npm run build

# 4. Run tests
npm test
```

#### Branch Naming Convention

| Type       | Format             | Example                        |
| ---------- | ------------------ | ------------------------------ |
| Feature    | `feat/<description>` | `feat/add-syntax-highlight`    |
| Bug fix    | `fix/<description>`  | `fix/session-leak`             |
| Docs       | `docs/<description>` | `docs/api-reference`           |
| Refactor   | `refactor/<description>` | `refactor/model-router`     |

#### Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Type descriptions**:

| Type       | Description                      |
| ---------- | -------------------------------- |
| `feat`     | New feature                      |
| `fix`      | Bug fix                          |
| `docs`     | Documentation updates            |
| `style`    | Code style (no logic change)     |
| `refactor` | Code refactoring                 |
| `perf`     | Performance improvement          |
| `test`     | Test-related                     |
| `chore`    | Build/tooling/dependency updates |
| `ci`       | CI/CD configuration              |

**Example**:

```
feat(core): add multi-provider fallback in model router

Implements automatic fallback to secondary providers when
primary provider fails or exceeds rate limits.

Closes #42
```

#### Code Standards

- **Language**: TypeScript strict mode
- **Formatting**: Prettier (auto-formatting)
- **Lint**: ESLint 9 + typescript-eslint
- **Pre-commit**: Husky + lint-staged auto-checks

```bash
# Manual checks and formatting
npm run lint
npm run format
```

#### PR Workflow

1. Ensure all tests pass: `npm test`
2. Ensure lint checks pass: `npm run lint`
3. Update relevant documentation
4. Create a PR and fill in the template
5. Wait for Code Review

#### Code Review Standards

- Code readability: clear naming, appropriate comments
- Test coverage: critical logic requires tests
- Type safety: leverage TypeScript's type system
- Performance: avoid unnecessary overhead
- Compatibility: backward compatible or clearly mark Breaking Changes

## Project Structure

```
packages/core/     # Core engine — session management, model routing, tool execution
packages/cli/      # CLI application — Ink-based terminal TUI
vscode/            # VS Code extension — WebView chat panel
docs/              # Project documentation
```

For detailed architecture, refer to [docs/architecture.md](./docs/architecture.md).

## Development Tools

| Tool                 | Purpose                |
| -------------------- | ---------------------- |
| TypeScript ^6.0.3    | Programming language   |
| esbuild              | Fast bundler           |
| Ink (React)          | CLI TUI framework      |
| ESLint + Prettier    | Code quality           |
| Husky + lint-staged  | Git hooks              |
| Node.js Test Runner  | Test framework         |

## Questions & Help

- **Issues**: [https://atomgit.com/zzwgbdt/Hex4Code/issues](https://atomgit.com/zzwgbdt/Hex4Code/issues)
- **Discussions**: [https://atomgit.com/zzwgbdt/Hex4Code/discussions](https://atomgit.com/zzwgbdt/Hex4Code/discussions)
