# Copyright 2022 David Bätge
# Distributed under the terms of the GNU Public License (GPLv3)

import datetime
import calendar
import time

import weewx
from weewx.cheetahgenerator import SearchList
from weewx.units import (
    UnitInfoHelper,
    ObsInfoHelper,
    mph_to_knot,
    kph_to_knot,
    mps_to_knot,
    ValueHelper
)
from weewx.wxformulas import beaufort
from weewx.tags import TimespanBinder
from weeutil.weeutil import TimeSpan

if weewx.__version__ < "4.6":
    raise weewx.UnsupportedFeature(
        "weewx 4.6 and newer is required, found %s" % weewx.__version__
    )

temp_obs = ["outTemp", "inTemp", "dewpoint",
            "windchill", "heatindex", "appTemp"]


class WdcGeneralUtil(SearchList):
    def __init__(self, generator):
        SearchList.__init__(self, generator)
        self.skin_dict = generator.skin_dict

        try:
            time_format_dict = self.skin_dict["Units"]["TimeFormats"]
            to_date_dict = self.skin_dict["CheetahGenerator"]["ToDate"]
        except KeyError:
            time_format_dict = {}
            to_date_dict = {}

        self.time_format = time_format_dict
        self.generator_to_date = to_date_dict

    def show_yesterday(self):
        if "yesterday" in self.generator_to_date:
            return True

        return False

    def get_time_format_dict(self):
        return self.time_format

    @staticmethod
    def get_icon(observation):
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

        elif (
                observation == "barometer"
                or observation == "pressure"
                or observation == "altimeter"
        ):
            return icon_path + "barometer.svg"

        elif observation == "windSpeed":
            return icon_path + "wind-speed.svg"

        elif observation == "windGust":
            return icon_path + "wind-gust.svg"

        elif observation == "windDir" or observation == "windGustDir":
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

        if (
                observation == "barometer"
                or observation == "pressure"
                or observation == "altimeter"
        ):
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

        return "#161616"

    @staticmethod
    def get_time_span_from_attr(attr, day, week, month, year, alltime, yesterday):
        """
        Get tag for use in templates.

        Args:
            attr (string): The time range
            day: Daily TimeSpanBinder
            week: Weekly TimeSpanBinder
            month: Monthly TimeSpanBinder
            year: Yearly TimeSpanBinder
            alltime: Alltime TimeSpanBinder
            yesterday: Yesterday TimeSpanBinder

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

        if attr == "yesterday":
            return yesterday

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

    def get_ordinates(self):
        default_ordinate_names = [
            "N",
            "NNE",
            "NE",
            "ENE",
            "E",
            "ESE",
            "SE",
            "SSE",
            "S",
            "SSW",
            "SW",
            "WSW",
            "W",
            "WNW",
            "NW",
            "NNW",
            "N/A",
        ]
        try:
            ordinate_names = self.generator.skin_dict["Units"]["Ordinates"][
                "directions"
            ]

        except KeyError:
            ordinate_names = default_ordinate_names

        return ordinate_names


class WdcArchiveUtil(SearchList):
    @staticmethod
    def filter_months(months, year):
        """
        Returns a filtered list of months

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

    @staticmethod
    def month_string_format(month):
        """
        Returns a formatted value of a weewwx month string (2022-01)

        Args:
            month (string): A month

        Returns:
            str: Formatted month string.
        """
        month_dt = datetime.datetime.strptime(month, "%Y-%m")

        return month_dt.strftime("%B")

    # TODO: Replace with https://groups.google.com/g/weewx-development/c/MvXZhJTTuGU.
    @staticmethod
    def fake_get_report_years(first, last):
        """
        Returns a fake $SummaryByYear tag.

        Args:
            first (int): Year of first observation.
            last (int): Year of last observation

        Returns:
            list: [2022, 2021].
        """
        first_year = int(first)
        last_year = int(last)

        if first_year == last_year:
            return [last_year]

        else:
            return list(range(first_year, last_year + 1))


