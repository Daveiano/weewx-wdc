from weewx.cheetahgenerator import SearchList
from weewx.units import UnitInfoHelper, ObsInfoHelper
from datetime import datetime
from calendar import isleap
from pprint import pprint

# Copyright 2022 David Bätge
# Distributed under the terms of the GNU Public License (GPLv3)

temp_obs = ["outTemp", "inTemp", "dewpoint", "windchill", "heatindex", "appTemp"]


class WdcGeneralUtil(SearchList):
    def __init__(self, generator):
        SearchList.__init__(self, generator)
        self.skin_dict = generator.skin_dict

    def get_icon(self, observation):
        """
        Returns an include path for an icon based on the observation
        @see http://weewx.com/docs/sle.html

        Args:
            observation (string): The observation

        Returns:
            str: An icon include path
        """
        icon_path = "includes/icons/"

        if observation == "outTemp" or observation == "inTemp":
            return icon_path + "temp.svg"

        elif observation == "outHumidity" or observation == "inHumidity":
            return icon_path + "humidity.svg"

        elif observation == "barometer":
            return icon_path + "barometer.svg"

        elif observation == "windSpeed":
            return icon_path + "wind-speed.svg"

        elif observation == "windGust":
            return icon_path + "wind-gust.svg"

        elif observation == "windDir":
            return icon_path + "wind-direction.svg"

        elif observation == "rain":
            return icon_path + "rain.svg"

        elif observation == "rainRate":
            return icon_path + "rain-rate.svg"

        elif observation == "dewpoint":
            return icon_path + "dew-point.svg"

        elif observation == "windchill":
            return icon_path + "wind-chill.svg"

        elif observation == "heatindex":
            return icon_path + "heat.svg"

        elif observation == "UV":
            return icon_path + "uv.svg"

        elif observation == "ET":
            return icon_path + "ev.svg"

        elif observation == "radiation":
            return icon_path + "solar.svg"

        elif observation == "appTemp":
            return icon_path + "feel-temp.svg"

        elif observation == "cloudbase":
            return icon_path + "cloud-base.svg"

        elif "Temp" in observation:
            return icon_path + "temp.svg"

        elif "Humid" in observation:
            return icon_path + "humidity.svg"

    def get_color(self, observation):
        """
        Color settings for observations.

        Args:
            observation (string): The observation

        Returns:
            str: A color string
        """
        diagrams_config = self.skin_dict["DisplayOptions"]["diagrams"]

        if observation in diagrams_config and "color" in diagrams_config[observation]:
            return diagrams_config[observation]["color"]

        if "humidity" in observation.lower():
            return "#0099CC"

        if observation == "barometer":
            return "#666666"

        if observation == "dewpoint":
            return "#5F9EA0"

        if observation == "appTemp":
            return "#C41E3A"

        if observation == "windchill":
            return "#0099CC"

        if observation == "heatindex":
            return "#610000"

        if observation == "windSpeed":
            return "#ffc000"

        if observation == "windGust":
            return "#666666"

        if observation == "radiation":
            return "#ff8c00"

        if observation == "UV":
            return "#e61919"

        if observation == "cloudbase":
            return "#92b6f0"

        if observation == "ET":
            return "#E97451"

        if observation == "rain":
            return "#0198E1"

        if observation == "rainRate":
            return "#0a6794"

        if observation in temp_obs or "temp" in observation.lower():
            return "#8B0000"

        return "black"

    def get_time_span_from_attr(self, attr, day, week, month, year, alltime):
        """
        Get tag for use in templates.

        Args:
            attr (string): The time range
            day: Daily TimeSpanBinder
            week: Weekly TimeSpanBinder
            month: Monthly TimeSpanBinder
            year: Yeary TimeSpanBinder

        Returns:
            obj: TimeSpanBinder
        """
        if attr == "day":
            return day

        if attr == "week":
            return week

        if attr == "month":
            return month

        if attr == "year":
            return year

        if attr == "alltime":
            return alltime

    def get_static_pages(self):
        """
        Get static pages.

        Returns:
            list: Static pages array
        """
        static_templates = self.skin_dict["CheetahGenerator"]["Static"]
        static_pages = []

        for static_page in static_templates:
            static_pages.append(
                {
                    "title": static_templates[static_page]["title"],
                    "link": static_templates[static_page]["template"].replace(
                        ".tmpl", ""
                    ),
                }
            )

        return static_pages


