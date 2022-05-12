from weewx.cheetahgenerator import SearchList
from user.diagram_util import DiagramUtil
from datetime import datetime


class TableUtil(SearchList):
    def get_table_headers(self, obs, unit_labels, obs_labels, period):
        """
        Returns tableheaders for use in carbon data table.

        Args:
            obs (list): $DisplayOptions.get("table_tile_..")
            unit_labels (dict): weewx $unit.labels
            obs_labels (obj): weewx $obs.labels
            period (obj): Period to use, eg. $year, month, $span

        Returns:
            list: Carbon data table headers.
        """
        carbon_headers = []

        carbon_headers.append({
            "title": "Time",
            "id": "timeParsed",
            "sortCycle": "tri-states-from-ascending",
        })

        for header in obs:
            if getattr(period, header).has_data:
                carbon_header = {
                    "title": obs_labels[header],
                    "small": "in " + getattr(unit_labels, header),
                    "id": header,
                    "sortCycle": "tri-states-from-ascending",
                }
                carbon_headers.append(carbon_header)

        return carbon_headers

    def get_table_rows(self, obs, period, precision):
        """
        Returns table values for use in carbon data table.

        Args:
            obs (list): $DisplayOptions.get("table_tile_..")
            period (obj): Period to use, eg. $year, month, $span
            precision (string): Day, week, month, year, alltime

        Returns:
            list: Carbon data table rows.
        """
        carbon_values = []

        diagramUtil = DiagramUtil(SearchList)

        for observation in obs:
            if getattr(period, observation).has_data:
                series = getattr(period, observation).series(
                    aggregate_type=diagramUtil.get_aggregate_type(observation),
                    aggregate_interval=diagramUtil.get_aggregate_interval(
                        observation,
                        precision
                    ),
                    time_series='start',
                    time_unit='unix_epoch'
                ).round(diagramUtil.get_rounding(observation))

                for start, data in zip(series.start, series.data):
                    cs_time = datetime.fromtimestamp(start.raw)
                    # The current series item by time.
                    cs_item = list(filter(
                        lambda x: (x['timeParsed'] == cs_time.isoformat()),
                        carbon_values
                    ))

                    if len(cs_item) == 0:
                        carbon_values.append({
                            "timeParsed": cs_time.isoformat(),
                            observation: data.raw
                        })
                    else:
                        cs_item = cs_item[0]
                        cs_item_index = carbon_values.index(cs_item)
                        cs_item[observation] = data.raw
                        carbon_values[cs_item_index] = cs_item

        # Sort per time
        carbon_values.sort(
            key=lambda item: datetime.fromisoformat(item['timeParsed'])
        )

        return carbon_values
