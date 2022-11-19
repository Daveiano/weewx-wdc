import React from "react";
import { ComboBox } from "carbon-components-react";

import he from "he";

type SelectItem = {
  date: string;
  timestamp: number;
};

interface StatisticsSelect {
  items: SelectItem[];
}

const translations = (window as any).weewxWdcConfig.translations;

export const StatisticsSelect: React.FC<StatisticsSelect> = (
  props: StatisticsSelect
): React.ReactElement => {
  return (
    // @todo current item preselected.
    <ComboBox
      id="statistics-select"
      items={props.items}
      itemToString={(item) => (item ? item.date : "")}
      placeholder={he.decode(translations.Select_a_day)}
      titleText={he.decode(translations.Archive_day)}
      helperText={`${he.decode(translations.stats_helper_text)} ${
        (window as any).archive_date_time.now
      }, ${translations.Format_is} ${(window as any).archive_date_time.format}`}
      onChange={(event) => {
        document.location.href = event.selectedItem
          ? // @todo base path
            `${(window as any).weewxWdcConfig.basePath}day-archive/day-${
              event.selectedItem.date
            }.html`
          : window.location.href;
      }}
    />
  );
};
