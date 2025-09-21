import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { useAppSelector } from "../store/hooks";

export const LightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: "#0ea5e9",
    background: "#ffffff",
    card: "#ffffff",
    text: "#1f2937",
    secondaryText: "#6b7280",
    border: "#e5e7eb",
    notification: "#0ea5e9",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    icon: "#4b5563",
    subtext: "#8E8E93",
    accent: "#0A84FF",
    buttonText: "#FFFFFF",
    disabled: "#cccccc", 
  },
  shadows: {
    small: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4.65,
      elevation: 6,
    },
    large: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8.3,
      elevation: 10,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export const DarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: "#0ea5e9",
    background: "#111827",
    card: "#1f2937",
    text: "#f9fafb",
    secondaryText: "#9ca3af",
    border: "#374151",
    notification: "#0ea5e9",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    icon: "#9ca3af",
    subtext: "#8E8E93",
    accent: "#0A84FF",
    buttonText: "#FFFFFF",
    disabled: "#cccccc", 
  },
  shadows: {
    small: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.4,
      shadowRadius: 4.65,
      elevation: 6,
    },
    large: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.5,
      shadowRadius: 8.3,
      elevation: 10,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export const useTheme = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const theme = isDarkMode ? DarkTheme : LightTheme;

  return {
    colors: theme.colors,
    shadows: theme.shadows,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    isDark: isDarkMode,
  };
};