class WdcCelestialUtil(SearchList):
    @staticmethod
    def get_celestial_icon(observation, prop):
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
        self.obs = ObsInfoHelper(generator.skin_dict)
        self.unit = UnitInfoHelper(generator.formatter, generator.converter)
        self.skin_dict = generator.skin_dict
        self.config_dict = generator.config_dict
        self.general_util = WdcGeneralUtil(generator)

    @staticmethod
    def get_diagram_type(observation):
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

        if (
                observation == "barometer"
                or observation == "pressure"
                or observation == "altimeter"
        ):
            return "pressure"

        return observation

    @staticmethod
    def get_diagram(observation):
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

    @staticmethod
    def get_aggregate_interval(observation, precision, *args, **kwargs):
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

        if precision == "day" or precision == 'yesterday':
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

                start_dt = datetime.datetime.strptime(
                    alltime_start, "%d.%m.%Y")
                end_dt = datetime.datetime.strptime(alltime_end, "%d.%m.%Y")
                delta = end_dt - start_dt

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

    @staticmethod
    def get_diagram_boundary(precision):
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

        if (
                observation == "pressure"
                or observation == "barometer"
                or observation == "altimeter"
        ) and self.unit.unit_type.pressure == "inHg":
            return 3

        return 1

    @staticmethod
    def get_hour_delta(precision):
        """
        Get delta for $span($hour_delta=$delta) call.

        Args:
            precision (string): Day, week, month, year, alltime

        Returns:
            float: A delta
        """
        now_dt = datetime.datetime.now()

        hour_delta = 24

        if precision == "week":
            hour_delta = 24 * 7

        if precision == "month":
            hour_delta = 24 * 30  # monthrange(now_dt.year, now_dt.month)[1]

        if precision == "year":
            days = 366 if calendar.isleap(now_dt.year) else 365
            hour_delta = 24 * days

        return hour_delta

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
        elif obs in diagrams_config["combined_observations"]:
            return {
                **diagram_base_props,
                **diagrams_config["combined_observations"][obs],
            }
        else:
            return diagram_base_props

    def get_windrose_data(self, period, precision):
        """
        Get data for rendering wind rose in JS.

        period (TimeSpanBinder): Period to use, eg. $year, month, $span

        Returns:
            list: Windrose data.
        """
        db_manager = self.generator.db_binder.get_manager(
            data_binding=self.config_dict["StdArchive"]["data_binding"])
        ordinals = self.general_util.get_ordinates()
        windrose_data = []

        # Remove "N/A" from ordinals.
        if len(ordinals) == 17:
            ordinals.pop()

        # We use a scale of 6: <=BF1, BF2, ..., BF5, >=BF6.
        for i in range(6):
            name_prefix = "<= " if i == 0 else ">= " if i == 5 else ""
            show_beaufort = False

            if show_beaufort:
                name = "Beaufort " + str(i + 1)
            else:
                # Bft 1 and lower
                if i == 0:
                    wind_upper_vt = self.generator.converter.convert(
                        (3, "knot", "group_speed"))
                    name = ValueHelper(
                        value_t=wind_upper_vt, formatter=self.generator.formatter).format()
                # Bft 2
                elif i == 1:
                    wind_lower_vt = self.generator.converter.convert(
                        (4, "knot", "group_speed"))
                    wind_upper_vt = self.generator.converter.convert(
                        (6, "knot", "group_speed"))
                    name = ValueHelper(value_t=wind_lower_vt, formatter=self.generator.formatter).format(
                    ) + " - " + ValueHelper(value_t=wind_upper_vt, formatter=self.generator.formatter).format()
                # Bft 3
                elif i == 2:
                    wind_lower_vt = self.generator.converter.convert(
                        (7, "knot", "group_speed"))
                    wind_upper_vt = self.generator.converter.convert(
                        (10, "knot", "group_speed"))
                    name = ValueHelper(value_t=wind_lower_vt, formatter=self.generator.formatter).format(
                    ) + " - " + ValueHelper(value_t=wind_upper_vt, formatter=self.generator.formatter).format()
                # Bft 4
                elif i == 3:
                    wind_lower_vt = self.generator.converter.convert(
                        (11, "knot", "group_speed"))
                    wind_upper_vt = self.generator.converter.convert(
                        (16, "knot", "group_speed"))
                    name = ValueHelper(value_t=wind_lower_vt, formatter=self.generator.formatter).format(
                    ) + " - " + ValueHelper(value_t=wind_upper_vt, formatter=self.generator.formatter).format()
                # Bft 5
                elif i == 4:
                    wind_lower_vt = self.generator.converter.convert(
                        (17, "knot", "group_speed"))
                    wind_upper_vt = self.generator.converter.convert(
                        (21, "knot", "group_speed"))
                    name = ValueHelper(value_t=wind_lower_vt, formatter=self.generator.formatter).format(
                    ) + " - " + ValueHelper(value_t=wind_upper_vt, formatter=self.generator.formatter).format()
                # Bft 6 and higher
                elif i == 5:
                    wind_lower_vt = self.generator.converter.convert(
                        (22, "knot", "group_speed"))
                    name = ValueHelper(
                        value_t=wind_lower_vt, formatter=self.generator.formatter).format()

            windrose_data.append(
                {
                    "r": [0] * len(ordinals),
                    "hovertemplate": "%{theta}, %{r}%",
                    "theta": ordinals,
                    "name": name_prefix + name,
                    "type": "barpolar",
                }
            )

        windDir_start_vt, windDir_stop_vt, windDir_vt = weewx.xtypes.get_series(
            "windDir",
            TimeSpan(period.start.raw, period.end.raw),
            db_manager,
            aggregate_type="avg",
            aggregate_interval=self.get_aggregate_interval(
                observation="windDir", precision=precision
            )
        )

        windSpeed_start_vt, windSpeed_stop_vt, windSpeed_vt = weewx.xtypes.get_series(
            "windSpeed",
            TimeSpan(period.start.raw, period.end.raw),
            db_manager,
            aggregate_type="max",
            aggregate_interval=self.get_aggregate_interval(
                observation="windSpeed", precision=precision
            )
        )

        # TODO: Gust speeds?
        for windSpeed, windDir in zip(windSpeed_vt[0], windDir_vt[0]):
            if windSpeed is None:
                continue

            # Convert windSpeed to knots, get beaufort.
            windspeed_source_unit = windSpeed_vt[1]
            if windspeed_source_unit in ("km_per_hour", "km_per_hour2"):
                windSpeed_knots = kph_to_knot(windSpeed)
            elif windspeed_source_unit in ("mile_per_hour", "mile_per_hour2"):
                windSpeed_knots = mph_to_knot(windSpeed)
            elif windspeed_source_unit in ("meter_per_second", "meter_per_second2"):
                windSpeed_knots = mps_to_knot(windSpeed)
            else:
                windSpeed_knots = windSpeed

            windSpeed_beaufort = beaufort(windSpeed_knots)
            winddir_oridnal = self.generator.formatter.to_ordinal_compass(
                (windDir, windDir_vt[1], windDir_vt[2]))
            windrose_data_ordinal_index = ordinals.index(winddir_oridnal)

            # Add 1 (one part of total number of parts) to the direction and
            # beaufort matrix.
            if windSpeed_beaufort is None or windSpeed_beaufort <= 1:
                windrose_data[0]["r"][windrose_data_ordinal_index] += 1
            elif windSpeed_beaufort <= 5:
                windrose_data[windSpeed_beaufort - 1]["r"][
                    windrose_data_ordinal_index
                ] += 1
            else:
                windrose_data[5]["r"][windrose_data_ordinal_index] += 1

        # Calculate percentages.
        num_of_values = len(list(windSpeed_vt[0]))
        for index, data in enumerate(windrose_data):
            for p_index, percent in enumerate(data["r"]):
                windrose_data[index]["r"][p_index] = round(
                    (percent / num_of_values) * 100
                )

        return windrose_data