class WdcArchiveUtil(SearchList):
    def filter_months(self, months, year):
        """
        Returns a filtred list of months

        Args:
            months (list): A list of months [2022-01, 2022-02]
            year (string): Year.

        Returns:
            str: A icon include string.
        """
        months_filtered = []

        for month in months:
            if str(year) in month:
                months_filtered.append(month)

        return months_filtered

    def month_string_format(self, month):
        """
        Returns a formatted value of a weewwx month string (2022-01)

        Args:
            month (string): A month

        Returns:
            str: Formatted month string.
        """
        date_time_obj = datetime.strptime(month, "%Y-%m")

        return date_time_obj.strftime("%B")

    def fake_get_report_years(self, first, last):
        """
        Returns a fake $SummaryByYear tag.

        Args:
            first (datetime): Datetime of first observation.

        Returns:
            list: [2022, 2021].
        """
        first_year = int(first.format("%Y"))
        last_year = int(last.format("%Y"))

        if first_year == last_year:
            return [last_year]

        if first_year + 1 == last_year:
            return [first_year, last_year]

        else:
            return list(range(first_year, last_year))


class WdcCelestialUtil(SearchList):
    def get_celestial_icon(self, observation, prop):
        """
        Returns an include path for an icon based on the observation

        Args:
            observation (string): Sun, Moon
            prop (string): set, rise

        Returns:
            str: A icon include string.
        """
        if observation == "Sun":
            if prop is None:
                return "includes/pictograms/sun.svg"
            if prop == "rise":
                return "includes/icons/sunrise.svg"
            if prop == "set":
                return "includes/icons/sunset.svg"
            if prop == "transit":
                return "includes/icons/solar.svg"

        if observation == "Moon":
            if prop is None:
                return "includes/pictograms/moon.svg"
            if prop == "rise":
                return "includes/icons/moonrise.svg"
            if prop == "set":
                return "includes/icons/moonset.svg"
            if prop == "transit":
                return "includes/icons/moon.svg"


