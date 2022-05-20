from weewx.cheetahgenerator import SearchList

# Copyright 2022 David Bätge
# Distributed under the terms of the GNU Public License (GPLv3)


class CelestialUtil(SearchList):

    def get_celestial_icon(self, observation, prop):
        """
        Returns an include path for an icon based on the observation

        Args:
            observation (string): Sun, Moon
            prop (string): set, rise

        Returns:
            str: A icon include string.
        """
        if observation == 'Sun':
            if prop is None:
                return "includes/pictograms/sun.svg"
            if prop == 'rise':
                return "includes/icons/sunrise.svg"
            if prop == 'set':
                return "includes/icons/sunset.svg"
            if prop == 'transit':
                return "includes/icons/solar.svg"

        if observation == 'Moon':
            if prop is None:
                return "includes/pictograms/moon.svg"
            if prop == 'rise':
                return "includes/icons/moonrise.svg"
            if prop == 'set':
                return "includes/icons/moonset.svg"
            if prop == 'transit':
                return "includes/icons/moon.svg"
