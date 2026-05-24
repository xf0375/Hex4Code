import chalk from "chalk";

export const CLI_THEME = {
  accent: "#37c6f4",
  accentStrong: "#8be9ff",
  accentDeep: "#148db8",
  border: "#2ca8d3",
  borderSoft: "#1d6f8d",
  warning: "#ffbf69",
  success: "#58d68d",
  inlineCode: "#7cecff",
};

export const themeChalk = {
  accent: chalk.hex(CLI_THEME.accent),
  accentBold: chalk.bold.hex(CLI_THEME.accent),
  accentStrong: chalk.hex(CLI_THEME.accentStrong),
  accentStrongBold: chalk.bold.hex(CLI_THEME.accentStrong),
  border: chalk.hex(CLI_THEME.border),
  warning: chalk.hex(CLI_THEME.warning),
  success: chalk.hex(CLI_THEME.success),
  inlineCode: chalk.hex(CLI_THEME.inlineCode),
};
