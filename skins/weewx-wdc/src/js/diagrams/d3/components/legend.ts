import * as d3 from "d3";
import { Serie, legendPosition } from "../../types";

export const addLegend = (
  svgElement: d3.Selection<SVGGElement, unknown, null, undefined>,
  width: number,
  height: number,
  legendPosition: legendPosition,
  data: Serie[],
  units: string[],
  colors: string[],
  showUnits = false
): d3.Selection<SVGGElement, unknown, null, undefined> | boolean => {
  if (data.length <= 1) {
    return false;
  }

  const size = 14,
    x = 144,
    y = 1.5,
    positionsLeft = ["top left", "bottom left"];

  const legend = svgElement.append("g").attr("class", "legend");

  data.map((item, index): void => {
    const legendItem = legend
      .append("g")
      .attr("transform", `translate(0, ${index * 21})`);

    legendItem
      .append("rect")
      .attr("width", 160)
      .attr("height", 19)
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill", "transparent");

    legendItem
      .selectAll("legend-rect")
      .data([item.id])
      .enter()
      .append("rect")
      .attr("x", positionsLeft.includes(legendPosition) ? 0 : x)
      .attr("y", y)
      .attr("width", size)
      .attr("data-testid", `legend-rect-${item.observation}`)
      .attr("height", size)
      .style("pointer-events", "none")
      .attr("fill", () => {
        return colors[index];
      });

    legendItem
      .selectAll("legend-text")
      .data(
        showUnits && units[index]
          ? [`${item.id} (${units[index].trim()})`]
          : [item.id]
      )
      .enter()
      .append("text")
      .attr("x", positionsLeft.includes(legendPosition) ? size + 5 : x - 10)
      .attr("y", y + 6)
      .style("fill", () => {
        return colors[index];
      })
      .text(function (d) {
        return d;
      })
      .attr(
        "text-anchor",
        positionsLeft.includes(legendPosition) ? "start" : "end"
      )
      .style("dominant-baseline", "central")
      .style("pointer-events", "none")
      .style("font-size", "11px");
  });

  // Legend position.
  switch (legendPosition) {
    case "top right":
      legend.attr(
        "transform",
        `translate(${
          width -
          (legend.node()?.getBBox().width as number) -
          (legend.node()?.getBBox().x as number)
        }, 0)`
      );
      break;
    case "top left":
      legend.attr("transform", `translate(0, 0)`);
      break;
    case "bottom right":
      legend.attr(
        "transform",
        `translate(${
          width -
          (legend.node()?.getBBox().width as number) -
          (legend.node()?.getBBox().x as number)
        }, ${
          height -
          (legend.node()?.getBBox().height as number) -
          (legend.node()?.getBBox().y as number)
        })`
      );
      break;
    case "bottom left":
      legend.attr(
        "transform",
        `translate(0, ${
          height -
          (legend.node()?.getBBox().height as number) -
          (legend.node()?.getBBox().y as number)
        })`
      );
      break;
    default:
      legend.attr(
        "transform",
        `translate(${
          width -
          (legend.node()?.getBBox().width as number) -
          (legend.node()?.getBBox().x as number)
        }, 0)`
      );
  }

  return legend;
};
