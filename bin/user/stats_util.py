from weewx.cheetahgenerator import SearchList


class StatsUtil(SearchList):
    show_min_stat = [
        "outTemp", "outHumidity", "barometer", "windSpeed",
        "windGust", "windDir", "rainRate", "snowDepth",
        "dewpoint", "windchill", "heatindex",
        "radiation", "appTemp", "cloudbase"
    ]

    def get_show_min_stat(self, observation):
        """
        Returns if the min stats should be shown.

        Args:
            observation (string): The observation

        Returns:
            bool: Show or hide min stat.
        """
        if 'Temp' in observation:
            return True

        elif 'Humid' in observation:
            return True

        if observation in self.show_min_stat:
            return True
