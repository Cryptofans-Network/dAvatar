import Document, { Html, Head, Main, NextScript } from "next/document";

class CFDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  // Setup body className to theme-system
  render() {
    return (
      <Html>
        <Head />
        <body className="theme-system">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CFDocument;
