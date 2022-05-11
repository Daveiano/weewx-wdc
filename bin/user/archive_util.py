from xml.etree.ElementInclude import include
from datetime import datetime
from weewx.cheetahgenerator import SearchList


class ArchiveUtil(SearchList):
    def filter_months(self, months, year):
        """
        Returns a filtred list of months

        Args:
            months (list): A list of months [2022-01, 2022-02]
            year (string): Year.

        Returns:
            str: A icon include string.
        """
        months_filtered = []

        for month in months:
            if year in month:
                months_filtered.append(month)

        return months_filtered

    def month_string_format(self, month):
        """
        Returns a formatted value of a weewwx month string (2022-01)

        Args:
            month (string): A month

        Returns:
            str: Formatted month string.
        """
        date_time_obj = datetime. strptime(month, '%Y-%m')

        return date_time_obj.strftime('%B')
