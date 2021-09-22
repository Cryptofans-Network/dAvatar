import { THEME, useThemeStore } from "./theme";

const ThemedImage = (props) => {
  const { theme } = useThemeStore();

  const { lightThemeSrc, darkThemeSrc } = props;
  const imageProps = Object.assign({}, props);
  delete imageProps.lightThemeSrc;
  delete imageProps.darkThemeSrc;

  if (theme === THEME.LIGHT) {
    return <img {...imageProps} src={lightThemeSrc} alt={props.alt} />;
  }

  if (theme === THEME.DARK) {
    return <img {...imageProps} src={darkThemeSrc} alt={props.alt} />;
  }

  return (
    <picture>
      <source
        {...imageProps}
        srcSet={darkThemeSrc}
        media="(prefers-color-scheme: dark)"
      />
      <img {...imageProps} src={lightThemeSrc} alt={props.alt} />
    </picture>
  );
};

export default ThemedImage;
