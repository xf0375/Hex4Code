# Changelog

All notable changes to Hex4Code are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] — 2026-05-19

### Added

- **Pipeline Orchestration**: Full pipeline orchestration system covering Build → Test → Code Index → Version Control
- **Dual Agent Mode**: Pipeline-forced mode + general free agent mode with dynamic switching
- **DualTrit Compression**: Efficient session context compression, significantly extending effective conversation windows
- **RAG Knowledge Base**: Retrieval-augmented generation based on project code, improving code suggestion accuracy
- **MCP Protocol Support**: Support for Model Context Protocol external tool server integration
- **Skills System**: User-level and project-level custom skill configurations
- **Semantic Cache**: LLM response caching based on semantic similarity, reducing API call costs
- **Inline Code Completion**: Context-aware VS Code inline code suggestions
- **Image Paste Support**: Both CLI and VS Code support pasting screenshots for questions

### Changed

- `@hex4code/core`: Refactored session management, unified tool execution interface
- Model router performance optimization, reduced routing latency

### Fixed

- Fixed memory leak in long-running sessions
- Fixed race condition during concurrent multi-provider calls

---

## [1.0.0] — 2025-12-01

### Added

- Initial release
- `@hex4code/core`: Core engine (session management, multi-model routing, tool execution)
- `@hex4code/cli`: Ink-based terminal chat application
- `hex4code-vscode`: VS Code chat panel extension
- Support for DeepSeek, OpenAI, Qwen, Doubao providers
- 14 VS Code commands
