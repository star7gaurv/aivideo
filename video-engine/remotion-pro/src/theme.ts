// Design System - Kurzgesagt-inspired
export const theme = {
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    accent: "#f59e0b",
    success: "#10b981",
    danger: "#ef4444",
    dark: "#001a4d",
    light: "#f8f9fa",
    white: "#ffffff",
    text: "#1a202c",
    textLight: "#718096",

    // Solar specific
    solar: {
      sun: "#fbbf24",
      panel: "#0369a1",
      energy: "#10b981",
      bg: "#0f172a"
    }
  },

  typography: {
    fontFamily: {
      sans: "'Inter', 'Roboto', sans-serif",
      hindi: "'Noto Sans Devanagari', sans-serif"
    },
    sizes: {
      xs: 12,
      sm: 16,
      base: 20,
      lg: 28,
      xl: 36,
      "2xl": 48,
      "3xl": 64,
      "4xl": 80,
    },
    weights: {
      light: 300,
      normal: 400,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    }
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
  },

  animation: {
    easing: {
      ease: [0.25, 0.46, 0.45, 0.94],
      easeIn: [0.42, 0, 1, 1],
      easeOut: [0, 0, 0.58, 1],
      easeInOut: [0.42, 0, 0.58, 1],
      custom: [0.25, 0.1, 0.25, 1],
    },
    durations: {
      fast: 0.2,
      base: 0.5,
      slow: 1,
      slower: 1.5,
    }
  }
};