class WdcDiagramUtil(SearchList):
    def __init__(self, generator):
        SearchList.__init__(self, generator)
        self.skin_dict = generator.skin_dict

    def get_diagram_type(self, observation):
        """
        Set e.g. "temp" for all diagrams which should be rendered as temp
        diagram (includes also heat anmd windchill).

        Args:
            observation (string): The observation

        Returns:
            str: A diagram type string
        """
        if observation in temp_obs or "temp" in observation.lower():
            return "temp"

        if "humidity" in observation.lower():
            return "humidity"

        if observation == "windSpeed" or observation == "windGust":
            return "wind"

        if observation == "barometer" or observation == "pressure":
            return "pressure"

        return observation

    def get_diagram(self, observation):
        """
        Choose between line and bar.

        Args:
            observation (string): The observation

        Returns:
            str: A diagram string
        """
        if observation == "rain" or observation == "ET":
            return "bar"

        return "line"

    def get_aggregate_type(self, observation, *args, **kwargs):
        """
        aggregate_type for observations series.
        @see https://github.com/weewx/weewx/wiki/Tags-for-series#syntax

        Args:
            observation (string): The observation

        Returns:
            string: aggregate_type
        """
        use_defaults = kwargs.get("use_defaults", False)
        combined = kwargs.get("combined", None)
        diagrams_config = self.skin_dict["DisplayOptions"]["diagrams"]

        if combined is not None and "aggregate_type" in combined:
            return combined["aggregate_type"]

        if (
            not use_defaults
            and observation in diagrams_config
            and "aggregate_type" in diagrams_config[observation]
            and combined is None
        ):
            return diagrams_config[observation]["aggregate_type"]

        if observation == "ET" or observation == "rain":
            return "sum"

        if (
            observation == "UV"
            or observation == "windGust"
            or observation == "rainRate"
        ):
            return "max"

        return "avg"

    def get_aggregate_interval(self, observation, precision, *args, **kwargs):
        """
        aggregate_interval for observations series.
        @see https://github.com/weewx/weewx/wiki/Tags-for-series#syntax

        Args:
            observation (string): The observation
            precision (string): Day, week, month, year, alltime

        Returns:
            int: aggregate_interval
        """
        alltime_start = kwargs.get("alltime_start", None)
        alltime_end = kwargs.get("alltime_end", None)

        if precision == "day":
            if observation == "ET" or observation == "rain":
                return 7200  # 2 hours

            return 1800  # 30 minutes

        if precision == "week":
            if observation == "ET" or observation == "rain":
                return 3600 * 24  # 1 day

            return 900 * 8  # 2 hours

        if precision == "month":
            if observation == "ET" or observation == "rain":
                return 3600 * 48  # 2 days

            return 900 * 24  # 6 hours

        if precision == "year":
            if observation == "ET" or observation == "rain":
                return 3600 * 432  # 8 days

            return 3600 * 48  # 2 days

        if precision == "alltime":
            if alltime_start is not None and alltime_end is not None:

                d1 = datetime.strptime(alltime_start, "%d.%m.%Y")
                d2 = datetime.strptime(alltime_end, "%d.%m.%Y")
                delta = d2 - d1

                if delta.days == 0:
                    # Edge case: code from year.
                    if observation == "ET" or observation == "rain":
                        return 3600 * 432  # 8 days

                    return 3600 * 48  # 2 days

                if observation == "ET" or observation == "rain":
                    return 3600 * (delta.days / 20) * 24  # Max of 20 bars

                return 3600 * (delta.days / 100) * 24  # Max of 100 points
            else:
                if observation == "ET" or observation == "rain":
                    return 3600 * 432  # 8 days

                return 3600 * 96  # 4 days

    def get_diagram_boundary(self, precision):
        """
        boundary for observations series for diagrams.

        Args:
            precision (string): Day, week, month, year, alltime

        Returns:
            string: None | 'midnight'
        """
        if precision == "day":
            return None

        if precision == "week":
            return None

        if precision == "month":
            return None

        if precision == "year" or precision == "alltime":
            return "midnight"

    def get_rounding(self, observation):
        """
        Rounding settings for observations.

        Args:
            observation (string): The observation

        Returns:
            int: A rounding
        """
        if observation == "UV" or observation == "cloudbase":
            return 0

        if observation == "ET" or observation == "rain":
            return 2

        return 1

    def get_hour_delta(self, precision):
        """
        Get delta for $span($hour_delta=$delta) call.

        Args:
            precision (string): Day, week, month, year, alltime

        Returns:
            float: A delta
        """
        now = datetime.now()

        hour_delta = 24

        if precision == "week":
            hour_delta = 24 * 7

        if precision == "month":
            hour_delta = 24 * 30  # monthrange(now.year, now.month)[1]

        if precision == "year":
            days = 366 if isleap(now.year) else 365
            hour_delta = 24 * days

        return hour_delta

    def get_week_delta(self, precision):
        """
        Get delta for $span($week_delta=$delta) call.

        Args:
            precision (string): Day, week, month, year, alltime

        Returns:
            float: A delta
        """
        week_delta = 0

        if precision == "alltime":
            week_delta = 1000  # TODO: This will stop to work after 19 years.

        return week_delta

    def get_nivo_props(self, obs):
        """
        Get nivo props from skin.conf.

        Args:
            obs (string): Observation

        Returns:
            dict: Nivo props.
        """
        diagrams_config = self.skin_dict["DisplayOptions"]["diagrams"]
        diagram_base_props = diagrams_config[self.get_diagram(obs)]

        if obs in diagrams_config:
            return {**diagram_base_props, **diagrams_config[obs]}
        else:
            return diagram_base_props


