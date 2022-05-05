from weewx.cheetahgenerator import SearchList


class GetIcon(SearchList):

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
