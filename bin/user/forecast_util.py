from weewx.cheetahgenerator import SearchList
import pprint

# Copyright 2022 David Bätge
# Distributed under the terms of the GNU Public License (GPLv3)


class ForecastUtil(SearchList):
    def get_day_icon(self, summary):
        pprint.pprint(summary)
        #if summary.pop is not None:
            #print(summary.pop)
