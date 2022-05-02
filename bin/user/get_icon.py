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
        if observation == 'outTemp':
            return icon_path + 'temp.svg'
        elif observation == 'outHumidity':
            return icon_path + 'humidity.svg'
        elif observation == 'barometer':
            return icon_path + 'barometer.svg'