class WdcStatsUtil(SearchList):
    def __init__(self, generator):
        SearchList.__init__(self, generator)
        self.unit = UnitInfoHelper(generator.formatter, generator.converter)
        self.obs = ObsInfoHelper(generator.skin_dict)
        self.diagram_util = WdcDiagramUtil(generator)

    @staticmethod
    def get_show_min(observation):
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
            "pressure",
            "altimeter",
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

    @staticmethod
    def get_show_sum(observation):
        """
        Returns if the sum stats should be shown.

        Args:
            observation (string): The observation

        Returns:
            bool: Show or hide sum stat.
        """
        show_sum = ["rain", "ET", "lightning_strike_count"]

        if observation in show_sum:
            return True

    @staticmethod
    def get_show_max(observation):
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

    @staticmethod
    def get_labels(prop, precision):
        """
        Returns a label like "Todays Max" or "Monthly average".

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
        freezing_point = 0.0 if getattr(unit_type, "outTemp") == "degree_C" else 32.0

        # TODO: Refactor.
        if day == "iceDays":
            day_series = period.outTemp.series(
                aggregate_type="max",
                aggregate_interval="day",
                time_series="start",
                time_unit="unix_epoch",
            )

            days = filter(
                lambda x: x.raw is not None and x.raw < freezing_point, list(day_series.data)
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
                lambda x: x.raw is not None and x.raw < freezing_point, list(day_series.data)
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
                lambda x: x.raw is not None and x.raw >= value, list(
                    day_series.data)
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
                lambda x: x.raw is not None and x.raw > 0.0, list(
                    day_series.data)
            )

            return len(list(days))

        if (
                day == "hotDays"
                or day == "summerDays"
                or day == "desertDays"
                or day == "tropicalNights"
        ):

            if day == "tropicalNights":
                value = 20.0 if getattr(
                    unit_type, "outTemp") == "degree_C" else 68.0
                aggregate_type = "min"
            if day == "summerDays":
                value = 25.0 if getattr(
                    unit_type, "outTemp") == "degree_C" else 77.0
                aggregate_type = "max"
            if day == "hotDays":
                value = 30.0 if getattr(
                    unit_type, "outTemp") == "degree_C" else 86.0
                aggregate_type = "max"
            if day == "desertDays":
                value = 35.0 if getattr(
                    unit_type, "outTemp") == "degree_C" else 95.0
                aggregate_type = "max"

            day_series = period.outTemp.series(
                aggregate_type=aggregate_type,
                aggregate_interval="day",
                time_series="start",
                time_unit="unix_epoch",
            )

            days = filter(
                lambda x: x.raw is not None and x.raw >= value, list(
                    day_series.data)
            )

            return len(list(days))

    def get_climatological_day_description(self, day, unit_type):
        """
        Return description of day.

        Args:
            day (string): Eg. rainDays, hotDays.
            unit_type (dict): degree_F or degree_C

        Returns:
            string: Day description.
        """
        if day == "iceDays":
            value = "0" if getattr(
                unit_type, "outTemp") == "degree_C" else "32"

            return (
                self.obs.label["outTemp"]
                + "<sub>max</sub> < "
                + value
                + getattr(self.unit.label, "outTemp")
            )

        if day == "frostDays":
            value = "0" if getattr(
                unit_type, "outTemp") == "degree_C" else "32"

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
                value = "20" if getattr(
                    unit_type, "outTemp") == "degree_C" else "68"
                aggregate_type = "min"
            if day == "summerDays":
                value = "25" if getattr(
                    unit_type, "outTemp") == "degree_C" else "77"
                aggregate_type = "max"
            if day == "hotDays":
                value = "30" if getattr(
                    unit_type, "outTemp") == "degree_C" else "86"
                aggregate_type = "max"
            if day == "desertDays":
                value = "35" if getattr(
                    unit_type, "outTemp") == "degree_C" else "95"
                aggregate_type = "max"

            return (
                self.obs.label["outTemp"]
                + "<sub>"
                + aggregate_type
                + "</sub> ≥ "
                + value
                + getattr(self.unit.label, "outTemp")
            )

    @staticmethod
    def get_calendar_color(obs):
        """
        Returns a color for use in diagram.

        Args:
            obs (string): The observation

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

    def get_calendar_data(self, obs, aggregate_type, period):
        """
        Returns array of calendar data for use in diagram.

        Args:
            obs (string): The observation
            aggregate_type (string): Min, max, avg.
            period (obj): Period to use, eg. $year, month, $span

        Returns:
            list: Calendar data.
        """
        if obs == "rain":
            day_series = period.rain.series(
                aggregate_type=aggregate_type,
                aggregate_interval="day",
                time_series="start",
                time_unit="unix_epoch",
            ).round(self.diagram_util.get_rounding("rain"))

            days = filter(
                lambda x: x[1].raw > 0.0, list(
                    zip(day_series.start, day_series.data))
            )
            rain_days = []

            for day in days:
                rain_days.append(
                    {"value": day[1].raw, "day": day[0].format("%Y-%m-%d")})

            return rain_days

        if obs == "outTemp":
            day_series = period.outTemp.series(
                aggregate_type=aggregate_type,
                aggregate_interval="day",
                time_series="start",
                time_unit="unix_epoch",
            ).round(self.diagram_util.get_rounding("outTemp"))

            days = list(zip(day_series.start, day_series.data))
            temp_days = []

            for day in days:
                if day[1].raw is not None:
                    temp_days.append(
                        {"value": day[1].raw, "day": day[0].format("%Y-%m-%d")}
                    )

            return temp_days


