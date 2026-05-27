# Acknowledgments

---

## Background

Hex4Code was born during the development of the **HEX4 Asymmetric Ternary + TC Computing System** at **Zhengzhou Weiguang Semiconductor Co., Ltd.**

In our daily R&D work, we discovered that general-purpose AI coding tools have a fundamental adaptability gap with the HEX4 technology stack — they can neither understand ternary encoding and TC confidence propagation semantics, nor provide targeted token optimization. At the same time, our accumulated expertise in DualTrit compression and confidence merging algorithms provided ready-made answers to these problems.

So we made a decision: instead of waiting for tools to adapt to us, we would build our own AI coding assistant deeply integrated with the HEX4 technology system.

---

## Technical Approach

### Model Selection

After a comprehensive evaluation of mainstream large language models, **DeepSeek** demonstrated a unique affinity with the HEX4 Asymmetric Ternary + TC Computing System across five dimensions:

| Dimension | DeepSeek Advantage | Significance for HEX4 |
|-----------|:------------------:|-----------------------|
| Context Window | Up to 1M tokens | Accommodates full DualTrit compressed context and TC propagation chains |
| Thinking Mode | Native support | TC four-state confidence determination relies on deep reasoning capability |
| Structured Output | Stable and reliable | DualTrit-encoded compact JSON can be unambiguously parsed |
| Token Economy | Cost-effective | Paired with ~44% DualTrit compression, doubling cost advantages |
| API Compatibility | OpenAI-compatible | Zero-friction integration, focusing entirely on upper-layer innovation |

Among all models evaluated, only DeepSeek simultaneously met the demanding requirements of the HEX4 technology stack across context depth, reasoning capability, and economic efficiency.

### Engineering Reference

At the architecture level, we studied and drew inspiration from the open-source implementation of **[deepcode]**. Its tool execution framework, session management patterns, and Agent loop design provided clear engineering references for Hex4Code's early prototype. Thanks to this work, we were able to focus our efforts on differentiated innovations for the HEX4 technology system rather than building foundational infrastructure from scratch.

---

## Development Timeline

| Time Point | Milestone | Description |
|------------|-----------|-------------|
| **Hours 0–3** | First working prototype | Referenced deepcode architecture, integrated HEX4 DualTrit compression, established basic session management and tool execution pipeline |
| **Hour 3** | Production deployment | Prototype immediately replaced general-purpose AI coding tools, used in daily R&D across the entire team |
| **Hours 3–24** | First production iteration | Refined prompt templates and tool parameter parsing logic based on real usage feedback |
| **Hours 24–72** | Core system成型 | Completed TC confidence propagation, pipeline orchestration engine, and semantic cache — the three pillars of the HEX4 toolchain |
| **Hours 72–168** | Multi-model routing + MCP | Expanded provider registry to 9 providers, integrated MCP protocol, implemented user-level and project-level Skills system |
| **Hour 168 (Day 7)** | **v1.1.0 Open Source Release** | Hex4Code v1.1.0 officially released on AtomGit and GitHub under the Apache-2.0 license |

The principle that guided these seven days was simple: **iterate in production**. Every day, the team used the very tools they were building to advance HEX4 computing system R&D. Every commit, every fix, every feature originated from real pain points encountered just hours earlier. No sprint plans, no roadmap meetings — just a continuous, tight feedback loop between the tool and the work it was meant to accelerate.

---

## Special Thanks

### DeepSeek

Thank you to the **DeepSeek** team for creating the large language model with the strongest affinity for the HEX4 Asymmetric Ternary + TC Computing System. DeepSeek V4's ultra-long context window, native Thinking Mode, and stable structured output capabilities enabled Hex4Code's two core innovations — DualTrit ternary compression encoding and TC four-state confidence propagation — to reach their full potential in production. Without DeepSeek's breakthrough in model capability, our technical vision would have remained theoretical.

### deepcode

Thank you to the **[deepcode]** open-source implementation. Its engineering practices in tool execution scheduling, session lifecycle management, and Agent loop design provided an invaluable architectural foundation for Hex4Code's early development. Standing on the shoulders of this work, we were able to complete a working prototype within three hours, focusing our creative energy on differentiated innovation for the HEX4 technology stack rather than reinventing the wheel.

### Zhengzhou Weiguang Semiconductor Team

Thank you to every team member who participated in Hex4Code's development and production validation during the intensive seven-day iteration. Your practice of "use it while improving it" — where every code change was immediately tested against real HEX4 computing system R&D tasks — was the core engine that turned a three-hour prototype into a production-grade open-source release.

### Open Source Community

Thank you to AtomGit and GitHub for providing fertile ground for open-source collaboration, and to every developer who uses, provides feedback on, and contributes to Hex4Code. Hex4Code will remain open source — we believe the best tools are shaped by the communities that use them, and the best innovations are born from free sharing.

---

## License

```
Hex4Code — An AI coding assistant integrating multi-model routing, semantic cache, and pipeline orchestration.

Copyright © 2026 Zhengzhou Weiguang Semiconductor Co., Ltd.

Licensed under the Apache License, Version 2.0.
See http://www.apache.org/licenses/LICENSE-2.0 for the full license text.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
```

---

> **Note**: The `[deepcode]` reference refers to the specific open-source project whose technical approach we studied and learned from.
> For the latest information about that project, please refer to its official repository. All code in Hex4Code based on its reference
> implementation has been properly attributed and declared in accordance with the relevant open-source license requirements.
