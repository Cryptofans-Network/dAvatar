import Image from "next/image";
import {useThemeUI} from "theme-ui";
import styles from "./navigation.module.scss";
import ToggleThemeMode, { THEME_MODES } from "../themeModeToggle/themeModeToggle";

const Navigation = () => {
  const { colorMode } = useThemeUI();
  console.log(colorMode)

  const Logo = (
    colorMode === THEME_MODES.LIGHT ?
      <img className={styles.logo} src="/dAvatar-logo.webp" alt="dAvatar Logo" /> :
      <img className={styles.logo} src="/dAvatar-logo-light.webp" alt="dAvatar Logo light version" />
  );

  return (
    <div className={styles.nav}>
      {Logo}
      <div className={styles.controls}>
        <button>Connect</button>
        <ToggleThemeMode />
      </div>
    </div>
  )
}

export default Navigation;
