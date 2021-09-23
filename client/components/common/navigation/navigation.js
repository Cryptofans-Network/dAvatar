import styles from "./navigation.module.scss";
import { useEthers } from "@usedapp/core";
import { ThemeModeToggle } from "../../../lib/theme";
import ThemedImage from "../../../lib/themedImage";

const Navigation = () => {
  const { activateBrowserWallet } = useEthers();

  return (
    <div className={styles.nav}>
      <ThemedImage
        className={styles.logo}
        lightThemeSrc="/dAvatar-logo.webp"
        darkThemeSrc="/dAvatar-logo-light.webp"
        alt="dAvatar Logo"
      />
      <div className={styles.controls}>
        <button onClick={activateBrowserWallet}>Connect</button>
        <ThemeModeToggle />
      </div>
    </div>
  )
}

export default Navigation;