class WdcStatsUtil(SearchList):
    def __init__(self, generator):
        SearchList.__init__(self, generator)
        self.unit = UnitInfoHelper(generator.formatter, generator.converter)
        self.obs = ObsInfoHelper(generator.skin_dict)
        self.diagram_util = WdcDiagramUtil(generator)

    def get_show_min(self, observation):
        """
        Returns if the min stats should be shown.

        Args:
            observation (string): The observation

        Returns:
            bool: Show or hide min stat.
        """
        show_min_stat = [
            "outTemp",
            "outHumidity",
            "barometer",
            "windDir",
            "snowDepth",
            "heatindex",
            "dewpoint",
            "windchill",
            "cloudbase",
            "appTemp",
        ]

        if "Temp" in observation:
            return True

        elif "Humid" in observation:
            return True

        if observation in show_min_stat:
            return True

    def get_show_sum(self, observation):
        """
        Returns if the sum stats should be shown.

        Args:
            observation (string): The observation

        Returns:
            bool: Show or hide sum stat.
        """
        show_sum = ["rain", "ET"]

        if observation in show_sum:
            return True

    def get_show_max(self, observation):
        """
        Returns if the max stats should be shown.

        Args:
            observation (string): The observation

        Returns:
            bool: Show or hide max stat.
        """
        show_max = ["rainRate"]

        if observation in show_max:
            return True

    def get_labels(self, prop, precision):
        """
        Returns a label like "Todays Max" or "Monthly average.

        Args:
            prop (string): Min, Max, Sum
            precision (string): Day, week, month, year, alltime

        Returns:
            string: A label.
        """
        if precision == "alltime":
            return prop

        return prop + " " + precision

    def get_climatological_day(self, day, period, unit_type):
        """
        Return number of days in period for day parameter.

        Args:
            day (string): Eg. rainDays, hotDays.
            period (obj): Period to use, eg. $year, month, $span
            unit_type (dict): degree_F or degree_C

        Returns:
            int: Number of days.
        """
        if day == "iceDays":
            day_series = period.outTemp.series(
                aggregate_type="max",
                aggregate_interval="day",
                time_series="start",
                time_unit="unix_epoch",
            )

            days = filter(
                lambda x: x.raw is not None and x.raw < 0.0, list(day_series.data)
            )

            return len(list(days))

        if day == "frostDays":
            day_series = period.outTemp.series(
                aggregate_type="min",
                aggregate_interval="day",
                time_series="start",
                time_unit="unix_epoch",
            )

            days = filter(
                lambda x: x.raw is not None and x.raw < 0.0, list(day_series.data)
            )

            return len(list(days))

        if day == "stormDays":
            day_series = period.windGust.series(
                aggregate_type="max",
                aggregate_interval="day",
                time_series="start",
                time_unit="unix_epoch",
            )

            if getattr(self.unit.label, "windGust") == " km/h":
                value = 62.0
            if getattr(self.unit.label, "windGust") == " mph":
                value = 38.5
            if getattr(self.unit.label, "windGust") == " m/s":
                value = 17.2

            days = filter(
                lambda x: x.raw is not None and x.raw >= value, list(day_series.data)
            )

            return len(list(days))

        if day == "rainDays":
            day_series = period.rain.series(
                aggregate_type="sum",
                aggregate_interval="day",
                time_series="start",
                time_unit="unix_epoch",
            )

            days = filter(
                lambda x: x.raw is not None and x.raw > 0.0, list(day_series.data)
            )

            return len(list(days))

        if (
            day == "hotDays"
            or day == "summerDays"
            or day == "desertDays"
            or day == "tropicalNights"
        ):

            if day == "tropicalNights":
                value = 20.0 if getattr(unit_type, "outTemp") == "degree_C" else 68.0
                aggregate_type = "min"
            if day == "summerDays":
                value = 25.0 if getattr(unit_type, "outTemp") == "degree_C" else 77.0
                aggregate_type = "max"
            if day == "hotDays":
                value = 30.0 if getattr(unit_type, "outTemp") == "degree_C" else 86.0
                aggregate_type = "max"
            if day == "desertDays":
                value = 35.0 if getattr(unit_type, "outTemp") == "degree_C" else 95.0
                aggregate_type = "max"

            day_series = period.outTemp.series(
                aggregate_type=aggregate_type,
                aggregate_interval="day",
                time_series="start",
                time_unit="unix_epoch",
            )

            days = filter(
                lambda x: x.raw is not None and x.raw >= value, list(day_series.data)
            )

            return len(list(days))

    def get_climatological_day_description(self, day, unit_type):
        """
        Return description of day.

        Args:
            day (string): Eg. rainDays, hotDays.
            unit_labels (dict): weewx $unit
            obs_labels (obj): weewx $obs.labels
            unit_type (dict): degree_F or degree_C

        Returns:
            string: Day description.
        """
        if day == "iceDays":
            value = "0" if getattr(unit_type, "outTemp") == "degree_C" else "32"

            return (
                self.obs.label["outTemp"]
                + "<sub>max</sub> < "
                + value
                + getattr(self.unit.label, "outTemp")
            )

        if day == "frostDays":
            value = "0" if getattr(unit_type, "outTemp") == "degree_C" else "32"

            return (
                self.obs.label["outTemp"]
                + "<sub>min</sub> < "
                + value
                + getattr(self.unit.label, "outTemp")
            )

        if day == "stormDays":
            if getattr(self.unit.label, "windGust") == " km/h":
                value = "62"
            if getattr(self.unit.label, "windGust") == " mph":
                value = "38.5"
            if getattr(self.unit.label, "windGust") == " m/s":
                value = "17.2"

            return (
                self.obs.label["windGust"]
                + " > "
                + value
                + getattr(self.unit.label, "windGust")
            )

        if day == "rainDays":
            return self.obs.label["rain"] + " > 0" + getattr(self.unit.label, "rain")

        if (
            day == "hotDays"
            or day == "summerDays"
            or day == "desertDays"
            or day == "tropicalNights"
        ):
            if day == "tropicalNights":
                value = "20" if getattr(unit_type, "outTemp") == "degree_C" else "68"
                aggregate_type = "min"
            if day == "summerDays":
                value = "25" if getattr(unit_type, "outTemp") == "degree_C" else "77"
                aggregate_type = "max"
            if day == "hotDays":
                value = "30" if getattr(unit_type, "outTemp") == "degree_C" else "86"
                aggregate_type = "max"
            if day == "desertDays":
                value = "35" if getattr(unit_type, "outTemp") == "degree_C" else "95"
                aggregate_type = "max"

            return (
                self.obs.label["outTemp"]
                + "<sub>"
                + aggregate_type
                + "</sub> ≥ "
                + value
                + getattr(self.unit.label, "outTemp")
            )

    def get_calendar_color(self, obs):
        """
        Returns a color for use in diagram.

        Args:
            observation (string): The observation

        Returns:
            string: Color string.
        """
        if obs == "rain":
            return ["#032c6a", "#02509d", "#1a72b7", "#4093c7", "#6bb0d7", "#9fcae3"][
                ::-1
            ]

        if obs == "outTemp":
            # Warming stripes colors
            # @see https://en.wikipedia.org/wiki/Warming_stripes
            return [
                "#032c6a",
                "#02509d",
                "#1a72b7",
                "#4093c7",
                "#6bb0d7",
                "#9fcae3",
                "#c6dcee",
                "#dfedf6",
                "#ffe1d2",
                "#fcbda3",
                "#fc9373",
                "#fa6a48",
                "#ee3829",
                "#cd1116",
                "#a6060d",
                "#660105",
            ]

    def get_calendar_data(self, obs, aggrgate_type, period):
        """
        Returns array of calendar data for use in diagram.

        Args:
            observation (string): The observation
            aggrgate_type (string): Min, max, avg.
            period (obj): Period to use, eg. $year, month, $span

        Returns:
            list: Calendar data.
        """
        if obs == "rain":
            day_series = period.rain.series(
                aggregate_type=aggrgate_type,
                aggregate_interval="day",
                time_series="start",
                time_unit="unix_epoch",
            ).round(self.diagram_util.get_rounding("rain"))

            days = filter(
                lambda x: x[1].raw > 0.0, list(zip(day_series.start, day_series.data))
            )
            rainDays = []

            for day in days:
                rainDays.append({"value": day[1].raw, "day": day[0].format("%Y-%m-%d")})

            return rainDays

        if obs == "outTemp":
            day_series = period.outTemp.series(
                aggregate_type=aggrgate_type,
                aggregate_interval="day",
                time_series="start",
                time_unit="unix_epoch",
            ).round(self.diagram_util.get_rounding("outTemp"))

            days = list(zip(day_series.start, day_series.data))
            tempDays = []

            for day in days:
                if day[1].raw is not None:
                    tempDays.append(
                        {"value": day[1].raw, "day": day[0].format("%Y-%m-%d")}
                    )

            return tempDays


