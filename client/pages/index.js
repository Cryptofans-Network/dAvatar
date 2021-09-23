import Head from "next/head";
import mainLayout from "../layouts/mainLayout";
import Hero from "../components/home/hero/hero";

export default function Home() {

  return (
    <div>
      <Head>
        <title>dAvatar</title>
        <meta name="description" content="One avatar to rule them all, tokenized and decentralized." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
    </div>
  )
}

Home.getLayout = mainLayout;
