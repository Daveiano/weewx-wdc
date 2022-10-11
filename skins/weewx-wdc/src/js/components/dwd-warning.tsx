import React from "react";
import dayjs from "dayjs";
import { TooltipDefinition } from "carbon-components-react";

type DWDWarningType = {
  description: string;
  end: number;
  event: string;
  headline: string;
  instruction: string;
  // Warnstufe
  level: number;
  level_text: string;
  start: number;
  // Gewitter, Startkregen, Sturm, etc. as number (event is the string value)
  // @see https://www.dwd.de/DE/wetter/warnungen_aktuell/kriterien/warnkriterien.html
  type: number;
  icon: string;
  stateShort: string;
};

interface DWDWarnings {
  warnings: DWDWarningType[];
}

// @todo Add all counties!
const warningLinks: { [key: string]: string } = {
  MV: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/mecklenburg_vorpommern/warnlage_mv_node.html",
};

export const DWDWarning: React.FC<DWDWarnings> = (
  props: DWDWarnings
): React.ReactElement => {
  if (props.warnings.length > 0) {
    return (
      <>
        {props.warnings.map((warning, index) => (
          <div key={index}>
            <header className="bx--row" style={{ marginBottom: "0.75rem" }}>
              <div
                className="bx--col-sm-1 bx--col-md-1 bx--col-lg-2 bx--col-xlg-2 bx--col-max-1"
                style={{ paddingLeft: "0.5rem" }}
              >
                <img src={warning.icon} />
              </div>
              <div className="bx--col-sm-3 bx--col-md-7 bx--col-lg-10 bx--col-xlg-10 bx--col-max-11">
                <h4 className="bx--type-productive-heading-02">
                  {warning.headline}
                </h4>
                <p className="bx--type-helper-text-02">
                  gültig von {dayjs(warning.start).format("DD.MM.YYYY HH:mm")}{" "}
                  bis {dayjs(warning.end).format("DD.MM.YYYY HH:mm")}
                </p>
              </div>
            </header>
            <p
              className="bx--type-body-short-02"
              style={{ paddingBottom: "0.25rem" }}
            >
              {warning.description}
            </p>
            <TooltipDefinition tooltipText={warning.instruction}>
              Verhaltenshinweise
            </TooltipDefinition>
          </div>
        ))}
        <p className="bx--type-helper-text-01" style={{ paddingTop: "0.5rem" }}>
          Quelle:{" "}
          <a href={warningLinks[props.warnings[0].stateShort]} target="_blank">
            DWD
          </a>
        </p>
      </>
    );
  }

  return <p>zur Zeit keine Warnungen</p>;
};
