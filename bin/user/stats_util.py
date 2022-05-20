from weewx.cheetahgenerator import SearchList

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

    def get_rain_days(self, period):
        """
        Return number of rain days in period (rain > 0).

        Args:
            period (obj): Period to use, eg. $year, month, $span

        Returns:
            int: Number of rain days.
        """
        rain_series = period.rain.series(
            aggregate_type="sum",
            aggregate_interval="day",
            time_series='start',
            time_unit='unix_epoch'
        )

        rain_days = filter(lambda x: x.raw > 0.0, list(rain_series.data))

        return len(list(rain_days))
