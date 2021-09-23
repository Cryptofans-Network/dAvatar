import Link from "next/link";
import { useEthers } from "@usedapp/core";
import Avatar from "boring-avatars";
import styles from "./navigation.module.scss";
import { ThemeModeToggle } from "../../../lib/theme";
import ThemedImage from "../../../lib/themedImage";

const Navigation = () => {
  const { activateBrowserWallet, account } = useEthers();
  const trimmedAccount = account && `${account.slice(0,6)}...${account?.slice(-4)}`;

  return (
    <div className={styles.nav}>
      <ThemedImage
        className={styles.logo}
        lightThemeSrc="/dAvatar-logo.webp"
        darkThemeSrc="/dAvatar-logo-light.webp"
        alt="dAvatar Logo"
      />
      <div className={styles.controls}>
        {
          account ?
            (
              <div className={styles.menu}>
                <button onClick={() => console.log("create page")}>Create</button>
                <Link href={`/profile/${account}`}>
                  <div className={styles.profile}>
                    <p className={styles.address}>{trimmedAccount}</p>
                    <Avatar
                      size={40}
                      square
                      name={account}
                      variant="marble"
                      colors={["#1693A5", "#45B5C4", "#7ECECA", "#A0DED6", "#C7EDE8"]}
                    />
                  </div>
                </Link>
              </div>
            ) :
            <button onClick={activateBrowserWallet}>Connect</button>
        }
        <ThemeModeToggle />
      </div>
    </div>
  )
}

export default Navigation;
