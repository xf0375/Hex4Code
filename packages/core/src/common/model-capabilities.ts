/// @file model-capabilities.ts
/// @brief 模型能力查询 — 动态读取 provider-registry，替代硬编码集合
///
/// 原始版本使用静态 Set 硬编码了 DeepSeek 模型名。
/// 改为动态查询 provider-registry，支持所有已注册模型。

import { getModelDef, getProvider } from "../models/provider-registry";

// ── 保留向后兼容的命名导出 ──────────────────────────────────────

/**
 * 判断模型是否默认启用thinking模式。
 * DeepSeek V4 和 Gemini 系列默认启用。
 */
export function defaultsToThinkingMode(model: string): boolean {
  const def = getModelDef(model);
  if (!def) return false;
  const provider = getProvider(def.provider);
  return provider?.supportsThinking === true;
}

/**
 * 判断模型是否支持多模态（图像/音频输入）。
 * DeepSeek 系列均不支持；其他模型视Provider而定。
 */
export function supportsMultimodal(model: string): boolean {
  const def = getModelDef(model);
  if (!def) return true; // 未知模型默认为支持多模态（向后兼容）
  const provider = getProvider(def.provider);
  return provider?.supportsMultimodal === true;
}

/**
 * 判断模型是否属于 DeepSeek V4 系列（保留向后兼容）。
 */
export function isDeepSeekV4Model(model: string): boolean {
  const def = getModelDef(model);
  return def?.provider === "deepseek" && (def.id === "deepseek-v4-pro" || def.id === "deepseek-v4-flash");
}

// ── 保留向后兼容的静态导出 ──────────────────────────────────────

/** @deprecated 请使用 getModelDef() 或 provider-registry 的动态查询 */
export const DEEPSEEK_V4_MODELS: ReadonlySet<string> = new Set(["deepseek-v4-flash", "deepseek-v4-pro", "deepseek-chat", "deepseek-reasoner"]);

/** @deprecated 请使用 provider-registry 的 supportsMultimodal 字段 */
export const NON_MULTIMODAL_MODELS: ReadonlySet<string> = new Set([
  "deepseek-v4-pro",
  "deepseek-v4-flash",
  "deepseek-chat",
  "deepseek-reasoner",
]);
