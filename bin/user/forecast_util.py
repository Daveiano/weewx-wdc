from weewx.cheetahgenerator import SearchList

# Copyright 2022 David Bätge
# Distributed under the terms of the GNU Public License (GPLv3)


class ForecastUtil(SearchList):
    # TODO: obvis
    # TODO: windGust & windChar is None
    def get_day_icon(self, summary):
        day_icon = summary['clouds']

        if summary['pop'].raw > 60:
            if (summary['clouds'] == 'BK' or summary['clouds'] == 'B1' or
                    summary['clouds'] == 'SC'):
                if 'rain' in summary['precip']:
                    day_icon = 'rain--scattered'
                if 'snow' in summary['precip']:
                    day_icon = 'snow--scattered'

            if summary['clouds'] == 'B2' or summary['clouds'] == 'OV':
                if 'rain' in summary['precip']:
                    day_icon = 'rain'
                if 'snow' in summary['precip']:
                    day_icon = 'snow'

        return day_icon + '.svg'
