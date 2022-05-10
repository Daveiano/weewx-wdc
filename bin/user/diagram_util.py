import datetime
from weewx.cheetahgenerator import SearchList
from user.general_util import GeneralUtil


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
        if observation in GeneralUtil.temp_obs or 'temp' in observation.lower():
            return 'temp'

        if 'humidity' in observation.lower():
            return 'humidity'

        if observation == 'windSpeed' or observation == 'windGust':
            return 'wind'

        if observation == 'barometer':
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

        return 'avg'

    def get_aggregate_interval(self, observation):
        """
        aggregate_interval for observations series.
        @see https://github.com/weewx/weewx/wiki/Tags-for-series#syntax

        Args:
            observation (string): The observation

        Returns:
            int: aggregate_interval
        """
        if observation == 'ET' or observation == 'rain':
            return 3600

        return 900

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

    def get_delta(self, observation):
        """
        Get delta for $span($hour_delta=$delta) call.

        Args:
            observation (string): The observation

        Returns:
            float: A delta
        """
        if observation == 'rain' or observation == 'ET':
            # @todo Use time of last record instead of now.minute
            now = datetime.datetime.now()
            return round(24 + (now.minute / 60), 2)

        return 24
