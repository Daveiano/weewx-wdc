import * as d3 from "d3";
import { Serie } from "../../types";

export const addLegend = (
  svgElement: d3.Selection<SVGGElement, unknown, null, undefined>,
  width: number,
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
    y = 1.5;

  const legend = svgElement.append("g").attr("class", "legend");

  data.map((item, index) => {
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
      .attr("x", x)
      .attr("y", y)
      .attr("width", size)
      .attr("height", size)
      .style("pointer-events", "none")
      .style("fill", () => {
        return colors[index];
      });

    legendItem
      .selectAll("legend-text")
      .data(showUnits ? [`${item.id} (${units[index].trim()})`] : [item.id])
      .enter()
      .append("text")
      .attr("x", x - 10)
      .attr("y", y + 6)
      .style("fill", () => {
        return colors[index];
      })
      .text(function (d) {
        return d;
      })
      .attr("text-anchor", "end")
      .style("dominant-baseline", "central")
      .style("pointer-events", "none")
      .style("font-size", "11px");
  });

  legend.attr(
    "transform",
    `translate(${
      width -
      (legend.node()?.getBBox().width as number) -
      (legend.node()?.getBBox().x as number)
    }, 0)`
  );

  return legend;
};
