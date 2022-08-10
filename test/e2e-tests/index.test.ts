import { fireEvent, getByText } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(
  path.resolve(
    __dirname,
    "artifacts-alternative-weewx-html/public_html/index.html"
  ),
  "utf8"
);

let dom;
let container: HTMLElement;

describe("index.html", () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    container = dom.window.document.body;
  });

  test("Basic Display", () => {
    expect(container.querySelector("h1")).not.toBeNull();
    expect(container.querySelector("h1")).toHaveTextContent(
      "Current Weather Conditions"
    );
    // expect(
    //   getByText(container, "Current Weather Conditions")
    // ).toBeInTheDocument();
  });
});
