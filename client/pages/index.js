import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import dAvatarLogo from "../public/dAvatar-logo.webp";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>dAvatar</title>
        <meta name="description" content="One avatar to rule them all, tokenized and decentralized." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Image src={dAvatarLogo} alt="dAvatar Logo" layout="intrinsic" />
        <h1 className={styles.title}>
          Welcome to dAvatar
        </h1>

        <p className={styles.description}>
          One avatar to rule them all
        </p>
      </main>

      <footer className={styles.footer}>
        <p>dAvatar</p>
      </footer>
    </div>
  )
}
