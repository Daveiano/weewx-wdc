from weewx.cheetahgenerator import SearchList
from datetime import datetime
from calendar import isleap
from user.general_util import GeneralUtil

# Copyright 2022 David Bätge
# Distributed under the terms of the GNU Public License (GPLv3)


class DiagramUtil(SearchList):
    def get_diagram_type(self, observation):
        """
        Set e.g. "temp" for all diagrams which should be rendered as temp
        diagram (includes also heat anmd windchill).

        Args:
            observation (string): The observation

        Returns:
            str: A diagram type string
        """
        if (observation in GeneralUtil.temp_obs or
                'temp' in observation.lower()):
            return 'temp'

        if 'humidity' in observation.lower():
            return 'humidity'

        if observation == 'windSpeed' or observation == 'windGust':
            return 'wind'

        if observation == 'barometer' or observation == 'pressure':
            return 'pressure'

        return observation

    def get_diagram(self, observation):
        """
        Choose between line and bar.

        Args:
            observation (string): The observation

        Returns:
            str: A diagram string
        """
        if observation == 'rain' or observation == 'ET':
            return 'bar'

        return 'line'

    def get_aggregate_type(self, observation):
        """
        aggregate_type for observations series.
        @see https://github.com/weewx/weewx/wiki/Tags-for-series#syntax

        Args:
            observation (string): The observation

        Returns:
            string: aggregate_type
        """
        if observation == 'ET' or observation == 'rain':
            return 'sum'

        if (observation == 'UV' or
                observation == 'windGust' or
                observation == 'rainRate'):
            return 'max'

        return 'avg'

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
        alltime_start = kwargs.get('alltime_start', None)
        alltime_end = kwargs.get('alltime_end', None)

        if precision == 'day':
            if observation == 'ET' or observation == 'rain':
                return 7200  # 2 hours

            return 1800  # 30 minutes

        if precision == 'week':
            if observation == 'ET' or observation == 'rain':
                return 3600 * 24  # 1 day

            return 900 * 8  # 2 hours

        if precision == 'month':
            if observation == 'ET' or observation == 'rain':
                return 3600 * 48  # 2 days

            return 900 * 24  # 6 hours

        if precision == 'year':
            if observation == 'ET' or observation == 'rain':
                return 3600 * 432  # 8 days

            return 3600 * 48  # 2 days

        if precision == 'alltime':
            if (alltime_start is not None and
                    alltime_end is not None):

                d1 = datetime.strptime(alltime_start, '%d.%m.%Y')
                d2 = datetime.strptime(alltime_end, '%d.%m.%Y')
                delta = d2 - d1

                if delta.days == 0:
                    # Edge case: code from year.
                    if observation == 'ET' or observation == 'rain':
                        return 3600 * 432  # 8 days

                    return 3600 * 48  # 2 days

                if observation == 'ET' or observation == 'rain':
                    return 3600 * (delta.days / 20) * 24  # Max of 20 bars

                return 3600 * (delta.days / 100) * 24  # Max of 100 points
            else:
                if observation == 'ET' or observation == 'rain':
                    return 3600 * 432  # 8 days

                return 3600 * 96  # 4 days

    def get_rounding(self, observation):
        """
        Rounding settings for observations.

        Args:
            observation (string): The observation

        Returns:
            int: A rounding
        """
        if observation == 'UV' or observation == 'cloudbase':
            return 0

        if observation == 'ET':
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

        if precision == 'week':
            hour_delta = 24 * 7

        if precision == 'month':
            hour_delta = 24 * 30  # monthrange(now.year, now.month)[1]

        if precision == 'year':
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

        if precision == 'alltime':
            week_delta = 1000  # TODO: This will stop to work after 19 years.

        return week_delta
