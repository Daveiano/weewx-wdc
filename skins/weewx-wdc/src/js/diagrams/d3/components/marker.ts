import * as d3 from "d3";

export const addMarkers = (
  svgElement: d3.Selection<SVGGElement, unknown, null, undefined>,
  width: number,
  yScale: d3.ScaleLinear<number, number>,
  unit: string,
  markerValue: number,
  markerColor: string | undefined,
  markerLabel: string | undefined
): d3.Selection<SVGLineElement, unknown, null, undefined> | boolean => {
  if (!markerValue) {
    return false;
  }

  // Marker outside of visible domain.
  if (markerValue <= yScale.domain()[0] || markerValue >= yScale.domain()[1]) {
    return false;
  }

  if (!markerColor) {
    markerColor = "black";
  }

  const g = svgElement.append("g");

  g.append("text")
    .data([markerLabel ? markerLabel : `${markerValue} ${unit}`])
    .attr("class", "marker-label")
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "central")
    .attr("x", width - 5)
    .attr("y", yScale(markerValue) - 10)
    .style("font-size", "14px")
    .style("text-shadow", "1px 1px grey")
    .text((d) => d);

  return g
    .append("line")
    .attr("class", "marker")
    .attr("x1", 1)
    .attr("x2", width)
    .attr("y1", yScale(markerValue))
    .attr("y2", yScale(markerValue))
    .attr("fill", "none")
    .attr("stroke", markerColor)
    .attr("stroke-width", "2")
    .style("stroke-dasharray", "10, 10")
    .style("stroke-width", "2");
};
