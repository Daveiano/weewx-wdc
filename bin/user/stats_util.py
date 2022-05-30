from weewx.cheetahgenerator import SearchList
from user.diagram_util import DiagramUtil

# Copyright 2022 David Bätge
# Distributed under the terms of the GNU Public License (GPLv3)


class StatsUtil(SearchList):
    def get_show_min(self, observation):
        """
        Returns if the min stats should be shown.

        Args:
            observation (string): The observation

        Returns:
            bool: Show or hide min stat.
        """
        show_min_stat = [
            "outTemp", "outHumidity", "barometer",
            "windDir", "snowDepth", "heatindex",
            "dewpoint", "windchill", "cloudbase",
            "appTemp"
        ]

        if 'Temp' in observation:
            return True

        elif 'Humid' in observation:
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
        if precision == 'alltime':
            return prop

        return prop + ' ' + precision

    def get_climatological_day(self, day, period, unit_type, unit_labels):
        """
        Return number of days in period for day parameter.

        Args:
            day (string): Eg. rainDays, hotDays.
            period (obj): Period to use, eg. $year, month, $span
            unit_type (dict): degree_F or degree_C

        Returns:
            int: Number of days.
        """
        if day == 'iceDays':
            day_series = period.outTemp.series(
                aggregate_type="max",
                aggregate_interval="day",
                time_series='start',
                time_unit='unix_epoch'
            )

            days = filter(lambda x: x.raw is not None and x.raw < 0.0, list(day_series.data))

            return len(list(days))

        if day == 'frostDays':
            day_series = period.outTemp.series(
                aggregate_type="min",
                aggregate_interval="day",
                time_series='start',
                time_unit='unix_epoch'
            )

            days = filter(lambda x: x.raw is not None and x.raw < 0.0, list(day_series.data))

            return len(list(days))

        if day == 'stormDays':
            day_series = period.windGust.series(
                aggregate_type="max",
                aggregate_interval="day",
                time_series='start',
                time_unit='unix_epoch'
            )

            if getattr(unit_labels, 'windGust') == ' km/h':
                value = 62.0
            if getattr(unit_labels, 'windGust') == ' mph':
                value = 38.5
            if getattr(unit_labels, 'windGust') == ' m/s':
                value = 17.2

            days = filter(lambda x: x.raw is not None and x.raw >= value, list(day_series.data))

            return len(list(days))

        if day == 'rainDays':
            day_series = period.rain.series(
                aggregate_type="sum",
                aggregate_interval="day",
                time_series='start',
                time_unit='unix_epoch'
            )

            days = filter(lambda x: x.raw is not None and x.raw > 0.0, list(day_series.data))

            return len(list(days))

        if (day == 'hotDays' or
                day == 'summerDays' or
                day == 'desertDays' or
                day == 'tropicalNights'):

            if day == 'tropicalNights':
                value = 20.0 if getattr(unit_type, 'outTemp') == 'degree_C' else 68.0
                aggregate_type = 'min'
            if day == 'summerDays':
                value = 25.0 if getattr(unit_type, 'outTemp') == 'degree_C' else 77.0
                aggregate_type = 'max'
            if day == 'hotDays':
                value = 30.0 if getattr(unit_type, 'outTemp') == 'degree_C' else 86.0
                aggregate_type = 'max'
            if day == 'desertDays':
                value = 35.0 if getattr(unit_type, 'outTemp') == 'degree_C' else 95.0
                aggregate_type = 'max'

            day_series = period.outTemp.series(
                aggregate_type=aggregate_type,
                aggregate_interval="day",
                time_series='start',
                time_unit='unix_epoch'
            )

            days = filter(lambda x: x.raw is not None and x.raw >= value, list(day_series.data))

            return len(list(days))

    def get_climatological_day_description(self, day, unit_labels,
                                           obs_labels, unit_type):
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
        if day == 'iceDays':
            value = '0' if getattr(unit_type, 'outTemp') == 'degree_C' else '32'

            return obs_labels['outTemp'] + '<sub>max</sub> < ' + value + getattr(unit_labels, 'outTemp')

        if day == 'frostDays':
            value = '0' if getattr(unit_type, 'outTemp') == 'degree_C' else '32'

            return obs_labels['outTemp'] + '<sub>min</sub> < ' + value + getattr(unit_labels, 'outTemp')

        if day == 'stormDays':
            if getattr(unit_labels, 'windGust') == ' km/h':
                value = '62'
            if getattr(unit_labels, 'windGust') == ' mph':
                value = '38.5'
            if getattr(unit_labels, 'windGust') == ' m/s':
                value = '17.2'

            return obs_labels['windGust'] + ' > ' + value + getattr(unit_labels, 'windGust')

        if day == 'rainDays':
            return obs_labels['rain'] + ' > 0' + getattr(unit_labels, 'rain')

        if (day == 'hotDays' or
                day == 'summerDays' or
                day == 'desertDays' or
                day == 'tropicalNights'):
            if day == 'tropicalNights':
                value = '20' if getattr(unit_type, 'outTemp') == 'degree_C' else '68'
                aggregate_type = 'min'
            if day == 'summerDays':
                value = '25' if getattr(unit_type, 'outTemp') == 'degree_C' else '77'
                aggregate_type = 'max'
            if day == 'hotDays':
                value = '30' if getattr(unit_type, 'outTemp') == 'degree_C' else '86'
                aggregate_type = 'max'
            if day == 'desertDays':
                value = '35' if getattr(unit_type, 'outTemp') == 'degree_C' else '95'
                aggregate_type = 'max'

            return obs_labels['outTemp'] + '<sub>' + aggregate_type + '</sub> ≥ ' + value + getattr(unit_labels, 'outTemp')

    def get_calendar_color(awlf, obs):
        """
        Returns a color for use in diagram.

        Args:
            observation (string): The observation

        Returns:
            string: Color string.
        """
        if obs == 'rain':
            return ['#032c6a', '#02509d', '#1a72b7',
                    '#4093c7', '#6bb0d7', '#9fcae3'][::-1]

        if obs == 'outTemp':
            # Warming stripes colors
            # @see https://en.wikipedia.org/wiki/Warming_stripes
            return ['#032c6a', '#02509d', '#1a72b7', '#4093c7', '#6bb0d7',
                    '#9fcae3', '#c6dcee', '#dfedf6', '#ffe1d2', '#fcbda3',
                    '#fc9373', '#fa6a48', '#ee3829', '#cd1116', '#a6060d',
                    '#660105']

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
        diagramUtil = DiagramUtil(SearchList)

        if obs == 'rain':
            day_series = period.rain.series(
                aggregate_type=aggrgate_type,
                aggregate_interval="day",
                time_series='start',
                time_unit='unix_epoch'
            ).round(diagramUtil.get_rounding('rain'))

            days = filter(lambda x: x[1].raw > 0.0, list(zip(day_series.start, day_series.data)))
            rainDays = []

            for day in days:
                rainDays.append({
                    'value': day[1].raw,
                    'day': day[0].format("%Y-%m-%d")
                })

            return rainDays

        if obs == 'outTemp':
            day_series = period.outTemp.series(
                aggregate_type=aggrgate_type,
                aggregate_interval="day",
                time_series='start',
                time_unit='unix_epoch'
            ).round(diagramUtil.get_rounding('rain'))

            days = list(zip(day_series.start, day_series.data))
            tempDays = []

            for day in days:
                if day[1].raw is not None:
                    tempDays.append({
                        'value': day[1].raw,
                        'day': day[0].format("%Y-%m-%d")
                    })

            return tempDays
