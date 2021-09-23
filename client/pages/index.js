import Head from "next/head";
import mainLayout from "../layouts/mainLayout";
import Hero from "../components/home/hero/hero";
import Footer from "../components/common/footer/footer";

export default function Home() {

  return (
    <div>
      <Head>
        <title>dAvatar</title>
        <meta name="description" content="One avatar to rule them all, tokenized and decentralized." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <Footer />
    </div>
  )
}

Home.getLayout = mainLayout;
