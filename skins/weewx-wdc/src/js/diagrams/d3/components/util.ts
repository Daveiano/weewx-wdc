import color from "color";

export const getAxisGridColor = (darkMode: boolean): string =>
  darkMode ? "#525252" : "#dddddd";

export const getBackgroundColorDarkModeLightness = color("#393939").lightness();

export const chartTransition = "left 0.25s ease-in-out, top 0.35s ease-in-out";

export const getColors = (
  darkMode: boolean,
  enableArea: boolean,
  colors: string[]
): string[] => {
  return darkMode
    ? enableArea
      ? colors.map((c) =>
          color(c).lightness() <= getBackgroundColorDarkModeLightness * 2
            ? color(c).desaturate(0.1).lighten(0.75).hex()
            : c
        )
      : colors.map((c) => {
          if (color(c).red() > 90) {
            return color(c).desaturate(0.5).lighten(1.5).hex();
          }
          if (color(c).lightness() <= getBackgroundColorDarkModeLightness) {
            return color(c).lighten(10).hex();
          }

          return color(c).lighten(0.25).hex();
        })
    : colors;
};
