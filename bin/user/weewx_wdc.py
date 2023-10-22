# coding: utf-8
#
#    Copyright (c) 2023 David Baetge <david.baetge@gmail.com>,
#      Vince Skahan (last_rain and time_since_last_rain),
#      Pat O'Brien (Consecutive Days With/Without Rain)
#
#    Distributed under the terms of the GNU Public License (GPLv3)
#
import datetime
import calendar
import pprint
import time
import os
import json

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
from weeutil.weeutil import TimeSpan, rounder, to_bool, to_int, startOfDay, startOfArchiveDay
from weeutil.config import search_up, accumulateLeaves


try:
    import weeutil.logger
    import logging

    log = logging.getLogger(__name__)

    def logdbg(msg):
        log.debug(msg)

    def loginf(msg):
        log.info(msg)

    def logerr(msg):
        log.error(msg)

except ImportError:
    import syslog

    def logmsg(level, msg):
        syslog.syslog(level, 'weewx-wdc: %s' % msg)

    def logdbg(msg):
        logmsg(syslog.LOG_DEBUG, msg)

    def loginf(msg):
        logmsg(syslog.LOG_INFO, msg)

    def logerr(msg):
        logmsg(syslog.LOG_ERR, msg)


class RainTags(SearchList):
    """"
    Code for last_rain and time_since_last_rain is taken
    (and slightly modified) from
    https://github.com/vinceskahan/vds-weewx-lastrain-extension

    reused massively from wdSearchX3.py in weewx-wd 1.0 at Gary's suggestion

    some code also reused_from/stolen_from/insulting weewx station.py
    per Tom's suggestion

    Basic concpet of most_days_with_rain and most_days_without_rain is partially
    copied from https://github.com/poblabs/weewx-belchertown
    """

    def __init__(self, generator):
        SearchList.__init__(self, generator)

    def get_extension_list(self, timespan, db_lookup):
        """Returns a search list extension with datetime of last rain and secs since then.

        Parameters:
          timespan: An instance of weeutil.weeutil.TimeSpan. This will
                    hold the start and stop times of the domain of
                    valid times.

          db_lookup: This is a function that, given a data binding
                     as its only parameter, will return a database manager
                     object.

        Returns:
          last_rain:            A ValueHelper containing the datetime of the last rain
          time_since_last_rain: A ValueHelper containing the seconds since last rain
          most_days_with_rain:  A dict containing
            start                   A ValueHelper containing the datetime of the start of the period
            end                     A ValueHelper containing the datetime of the end of the period
            amount                  A ValueHelper containing the amount of rain in the period
            days_with_rain          The number of days with rain (raw int value)
            days_with_rain_delta    A ValueHelper containing the number of seconds in the period
          most_days_without_rain: A dict containing
            start                   A ValueHelper containing the datetime of the start of the period
            end                     A ValueHelper containing the datetime of the end of the period
            days_without_rain       The number of days without rain (raw int value)
            days_without_rain_delta A ValueHelper containing the number of seconds in the period
        """

        wx_manager = db_lookup()

        ##
        # Get date and time of last rain
        ##
        # Returns unix epoch of archive period of last rain
        ##
        # Result is returned as a ValueHelper so standard Weewx formatting
        # is available eg $last_rain.format("%d %m %Y")
        ##

        # Get ts for day of last rain from statsdb
        # Value returned is ts for midnight on the day the rain occurred
        _row = wx_manager.getSql(
            "SELECT MAX(dateTime) FROM archive_day_rain WHERE sum > 0")

        last_rain_ts = _row[0]
        # Now if we found a ts then use it to limit our search on the archive
        # so we can find the last archive record during which it rained. Wrap
        # in a try statement just in case

        if last_rain_ts is not None:
            try:
                _row = wx_manager.getSql("SELECT MAX(dateTime) FROM archive WHERE rain > 0 AND dateTime > ? AND dateTime <= ?",
                                         (last_rain_ts, last_rain_ts + 86400))
                last_rain_ts = _row[0]
            except:
                last_rain_ts = None
        else:
            # the dreaded you should never reach here block
            # intent is to belt'n'suspender for a new db with no rain recorded yet
            last_rain_ts = None

        # Wrap our ts in a ValueHelper
        last_rain_vt = (last_rain_ts, 'unix_epoch', 'group_time')
        last_rain_vh = ValueHelper(
            last_rain_vt, formatter=self.generator.formatter, converter=self.generator.converter)

        # next idea stolen with thanks from weewx station.py
        # note this is delta time from 'now' not the last weewx db time
        #  - weewx used time.time() but weewx-wd suggests timespan.stop()
        delta_time = time.time() - last_rain_ts if last_rain_ts else None

        # Wrap our ts in a ValueHelper
        delta_time_vt = (delta_time, 'second', 'group_deltatime')

        last_rain_delta_time_vh = ValueHelper(delta_time_vt, context='long_delta',
                                              formatter=self.generator.formatter, converter=self.generator.converter)

        ##
        # Get date and value of most consecutive days with rain
        ##
        at_days_with_rain_total = 0
        at_days_with_rain_total_amount = 0
        at_days_without_rain_total = 0
        at_days_with_rain_output = []
        at_days_without_rain_output = []
        at_rain_query = wx_manager.genSql(
            "SELECT dateTime, sum FROM archive_day_rain WHERE count > 0;"
        )

        # Create empty list and append at_rain_query rows.
        rain_query_list = []
        years = []
        with_rain_period = None
        without_rain_period = None

        for row in at_rain_query:
            rain_query_list.append(row)
            # Get all years from records.
            year = datetime.datetime.fromtimestamp(
                row[0]).strftime('%Y')
            if year not in years:
                years.append(year)

        for index in range(len(rain_query_list)):
            row = rain_query_list[index]
            # Original MySQL way: CASE WHEN sum!=0 THEN @total+1 ELSE 0 END
            # pprint.pprint(row)
            if row[1] != 0:
                with_period_end = False
                at_days_with_rain_total += 1
                at_days_with_rain_total_amount = at_days_with_rain_total_amount + \
                    row[1]

                # Create rain period if not exists.
                if at_days_with_rain_total == 1:
                    with_rain_period = {
                        "start": row[0],
                        "end": row[0],
                        "days_with_rain": at_days_with_rain_total,
                        "amount": row[1],
                    }

                # Update period
                if at_days_with_rain_total > 1:
                    with_rain_period["end"] = row[0]
                    with_rain_period["days_with_rain"] = at_days_with_rain_total
                    with_rain_period["amount"] = at_days_with_rain_total_amount

            else:
                at_days_with_rain_total = 0
                at_days_with_rain_total_amount = 0
                with_period_end = True

            # Original MySQL way: CASE WHEN sum=0 THEN @total+1 ELSE 0 END
            if row[1] == 0:
                without_period_end = False
                at_days_without_rain_total += 1

                # Create rain period if not exists.
                if at_days_without_rain_total == 1:
                    without_rain_period = {
                        "start": row[0],
                        "end": row[0],
                        "days_without_rain": at_days_without_rain_total,
                    }

                # Update period
                if at_days_without_rain_total > 1:
                    without_rain_period["end"] = row[0]
                    without_rain_period["days_without_rain"] = at_days_without_rain_total
            else:
                at_days_without_rain_total = 0
                without_period_end = True

            # Rain period ended, append to output.
            if with_rain_period is not None and with_period_end is True:
                # Tranform raw amount value to ValueHelper.
                rain_vt = (with_rain_period["amount"], 'inch', 'group_rain')
                rain_vh = ValueHelper(
                    rain_vt, formatter=self.generator.formatter, converter=self.generator.converter)

                with_rain_period["amount"] = rain_vh

                # Transform raw days_with_rain value to ValueHelper.
                delta_time = with_rain_period['end'] - \
                    with_rain_period['start'] + 86400
                delta_time_vt = (delta_time, 'second', 'group_deltatime')
                delta_time_vh = ValueHelper(delta_time_vt,
                                            formatter=self.generator.formatter, converter=self.generator.converter)
                with_rain_period["days_with_rain_delta"] = delta_time_vh

                # Tranform raw start and end value to ValueHelper.
                start_vt = (with_rain_period["start"],
                            'unix_epoch', 'group_time')
                start_vh = ValueHelper(
                    start_vt, formatter=self.generator.formatter, converter=self.generator.converter)
                end_vt = (with_rain_period["end"], 'unix_epoch', 'group_time')
                end_vh = ValueHelper(
                    end_vt, formatter=self.generator.formatter, converter=self.generator.converter)

                with_rain_period["start"] = start_vh
                with_rain_period["end"] = end_vh

                at_days_with_rain_output.append(with_rain_period)
                with_rain_period = None

            # No rain period ended, append to output.
            if without_rain_period is not None and without_period_end is True:
                # Transform raw days_with_rain value to ValueHelper.
                delta_time = without_rain_period['end'] - \
                    without_rain_period['start'] + 86400
                delta_time_vt = (delta_time, 'second', 'group_deltatime')
                delta_time_vh = ValueHelper(delta_time_vt,
                                            formatter=self.generator.formatter, converter=self.generator.converter)
                without_rain_period["days_without_rain_delta"] = delta_time_vh

                # Tranform raw start and end value to ValueHelper.
                start_vt = (without_rain_period["start"],
                            'unix_epoch', 'group_time')
                start_vh = ValueHelper(
                    start_vt, formatter=self.generator.formatter, converter=self.generator.converter)
                end_vt = (without_rain_period["end"],
                          'unix_epoch', 'group_time')
                end_vh = ValueHelper(
                    end_vt, formatter=self.generator.formatter, converter=self.generator.converter)

                without_rain_period["start"] = start_vh
                without_rain_period["end"] = end_vh

                at_days_without_rain_output.append(without_rain_period)
                without_rain_period = None

        if len(at_days_with_rain_output) > 0:
            at_days_with_rain = max(
                at_days_with_rain_output, key=lambda x: x['days_with_rain'])

            # Add values for all years.
            for year in years:
                at_days_with_rain_output_per_year = list(filter(
                    lambda x: datetime.datetime.fromtimestamp(x['start'].raw).strftime('%Y') == year, at_days_with_rain_output))

                if len(at_days_with_rain_output_per_year) > 0:
                    at_days_with_rain[year] = max(
                        at_days_with_rain_output_per_year, key=lambda x: x['days_with_rain'])
                else:
                    at_days_with_rain[year] = None

        else:
            at_days_with_rain = None

        if len(at_days_without_rain_output) > 0:
            at_days_without_rain = max(
                at_days_without_rain_output, key=lambda x: x['days_without_rain'])

            # Add values for all years.
            for year in years:
                at_days_without_rain_output_per_year = list(filter(
                    lambda x: datetime.datetime.fromtimestamp(x['start'].raw).strftime('%Y') == year, at_days_without_rain_output))

                if len(at_days_without_rain_output_per_year) > 0:
                    at_days_without_rain[year] = max(
                        at_days_without_rain_output_per_year, key=lambda x: x['days_without_rain'])
                else:
                    at_days_without_rain[year] = None
        else:
            at_days_without_rain = None

        search_list_extension = {
            'last_rain': last_rain_vh,
            'time_since_last_rain':  last_rain_delta_time_vh,
            'most_days_with_rain': at_days_with_rain,
            "most_days_without_rain": at_days_without_rain
        }

        return [search_list_extension]


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
        self.default_binding = search_up(
            self.generator.config_dict["StdReport"]["WdcReport"],
            "data_binding",
            "wx_binding"
        )

    def get_locale(self):
        """
        Get the locale.

        Returns:
            str: The locale
        """
        try:
            return self.skin_dict["DisplayOptions"]["date_time_locale"]
        except KeyError:
            report_lang = search_up(
                self.generator.config_dict["StdReport"]["WdcReport"],
                "lang",
                "en"
            )

            if report_lang == "de":
                return 'de-DE'

            if report_lang == "it":
                return 'it-IT'

            return 'en-US'

    def getValueHelper(self, value_vt):
        """
        Get a value helper for a value_vt.

        Args:
            value_vt (tuple): A value tuple

        Returns:
            obj: A value helper
        """
        value_vt = self.generator.converter.convert(value_vt)
        return ValueHelper(value_t=value_vt, formatter=self.generator.formatter)

    def get_custom_data_binding_obs_key(self, obs_key):
        """
        Get the observation key for a custom observation.

        Args:
            obs_key (string): The observation key

        Returns:
            string: The custom data binding observation key
        """
        try:
            return self.skin_dict["ObservationBindings"][obs_key]["observation"]
        except KeyError:
            return obs_key

    def get_data_binding(self, obs_key, context=None, combined_key=None):
        """
        Get the data binding for a given observation.

        Args:
            obs_key (string): The observation key
            context (string): The context
            combined_key (string): The combined diagram key, eg. tempdew.

        Returns:
            string: The data binding
        """
        if combined_key is not None and context is not None:
            try:
                return self.skin_dict["DisplayOptions"]["diagrams"][context]["observations"][combined_key]['data_binding']
            except KeyError:
                try:
                    return self.skin_dict["DisplayOptions"]["diagrams"]["combined_observations"][combined_key]['data_binding']
                except KeyError:
                    pass

        if context is not None:
            try:
                return self.skin_dict["DisplayOptions"]["diagrams"][context]["observations"][obs_key]['data_binding']
            except KeyError:
                try:
                    return self.skin_dict["DisplayOptions"]["diagrams"][context]['data_binding']
                except KeyError:
                    pass

        try:
            return self.skin_dict["ObservationBindings"][obs_key]["data_binding"]
        except KeyError:
            return self.default_binding

    def get_data_binding_combined_diagram(self, observation, combined_config, combined_key, context):
        """
        Get the data binding for a combined diagram.

        Args:
            observation (string): The observation
            combined_config (dict): The combined config
            combined_key (string): The combined diagram key
            context (string): The context

        Returns:
            string: The data binding
        """
        try:
            return self.skin_dict["DisplayOptions"]["diagrams"][context]["observations"][combined_key]['data_binding']
        except KeyError:
            try:
                return self.skin_dict["DisplayOptions"]["diagrams"][context]['data_binding']
            except KeyError:
                pass

        if 'data_binding' in combined_config['obs'][observation]:
            return combined_config['obs'][observation]['data_binding']

        if combined_config['obs'][observation]['observation'] in self.skin_dict["ObservationBindings"]:
            try:
                return self.skin_dict["ObservationBindings"][combined_config['obs'][observation]['observation']]['data_binding']
            except KeyError:
                logdbg("No data_binding defined for %s" % observation)

        return search_up(
            self.skin_dict['DisplayOptions']['diagrams']['combined_observations'][combined_key],
            'data_binding',
            self.default_binding
        )

    def get_base_path(self, *args, **kwargs):
        """
        Get the base path + a given path.

        Args:
            path (string): The path

        Returns:
            str: The base path
        """
        path = kwargs.get("path", None)
        base_path = self.skin_dict["Extras"].get("base_path", "/")

        if path is None or path == "/":
            return base_path

        return base_path + path

    def show_yesterday(self):
        if "yesterday" in self.generator_to_date:
            return True

        return False

    def get_context_key_from_time_span(self, start_ts, end_ts):
        """
        Get the context key from a given time span.

        Args:
            start_ts (int): The start timestamp
            end_ts (int): The end timestamp

        Returns:
            str: The context key
        """
        if start_ts == end_ts:
            return "day"

        if end_ts - start_ts <= 86400:
            return "day"

        # Up to 2 weeks.
        if end_ts - start_ts <= 1209600:
            return "week"

        # Up to 3 months.
        if end_ts - start_ts <= 8035200:
            return "month"

        if end_ts - start_ts <= 31536000:
            return "year"

        return "alltime"

    def show_sensor_page(self):
        if "sensor_status" in self.generator_to_date:
            return True

        return False

    def show_cmon_page(self):
        if "computer_monitor" in self.generator_to_date:
            return True

        return False

    def get_time_format_dict(self):
        return self.time_format

    def get_unit_label(self, unit):
        """
        Get the unit label for a given unit.
        @see https://www.weewx.com/docs/customizing.htm#units

        Args:
            unit (string): The unit

        Returns:
            string: The unit label
        """
        try:
            unit_label = self.generator.formatter.unit_label_dict[unit]
            if type(unit_label) == list:
                # Singular vs Plural label.
                if len(unit_label) == 2:
                    return unit_label[1]
                else:
                    return unit_label[0]
            else:
                return unit_label
        except KeyError:
            if unit is not None:
                return ' ' + unit
            else:
                return ''

    def get_unit_for_obs(self, observation, observation_key, context, combined=None, combined_key=None):
        """
        Get the unit for a given observation.

        Args:
            observation (string): The observation
            observation_key (string): The observation key (e.g. outTemp), this
              is only different from observation if it's a custom observation
              from a custom data_biding.
            context (string): The context
            combined (dict): The combined config
            combined_key (string): The combined diagram key

        Returns:
            string: The unit
        """
        # Combined diagram.
        if combined is not None:
            try:
                unit = search_up(self.skin_dict["DisplayOptions"]["diagrams"][context]
                                 ["observations"][combined_key]['obs'][observation], 'unit', None)
            except KeyError:
                unit = None

            if unit is not None:
                return unit

            try:
                unit = search_up(self.skin_dict["DisplayOptions"]["diagrams"]
                                 ["combined_observations"][combined_key]['obs'][observation], 'unit', None)
            except KeyError:
                unit = None

            if unit is not None:
                return unit

        # Context.
        try:
            unit = self.skin_dict["DisplayOptions"]["diagrams"][context]["observations"][observation]['unit']
        except KeyError:
            unit = None

        if unit is not None:
            return unit

        try:
            return self.skin_dict["DisplayOptions"]["diagrams"][observation]["unit"]
        except KeyError:
            unit = self.generator.converter.getTargetUnit(
                obs_type=observation_key)
            return unit[0]

    def get_windrose_enabled(self):
        """
        Check if the windrose is enabled.

        Returns:
            bool: True if the windrose is enabled, False otherwise.
        """
        try:
            windrose_day_enabled = False
            if "windRose" in self.skin_dict["DisplayOptions"]["diagrams"]["day"]["observations"]:
                windrose_day_enabled = True
        except KeyError:
            windrose_day_enabled = False

        try:
            windrose_week_enabled = False
            if "windRose" in self.skin_dict["DisplayOptions"]["diagrams"]["week"]["observations"]:
                windrose_week_enabled = True
        except KeyError:
            windrose_week_enabled = False

        try:
            windrose_month_enabled = False
            if "windRose" in self.skin_dict["DisplayOptions"]["diagrams"]["month"]["observations"]:
                windrose_month_enabled = True
        except KeyError:
            windrose_month_enabled = False

        try:
            windrose_year_enabled = False
            if "windRose" in self.skin_dict["DisplayOptions"]["diagrams"]["year"]["observations"]:
                windrose_year_enabled = True
        except KeyError:
            windrose_year_enabled = False

        try:
            windrose_alltime_enabled = False
            if "windRose" in self.skin_dict["DisplayOptions"]["diagrams"]["alltime"]["observations"]:
                windrose_alltime_enabled = True
        except KeyError:
            windrose_alltime_enabled = False

        return windrose_day_enabled or windrose_week_enabled or windrose_month_enabled or windrose_year_enabled or windrose_alltime_enabled

    def get_icon(self, observation, use_diagram_config=False, use_combined_diagram_config=False, context=None):
        """
        Returns an include path for an icon based on the observation
        # @see https://www.weewx.com/docs/customizing.htm#units
        # @see https://carbondesignsystem.com/guidelines/icons/library/

        Args:
            observation (string): The observation
            use_diagram_config (bool): Use the diagram config
            use_combined_diagram_config (bool): Use the combined diagram config
            context (string): The context

        Returns:
            str: An icon include path | 'none' | 'unset'
        """
        icon_path = "includes/icons/"

        if use_diagram_config and context is not None:
            try:
                icon = self.generator.skin_dict['DisplayOptions']['diagrams'][context]['observations'][observation]['icon']
            except KeyError:
                icon = False

            if icon or icon == 'none':
                return icon

            try:
                icon = self.generator.skin_dict['DisplayOptions']['diagrams'][observation]['icon']
            except KeyError:
                icon = False

            if icon or icon == 'none':
                return icon

        if use_combined_diagram_config and context is not None:
            try:
                icon = self.generator.skin_dict['DisplayOptions']['diagrams'][context]['observations'][observation]['icon']
            except KeyError:
                icon = False

            if icon and icon != 'none':
                return icon

            if icon and icon == 'none':
                return 'unset'

            try:
                icon = self.generator.skin_dict['DisplayOptions']['diagrams']['combined_observations'][observation]['icon']
            except KeyError:
                icon = False

            if icon and icon != 'none':
                return icon

            if icon and icon == 'none':
                return 'unset'

        try:
            icon_config = self.generator.skin_dict['DisplayOptions']['Icons'].get(
                observation, None)
        except KeyError:
            icon_config = None

        if icon_config is not None:
            return icon_config

        # Default icon set
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

        elif (
                observation == "no2"
                or observation == "pm1_0"
                or observation == "pm2_5"
                or observation == "pm10_0"
        ):
            return icon_path + "mask.svg"

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

        elif observation == "dewpoint" or observation == "dewpoint1" or observation == 'inDewpoint':
            return icon_path + "dew-point.svg"

        elif observation == "windchill":
            return icon_path + "wind-chill.svg"

        elif observation == "heatindex" or observation == "heatindex1" or observation == 'humidex' or observation == 'humidex1':
            return icon_path + "heat-index.svg"

        elif observation == "UV":
            return icon_path + "uv.svg"

        elif observation == "ET":
            return icon_path + "et.svg"

        elif observation == "noise":
            return icon_path + "noise.svg"

        elif observation == "forecast":
            return icon_path + "forecast.svg"

        elif observation == "radiation" or observation == 'luminosity' or observation == 'maxSolarRad' or observation == 'sunshineDur':
            return icon_path + "radiation.svg"

        elif observation == "appTemp" or observation == "appTemp1":
            return icon_path + "app-temp.svg"

        elif observation == "cloudbase":
            return icon_path + "cloud-base.svg"

        elif observation == "snowDepth":
            return icon_path + "snow-depth.svg"

        elif observation == "snowMoisture":
            return icon_path + "snow-moist.svg"

        elif observation == "windrun":
            return icon_path + "wind-run.svg"

        elif observation == "snow" or observation == "snowRate":
            return icon_path + "snow.svg"

        elif observation == "hail" or observation == "hailRate":
            return icon_path + "hail.svg"

        elif observation == 'cloudcover':
            return icon_path + "forecast/B2.svg"

        elif "leaf" in observation:
            return icon_path + "leaf.svg"

        elif "signal" in observation or observation == "rxCheckPercent":
            return icon_path + "signal.svg"

        elif "Voltage" in observation:
            return icon_path + "voltage.svg"

        elif "batterystatus" in observation.lower() or "batteryvoltage" in observation.lower():
            return icon_path + "battery.svg"

        elif 'lightning' in observation:
            return icon_path + "lightning.svg"

        elif "soilMoist" in observation:
            return icon_path + "soil-moist.svg"

        elif "soilTemp" in observation:
            return icon_path + "soil-temp.svg"

        elif "Temp" in observation:
            return icon_path + "temp.svg"

        elif "Humid" in observation:
            return icon_path + "humidity.svg"

        return 'none'

    def get_color(self, observation, context, *args, **kwargs):
        """
        Color settings for observations.

        Args:
            observation (string): The observation
            context (string): The context

        Returns:
            str: A color string
        """
        diagrams_config = self.skin_dict["DisplayOptions"]["diagrams"]

        combined = kwargs.get("combined", False)
        combined_obs = kwargs.get("combined_obs", None)
        combined_obs_key = kwargs.get("combined_obs_key", None)

        try:
            color = search_up(
                diagrams_config[context]["observations"][observation], "color", None)
            if color is not None:
                return color
        except KeyError:
            try:
                color = search_up(diagrams_config[context], "color", None)
                if color is not None:
                    return color
            except KeyError:
                color = None

        # For combined diagrams, observation = temp_min_max_avg
        # and combined_obs = outTemp, combined_obs_key = outTemp_max
        if combined and combined_obs_key is not None and combined_obs is not None:
            try:
                color = search_up(
                    diagrams_config[context]["observations"][combined_obs], "color", None)

                if color is not None:
                    return color
            except KeyError:
                color = None

            try:
                color = search_up(
                    diagrams_config["combined_observations"][observation]["obs"][combined_obs_key], "color", None)

                if color is not None:
                    return color
            except KeyError:
                color = None

            try:
                color = diagrams_config[combined_obs]["color"]

                if color is not None:
                    return color
            except KeyError:
                color = None

        if color is not None:
            return color

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

        if "temp" in observation.lower():
            return "#8B0000"

        return "#161616"

    @ staticmethod
    def get_time_span_from_context(context, day, week, month, year, alltime, yesterday):
        """
        Get tag for use in templates.

        Args:
            context (string): The time range
            day: Daily TimeSpanBinder
            week: Weekly TimeSpanBinder
            month: Monthly TimeSpanBinder
            year: Yearly TimeSpanBinder
            alltime: Alltime TimeSpanBinder
            yesterday: Yesterday TimeSpanBinder

        Returns:
            obj: TimeSpanBinder
        """
        if context == "day":
            return day

        if context == "week":
            return week

        if context == "month":
            return month

        if context == "year":
            return year

        if context == "alltime":
            return alltime

        if context == "yesterday":
            return yesterday

    def get_static_pages(self):
        """
        Get static pages.

        Returns:
            list: Static pages array
        """
        try:
            static_templates = self.skin_dict["CheetahGenerator"]["Static"]
        except KeyError:
            static_templates = {}

        static_pages = []

        for static_page in static_templates:
            static_pages.append(
                {
                    "name": static_page,
                    "title": static_templates[static_page]["title"],
                    "link": static_templates[static_page]["template"].replace(
                        ".tmpl", ""
                    ),
                }
            )

        return static_pages

    def get_static_page_title(self, page):
        """
        Get static page title.

        Args:
            page (string): The page

        Returns:
            str: The page title
        """
        static_pages = self.get_static_pages()

        for static_page in static_pages:
            if static_page["name"] == page:
                return static_page["title"]

        return ''

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

    def dwd_warning_has_warning(self, region_key):
        """
        Check if a given warning is empty.

        Args:
            region_key (string): The region key

        Returns:
            bool: True if a warning exists, False otherwise.
        """
        if not os.path.exists("dwd/warn-" + region_key + ".json"):
            return False

        with open("dwd/warn-" + region_key + ".json", "r") as warn_file:
            data = json.load(warn_file)

        if len(data) == 0:
            return False

        return True

    def get_dwd_warning_region_name(self, region_key):
        """
        Get the name of a given region.

        Args:
            region_key (string): The region key

        Returns:
            str: The region name
        """
        if not os.path.exists("dwd/warn-" + region_key + ".json"):
            return ""

        with open("dwd/warn-" + region_key + ".json", "r") as warn_file:
            data = json.load(warn_file)

            return data[0]["regionName"]

    def get_dwd_warnings(self):
        """
        Get the configured warn regions for weewx-DWD from weewx.conf.
        """
        try:
            dwd_warnings = self.generator.config_dict["DeutscherWetterdienst"]["warning"]
            return {**dwd_warnings.get("counties", {}), **dwd_warnings.get("cities", {})}

        # todo Log info.
        except KeyError:
            return {}


