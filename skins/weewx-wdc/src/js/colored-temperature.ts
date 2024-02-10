const transperancy = (window as any).weewxWdcConfig
  .color_temperature_transparency;
const min = (window as any).weewxWdcConfig.color_temperature_min;
const max = (window as any).weewxWdcConfig.color_temperature_max;

// outTemp tile.
const outTempTile = document.querySelector(
  'div.stat-tile[data-observation="outTemp"]'
) as HTMLDivElement;

/**
 * Get temperature color, algorithm 1.
 *
 * @see https://stackoverflow.com/a/16468491
 *
 * @param string temp
 * @returns string
 */
const getTemperatureColorHSL = (temp: number): string => {
  const hue = 30 + (240 * (30 - temp)) / 60;

  return `hsla(${hue}, 75%, 50%, ${transperancy})`;
};

/**
 * Get temperature color, algorithm 2.
 *
 * @see https://wenktec.de/6482
 *
 * @param t
 * @returns
 */
const getTemperatureColorRGB = (t: number): string => {
  if (t < min) t = min;
  if (t > max) t = max;

  t = Math.round(((t - min) / (max - min)) * 600);
  let m = Math.round((t / 100 - Math.floor((t - 1) / 100)) * 600);

  if (t == 0) {
    m = 0;
  }

  const n = m * 0.425;
  let r = 0,
    g = 0,
    b = 0;

  const FF = 255;

  if (t <= 100) {
    r = Math.round(FF - n) + Math.floor(n / 4);
    g = Math.floor(n / 4);
    b = FF;
  } else if (t > 100 && t <= 200) {
    r = Math.floor(n / 4);
    g = Math.round(n) + Math.floor(n / 4);
    b = FF;
  } else if (t > 200 && t <= 300) {
    r = Math.floor(n / 4);
    g = FF;
    b = Math.round(FF - n);
  } else if (t > 300 && t <= 400) {
    r = Math.round(n + n / 4);
    g = FF;
  } else if (t > 400 && t <= 500) {
    r = FF;
    g = Math.round(FF - n);
  } else {
    r = FF;
    b = Math.round(n);
  }

  if (r > FF) r = FF;
  if (g > FF) g = FF;

  return `rgba(${r}, ${g}, ${b}, ${transperancy})`;
};

/**
 * Set color for outTemp tile.
 *
 * @param HTMLDivElement outTempTile
 */
const setColor = (outTempTile: HTMLDivElement): void => {
  const unit: string = outTempTile.dataset.unit as string;
  const outTemp = parseFloat(
    outTempTile
      .querySelector(".stat-title-obs-value .raw")
      ?.textContent?.replace(unit, "")
      .replace(",", ".") || "0"
  );

  const outTempColor = getTemperatureColorRGB(outTemp);
  outTempTile.style.backgroundColor = outTempColor;
};

// Set color for outTemp tile on load.
if (outTempTile && outTempTile.dataset.unit) {
  setColor(outTempTile);
}

// Set color for outTemp tile on change (MQTT).
const observer = new MutationObserver(function () {
  if (outTempTile && outTempTile.dataset.unit) {
    setColor(outTempTile);
  }
});

observer.observe(
  outTempTile.querySelector(".stat-title-obs-value .raw") as HTMLDivElement,
  {
    characterData: true,
    childList: true,
  }
);

/**
 * Test with:
 * document.querySelector(
  'div.stat-tile[data-observation="outTemp"] .stat-title-obs-value .raw'
).innerHTML = '-14,5 °C';
 *
 */
