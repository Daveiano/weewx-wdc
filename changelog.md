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

- (Optional) Change wind speed unit from beaufort to km/h, mph, m/s or knots in windrose. [GH-51]
- Added (optional) Yesterdays page. [GH-52]
- (Optional) Show date/time when the min / max was reached on the index, yesterday, week and month page. [GH-53]
- Make aggregate_interval configurable for charts / tables [GH-55]
- Added support for [weewx-DWD](https://github.com/roe-dl/weewx-DWD) [GH-25], for more Information please have a look at the [wiki](https://github.com/Daveiano/weewx-wdc/wiki/Support-for-weewx-DWD)
- Bugfix: Frost days and Ice days were calculated wrong when using `degree_F` (°F)
- Bugfix: Errors when NULL values in archive_day_outtemp or archive_day_rain [GH-77], by @hoetzgit

**Please have a look at the [wiki](https://github.com/Daveiano/weewx-wdc/wiki/Configuration) for information on how to configure the new features.**

## Changes made to skin.conf since 2.2.1:

1. Line 71, Custom min/max date/time display, see [GH-53].

```diff
diagram_tile_winddir_ordinal = True
+show_min_max_time_day = False
+show_min_max_time_yesterday = False
+show_min_max_time_week = False
+show_min_max_time_month = False
windRose_colors = "#f3cec9", "#e7a4b6", "#cd7eaf", "#a262a9", "#6f4d96", "#3d3b72"
```

2. Line 78, custom data tables aggregate_interval, see [GH-55]

```diff
+[[tables]]
+   [[[day]]]
+      aggregate_interval = 3600  # 1 hour
+   [[[week]]]
+      aggregate_interval = 21600  # 6 hours
+   [[[month]]]
+      aggregate_interval = 43200  # 12 hours
+   [[[year]]]
+      aggregate_interval = 86400  # 1 day
+   [[[alltime]]]
+      aggregate_interval = 86400  # 1 day
```

3. Exposed more previously static `aggregate_type`s on diagrams.

```diff
# Observation specific settings.
[[[windGust]]]
+   aggregate_type = "max"
   yScaleMin = 0
[[[radiation]]]
   curve = "basis"
   yScaleMin = 0
[[[UV]]]
+   aggregate_type = "max"
   curve = "step"
   yScaleMin = 0
   yScaleOffset = 1
[[[rain]]]
+   aggregate_type = "sum"
   yScaleOffset = 0.25
[[[rainRate]]]
+   aggregate_type = "max"
   curve = "linear"
   yScaleMin = 0
   yScaleOffset = 0.25
[[[outHumidity]]]
   yScaleMin = 0
   yScaleMax = 103
[[[ET]]]
+   aggregate_type = "sum"
   yScaleOffset = 0.02
```

4. Line 196, added context specific `aggregate_interval` for diagrams [GH-55]

```diff
+# Context specific settings, alltime: if not set, will be calculated.
+[[[day]]]
+   aggregate_interval = 1800 # 30 minutes
+   [[[[ET]]]]
+         aggregate_interval = 7200  # 2 hours
+   [[[[rain]]]]
+         aggregate_interval = 7200  # 2 hours
+
+[[[week]]]
+   aggregate_interval = 7200  # 2 hours
+   [[[[ET]]]]
+         aggregate_interval = 86400  # 1 day
+   [[[[rain]]]]
+         aggregate_interval = 86400  # 1 day
+
+[[[month]]]
+   aggregate_interval = 21600  # 6 hours
+   [[[[ET]]]]
+         aggregate_interval = 172800  # 2 days
+   [[[[rain]]]]
+         aggregate_interval = 172800  # 2 days
+
+[[[year]]]
+   aggregate_interval = 172800  # 2 days
+   [[[[ET]]]]
+         aggregate_interval = 1555200  # 8 days
+   [[[[rain]]]]
+         aggregate_interval = 1555200  # 8 days
```

5. Added yesterday page [GH-52]

Line 270:

```diff
[[ToDate]]
   [[[day]]]
      template = index.html.tmpl

+   #[[[yesterday]]]
+   #    template = yesterday.html.tmpl

   [[[week]]]
      template = week.html.tmpl
```

1. Added support for [weewx-DWD](https://github.com/roe-dl/weewx-DWD) [GH-25]

Line 39:

```diff
+#[[weewx-DWD]]
+    #   show_text_forecast = True
+    #   text_forecast_VHDL = DWLG
+    #   dwd_link = https://www.dwd.de/DE/wetter/wetterundklima_vorort/sachsen/sac_node.html
+    #   show_pressure_map = True
+    #   show_warning_map = True
+    #   show_text_warnings = True
+    #   show_warnings_on_front = XXX
+    #   show_forecast = True
+    #   mosmix_id = XXXX
+    #   [[[forecast_table_settings]]]
+    #       show_hourly = 1
+    #       show_date = 1
+    #       show_outlook = 1
+    #       show_temp = 1
+    #       show_dewpoint = 1
+    #       show_pressure = 1
+    #       show_wind= 1
+    #       show_pop = 1
+    #       show_precip = 1
+    #       show_cloud_cover = 1
+    #       show_sun_dur = 1
+    #       carbon_icons = 0
```

Line 290:

```diff
[[Static]]
   #[[[about]]]
      #template = about.html.tmpl
      #title = About
+   #[[[DWD]]]
+      #template = dwd.html.tmpl
+      #title = Vorhersage vom DWD
```

# 2.3.1

**This is a minor Bugfix release which you will likely only need to install if you use weewx-DWD. Besides that, only a tiny Bugfix is included: [GH-83]**

- Bugfixes for weewx-DWD Support [GH-81]: Make static `SchilderLZ.jpg` configurable, fixed various encoding issues for DE (Umlaute, `&shy;`).
- Restructured DWD Text forecast, Added gettext/pgettext to headings/texts to make it easier to change for the user. [GH-86]
- Using the gettext function for "WeeWX version" in footer.inc [GH-83]

## Changes made to skin.conf since 2.3.0:

Line 39 following:

```diff
#[[weewx-DWD]]
    #   show_text_forecast = True
    #   text_forecast_VHDL = DWLG
    #   dwd_link = https://www.dwd.de/DE/wetter/wetterundklima_vorort/sachsen/sac_node.html
    #   show_pressure_map = True
    #   show_warning_map = True
+   #   warning_map_filename = 'SchilderLZ.jpg'
    #   show_text_warnings = True
    #   show_warnings_on_front = XXX
    #   show_forecast = True
    #   mosmix_id = XXXX
    #   [[[forecast_table_settings]]]
    #       show_hourly = 1
    #       show_date = 1
    #       show_outlook = 1
    #       show_temp = 1
    #       show_dewpoint = 1
    #       show_pressure = 1
    #       show_wind= 1
    #       show_pop = 1
    #       show_precip = 1
    #       show_cloud_cover = 1
    #       show_sun_dur = 1
    #       carbon_icons = 0
```

# 2.3.2

- Added `yScaleMin = 0` to combined wind diagram. [GH-90]
- Updated italian translation, thanks to Luca Montefiori
- Added IBM Plex font locally, removed GoogleFonts. [GH-99]

## Changes made to skin.conf since 2.3.1

Line 133:

```diff
[[[[wind]]]]
    label = 'Wind speed / Gust speed'
+   yScaleMin = 0
    [[[[[obs]]]]]
        [[[[[[speed]]]]]]
            observation = "windSpeed"
        [[[[[[gust]]]]]]
            observation = "windGust"
```

# 2.3.3

- Compatibility for Weewx > 4.10 [GH-111]

## No changes made to skin.conf since 2.3.2

# 3.0.0

**Requires WeeWX >=v4.9.0**

- Bugfix: Forecast error using OWM Forecast [GH-100]
- Bugfix: Forecast NWS Bug: Reason: '>' not supported between instances of 'NoneType' and 'int' [GH-118]
- Bugfix: Why are the Weather intervals (week, month, year) all off by one day? [GH-116]
- Show weather data for a specific day [GH-67]
- Make diagrams configurable per context (per period) / Refactor diagrams configuration [GH-73]. Diagrams can now be configured per context, eg. day, week or month. Per default, the day and week pages do not include the `outTemp` min/max/avg diagram anymore.
- Enhancements for weewx-forecast support [GH-95]
- Make show_min, show_max, show_sum configurable for stat tiles [GH-94]
- Support for custom `data_bindings` [GH-71]
- Configurable Icons [GH-87]
- Configurable unit for diagrams [GH-88]
- Configurable Rounding [GH-89]
- Make markers configurable [GH-106]
- Automatic Refresh [GH-105]
- Support for combining different diagram types (eg. line and bar) [GH-75]. This adds an own implementation of chart rendering based directly on [D3.js](https://d3js.org/), please see https://github.com/Daveiano/weewx-wdc/wiki/Configuration#ENABLE_D3_DIAGRAMS (a Feature Flag was added to skin.conf for activating the new charts)
- Along [GH-75]: Added new climatogram (combined chart consisting of rain as bar and outTemp as line) for statistics and yearly statistics pages
- Update radar_img to allow for raw HTML (for using eg. iFrames as radar maps) [GH-108]
- Wind direction aggregation - use vecdir instead of avg [GH-119]

**Please have a look at the [wiki](https://github.com/Daveiano/weewx-wdc/wiki) for information on how to configure the new features.**

## Changes made to skin.conf since 2.3.3

This update contains like a rewrite of the skin.conf file, a complete diff can be found here (please click on "Load diff"):

https://github.com/Daveiano/weewx-wdc/compare/v2.3.3...7da0c421941c8e61e5aaf2b6d236ae7cf231009b#diff-ba225fb627dcbf577d0d1fde0f18d93e8e2cf2097c37086cd28ef23e8e7bd820

# 3.0.1

- Bugfix: Some built-in fields require adding an entry to [[Icons]] GH-124
- Added icon for no2, pm1_0, pm2_5 and pm10_0
- Bugfix: Unexpected IndexError in get_unit_label GH-123
- Bugfix: Resolved a caching issue for radar images (service worker was caching too much here)

## No changes made to skin.conf since 3.0.0

# 3.1.0

- Live updates via MQTT driven stat tiles on front page GH-131
- Add slot for webcam image(s) to front page. Add optional extra webcam page GH-127 and https://github.com/Daveiano/weewx-wdc/discussions/121#discussioncomment-5280575

## Changes made to skin.conf since 3.0.1

Line 29, following:

```diff
#radar_html = ''
#radar_heading = Recent radar

+# Set to True to have the Forecast tile and the radar/externals tile to have the same width.
+# Default is forecast = 2/3 and radar tile = 1/3.
+forecast_radar_equal_width = False

+[[mqtt]]
+     mqtt_websockets_enabled = 0
+     mqtt_websockets_host = "localhost"
+     mqtt_websockets_port = 9001
+     mqtt_websockets_ssl = 0
+     mqtt_websockets_topic = "weather/loop"

+# Include various external sources (eg. webcams) here.
+#[[external_1]]
+#    source = '<img src="http://your-server.com/uploads/webcam01.jpg" />'
+#    title = Webcam 1
+#    title_long = "Webcam 1, facing North"

+#[[external_2]]
+#    source = '<img src="http://your-server.com/uploads/webcam02.jpg" />'
+#    title = Webcam 2
+#    title_long = "Webcam 2, facing South"

+#[[external_3]]
+#    source = '<img src="http://your-server.com/uploads/webcam01.gif" />'
+#    title = Webcam 1
+#    title_long = "Webcam 1, Timelapse"

+#[[external_4]]
+#    source = '<img src="http://your-server.com/uploads/webcam02.gif" />'
+#    title = Webcam 2
+#    title_long = "Webcam 2, Timelapse"

[[forecast_zambretti]]
   enable = False
```

Line 508:

```diff
[[[about]]]
   template = about.html.tmpl
   title = About
+#[[[externals]]]
+   #template = externals.html.tmpl
+   #title = Webcams/Externals
#[[[DWD]]]
   #template = dwd.html.tmpl
   #title = Vorhersage vom DWD
```

Line 567:

```diff
[CopyGenerator]
-    copy_once = dist/main.js, dist/main.css, plotly-custom-build.min.js, favicon.ico, manifest.json, icon-192x192.png, icon-256x256.png, icon-384x384.png, icon-512x512.png, service-worker.js, offline.html, dist/assets
+    copy_once = dist/main.js, dist/main.css, plotly-custom-build.min.js, dist/live-updates.js, favicon.ico, manifest.json, icon-192x192.png, icon-256x256.png, icon-384x384.png, icon-512x512.png, service-worker.js, offline.html, dist/assets
```

# Next

- Bugfix: Visual padding bug in single radar tile on front page
- Bugfix: Not working tabs for radar/webcams when used with enabled forecast extension
- Bugfix: (MQTT) Handle observations with underscores GH-139

## Changes made to skin.conf since 3.1.0
