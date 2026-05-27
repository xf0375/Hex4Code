# Hex4Code

[Hex4Code](https://marketplace.visualstudio.com/items?itemName=hex4code-vscode) is a Visual Studio Code AI coding assistant extension, specially optimized for the latest `deepseek-v4` models.

## Configuration

Create a `~/.hex4code/settings.json` file with the following content:

```json
{
  "env": {
    "MODEL": "deepseek-v4-pro",
    "BASE_URL": "https://api.deepseek.com",
    "API_KEY": "sk-..."
  },
  "thinkingEnabled": true,
  "reasoningEffort": "max"
}
```

## Key Features

### **Skills**

Hex4Code supports agent skills, allowing you to extend the assistant's capabilities:

- **User-level Skills**: Skills are discovered and activated from the `~/.agents/skills/` directory.
- **Project-level Skills**: Project-specific skills are loaded from `./.agents/skills/`, with backward compatibility for the legacy `./.hex4code/skills/` directory.

### **Optimized for DeepSeek**

- Performance-tuned specifically for DeepSeek models.
- Cost reduction through [context caching](https://api-docs.deepseek.com/guides/kv_cache).
- Native support for [thinking mode](https://api-docs.deepseek.com/guides/thinking_mode) and reasoning effort control.

## Supported Models

- `deepseek-v4-pro` (recommended)
- `deepseek-v4-flash`
- Any other OpenAI-compatible model

## Screenshot

![screenshot](https://atomgit.com/zzwgbdt/Hex4Code/raw/master/vscode/resources/hex4code_screenshot.png)

## Hex4Code CLI

```bash
npm install -g @hex4code/cli
```

> The VS Code extension and CLI share configuration files and data, but are runtime-independent.

- AtomGit: https://atomgit.com/zzwgbdt/Hex4Code

## FAQ

### How do I move Hex4Code from the left sidebar to the right sidebar (Secondary Side Bar)?

![faq1](https://atomgit.com/zzwgbdt/Hex4Code/raw/master/vscode/resources/faq1.gif)

### Does Hex4Code support image understanding?

Hex4Code supports multimodal inputs. However, the current deepseek-v4 model does not support multimodal. While some models have multimodal capabilities, they may have strict limits on multi-turn conversation requests. For multimodal input, the Doubao-Seed-2.0-pro model from Volcano Engine is recommended for the best experience.

### How do I send automatic notifications after a task completes?

Write a shell notification script that calls a notification webhook, then set the `notify` field in `~/.hex4code/settings.json` to the full path of that script. For detailed steps, refer to the project docs.

### Does it support Coding Plan?

Yes. Just configure `env.BASE_URL` in `~/.hex4code/settings.json` to an OpenAI-compatible endpoint. Using Volcano Engine's Coding Plan as an example, configure `~/.hex4code/settings.json` like this:

```json
{
  "env": {
    "MODEL": "ark-code-latest",
    "BASE_URL": "https://ark.cn-beijing.volces.com/api/coding/v3",
    "API_KEY": "**************"
  },
  "thinkingEnabled": true
}
```

## Get Help

- Report bugs or request features on AtomGit Issues (https://atomgit.com/zzwgbdt/Hex4Code/issues)

## Support Us

If you find this extension helpful, please consider supporting us by:

- Giving us a Star on AtomGit (https://atomgit.com/zzwgbdt/Hex4Code)
- Submitting feedback and suggestions
- Sharing with your friends and colleagues
