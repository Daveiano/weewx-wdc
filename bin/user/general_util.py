import datetime
from weewx.cheetahgenerator import SearchList


class GeneralUtil(SearchList):
    temp_obs = [
        'outTemp', 'inTemp',
        'dewpoint', 'windchill',
        'heatindex', 'appTemp'
    ]

    def get_icon(self, observation):
        """
        Returns an include path for an icon based on the observation
        @see http://weewx.com/docs/sle.html

        Args:
            observation (string): The observation

        Returns:
            str: A color string
        """
        icon_path = "includes/icons/"

        if observation == 'outTemp' or observation == 'inTemp':
            return icon_path + 'temp.svg'

        elif observation == 'outHumidity' or observation == 'inHumidity':
            return icon_path + 'humidity.svg'

        elif observation == 'barometer':
            return icon_path + 'barometer.svg'

        elif observation == 'windSpeed':
            return icon_path + 'wind-speed.svg'

        elif observation == 'windGust':
            return icon_path + 'wind-gust.svg'

        elif observation == 'windDir':
            return icon_path + 'wind-direction.svg'

        elif observation == 'rain':
            return icon_path + 'rain.svg'

        elif observation == 'rainRate':
            return icon_path + 'rain-rate.svg'

        elif observation == 'dewpoint':
            return icon_path + 'dew-point.svg'

        elif observation == 'windchill':
            return icon_path + 'wind-chill.svg'

        elif observation == 'heatindex':
            return icon_path + 'heat.svg'

        elif observation == 'UV':
            return icon_path + 'uv.svg'

        elif observation == 'ET':
            return icon_path + 'ev.svg'

        elif observation == 'radiation':
            return icon_path + 'solar.svg'

        elif observation == 'appTemp':
            return icon_path + 'feel-temp.svg'

        elif observation == 'cloudbase':
            return icon_path + 'cloud-base.svg'

        elif 'Temp' in observation:
            return icon_path + 'temp.svg'

        elif 'Humid' in observation:
            return icon_path + 'humidity.svg'

    def get_color(self, observation):
        """
        Color settings for observations.

        Args:
            observation (string): The observation

        Returns:
            str: A color string
        """
        if 'humidity' in observation.lower():
            return '#0099CC'

        if observation == 'barometer':
            return '#666666'

        if observation == 'dewpoint':
            return '#5F9EA0'

        if observation == 'appTemp':
            return '#C41E3A'

        if observation == 'windchill':
            return '#0099CC'

        if observation == 'heatindex':
            return '#610000'

        if observation == 'windSpeed':
            return '#ffc000'

        if observation == 'windGust':
            return '#666666'

        if observation == 'radiation':
            return '#ff8c00'

        if observation == 'UV':
            return '#e61919'

        if observation == 'cloudbase':
            return '#92b6f0'

        if observation == 'ET':
            return '#E97451'

        if observation == 'rain':
            return '#0198E1'

        if observation == 'rainRate':
            return '#0a6794'

        if observation in self.temp_obs or 'temp' in observation.lower():
            return '#8B0000'

        return 'black'

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
