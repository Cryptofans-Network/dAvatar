import { useEffect } from "react";
import create from "zustand";
import Image from "next/image";
import MoonIcon from "../public/dark-mode-icons/moon.svg";
import SunIcon from "../public/light-mode-icons/005-sun-1.svg";

export const THEME = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system",
};

const doesPreferDarkMode = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/**
 * Hook for handling theme within state.
 */
export const useThemeStore = create((set, get) => {
  const setTheme = (theme) => {
    localStorage.setItem("cf-theme", theme);
    set({ theme });
  };

  return {
    theme: THEME.SYSTEM,
    setTheme,
    toggleDarkLightTheme: () => {
      let theme = THEME.LIGHT;
      let currentTheme = get().theme;

      if (currentTheme === THEME.SYSTEM) {
        theme = doesPreferDarkMode() ? THEME.LIGHT : THEME.DARK;
      } else {
        theme = currentTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
      }

      setTheme(theme);
    },
  };
});

/**
 * Hook for setting up theme based on localStorage and handling effects
 * within html directly.
 */
export const useThemeSetup = () => {
  const { theme, setTheme } = useThemeStore();

  // Once React is loaded sync with the local storage
  useEffect(() => {
    const storedTheme = localStorage.getItem("cf-theme");

    if (storedTheme) {
      setTheme(storedTheme);
    }
    // This effect should run only once on startup (Used for permanence)
    // After first load theme is stored in state which becomes source of truth
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Change theme every time the variable changes
  useEffect(() => {
    const themeClasses = Object.values(THEME).map((v) => `theme-${v}`);
    document.body.classList.remove(...themeClasses);
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);
};

export const THEME_SCRIPT = `
  (()=>{
    const theme = localStorage.getItem('cf-theme') || 'system';
    
    document.body.classList.remove("theme-system", "theme-dark", "theme-light");
    document.body.classList.add(\`theme-\${theme}\`);
  })();`;

export function ThemeModeToggle(props) {
  const { toggleDarkLightTheme, theme } = useThemeStore();

  const buttonStyles = {
    background: theme == THEME.DARK ? "linear-gradient(#39598a, #79d7ed)" : "linear-gradient(#091236, #1e215d)",
    border: `2px solid ${theme == THEME.DARK ? "#fff" : "#6b8096"}`,
    borderRadius: "30px",
    cursor: "pointer",
    display: "flex",
    fontSize: "0.5rem",
    justifyContent: "space-between",
    overflow: "hidden",
    padding: "0.5rem",
    position: "relative",
    width: "3rem",
    height: "1.5rem",
  }

  return (
    <button
      {...props}
      style={buttonStyles}
      onClick={() => toggleDarkLightTheme()}
    >
      {
        theme == THEME.LIGHT ?
          <Image src={MoonIcon} alt="Moon icon" /> :
          <Image src={SunIcon} alt="Sun icon"  />
      }
    </button>
  );
}
