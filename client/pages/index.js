import Head from "next/head";
import Image from "next/image";
import { useThemeUI } from "theme-ui";
import styles from "../styles/Home.module.css";
import mainLayout from "../layouts/mainLayout";
import dAvatarLogo from "../public/dAvatar-logo.webp";
import dAvatarLogoLight from "../public/dAvatar-logo-light.webp";
import ToggleThemeMode, {THEME_MODES} from "../components/common/themeModeToggle/themeModeToggle";

export default function Home() {
  const { colorMode } = useThemeUI();

  const Logo = (
    colorMode === THEME_MODES.light ?
    <Image src={dAvatarLogo} alt="dAvatar Logo" layout="intrinsic" /> :
    <Image src={dAvatarLogoLight} alt="dAvatar Logo light version" layout="intrinsic" />
    );

  return (
    <div className={styles.container}>
      <Head>
        <title>dAvatar</title>
        <meta name="description" content="One avatar to rule them all, tokenized and decentralized." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {Logo}
        <h1 className={styles.title}>
          Welcome to dAvatar
        </h1>

        <p className={styles.description}>
          One avatar to rule them all
        </p>

        <ToggleThemeMode />
      </main>

      <footer className={styles.footer}>
        <p>dAvatar</p>
      </footer>
    </div>
  )
}

Home.getLayout = mainLayout;
