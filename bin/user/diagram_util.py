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
