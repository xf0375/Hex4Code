import type React from "react";
import { Text, type TextProps } from "ink";
import Gradient from "ink-gradient";
import { CLI_THEME } from "./theme";

export const ThemedGradient: React.FC<TextProps> = ({ children, ...props }) => {
  const gradient = [
    CLI_THEME.accentStrong,
    CLI_THEME.accent,
    CLI_THEME.accentDeep,
  ];

  if (gradient && gradient.length >= 2) {
    return (
      <Gradient colors={gradient}>
        <Text {...props}>{children}</Text>
      </Gradient>
    );
  }

  if (gradient && gradient.length === 1) {
    return (
      <Text color={gradient[0]} {...props}>
        {children}
      </Text>
    );
  }

  // Fallback to accent color if no gradient
  return (
    <Text color={CLI_THEME.accent} {...props}>
      {children}
    </Text>
  );
};
