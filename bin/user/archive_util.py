from datetime import datetime
from weewx.cheetahgenerator import SearchList

# Copyright 2022 David Bätge
# Distributed under the terms of the GNU Public License (GPLv3)


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
            if str(year) in month:
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
        date_time_obj = datetime.strptime(month, "%Y-%m")

        return date_time_obj.strftime("%B")

    def fake_get_report_years(self, first, last):
        """
        Returns a fake $SummaryByYear tag.

        Args:
            first (datetime): Datetime of first observation.

        Returns:
            list: [2022, 2021].
        """
        first_year = int(first)
        last_year = int(last)

        if first_year == last_year:
            return [last_year]

        else:
            return list(range(first_year, last_year + 1))
