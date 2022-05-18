from weewx.cheetahgenerator import SearchList


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
        Returns if the min stats should be shown.

        Args:
            observation (string): The observation

        Returns:
            bool: Show or hide min stat.
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
        Returns a label.

        Args:
            prop (string): Min, Max, Sum
            precision (string): Day, week, month, year, alltime

        Returns:
            string: A label.
        """
        if precision == 'alltime':
            return prop

        return prop + ' ' + precision
