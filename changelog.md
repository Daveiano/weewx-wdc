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

# 2.2.0

- Bugfix: Windchill is not translated to Windkühle in German [GH-50]
- Added Dark mode support [GH-48]
- Added more automated testing to make the skin more robust [GH-34]
- Added yScaleMin, yScaleMax and yScaleOffset as diagram parameters for skin.conf. [GH-49]

## Changes made to skin.conf since 2.1.0:

1. [yScaleMin, yScaleMax and yScaleOffset](https://github.com/Daveiano/weewx-wdc/commit/2f74e1468a080cbefa67ae20c725d25664d33895#diff-ba225fb627dcbf577d0d1fde0f18d93e8e2cf2097c37086cd28ef23e8e7bd820), also see https://github.com/Daveiano/weewx-wdc/wiki/Configuration#general

From Line 102:

```
...
[[[windDir]]]
   curve = "basis"
   lineWidth = 0
+  yScaleMin = 0
+  yScaleMax = 360
[[[radiation]]]
   curve = "basis"
+  yScaleOffset = 150
...
```

# 2.2.1

- Removed default yScaleOffset for radiation and updated yScaleOffset for temp_min_max_avg (from 3 to 0.5).
- Bugfix: ERROR cannot find 'dewPoint' [GH-33]
- Bugfix: Latest month and year pages are missing diagrams and stat tiles [GH-63]
- Move programmatically set yScaleMin, yScaleMax and yScaleOffset to skin.conf [GH-61], **Note:** This change reverts [GH-37]! If you are using inHg units, please update you skin.conf (Line 138 following) from

  ```
  [[[pressure]]]
     yScaleOffset = 1
  [[[barometer]]]
     yScaleOffset = 1
  [[[altimeter]]]
     yScaleOffset = 1
  ```

  to

  ```
  [[[pressure]]]
     yScaleOffset = 0.1
  [[[barometer]]]
     yScaleOffset = 0.1
  [[[altimeter]]]
     yScaleOffset = 0.1
  ```

  Please also have a look at the corresponding section in the [wiki](https://github.com/Daveiano/weewx-wdc/wiki/Configuration#general).

## Changes made to skin.conf since 2.2.0:

1. Updated default yScaleMin, yScaleMax and yScaleOffset for various observations ([GH-61])

From Line 48:

```diff
[[[[temp_min_max_avg]]]]
   label = "Temperature Min/Max/Avg"
   pointSize = 3
+  yScaleOffset = 0.5
```

From Line 74:

```diff
[[[[windchill_heatindex]]]]
   label = 'Windchill / Heatindex'
+  yScaleOffset = 0.5
```

From Line 92:

```diff
# Diagram-type specific settings.
[[[line]]]
   lineWidth = 2
   pointSize = 5
   isInteractive = True
   enablePoints = True
   enableCrosshair = True
+  yScaleOffset = 3
   # @see https://github.com/plouc/nivo/blob/master/packages/line/index.d.ts#L144
   curve = "natural"
[[[bar]]]
   enableLabel = False
   isInteractive = True
+  yScaleOffset = 3

# Observation specific settings
+[[[cloudbase]]]
+  yScaleMin = 0
+  yScaleOffset = 300
[[[windDir]]]
   curve = "basis"
   lineWidth = 0
   yScaleMin = 0
   yScaleMax = 360
+[[[windSpeed]]]
+  yScaleMin = 0
+[[[windGust]]]
+  yScaleMin = 0
[[[radiation]]]
   curve = "basis"
-  yScaleOffset = 150
+  yScaleMin = 0
[[[UV]]]
   curve = "step"
+  yScaleMin = 0
+  yScaleOffset = 1
+[[[rain]]]
+  yScaleOffset = 0.25
[[[rainRate]]]
   curve = "linear"
+  yScaleMin = 0
+  yScaleOffset = 0.25
+[[[outHumidity]]]
+  yScaleMin = 0
+  yScaleMax = 103
+[[[ET]]]
+  yScaleOffset = 0.02
+[[[pressure]]]
+  yScaleOffset = 1
+[[[barometer]]]
+  yScaleOffset = 1
+[[[altimeter]]]
+  yScaleOffset = 1
```

# 2.3.0

- Added (optional) Yesterdays page [GH-52]
- Bugfix: Frost days and Ice days were calculated wrong when using °F

# Next