class WdcTableUtil(SearchList):
    def __init__(self, generator):
        SearchList.__init__(self, generator)
        self.unit = UnitInfoHelper(generator.formatter, generator.converter)
        self.obs = ObsInfoHelper(generator.skin_dict)
        self.diagram_util = WdcDiagramUtil(generator)

    @staticmethod
    def get_table_aggregate_interval(precision):
        """
        aggregate_interval for observations series for tables.

        Args:
            precision (string): Day, week, month, year, alltime

        Returns:
            int: aggregate_interval
        """
        if precision == "day" or precision == "yesterday":
            return 900 * 4  # 1 hours

        if precision == "week":
            return 900 * 24  # 6 hours

        if precision == "month":
            return 900 * 48  # 12 hours

        if precision == "year" or precision == "alltime":
            return 3600 * 24  # 1 day

    @staticmethod
    def get_table_boundary(precision):
        """
        boundary for observations series for tables.

        Args:
            precision (string): Day, week, month, year, alltime

        Returns:
            string: None | 'midnight'
        """
        if precision == "day" or precision == 'yesterday':
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
        carbon_headers = [{
            "title": "Time",
            "id": "time",
            "sortCycle": "tri-states-from-ascending",
        }]

        for header in obs:
            # TODO: weewx.tags.ObservationBinder
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

        # TODO: xtypes.get_series
        for observation in obs:
            if getattr(period, observation).has_data:
                series = (
                    getattr(period, observation)
                    .series(
                        aggregate_type=self.diagram_util.get_aggregate_type(
                            observation, use_defaults=True
                        ),
                        aggregate_interval=self.get_table_aggregate_interval(
                            precision
                        ),
                        time_series="both",
                        time_unit="unix_epoch",
                    )
                    .round(self.diagram_util.get_rounding(observation))
                )

                for start, stop, data in zip(series.start, series.stop, series.data):
                    if precision == "alltime":
                        cs_time_dt = datetime.datetime.fromtimestamp(start.raw)
                    else:
                        cs_time_dt = datetime.datetime.fromtimestamp(stop.raw)

                    # The current series item by time.
                    cs_item = list(
                        filter(
                            lambda x: (
                                x["time"] == cs_time_dt.isoformat()), carbon_values
                        )
                    )

                    if len(cs_item) == 0:
                        carbon_values.append(
                            {
                                "time": cs_time_dt.isoformat(),
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
        carbon_values.sort(
            key=lambda item: datetime.datetime.fromisoformat(item["time"]))

        return carbon_values


class Yesterday(SearchList):
    def __init__(self, generator):
        SearchList.__init__(self, generator)

    def get_extension_list(self, timespan, db_lookup):
        """Returns a search list extension with two additions.

        Parameters:
          timespan: An instance of weeutil.weeutil.TimeSpan. This will
                    hold the start and stop times of the domain of
                    valid times.

          db_lookup: This is a function that, given a data binding
                     as its only parameter, will return a database manager
                     object.
        """
        yesterday_end_dt = datetime.datetime.combine(
            datetime.datetime.fromtimestamp(timespan.stop), datetime.datetime.min.time())
        yesterday_end_ts = time.mktime(yesterday_end_dt.timetuple())

        yesterday_start_dt = yesterday_end_dt - datetime.timedelta(days=1)
        yesterday_start_ts = time.mktime(yesterday_start_dt.timetuple())

        yesterday_stats = TimespanBinder(TimeSpan(yesterday_start_ts, yesterday_end_ts),
                                         db_lookup,
                                         context='day',
                                         formatter=self.generator.formatter,
                                         converter=self.generator.converter,
                                         skin_dict=self.generator.skin_dict)

        search_list_extension = {'yesterday': yesterday_stats}

        return [search_list_extension]
