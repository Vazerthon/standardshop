import { defineConfig } from "@chakra-ui/react";

export const theme = defineConfig({
  theme: {
    tokens: {
      colors: {
        neuomorphic: {
          bg: { value: '#f0f0f0' },
          surface: { value: '#ffffff' },
          shadow: { value: '#d1d1d1' },
          highlight: { value: '#ffffff' },
          text: { value: '#2d3748' },
          textSecondary: { value: '#4a5568' },
          accent: { value: '#000000' },
        },
      },
      shadows: {
        neuomorphic: { value: '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff' },
        neuomorphicHover: { value: '6px 6px 12px #d1d1d1, -6px -6px 12px #ffffff' },
        neuomorphicInset: { value: 'inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff' },
        neuomorphicInsetHover: { value: 'inset 6px 6px 12px #d1d1d1, inset -6px -6px 12px #ffffff' },
        neuomorphicLarge: { value: '12px 12px 24px #d1d1d1, -12px -12px 24px #ffffff' },
      },
    },
    semanticTokens: {
      colors: {
        'bg.primary': { value: '{colors.neuomorphic.bg}' },
        'surface.primary': { value: '{colors.neuomorphic.surface}' },
        'text.primary': { value: '{colors.neuomorphic.text}' },
        'text.secondary': { value: '{colors.neuomorphic.textSecondary}' },
        'accent.primary': { value: '{colors.neuomorphic.accent}' },
      },
    },
  },
}); 

export const transitions = {
  default: 'all 0.2s ease-in-out',
  slow: 'all 0.3s ease-in-out',
  fast: 'all 0.1s ease-in-out',
} as const; 