class WdcTableUtil(SearchList):
    def __init__(self, generator):
        SearchList.__init__(self, generator)
        self.unit = UnitInfoHelper(generator.formatter, generator.converter)
        self.obs = ObsInfoHelper(generator.skin_dict)
        self.diagram_util = WdcDiagramUtil(generator)

    def get_table_aggregate_interval(self, observation, precision):
        """
        aggregate_interval for observations series for tables.

        Args:
            observation (string): The observation
            precision (string): Day, week, month, year, alltime

        Returns:
            int: aggregate_interval
        """
        if precision == "day":
            return 900 * 8  # 2 hours

        if precision == "week":
            return 900 * 24  # 6 hours

        if precision == "month":
            return 900 * 48  # 12 hours

        if precision == "year" or precision == "alltime":
            return 3600 * 24  # 1 day

    def get_table_boundary(self, precision):
        """
        boundary for observations series for tables.

        Args:
            precision (string): Day, week, month, year, alltime

        Returns:
            string: None | 'midnight'
        """
        if precision == "day":
            return None

        if precision == "week":
            return None

        if precision == "month":
            return None

        if precision == "year" or precision == "alltime":
            return "midnight"

    def get_table_headers(self, obs, period):
        """
        Returns tableheaders for use in carbon data table.

        Args:
            obs (list): $DisplayOptions.get("table_tile_..")
            period (obj): Period to use, eg. $year, month, $span

        Returns:
            list: Carbon data table headers.
        """
        carbon_headers = []

        carbon_headers.append(
            {
                "title": "Time",
                "id": "time",
                "sortCycle": "tri-states-from-ascending",
            }
        )

        for header in obs:
            if getattr(period, header).has_data:
                carbon_header = {
                    "title": self.obs.label[header],
                    "small": "in " + getattr(self.unit.label, header),
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

        # TODO: Get values directly from DB?
        for observation in obs:
            if getattr(period, observation).has_data:
                series = (
                    getattr(period, observation)
                    .series(
                        aggregate_type=self.diagram_util.get_aggregate_type(
                            observation, use_defaults=True
                        ),
                        aggregate_interval=self.get_table_aggregate_interval(
                            observation, precision
                        ),
                        time_series="start",
                        time_unit="unix_epoch",
                    )
                    .round(self.diagram_util.get_rounding(observation))
                )

                for start, data in zip(series.start, series.data):
                    cs_time = datetime.fromtimestamp(start.raw)
                    # The current series item by time.
                    cs_item = list(
                        filter(
                            lambda x: (x["time"] == cs_time.isoformat()), carbon_values
                        )
                    )

                    if len(cs_item) == 0:
                        carbon_values.append(
                            {
                                "time": cs_time.isoformat(),
                                observation: data.raw,
                                "id": start.raw,
                            }
                        )
                    else:
                        cs_item = cs_item[0]
                        cs_item_index = carbon_values.index(cs_item)
                        cs_item[observation] = data.raw if data.raw is not None else "-"
                        carbon_values[cs_item_index] = cs_item

        # Sort per time
        carbon_values.sort(key=lambda item: datetime.fromisoformat(item["time"]))

        return carbon_values
