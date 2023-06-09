import { Margin } from "@nivo/core";
import dayjs from "dayjs";
import { useState, useEffect, RefObject } from "react";
export interface Size {
  width: number | undefined;
  height: number | undefined;
}

export const useWindowSize = (): Size => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
};

// @see https://dev.to/jmalvarez/check-if-an-element-is-visible-with-react-hooks-27h8
export const useIsVisible = (ref: RefObject<SVGSVGElement>): boolean => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current as Element);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
};

// TODO: Somehow get width of axis.
export const getMargins = (obs: string): Margin => {
  // These are nivo margin, not d3!
  const margin = {
    top: 20,
    right: 10,
    bottom: 20,
    left: 40,
  };

  if (obs == "cloudbase" || obs == "rainRate") {
    margin.left = 50;
  }

  if (
    obs === "pressure" ||
    obs === "altimeter" ||
    obs === "barometer" ||
    obs === "rain" ||
    obs === "ET" ||
    obs.includes("Voltage")
  ) {
    margin.left = 55;
  }

  // cmon
  if (obs === "mem_used") {
    margin.left = 70;
  }
  if (obs === "cpu_user" || obs === "cpu_system" || obs === "cpu_idle") {
    margin.left = 60;
  }
  if (obs === "radiation") {
    margin.left = 45;
  }
  if (obs.includes("net_eth0") || obs.includes("net_wlan0")) {
    margin.left = 65;
  }

  return margin;
};

export const getAxisLeftLegendOffset = (obs: string): number => {
  const margins = getMargins(obs);

  return (margins.left - 5) * -1;
};

export const getTimeDifferenceInMonths = (data: string | any[]): number => {
  const firstDate = dayjs.unix(data[0].x),
    lastDate = dayjs.unix(data[data.length - 1].x);

  let diff = (lastDate.year() - firstDate.year()) * 12;

  diff -= firstDate.month();
  diff += lastDate.month() + 1;

  return diff;
};
