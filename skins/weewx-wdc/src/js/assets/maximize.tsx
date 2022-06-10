import React, { MouseEventHandler } from "react";

export const Maximize = ({ onClick }: { onClick: MouseEventHandler }) => {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 32 32"
      className="maximize"
    >
      <polygon points="20 2 20 4 26.586 4 18 12.582 19.414 14 28 5.414 28 12 30 12 30 2 20 2" />
      <polygon points="14 19.416 12.592 18 4 26.586 4 20 2 20 2 30 12 30 12 28 5.414 28 14 19.416" />
      <rect
        style={{ fill: "none" }}
        data-name="&lt;Transparent Rectangle&gt;"
        className="cls-1"
        width="32"
        height="32"
        transform="translate(32 32) rotate(-180)"
      />
    </svg>
  );
};
