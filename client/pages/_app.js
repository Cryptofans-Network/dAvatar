import Script from "next/script";
import "../styles/main.scss";
import { THEME_SCRIPT, useThemeSetup } from "../lib/theme";

function MyApp({ Component, pageProps }) {
  useThemeSetup();
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Script id="theme-script" strategy="beforeInteractive">
        {THEME_SCRIPT}
      </Script>
      {getLayout(<Component {...pageProps} />)}
    </>
  )
}

export default MyApp;
