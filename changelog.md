# 1.0.0-alpha1

- Basic Theme Structure
- Added pages for: Today, Week, Month, Year, All time stats
- Added Stat Tile
- Added Diagram Tile
- Added basic configs with skin.conf

# 1.0.0-alpha2

- Added celestial page

# 1.0.0-alpha3

- Added archive and NOAA Reports

# 1.0.0-beta1

- Added Carbon Data Tables

# 1.0.0-beta2

- Updated headings and translations
- Bugfixes: Diagram Axis Labels, series generation
- Overall diagram fine-tuning

# 1.0.0-beta3

- Removed HTML_ROOT setting in install.py

# 1.0.0-beta4

- Added missing includes to install.py.

# 1.0.0-beta5

- Fixed JS build
- Updated UI Shell
- Updated some diagram aggragate types

# 1.0.0-beta6

- Responsive Updates for Ui-Shell, Stat Tiles and diagrams
- GH-2
- Added basic PWA manifest and service-worker
- Data Table aggregation updated

# 1.0.0

- Bugfixes
- Added rain days for stat tile
- Updated service-worker for PWA
- Responsive updates
- Added icon

# 1.0.1

- Bugfix: Add offline.html.tmpl to install.py

# 1.0.2

- Bugfix: Fixed syntax errors in install.py.

# 1.0.3

- Bugfix: Added wdc.svg.

# 1.1.0

- Added test_install.sh
- Added "Climatological Days" Tile to stats and year pages
- Added rain days and average temperature calendar diagram
- Updated Chart axis labels and aggregate intervals

# 1.2.0

- Added radar image
- Support for weewx-forecast (zambretti and table template)

# 1.2.1

- Small responsive updates
- Bugfix: Report takes forever on fresh install without data
- Bugfix: Avg Temperature diagram when values missing.
- Bugfix: ERROR weewx.cheetahgenerator: Reason: '>=' not supported between instances of 'NoneType' and 'float' [GH-9]
- Update forecast display [GH-10]

# 1.2.2

- Bugfix: Added forecast_util.py in install.py, see https://github.com/Daveiano/weewx-interceptor-docker/issues/1

# 1.3.0

- Updated rain rounding in diagrams
- Make Data Tables easy to deactivate, see readme
- Generate month and year pages less frequently
- Generate statistics page less frequently per default (stale age) [GH-14]
- Performance update: reduced generation time by 50% [GH-14]
- Added about page [GH-15]
- Added tutorial on how to change about page (user generated content) [GH-15]
- Added thunderstorm logic and icon to forecast table
- Fullscreen display for diagrams [GH-6]

# 1.3.1

- Typo fixes for de
- Bugfix: Month navigation only visible for current year when inside a month archive page [GH-24]
- Bugfix: Encoding issues in Data tables [GH-26]

# 1.3.2

- Bugfix: No module named 'user.forecast' [GH-29]

# 1.3.3

- Bugfix: Last year missing in the navigation bar of monthly pages [GH-30]
- Bugfix: Typo de.conf [GH-31]

# 2.0.0

- Breaking change: Refactored Search list extensions into two modules (weewx_wdc and weewx_wdc_forecast), see updated skin.conf. [GH-21]
- Added classic layout, preview here: https://weewx-hbt.de/classic [GH-12]
- More customisation via skin.conf: diagram height, digram aggregate_type, Time formats, some basic diagram options like line width or point size (please see the readme for more information) [GH-17]
- windDir ordinals display support, new chart type: windRose [GH-27]
- Some Frontend JavaScript optimization resulting in smaller files and better performance [GH-1]

## Update instructions

1. Uninstall weewx-wdc: `wee_extension --uninstall=weewx-wdc`
2. Delete all generated files: `rm -rf /var/www/html` (or whatever your output directory may be)
3. Install weewx-wdc version 2.0.0
   1. [Download](https://github.com/Daveiano/weewx-wdc/releases/download/v2.0.0/weewx-wdc-v2.0.0.zip)
   2. Create a new folder and unzip to that folder
   3. Install the extension: `wee_extension --install=path/to/weewx-wdc`
4. Update and review the skin.conf with many new customization possibilities
5. Restart weewx: `weewx restart`
6. Wait for the next report cycle or run `wee_reports`

For more info about installing and uninstalling extensions in weewx, see https://www.weewx.com/docs/utilities.htm#wee_extension_utility.

# 2.0.1

- Bugfix: Only working when generated into webservers root [GH-35]
- Bugfix: Pressure diagram with inHg unit. Updated rounding and yScale for pressure/barometer diagram in inHg. [GH-37]
- Bugfix: Time is Not Correct In All Data - Show stop instead of start date of interval, 1hr interval for daily table values. [GH-40]
- Forecast Min/Max - Updated forecast table typography. [GH-43]
- Bugfix: Rain Rate Graph in/h Intruding on Amount Values [GH-44]

# 2.1.0

- Updated windDir/windGustDir handling: These two observations are now printed alongside there corresponding speeds in the stat tiles (alternative layout) and the conditions table (classic layout). [GH-39]
- Stat Tile: lightning_strike_count should show the sum [GH-45]
- Updated altimeter support
- Added Italian translation contributed by Montefiori Luca.
- Bugfix: Running wee_reports takes forever when there is not enough weather data [GH-47]

# Next

- Bugfix: Windchill is not translated to Windkühle in German [GH-50]
- Added Dark mode support [GH-48]