class WdcArchiveUtil(SearchList):
    def get_day_archive_enabled(self):
        """
        Get day archive enabled.

        Returns:
            bool|string: Value of day template if day archive is enabled, False otherwise.
        """
        try:
            return self.generator.skin_dict["CheetahGenerator"]["SummaryByDay"]["summary_day"]["template"]
        except KeyError:
            return False

    @staticmethod
    def get_archive_days_array(start_ts, end_ts, date_format):
        """
        Get an array of days between two timestamps.

        Args:
            start_ts (int): The start timestamp
            end_ts (int): The end timestamp
            date_format (string): The date format

        Returns:
            list: Array of days
        """
        days = []
        start_date = datetime.datetime.fromtimestamp(start_ts)
        end_date = datetime.datetime.fromtimestamp(end_ts)

        for n in range(int((end_date - start_date).days) + 1):
            days.append(
                {
                    "date": (start_date + datetime.timedelta(n)).strftime(date_format),
                    "timestamp": int(
                        time.mktime(
                            (start_date + datetime.timedelta(n)).timetuple())
                    ),
                }
            )

        return days

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
                return "includes/icons/radiation.svg"

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

    def get_diagram_data(
        self,
        observation,
        observation_key,
        context_key,
        start_ts,
        end_ts,
        data_binding,
        alltime_start,
        alltime_end,
        combined=None,
        combined_key=None,
    ):
        """
        Get diagram data.

        Args:
            observation (string): The observation
            observation_key (string): The observation key, this is only
              different from observation if it's a custom observation from
              a custom data_biding.
            context_key (string): The context key
            start_ts (int): The start timestamp
            end_ts (int): The end timestamp
            data_binding (string): The data binding
            alltime_start (str): The alltime start (%d.%m.%Y)
            alltime_end (str): The alltime end (%d.%m.%Y)
            combined (dict|None): The combined obs dict
            combined_key (string|None): The combined key

        Returns:
            list: A list of diagram data
        """
        if combined is not None:
            aggregate_type = self.get_aggregate_type(
                observation, context_key, combined=combined['obs'][observation])
        else:
            aggregate_type = self.get_aggregate_type(
                observation, context_key
            )

        if (observation_key == 'windDir'):
            wobs = "wind"
        else:
            wobs = observation_key

        # Include any given config to the XType call.
        obs_props = self.get_diagram_props_obs(
            observation, context_key, combined_key=combined_key)
        if 'aggregate_type' in obs_props:
            obs_props.pop("aggregate_type")
        if 'aggregate_interval' in obs_props:
            obs_props.pop("aggregate_interval")
        if 'observations' in obs_props:
            obs_props.pop('observations')

        obs_start_vt, obs_stop_vt, obs_vt = weewx.xtypes.get_series(
            wobs,
            TimeSpan(start_ts, end_ts),
            self.generator.db_binder.get_manager(data_binding),
            aggregate_type=aggregate_type,
            aggregate_interval=self.get_aggregate_interval(
                observation=observation, context=context_key,
                alltime_start=alltime_start, alltime_end=alltime_end,
                combined_key=combined_key
            ),
            **obs_props
        )

        unit_default = self.generator.converter.getTargetUnit(
            obs_type=observation_key)
        unit_configured = self.general_util.get_unit_for_obs(
            observation, observation_key, context_key,
            combined=combined, combined_key=combined_key)

        # Target unit conversion.
        if unit_default != unit_configured and unit_configured is not None:
            obs_vt = weewx.units.Converter(
                {obs_vt[2]: unit_configured}).convert(obs_vt)
        else:
            obs_vt = self.generator.converter.convert(obs_vt)

        # Round values.
        obs_vt = rounder(
            obs_vt,
            self.get_rounding(
                observation,
                observation_key,
                type="diagram",
                combined=combined,
                combined_key=combined_key,
                context=context_key)
        )

        return json.dumps(list(
            zip(obs_start_vt[0], obs_stop_vt[0], obs_vt[0]))
        )

    def get_diagram(self, observation, context_key, *args, **kwargs):
        """
        Choose between line and bar.

        Args:
            observation (string): The observation
            context_key (string): The context

        Returns:
            str: A diagram string
        """
        combined_key = kwargs.get("combined_key", None)
        combined_obs = kwargs.get("combined_obs", None)

        type = "line"
        if observation == "rain" or observation == "ET":
            type = "bar"

        try:
            type = self.skin_dict["DisplayOptions"]["diagrams"][observation]["type"]
        except KeyError:
            pass

        if combined_key is None:
            try:
                type = self.skin_dict["DisplayOptions"]["diagrams"][context_key]["observations"][observation]["type"]
            except KeyError:
                pass

        if combined_key is not None:
            try:
                type = self.skin_dict["DisplayOptions"]["diagrams"]["combined_observations"][combined_key]["obs"][combined_obs]["type"]
            except KeyError:
                pass

            try:
                type = self.skin_dict["DisplayOptions"]["diagrams"][context_key][
                    "observations"][combined_key]["obs"][combined_obs]["type"]
            except KeyError:
                pass

        return type

    def get_aggregate_type(self, observation, context, *args, **kwargs):
        """
        aggregate_type for observations series.
        @see https://github.com/weewx/weewx/wiki/Tags-for-series#syntax

        @todo Rework/Fix use_defaults (currently used for tables)

        Args:
            observation (string): The observation
            context (string): The context

        Returns:
            string: aggregate_type
        """
        use_defaults = kwargs.get("use_defaults", False)
        combined = kwargs.get("combined", None)
        diagrams_config = self.skin_dict["DisplayOptions"]["diagrams"]

        try:
            aggregate_type = search_up(
                diagrams_config[context]["observations"][observation], "aggregate_type", None)
        except KeyError:
            aggregate_type = None

        if aggregate_type is not None:
            return aggregate_type

        if combined is not None and "aggregate_type" in combined and not use_defaults:
            return combined["aggregate_type"]

        if (
                not use_defaults
                and observation in diagrams_config
                and "aggregate_type" in diagrams_config[observation]
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

        if observation == "windDir":
            return "vecdir"

        return "avg"

    def get_aggregate_interval(self, observation, context, *args, **kwargs):
        """
        aggregate_interval for observations series.
        @see https://github.com/weewx/weewx/wiki/Tags-for-series#syntax

        Args:
            observation (string): The observation
            context (string): Day, week, month, year, alltime

        Returns:
            int: aggregate_interval
        """
        alltime_start = kwargs.get("alltime_start", None)
        alltime_end = kwargs.get("alltime_end", None)
        combined_key = kwargs.get("combined_key", None)

        if context == "yesterday":
            context = "day"

        # First, check combined obs.
        if combined_key is not None:
            try:
                aggregate_interval = self.generator.skin_dict["DisplayOptions"]["diagrams"][
                    context]["observations"][combined_key]["obs"][observation]["aggregate_interval"]
                return aggregate_interval
            except KeyError:
                aggregate_interval = False

            try:
                aggregate_interval = self.generator.skin_dict["DisplayOptions"]["diagrams"][
                    context]["observations"][combined_key]["aggregate_interval"]
                return aggregate_interval
            except KeyError:
                aggregate_interval = False

            try:
                aggregate_interval = self.generator.skin_dict["DisplayOptions"]["diagrams"][
                    "combined_observations"][combined_key]["obs"][observation]["aggregate_interval"]
                return aggregate_interval
            except KeyError:
                aggregate_interval = False

            try:
                aggregate_interval = self.generator.skin_dict["DisplayOptions"]["diagrams"][
                    "combined_observations"][combined_key]["aggregate_interval"]
                return aggregate_interval
            except KeyError:
                aggregate_interval = False

        # Check if something is configured via skin.conf.
        context_dict = self.generator.skin_dict["DisplayOptions"]["diagrams"].get(
            context, {})
        try:
            aggregate_interval = search_up(
                context_dict['observations'][observation], 'aggregate_interval')
        except KeyError:
            try:
                aggregate_interval = search_up(
                    context_dict, 'aggregate_interval', False)
            except (KeyError, AttributeError):
                aggregate_interval = False
        except AttributeError:
            aggregate_interval = False

        if aggregate_interval:
            return aggregate_interval

        # Then, use defaults.
        if context == "day":
            if observation == "ET" or observation == "rain":
                return 7200  # 2 hours

            return 1800  # 30 minutes

        if context == "week":
            if observation == "ET" or observation == "rain":
                return 3600 * 24  # 1 day

            return 900 * 8  # 2 hours

        if context == "month":
            if observation == "ET" or observation == "rain":
                return 3600 * 48  # 2 days

            return 900 * 24  # 6 hours

        if context == "year":
            if observation == "ET" or observation == "rain":
                return 3600 * 432  # 8 days

            return 3600 * 48  # 2 days

        if context == "alltime":
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

    def get_diagram_props(self, obs, context):
        """
        Get diagram props from skin.conf.

        Args:
            obs (string): Observation
            context (string): Day, week, month, year, alltime

        Returns:
            dict: Diagram props for d3.js.
        """
        if context == "yesterday":
            context = "day"

        diagrams_config = self.skin_dict["DisplayOptions"]["diagrams"]
        diagram_base_props = diagrams_config[self.get_diagram(obs, context)]

        try:
            diagram_context_props = accumulateLeaves(
                diagrams_config[context]['observations'][obs], max_level=3)
        except KeyError:
            try:
                diagram_context_props = accumulateLeaves(
                    diagrams_config[context]['observations'], max_level=2)
            except KeyError:
                diagram_context_props = {}

        if obs in diagrams_config:
            return {
                **diagram_base_props,
                **diagrams_config[obs],
                **diagram_context_props
            }
        elif obs in diagrams_config["combined_observations"]:
            if context in diagrams_config and 'observations' in diagrams_config[context] and obs in diagrams_config[context]['observations']:
                return {
                    **diagram_base_props,
                    **diagrams_config["combined_observations"][obs],
                    **diagram_context_props,
                }
            else:
                return {
                    **diagram_base_props,
                    **diagrams_config["combined_observations"][obs],
                }
        else:
            return {
                **diagram_base_props,
                **diagram_context_props
            }

    def get_diagram_props_obs(self, observation, context, *args, **kwargs):
        """
        Same as get_diagram_props, but for specific observations. Returns
        the values in [combined_observations][X][observations][obs]
        instead of [combined_observations][X].

        Args:
            observation (string): The observation
            context (string): Day, week, month, year, alltime

        Returns:
            dict: A dict of props
        """
        combined_key = kwargs.get("combined_key", None)

        if context == "yesterday":
            context = "day"

        # Most basic config.
        try:
            props = self.skin_dict["DisplayOptions"]["diagrams"][observation]
        except KeyError:
            props = {}

        # Context config.
        try:
            props_context = accumulateLeaves(self.skin_dict["DisplayOptions"]["diagrams"][context][
                "observations"][observation], 3)
        except KeyError:
            props_context = self.skin_dict["DisplayOptions"]["diagrams"][context]
        finally:
            props = {**props, **props_context}

        # Combined config.
        if combined_key is not None:
            try:
                combined_props = accumulateLeaves(self.skin_dict["DisplayOptions"]["diagrams"][
                    "combined_observations"][combined_key]["obs"][observation], 3)
            except KeyError:
                combined_props = self.skin_dict["DisplayOptions"]["diagrams"][
                    "combined_observations"][combined_key]
            finally:
                props = {**props, **combined_props}

            try:
                props_context_obs = accumulateLeaves(self.skin_dict["DisplayOptions"]["diagrams"][
                    context]["observations"][combined_key]["obs"][observation], 3)
            except KeyError:
                try:
                    props_context_obs = self.skin_dict["DisplayOptions"]["diagrams"][
                        context]["observations"][combined_key]
                except KeyError:
                    props_context_obs = {}
            finally:
                props = {**props, **props_context_obs}

        return props

    def get_diagram_boundary(self, context):
        """
        boundary for observations series for diagrams.

        Args:
            context (string): Day, week, month, year, alltime

        Returns:
            string: None | 'midnight'
        """
        try:
            aggregate_interval_s = self.generator.skin_dict[
                "DisplayOptions"]["diagrams"][context]["aggregate_interval"]
            return "midnight" if (to_int(aggregate_interval_s) / 60 / 60) % 24 == 0 else None
        except KeyError:
            if context == "day":
                return None

            if context == "week":
                return None

            if context == "month":
                return None

            if context == "year" or context == "alltime":
                return "midnight"

    def get_rounding(self, observation, observation_key, type=None, context=None, combined=None, combined_key=None):
        """
        Rounding settings for observations.

        Args:
            observation (string): The observation
            observation_key (string): The observation key (e.g. outTemp), this
              is only different from observation if it's a custom observation
              from a custom data_biding.
            type (string): The type (table or diagram)
            context (string): The context
            combined (dict): The combined dict
            combined_key (string): The combined key

        Returns:
            int: A rounding
        """
        # Context.
        if context is not None:
            try:
                rounding = search_up(
                    self.generator.skin_dict["DisplayOptions"]['diagrams'][context]['observations'][observation_key], 'rounding', None)
            except KeyError:
                rounding = None

            if rounding is not None:
                return int(rounding)

        # Combined context.
        if combined is not None and context is not None:
            # Combined diagram.
            try:
                rounding = search_up(self.skin_dict["DisplayOptions"]["diagrams"][context]
                                     ["observations"][combined_key]['obs'][observation], 'rounding', None)
            except KeyError:
                rounding = None

            if rounding is not None:
                return int(rounding)

        # Combined obs.
        if combined is not None and "rounding" in combined['obs'][observation]:
            return int(combined['obs'][observation]["rounding"])

        # Combined general.
        if combined is not None and "rounding" in combined:
            return int(combined["rounding"])

        # Table specific.
        if type == 'table':
            # DisplayOptions > tables > Rounding.
            try:
                rounding = self.skin_dict["DisplayOptions"]['tables']["Rounding"][observation_key]
            except KeyError:
                rounding = None

            if rounding is not None:
                return int(rounding)

        # Diagram specific.
        if type == 'diagram':
            # General Diagram options, e.g. DisplayOptions > diagrams > heatindex.
            try:
                rounding = self.skin_dict["DisplayOptions"]['diagrams'][observation_key]['rounding']
            except KeyError:
                rounding = None

            if rounding is not None:
                return int(rounding)

            # DisplayOptions > diagrams > Rounding.
            try:
                rounding = self.skin_dict["DisplayOptions"]['diagrams']["Rounding"][observation_key]
            except KeyError:
                rounding = None

            if rounding is not None:
                return int(rounding)

        # DisplayOptions > Rounding.
        try:
            rounding = self.skin_dict["DisplayOptions"]["Rounding"][
                observation_key]
        except KeyError:
            rounding = None

        unit = self.general_util.get_unit_for_obs(
            observation, observation_key, context)

        # Fallback to a simple string parsing of [[StringFormats]].
        if rounding is None:
            try:
                unit_string_format = self.skin_dict["Units"]["StringFormats"][unit]

                # Careful! Potential for bugs here.
                for c in unit_string_format:
                    if c.isdigit():
                        rounding = c
                        break
            except KeyError:
                rounding = None

        if rounding is not None:
            return int(rounding)

        # Default roundings.
        if context is None:
            context = 'day'

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

        if unit == 'percent':
            return 0

        return 1

    @ staticmethod
    def get_hour_delta(context):
        """
        Get delta for $span($hour_delta=$delta) call.

        Args:
            context (string): Day, week, month, year, alltime

        Returns:
            float: A delta
        """
        now_dt = datetime.datetime.now()

        hour_delta = 24

        if context == "week":
            hour_delta = 24 * 7

        if context == "month":
            hour_delta = 24 * 30  # monthrange(now_dt.year, now_dt.month)[1]

        if context == "year":
            days = 366 if calendar.isleap(now_dt.year) else 365
            hour_delta = 24 * days

        return hour_delta

    def get_gauge_diagram_props(self, obs, context):
        """
        Get gauge props from skin.conf.

        Args:
            obs (string): Observation
            context (string): Day, week, month, year, alltime

        Returns:
            dict: Diagram props for d3.js.
        """
        if context == "yesterday":
            context = "day"

        diagrams_config = self.skin_dict["DisplayOptions"]["Gauges"][context][obs]

        return accumulateLeaves(diagrams_config, max_level=2)

    def get_gauge_diagram_prop(self, obs, prop, context):
        """
        Get gauge prop from skin.conf.

        Args:
            obs (string): Observation
            prop (string): Prop
            context (string): Day, week, month, year, alltime

        Returns:
            sring|number: Diagram prop for d3.js.
        """
        if context == "yesterday":
            context = "day"

        diagrams_config = self.skin_dict["DisplayOptions"]["Gauges"][context][obs]

        value = search_up(diagrams_config, prop, None)

        return value

    def get_windrose_data(self, start_ts, end_ts, context):
        """
        Get data for rendering wind rose in JS.

        start_ts (Timestamp): Start timestamp
        end_ts (Timestamp): End timestamp
        context (string): One of day, week, month, year

        Returns:
            list: Windrose data.
        """
        try:
            show_beaufort = self.generator.skin_dict["DisplayOptions"]["windRose_show_beaufort"]
        except KeyError:
            show_beaufort = False

        db_manager = self.generator.db_binder.get_manager(
            data_binding=search_up(
                self.generator.config_dict["StdReport"]["WdcReport"], "data_binding", "wx_binding"))

        ordinals = self.general_util.get_ordinates()
        windrose_data = []

        # Remove "N/A" from ordinals.
        if len(ordinals) == 17:
            ordinals.pop()

        # We use a scale of 6: <=BF1, BF2, ..., BF5, >=BF6.
        for i in range(6):
            name_prefix = "<= " if i == 0 else ">= " if i == 5 else ""

            if to_bool(show_beaufort):
                name = "Beaufort " + str(i + 1)
            else:
                # Bft 1 and lower
                if i == 0:
                    wind_upper_vt = self.generator.converter.convert(
                        (5, "km_per_hour", "group_speed"))
                    name = ValueHelper(
                        value_t=wind_upper_vt, formatter=self.generator.formatter).format()
                # Bft 2
                elif i == 1:
                    wind_lower_vt = self.generator.converter.convert(
                        (6, "km_per_hour", "group_speed"))
                    wind_upper_vt = self.generator.converter.convert(
                        (11, "km_per_hour", "group_speed"))
                    name = ValueHelper(value_t=wind_lower_vt,
                                       formatter=self.generator.formatter).format(
                    ) + " - " + ValueHelper(value_t=wind_upper_vt,
                                            formatter=self.generator.formatter).format()
                # Bft 3
                elif i == 2:
                    wind_lower_vt = self.generator.converter.convert(
                        (12, "km_per_hour", "group_speed"))
                    wind_upper_vt = self.generator.converter.convert(
                        (19, "km_per_hour", "group_speed"))
                    name = ValueHelper(value_t=wind_lower_vt,
                                       formatter=self.generator.formatter).format(
                    ) + " - " + ValueHelper(value_t=wind_upper_vt,
                                            formatter=self.generator.formatter).format()
                # Bft 4
                elif i == 3:
                    wind_lower_vt = self.generator.converter.convert(
                        (20, "km_per_hour", "group_speed"))
                    wind_upper_vt = self.generator.converter.convert(
                        (28, "km_per_hour", "group_speed"))
                    name = ValueHelper(value_t=wind_lower_vt,
                                       formatter=self.generator.formatter).format(
                    ) + " - " + ValueHelper(value_t=wind_upper_vt,
                                            formatter=self.generator.formatter).format()
                # Bft 5
                elif i == 4:
                    wind_lower_vt = self.generator.converter.convert(
                        (29, "km_per_hour", "group_speed"))
                    wind_upper_vt = self.generator.converter.convert(
                        (38, "km_per_hour", "group_speed"))
                    name = ValueHelper(value_t=wind_lower_vt,
                                       formatter=self.generator.formatter).format(
                    ) + " - " + ValueHelper(value_t=wind_upper_vt,
                                            formatter=self.generator.formatter).format()
                # Bft 6 and higher
                elif i == 5:
                    wind_lower_vt = self.generator.converter.convert(
                        (39, "km_per_hour", "group_speed"))
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
            "wind",
            TimeSpan(start_ts, end_ts),
            db_manager,
            aggregate_type="vecdir",
            aggregate_interval=self.get_aggregate_interval(
                observation="windDir", context=context
            )
        )

        windSpeed_start_vt, windSpeed_stop_vt, windSpeed_vt = weewx.xtypes.get_series(
            "windSpeed",
            TimeSpan(start_ts, end_ts),
            db_manager,
            aggregate_type="max",
            aggregate_interval=self.get_aggregate_interval(
                observation="windSpeed", context=context
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

        if num_of_values > 0:
            for index, data in enumerate(windrose_data):
                for p_index, percent in enumerate(data["r"]):
                    windrose_data[index]["r"][p_index] = round(
                        # todo: division by zero
                        (percent / num_of_values) * 100
                    )

        return windrose_data


class WdcStatsUtil(SearchList):
    def __init__(self, generator):
        SearchList.__init__(self, generator)
        self.unit = UnitInfoHelper(generator.formatter, generator.converter)
        self.obs = ObsInfoHelper(generator.skin_dict)
        self.diagram_util = WdcDiagramUtil(generator)

        # Setup database manager
        binding = search_up(
            self.generator.config_dict["StdReport"]["WdcReport"], "data_binding", "wx_binding")

        self.db_manager = self.generator.db_binder.get_manager(binding)

    def get_show_min(self, observation):
        """
        Returns if the min stats should be shown.

        Args:
            observation (string): The observation

        Returns:
            bool: Show or hide min stat.
        """
        show_min = self.generator.skin_dict['DisplayOptions'].get(
            'stat_tiles_show_min',
            [
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
        )

        if observation in show_min:
            return True

    def get_show_sum(self, observation):
        """
        Returns if the sum stats should be shown.

        Args:
            observation (string): The observation

        Returns:
            bool: Show or hide sum stat.
        """
        show_sum = self.generator.skin_dict['DisplayOptions'].get(
            'stat_tiles_show_sum',
            ["rain", "ET", "hail", "snow", "lightning_strike_count"]
        )

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
        show_max = self.generator.skin_dict['DisplayOptions'].get(
            'stat_tiles_show_max',
            ["rainRate", "hailRate", "snowRate", "UV"]
        )

        if observation in show_max:
            return True

    @ staticmethod
    def get_labels(prop, context):
        """
        Returns a label like "Todays Max" or "Monthly average".

        Args:
            prop (string): Min, Max, Sum
            context (string): Day, week, month, year, alltime

        Returns:
            string: A label.
        """
        if context == "alltime":
            return prop

        return prop + " " + context

    def get_climatological_day(self, day, start_ts, end_ts):
        """
        Return number of days in period for day parameter.

        Args:
            day (string): Eg. rainDays, hotDays.
            start_ts (str): Start timestamp.
            end_ts (str): End timestamp

        Returns:
            int: Number of days.
        """
        outTemp_target_unit_vt = self.generator.converter.getTargetUnit(
            "outTemp")
        windGust_target_unit_vt = self.generator.converter.getTargetUnit(
            "windGust")
        freezing_point = 0.0 if outTemp_target_unit_vt[0] == "degree_C" else 32.0

        if day == "iceDays":
            outTemp_max_start_vt, outTemp_max_stop_vt, outTemp_max_vt = weewx.xtypes.get_series(
                "outTemp",
                TimeSpan(start_ts, end_ts),
                self.db_manager,
                aggregate_type="max",
                aggregate_interval="day"
            )

            days = filter(
                lambda outTemp: outTemp is not None and self.generator.converter.convert(
                    (outTemp, outTemp_max_vt[1], outTemp_max_vt[2]))[0] < freezing_point, outTemp_max_vt[0]
            )

            return len(list(days))

        if day == "frostDays":
            outTemp_min_start_vt, outTemp_min_stop_vt, outTemp_min_vt = weewx.xtypes.get_series(
                "outTemp",
                TimeSpan(start_ts, end_ts),
                self.db_manager,
                aggregate_type="min",
                aggregate_interval="day"
            )

            days = filter(
                lambda outTemp: outTemp is not None and self.generator.converter.convert(
                    (outTemp, outTemp_min_vt[1], outTemp_min_vt[2]))[0] < freezing_point, outTemp_min_vt[0]
            )

            return len(list(days))

        if day == "stormDays":
            windGust_min_start_vt, windGust_min_stop_vt, windGust_max_vt = weewx.xtypes.get_series(
                "windGust",
                TimeSpan(start_ts, end_ts),
                self.db_manager,
                aggregate_type="max",
                aggregate_interval="day"
            )

            if windGust_target_unit_vt[0] in ("km_per_hour", "km_per_hour2"):
                value = 62.0
            if windGust_target_unit_vt[0] in ("mile_per_hour", "mile_per_hour2"):
                value = 38.5
            if windGust_target_unit_vt[0] in ("meter_per_second", "meter_per_second2"):
                value = 17.2

            days = filter(
                lambda windGust: windGust is not None and self.generator.converter.convert(
                    (windGust, windGust_max_vt[1], windGust_max_vt[2]))[0] >= value, windGust_max_vt[0]
            )

            return len(list(days))

        if day == "rainDays":
            rain_sum_start_vt, rain_sum_stop_vt, rain_sum_vt = weewx.xtypes.get_series(
                "rain",
                TimeSpan(start_ts, end_ts),
                self.db_manager,
                aggregate_type="sum",
                aggregate_interval="day"
            )

            days = filter(
                lambda rain: rain is not None and rain > 0.0, list(
                    rain_sum_vt[0])
            )

            return len(list(days))

        if (
                day == "hotDays"
                or day == "summerDays"
                or day == "desertDays"
                or day == "tropicalNights"
        ):

            if day == "tropicalNights":
                value = 20.0 if outTemp_target_unit_vt[0] == "degree_C" else 68.0
                aggregate_type = "min"
            if day == "summerDays":
                value = 25.0 if outTemp_target_unit_vt[0] == "degree_C" else 77.0
                aggregate_type = "max"
            if day == "hotDays":
                value = 30.0 if outTemp_target_unit_vt[0] == "degree_C" else 86.0
                aggregate_type = "max"
            if day == "desertDays":
                value = 35.0 if outTemp_target_unit_vt[0] == "degree_C" else 95.0
                aggregate_type = "max"

            outTemp_start_vt, outTemp_stop_vt, outTemp_vt = weewx.xtypes.get_series(
                "outTemp",
                TimeSpan(start_ts, end_ts),
                self.db_manager,
                aggregate_type=aggregate_type,
                aggregate_interval="day"
            )

            days = filter(
                lambda outTemp: outTemp is not None and self.generator.converter.convert(
                    (outTemp, outTemp_vt[1], outTemp_vt[2]))[0] >= value, outTemp_vt[0]
            )

            return len(list(days))

    def get_climatological_day_description(self, day):
        """
        Return description of day.

        Args:
            day (string): Eg. rainDays, hotDays.

        Returns:
            string: Day description.
        """
        outTemp_target_unit_vt = self.generator.converter.getTargetUnit(
            "outTemp")
        windGust_target_unit_vt = self.generator.converter.getTargetUnit(
            "windGust")

        if day == "iceDays":
            value = "0" if outTemp_target_unit_vt[0] == "degree_C" else "32"

            return (
                self.obs.label["outTemp"]
                + "<sub>max</sub> < "
                + value
                + getattr(self.unit.label, "outTemp")
            )

        if day == "frostDays":
            value = "0" if outTemp_target_unit_vt[0] == "degree_C" else "32"

            return (
                self.obs.label["outTemp"]
                + "<sub>min</sub> < "
                + value
                + getattr(self.unit.label, "outTemp")
            )

        if day == "stormDays":
            if windGust_target_unit_vt[0] == "km_per_hour":
                value = "62"
            if windGust_target_unit_vt[0] == "mile_per_hour":
                value = "38.5"
            if windGust_target_unit_vt[0] == "meter_per_second":
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
                value = "20" if outTemp_target_unit_vt[0] == "degree_C" else "68"
                aggregate_type = "min"
            if day == "summerDays":
                value = "25" if outTemp_target_unit_vt[0] == "degree_C" else "77"
                aggregate_type = "max"
            if day == "hotDays":
                value = "30" if outTemp_target_unit_vt[0] == "degree_C" else "86"
                aggregate_type = "max"
            if day == "desertDays":
                value = "35" if outTemp_target_unit_vt[0] == "degree_C" else "95"
                aggregate_type = "max"

            return (
                self.obs.label["outTemp"]
                + "<sub>"
                + aggregate_type
                + "</sub> ≥ "
                + value
                + getattr(self.unit.label, "outTemp")
            )

    @ staticmethod
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

    def get_calendar_data(self, obs, aggregate_type, start_ts, end_ts):
        """
        Returns array of calendar data for use in diagram.

        Args:
            obs (string): The observation
            aggregate_type (string): Min, max, avg.
            start_ts (int): Start timestamp.
            end_ts (int): End timestamp.

        Returns:
            list: Calendar data.
        """
        if obs == "rain":
            rain_start_vt, rain_stop_vt, rain_vt = weewx.xtypes.get_series(
                "rain",
                TimeSpan(start_ts, end_ts),
                self.db_manager,
                aggregate_type=aggregate_type,
                aggregate_interval="day",
            )

            days = filter(
                lambda x: (x[1] is not None and x[1] > 0.0), list(
                    zip(rain_start_vt[0], rain_vt[0]))
            )
            rain_days = []

            for day in days:
                day_dt = datetime.datetime.fromtimestamp(day[0])
                rain_target_unit_vt = self.generator.converter.convert(
                    (day[1], rain_vt[1], rain_vt[2]))
                rain_days.append(
                    {"value": rounder(rain_target_unit_vt[0], self.diagram_util.get_rounding("rain", "rain")), "day": day_dt.strftime("%Y-%m-%d")})

            return rain_days

        if obs == "outTemp":
            outTemp_start_vt, outTemp_stop_vt, outTemp_vt = weewx.xtypes.get_series(
                "outTemp",
                TimeSpan(start_ts, end_ts),
                self.db_manager,
                aggregate_type=aggregate_type,
                aggregate_interval="day",
            )

            days = list(zip(outTemp_start_vt[0], outTemp_vt[0]))
            temp_days = []

            for day in days:
                if day[1] is not None:
                    day_dt = datetime.datetime.fromtimestamp(day[0])
                    outTemp_target_unit_vt = self.generator.converter.convert(
                        (day[1], outTemp_vt[1], outTemp_vt[2]))
                    temp_days.append(
                        {"value": rounder(outTemp_target_unit_vt[0], self.diagram_util.get_rounding(
                            "outTemp", "outTemp")), "day": day_dt.strftime("%Y-%m-%d")}
                    )

            return temp_days


class WdcTableUtil(SearchList):
    def __init__(self, generator):
        SearchList.__init__(self, generator)
        self.unit = UnitInfoHelper(generator.formatter, generator.converter)
        self.obs = ObsInfoHelper(generator.skin_dict)
        self.diagram_util = WdcDiagramUtil(generator)
        self.general_util = WdcGeneralUtil(generator)

        # Setup database manager
        binding = search_up(
            self.generator.config_dict["StdReport"]["WdcReport"], "data_binding", "wx_binding")

        self.binding = binding
        self.db_manager = self.generator.db_binder.get_manager(binding)

        self.table_obs = self.generator.skin_dict["DisplayOptions"].get(
            "table_tile_observations", {})
        self.table_options = self.generator.skin_dict["DisplayOptions"].get("tables", {
        })

    def get_table_aggregate_interval(self, context):
        """
        aggregate_interval for observations series for tables.

        Args:
            context (string): Day, week, month, year, alltime

        Returns:
            int: aggregate_interval
        """
        if context == "yesterday":
            context = "day"

        try:
            return self.table_options[context]["aggregate_interval"]
        except KeyError:
            if context == "day":
                return 900 * 4  # 1 hours

            if context == "week":
                return 900 * 24  # 6 hours

            if context == "month":
                return 900 * 48  # 12 hours

            if context == "year" or context == "alltime":
                return 3600 * 24  # 1 day

    def get_table_boundary(self, context):
        """
        boundary for observations series for tables.

        Args:
            context (string): Day, week, month, year, alltime

        Returns:
            string: None | 'midnight'
        """
        if context == "yesterday":
            context = "day"

        try:
            aggregate_interval_s = to_int(
                self.table_options[context]["aggregate_interval"])
            return "midnight" if (aggregate_interval_s / 60 / 60) % 24 == 0 else None
        except KeyError:
            if context == "day":
                return None

            if context == "week":
                return None

            if context == "month":
                return None

            if context == "year" or context == "alltime":
                return "midnight"

    def get_table_headers(self, start_ts, end_ts, table_obs=None):
        """
        Returns tableheaders for use in carbon data table.

        Args:
            start_ts (Timestamp): Start timestamp.
            end_ts (Timestamp): End timestamp.
            table_obs (list, optional): List of observations to use. Defaults to None.

        Returns:
            list: Carbon data table headers.
        """
        carbon_headers = [{
            "title": "Time",
            "id": "time",
            "sortCycle": "tri-states-from-ascending",
        }]

        obs = self.table_obs

        if table_obs:
            obs = table_obs

        for observation in obs:
            observation_binding = self.general_util.get_data_binding(
                observation)
            observation_key = self.general_util.get_custom_data_binding_obs_key(
                observation)

            if observation_binding == self.binding:
                db_manager = self.db_manager
            else:
                db_manager = self.generator.db_binder.get_manager(
                    observation_binding)

            if db_manager.has_data(observation_key, TimeSpan(start_ts, end_ts)):
                carbon_header = {
                    "title": self.obs.label[observation],
                    "small": "in " + getattr(self.unit.label, observation_key),
                    "id": observation,
                    "sortCycle": "tri-states-from-ascending",
                }
                carbon_headers.append(carbon_header)

        return carbon_headers

    def get_table_rows(self, start_ts, end_ts, context, table_obs=None):
        """
        Returns table values for use in carbon data table.

        Args:
            start_ts (Timestamp): Start timestamp.
            end_ts (Timestamp): End timestamp.
            context (string): Day, week, month, year, alltime
            table_obs (list|None): List of observations to include in table.

        Returns:
            list: Carbon data table rows.
        """
        carbon_values = []

        # The aggregate_interval should be the multiple of a day for these contexts, so
        # we need to adjust the start and end timestamps to the start of the day.
        # This would otherwise generate table rows with different start timestamps, actually
        # it puts the windDir (wind) values sometimes in a new row.
        if context == 'year' or context == 'alltime':
            start_ts = startOfArchiveDay(start_ts)
            end_ts = startOfArchiveDay(end_ts)

        obs = self.table_obs

        if table_obs:
            obs = table_obs

        for observation in obs:
            observation_binding = self.general_util.get_data_binding(
                observation)
            observation_key = self.general_util.get_custom_data_binding_obs_key(
                observation)

            if observation_binding == self.binding:
                db_manager = self.db_manager
            else:
                db_manager = self.generator.db_binder.get_manager(
                    observation_binding)

            if db_manager.has_data(observation_key, TimeSpan(start_ts, end_ts)):
                if observation_key == 'windDir':
                    wobs = 'wind'
                else:
                    wobs = observation_key

                series_start_vt, series_stop_vt, observation_vt = weewx.xtypes.get_series(
                    wobs,
                    TimeSpan(start_ts, end_ts),
                    db_manager,
                    aggregate_type=self.diagram_util.get_aggregate_type(
                        observation, context, use_defaults=True
                    ),
                    aggregate_interval=self.get_table_aggregate_interval(
                        context=context
                    )
                )

                for table_start_ts, table_stop_ts, table_data in zip(
                        series_start_vt[0],
                        series_stop_vt[0],
                        observation_vt[0]
                ):
                    if context == "alltime" or context == "year":
                        # We show the date only here, so we need the start of the day.
                        cs_time_dt = datetime.datetime.fromtimestamp(
                            table_start_ts)
                    else:
                        cs_time_dt = datetime.datetime.fromtimestamp(
                            table_stop_ts)

                    # The current series item by time.
                    cs_item = list(
                        filter(
                            lambda x: (
                                x["time"] == cs_time_dt.isoformat()), carbon_values
                        )
                    )

                    table_date_target_unit = self.generator.converter.convert((
                        table_data,
                        observation_vt[1],
                        observation_vt[2])
                    )

                    table_data_rounded = rounder(table_date_target_unit[0],
                                                 self.diagram_util.get_rounding(observation, observation, type="table"))

                    if len(cs_item) == 0:
                        carbon_values.append(
                            {
                                "time": cs_time_dt.isoformat(),
                                observation: table_data_rounded,
                                "id": table_start_ts,
                            }
                        )
                    else:
                        cs_item = cs_item[0]
                        cs_item_index = carbon_values.index(cs_item)
                        cs_item[observation] = table_data_rounded if table_data_rounded is not None else "-"
                        carbon_values[cs_item_index] = cs_item

        # Sort per time
        carbon_values.sort(
            key=lambda item: datetime.datetime.fromisoformat(item["time"]))

        return carbon_values


class WdcForecastUtil(SearchList):
    def __init__(self, generator):
        try:
            from user.forecast import ForecastVariables

            SearchList.__init__(self, generator)
            self.forecast = ForecastVariables(generator)
            try:
                self.forecast_source = generator.skin_dict["Extras"][
                    "forecast_table_settings"
                ]["source"]
            except KeyError:
                logdbg("forecast_table_settings.source not found in skin.conf")

        except ImportError:
            logdbg(
                "weewx-forecast extension is not installed. Not providing any forecast data.")

    def get_day_icon(self, summary, hourly=False):
        """
        Returns the icon for the day (summary) or a single period.

        Args:
            summary (dict): The summary/period dict.
            hourly (bool, optional): If the summary is for a single period.
        """
        day_icon = summary["clouds"]
        thunderstorm = False

        if hourly:
            if summary["tstms"] is not None and (summary["tstms"] != "S"):
                thunderstorm = True
        else:
            periods = self.forecast.weather_periods(
                self.forecast_source,
                startOfDay(summary["dateTime"].raw),
                summary["dateTime"].raw + 86400,
            )

            for period in periods:
                if period["tstms"] is not None and (period["tstms"] != "S"):
                    thunderstorm = True

        rain = summary['qpf'].raw is not None and summary['qpf'].raw > 0
        snow = summary['qsf'].raw is not None and summary['qsf'].raw > 0

        if (
            summary["clouds"] == "BK"
            or summary["clouds"] == "B1"
            or summary["clouds"] == "SC"
        ):
            if rain:
                day_icon = "rain--scattered"
            if snow:
                day_icon = "snow--scattered"

        if summary["clouds"] == "B2" or summary["clouds"] == "OV":
            if summary["obvis"] is not None and ('F' in summary["obvis"] or 'PF' in summary["obvis"] or 'F+' in summary["obvis"] or 'PF+' in summary["obvis"]):
                day_icon = 'fog'
            if summary['obvis'] is not None and 'H' in summary['obvis']:
                day_icon = 'haze'
            if rain:
                day_icon = "rain"
            if snow:
                day_icon = "snow"

        if rain and snow:
            day_icon = "sleet"

        if thunderstorm:
            day_icon = "thunderstorm"

        return day_icon + ".svg"
