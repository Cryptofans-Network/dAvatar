import { useColorMode } from "theme-ui";
import Image from "next/image";
import SunIcon from "../../../public/light-mode-icons/005-sun-1.svg";
import MoonIcon from "../../../public/dark-mode-icons/moon.svg";

export const THEME_MODES = {
  dark: "dark",
  light: "light",
}

const ToggleThemeMode = (props) => {
  const [mode, setMode] = useColorMode();

  const buttonStyles = {
    background: mode == THEME_MODES.dark ? "linear-gradient(#39598a, #79d7ed)" : "linear-gradient(#091236, #1e215d)",
    border: `2px solid ${mode == THEME_MODES.dark ? "#fff" : "#6b8096"}`,
    borderRadius: "30px",
    cursor: "pointer",
    display: "flex",
    fontSize: "0.5rem",
    justifyContent: "space-between",
    margin: "0 auto",
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
      onClick={(e) => {
        const next = mode === THEME_MODES.dark ? THEME_MODES.light : THEME_MODES.dark
        setMode(next)
      }}
    >
      {
        mode == THEME_MODES.light ?
          <Image src={MoonIcon} alt="Moon icon" /> :
          <Image src={SunIcon} alt="Sun icon"  />
      }
    </button>
  )
}

export default ToggleThemeMode;
