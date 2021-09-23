import { useEthers } from "@usedapp/core";
import styles from "./hero.module.scss";
import ThemedImage from "../../../lib/themedImage";

const Hero = () => {
  const { account } = useEthers();

  const greeting = account ?
    <p>You are connected with the following account<br/><span className={styles.address}>{account}</span></p> :
    <p>Please connect with your Metamask to continue</p>;

  return (
    <main className={styles.hero}>
      <h1>
        Welcome to dAvatar
      </h1>
      <p>
        {greeting}
      </p>
      <p className={styles.learnMore}>Learn more</p>
      <ThemedImage
        className={styles.arrow}
        lightThemeSrc="/light-mode-icons/iconmonstr-arrow-65.svg"
        darkThemeSrc="/dark-mode-icons/iconmonstr-arrow-65-white.svg"
      />
    </main>
  )
}

export default Hero;
