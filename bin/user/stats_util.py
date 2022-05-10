from weewx.cheetahgenerator import SearchList


class StatsUtil(SearchList):
    def get_show_min_stat(self, observation):
        """
        Returns if the min stats should be shown.

        Args:
            observation (string): The observation

        Returns:
            bool: Show or hide min stat.
        """
        show_min_stat = [
            "outTemp", "outHumidity", "barometer", "windSpeed",
            "windGust", "windDir", "rainRate", "snowDepth",
            "dewpoint", "windchill", "heatindex",
            "appTemp", "cloudbase"
        ]

        if 'Temp' in observation:
            return True

        elif 'Humid' in observation:
            return True

        if observation in show_min_stat:
            return True

    def get_show_only_sum(self, observation):
        """
        Returns if the min stats should be shown.

        Args:
            observation (string): The observation

        Returns:
            bool: Show or hide min stat.
        """
        show_only_sum = ["rain", "ET"]

        if observation in show_only_sum:
            return True
