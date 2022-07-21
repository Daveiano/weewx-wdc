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

# Next
