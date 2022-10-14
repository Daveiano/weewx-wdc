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

const warningLinks: { [key: string]: string } = {
  SN: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/sachsen/warnlage_sac_node.html",
  TH: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/thueringen/warnlage_thu_node.html",
  SA: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/sachen_anhalt/warnlage_saa_node.html",
  BB: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/berlin_brandenburg/warnlage_bb_node.html",
  MV: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/mecklenburg_vorpommern/warnlage_mv_node.html",
  NS: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/niedersachsen_bremen/warnlage_nds_node.html",
  HB: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/niedersachsen_bremen/warnlage_nds_node.html",
  HE: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/hessen/warnlage_hes_node.html",
  NRW: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/nordrhein_westfalen/warnlage_nrw_node.html",
  BY: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/bayern/warnlage_bay_node.html",
  SH: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/schleswig_holstein_hamburg/warnlage_shh_node.html",
  HH: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/schleswig_holstein_hamburg/warnlage_shh_node.html",
  RP: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/rheinland-pfalz_saarland/warnlage_rps_node.html",
  SL: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/rheinland-pfalz_saarland/warnlage_rps_node.html",
  BW: "https://www.dwd.de/DE/wetter/warnungen_aktuell/warnlagebericht/baden-wuerttemberg/warnlage_baw_node.html",
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
                className="bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-12 bx--col-max-12"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                <img src={warning.icon} />
                <div className="warning-header">
                  <h4 className="bx--type-productive-heading-02">
                    {warning.headline}
                  </h4>
                  <p className="bx--type-helper-text-02">
                    gültig von {dayjs(warning.start).format("DD.MM.YYYY HH:mm")}{" "}
                    bis {dayjs(warning.end).format("DD.MM.YYYY HH:mm")}
                  </p>
                </div>
              </div>
            </header>
            <p
              className="bx--type-body-short-02"
              style={{ paddingBottom: "0.25rem" }}
            >
              {warning.description}
            </p>
            {warning.instruction ? (
              <TooltipDefinition tooltipText={warning.instruction}>
                Verhaltenshinweise
              </TooltipDefinition>
            ) : null}
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
