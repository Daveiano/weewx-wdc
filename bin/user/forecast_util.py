from weewx.cheetahgenerator import SearchList
from user.forecast import ForecastVariables
import datetime

# from pprint import pprint

# Copyright 2022 David Bätge
# Distributed under the terms of the GNU Public License (GPLv3)


class ForecastUtil(SearchList):
    def __init__(self, generator):
        self.forecast = ForecastVariables(generator)
        self.forecast_source = generator.skin_dict.get("Extras")[
            "forecast_table_settings"
        ]["source"]
        SearchList.__init__(self, generator)

    # TODO: obvis
    # TODO: windGust & windChar is None
    def get_day_icon(self, summary):
        day_icon = summary["clouds"]
        thunderstorm = False

        # @see https://stackoverflow.com/a/65402452/1551356
        start = datetime.datetime.combine(
            datetime.datetime.fromtimestamp(summary["dateTime"].raw),
            datetime.time(00, 00, 00),
        )
        end = datetime.datetime.combine(
            datetime.datetime.fromtimestamp(summary["dateTime"].raw),
            datetime.time(23, 59, 59),
        )

        periods = self.forecast.weather_periods(
            self.forecast_source,
            datetime.datetime.timestamp(start),
            datetime.datetime.timestamp(end),
        )

        for period in periods:
            if period["tstms"] is not None and (period["tstms"] != "S"):
                thunderstorm = True

        # pprint(summary)
        # pprint(periods)

        if summary["pop"].raw > 65:
            if (
                summary["clouds"] == "BK"
                or summary["clouds"] == "B1"
                or summary["clouds"] == "SC"
            ):
                if "rain" in summary["precip"]:
                    day_icon = "rain--scattered"
                if "snow" in summary["precip"]:
                    day_icon = "snow--scattered"

            if summary["clouds"] == "B2" or summary["clouds"] == "OV":
                if "rain" in summary["precip"]:
                    day_icon = "rain"
                if "snow" in summary["precip"]:
                    day_icon = "snow"

            if thunderstorm:
                day_icon = "thunderstorm"
        else:
            if thunderstorm:
                day_icon = "thunderstorm--scattered"

        return day_icon + ".svg"
