import { ThemeProvider } from "theme-ui";
import { theme } from "../styles/theme";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ThemeProvider theme={theme}>
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  )
}

export default MyApp;
