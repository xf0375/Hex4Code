import type { SkillInfo } from "@hex4/core/session";

export type SlashCommandKind = "skill" | "skills" | "model" | "provider" | "cost" | "vote" | "recommend" | "compact" | "cache" | "benchmark" | "quota" | "insights" | "new" | "init" | "resume" | "mcp" | "exit" | "clearcache" | "sessions" | "hex4";

export type SlashCommandItem = {
  kind: SlashCommandKind;
  name: string;
  label: string;
  description: string;
  skill?: SkillInfo;
};

export const BUILTIN_SLASH_COMMANDS: SlashCommandItem[] = [
  {
    kind: "skills",
    name: "skills",
    label: "/skills",
    description: "List available skills",
  },
  {
    kind: "model",
    name: "model",
    label: "/model",
    description: "Select model, thinking mode and effort control. Use /model list to browse all models.",
  },
  {
    kind: "provider",
    name: "provider",
    label: "/provider",
    description: "Manage AI providers: list, set API keys, check status",
  },
  {
    kind: "new",
    name: "new",
    label: "/new",
    description: "Start a fresh conversation",
  },
  {
    kind: "init",
    name: "init",
    label: "/init",
    description: "Initialize an AGENTS.md file with instructions for LLM",
  },
  {
    kind: "resume",
    name: "resume",
    label: "/resume",
    description: "Pick a previous conversation to continue",
  },
  {
    kind: "mcp",
    name: "mcp",
    label: "/mcp",
    description: "Show MCP server status and available tools",
  },
  {
    kind: "exit",
    name: "exit",
    label: "/exit",
    description: "Quit Hex4Code CLI",
  },
  {
    kind: "clearcache",
    name: "clearcache",
    label: "/clearcache",
    description: "Clear all in-memory caches (code index, file state)",
  },
  {
    kind: "sessions",
    name: "sessions",
    label: "/sessions",
    description: "Manage sessions: list, search, delete, export"
  },
  {
    kind: "hex4",
    name: "hex4",
    label: "/hex4",
    description: "HEX4 project utilities: new, build, test",
  },
  {
    kind: "cost",
    name: "cost",
    label: "/cost",
    description: "Cost Dashboard — view session costs and token usage",
  },
  {
    kind: "recommend",
    name: "recommend",
    label: "/recommend",
    description: "Smart model recommendation — get best model for each task type",
  },
  {
    kind: "compact",
    name: "compact",
    label: "/compact",
    description: "Manually compact current session context",
  },
  {
    kind: "vote",
    name: "vote",
    label: "/vote",
    description: "Multi-model parallel vote — query multiple providers simultaneously",
  },
  {
    kind: "cache",
    name: "cache",
    label: "/cache",
    description: "Semantic cache stats — show hit rate, entries, models",
  },
  {
    kind: "benchmark",
    name: "benchmark",
    label: "/benchmark",
    description: "Benchmark models — compare latency and response quality across providers",
  },
  {
    kind: "quota",
    name: "quota",
    label: "/quota",
    description: "Usage quota management — view and set monthly token/cost limits",
  },
  {
    kind: "insights",
    name: "insights",
    label: "/insights",
    description: "Route history insights — show model performance analytics per task type",
  },
];

export function buildSlashCommands(skills: SkillInfo[]): SlashCommandItem[] {
  const skillItems: SlashCommandItem[] = skills.map((skill) => ({
    kind: "skill",
    name: skill.name,
    label: `/${skill.name}`,
    description: skill.description || "(no description)",
    skill,
  }));
  return [...skillItems, ...BUILTIN_SLASH_COMMANDS];
}

export function filterSlashCommands(items: SlashCommandItem[], token: string): SlashCommandItem[] {
  if (!token.startsWith("/")) {
    return [];
  }
  const query = token.slice(1).toLowerCase();
  if (!query) {
    return items;
  }
  return items.filter((item) => item.name.toLowerCase().includes(query));
}

export function findExactSlashCommand(items: SlashCommandItem[], token: string): SlashCommandItem | null {
  if (!token.startsWith("/")) {
    return null;
  }
  const query = token.slice(1);
  const matches = items.filter((item) => item.name === query);
  return matches.find((item) => item.kind !== "skill") ?? matches[0] ?? null;
}

export function formatSlashCommandDescription(description: string): string {
  return (description || "(no description)").trim().replace(/\s+/g, " ");
}

export function formatSlashCommandLabel(item: SlashCommandItem): string {
  return item.kind === "skill" && item.skill?.isLoaded ? `${item.label} ✓` : item.label;
}
