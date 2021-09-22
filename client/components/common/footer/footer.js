import styles from "./footer.module.scss";

const Footer = () => (
  <footer>
    <p className={styles.footerText}>© {new Date().getUTCFullYear()} dAvatar</p>
  </footer>
);

export default Footer;
