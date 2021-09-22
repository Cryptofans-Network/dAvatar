import { useColorMode } from "theme-ui";
import Image from "next/image";
import SunIcon from "../../../public/light-mode-icons/005-sun-1.svg";
import MoonIcon from "../../../public/dark-mode-icons/moon.svg";

export const THEME_MODES = {
  DARK: "dark",
  LIGHT: "light",
}

const ToggleThemeMode = (props) => {
  const [mode, setMode] = useColorMode();

  const buttonStyles = {
    background: mode == THEME_MODES.DARK ? "linear-gradient(#39598a, #79d7ed)" : "linear-gradient(#091236, #1e215d)",
    border: `2px solid ${mode == THEME_MODES.DARK ? "#fff" : "#6b8096"}`,
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
      onClick={(e) => {
        const next = mode === THEME_MODES.DARK ? THEME_MODES.LIGHT : THEME_MODES.DARK
        setMode(next)
      }}
    >
      {
        mode == THEME_MODES.LIGHT ?
          <Image src={MoonIcon} alt="Moon icon" /> :
          <Image src={SunIcon} alt="Sun icon"  />
      }
    </button>
  )
}

export default ToggleThemeMode;
