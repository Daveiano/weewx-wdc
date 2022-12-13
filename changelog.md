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

# 3.0.0

- Bugfix: Forecast error using OWM Forecast [GH-100]
- Show weather data for a specific day [GH-67]
- Make diagrams configurable per context (per period) / Refactor diagrams configuration [GH-73], diagrams can now be configured per context, eg. day, week or month. Per default, the day and week pages do not include the `outTemp` min/max/avg diagram anymore.
- Enhancements for weewx-forecast support [GH-95]
- Make show_min, show_max, show_sum configurable for stat tiles [GH-94]
- Support for custom `data_bindings` [GH-71]
- Configurable Icons [GH-87]
- Configurable unit for diagrams [GH-88]
- Configurable Rounding [GH-89]

**Please have a look at the [wiki](https://github.com/Daveiano/weewx-wdc/wiki) for information on how to configure the new features.**

## Changes made to skin.conf since X.X.X

Line 5:

```diff
+[ObservationBindings]
+    [[custom_obs_1]]
+        data_binding = extension_1_binding # eg wx_binding
+        observation = obs_key # eg. outTemp
+    [[custom_obs_2]]
+        data_binding = extension_2_binding
+        observation = another_obs_key
```

Line 20:

```diff
[[forecast_zambretti]]
-    enable = True
+    enable = False

[[forecast_table_settings]]
     source = WU
     num_periods = 72
     num_days = 5
-    # Todo: Does not make sense?
-    show_legend = 1
-    show_hourly = 0
+    show_hourly = 1
     show_day = 1
     show_date = 1
     show_outlook = 1
     show_temp = 1
     show_dewpoint = 0
     show_humidity = 0
     show_wind = 1
     show_tides = 0
     show_sun = 1
     show_moon = 1
     show_pop = 1
     show_precip = 1
-    show_obvis = 0
```

Line 70:

```diff
     stat_tile_observations = outTemp, outHumidity, barometer, windSpeed, windDir, windGust, windGustDir, rain, rainRate, snowDepth, dewpoint, windchill, heatindex, UV, ET, radiation, appTemp, cloudbase, extraTemp1, extraHumid1, extraTemp2, extraHumid2, extraTemp3, extraHumid3, extraTemp4, extraHumid4, extraTemp5, extraHumid5, extraTemp6, extraHumid6, extraTemp7, extraHumid7, extraTemp8, extraHumid8
-    diagram_tile_observations = temp_min_max_avg, tempdew, outHumidity, barometer, windchill_heatindex, wind, windDir, windRose, rain, rainRate, snowDepth, UV, ET, radiation, cloudbase, appTemp
     stat_tile_winddir_ordinal = True
     diagram_tile_winddir_ordinal = True
     show_min_max_time_day = False
```

Line 84:

```diff
# What to show for the stat tiles.
-stat_tile_observations = outTemp, outHumidity, barometer, windSpeed, windDir, windGust, windGustDir, rain, rainRate, snowDepth, dewpoint, windchill, heatindex, UV, ET, radiation, appTemp, cloudbase, extraTemp1, extraHumid1, extraTemp2, extraHumid2, extraTemp3, extraHumid3, extraTemp4, extraHumid4, extraTemp5, extraHumid5, extraTemp6, extraHumid6, extraTemp7, extraHumid7, extraTemp8, extraHumid8
+stat_tile_observations = outTemp, outHumidity, barometer, windSpeed, windDir, windGust, windGustDir, windrun, rain, rainRate, snowDepth, dewpoint, windchill, heatindex, UV, ET, radiation, appTemp, cloudbase, extraTemp1, extraHumid1, extraTemp2, extraHumid2, extraTemp3, extraHumid3, extraTemp4, extraHumid4, extraTemp5, extraHumid5, extraTemp6, extraHumid6, extraTemp7, extraHumid7, extraTemp8, extraHumid8
+# Stat tiles: Min/Max/Sum settings.
+stat_tiles_show_min = outTemp, outHumidity, barometer, pressure, altimeter, snowDepth, heatindex, dewpoint, windchill, cloudbase, appTemp
+stat_tiles_show_max = rainRate, hailRate, snowRate, UV
+stat_tiles_show_sum = rain, ET, hail, snow, lightning_strike_count, windrun
```

Line 103:

```diff
+[[Icons]]
+    #rain = "includes/icons/barometer.svg"

```

Line 106 following:

```diff
+#[[Rounding]]
+   #dewpoint = 3

[[tables]]
+   #[[[Rounding]]]
+      #outTemp = 3
   [[[day]]]
      aggregate_interval = 3600  # 1 hour

[[diagrams]]
+   #[[[Rounding]]]
+      #barometer = 3
```

Line 96:

```diff
      [[diagrams]]
         [[[combined_observations]]]
            ...
            [[[[tempdew]]]]
                label = 'Temperature / Dewpoint'
                [[[[[obs]]]]]
                    [[[[[[temp]]]]]]
                        observation = "outTemp"
                    [[[[[[dew]]]]]]
                        observation = "dewpoint"
+                        color = "#5F9EA0"

             ...
             [[[[wind]]]]
                 label = 'Wind speed / Gust speed'
                 yScaleMin = 0
+                enableArea = True
+                areaOpacity = 0.5
                 [[[[[obs]]]]]
                     [[[[[[speed]]]]]]
                         observation = "windSpeed"
+                        color = "#ffc000"
                     [[[[[[gust]]]]]]
                         observation = "windGust"
+                        color = "#666666"

         # Diagram-type specific settings.
         [[[line]]]
             lineWidth = 2
             pointSize = 5
             isInteractive = True
             enablePoints = True
             enableCrosshair = True
             yScaleOffset = 3
+            enableArea = False
+            areaOpacity = 0.07
             # @see https://github.com/plouc/nivo/blob/master/packages/line/index.d.ts#L144
             curve = "natural"
         [[[bar]]]
             enableLabel = False
             isInteractive = True
             yScaleOffset = 3

         # Observation specific settings.
-        [[[cloudbase]]]
+        [[[outTemp]]]
+            type = line
+            color = "#8B0000"
+        [[[dewpoint]]]
+            type = line
+            color = "#5F9EA0"
+        [[[outHumidity]]]
             yScaleMin = 0
-            yScaleOffset = 300
+            yScaleMax = 103
+            type = line
+            enableArea = True
+            color = "#0099CC"
+        [[[pressure]]]
+            yScaleOffset = 1
+            type = line
+            enableArea = True
+            color = "#666666"
+        [[[barometer]]]
+            yScaleOffset = 1
+            type = line
+            enableArea = True
+            color = "#666666"
+        [[[altimeter]]]
+            yScaleOffset = 1
+            type = line
+            enableArea = True
+            color = "#666666"
+        [[[windchill]]]
+            type = line
+            color = "#0099CC"
+        [[[heatindex]]]
+            type = line
+            color = "#610000"
         [[[windDir]]]
             curve = "basis"
             lineWidth = 0
             yScaleMin = 0
             yScaleMax = 360
+            type = line
+            color = "#161616"
         [[[windSpeed]]]
             yScaleMin = 0
+            type = line
+            enableArea = True
+            color = "#ffc000"
         [[[windGust]]]
             aggregate_type = "max"
             yScaleMin = 0
-        [[[radiation]]]
-            curve = "basis"
-            yScaleMin = 0
-        [[[UV]]]
-            aggregate_type = "max"
-            curve = "step"
-            yScaleMin = 0
-            yScaleOffset = 1
+            type = line
+            enableArea = True
+            color = "#666666"
         [[[rain]]]
             aggregate_type = "sum"
             yScaleOffset = 0.25
+            type = bar
+            color = "#0198E1"
         [[[rainRate]]]
             aggregate_type = "max"
             curve = "linear"
             yScaleMin = 0
             yScaleOffset = 0.25
-        [[[outHumidity]]]
+            type = line
+            color = "#0a6794"
+        [[[UV]]]
+            aggregate_type = "max"
+            curve = "step"
             yScaleMin = 0
-            yScaleMax = 103
+            yScaleOffset = 1
+            type = line
+            enableArea = True
+            color = "#e61919"
         [[[ET]]]
             aggregate_type = "sum"
             yScaleOffset = 0.02
-        [[[pressure]]]
-            yScaleOffset = 1
-        [[[barometer]]]
-            yScaleOffset = 1
-        [[[altimeter]]]
-            yScaleOffset = 1
-
-        # Context specific settings, alltime: if not set, will be calculated.
+            type = bar
+            color = "#E97451"
+        [[[radiation]]]
+            curve = "basis"
+            yScaleMin = 0
+            type = line
+            enableArea = True
+            color = "#ff8c00"
+        [[[cloudbase]]]
+            yScaleMin = 0
+            yScaleOffset = 300
+            type = line
+            enableArea = True
+            color = "#92b6f0"
+        [[[appTemp]]]
+            type = line
+            color = "#C41E3A"
+
+        # Context specific settings, alltime: if aggregate_interval is not set,
+        # it will be calculated.
         [[[day]]]
             aggregate_interval = 1800 # 30 minutes
-            [[[[ET]]]]
-                aggregate_interval = 7200  # 2 hours
-            [[[[rain]]]]
-                aggregate_interval = 7200  # 2 hours
+            [[[[observations]]]]
+                [[[[[tempdew]]]]]
+                [[[[[outHumidity]]]]]
+                [[[[[barometer]]]]]
+                [[[[[windchill_heatindex]]]]]
+                [[[[[wind]]]]]
+                [[[[[windDir]]]]]
+                [[[[[windRose]]]]]
+                [[[[[rain]]]]]
+                    aggregate_interval = 7200  # 2 hours
+                [[[[[rainRate]]]]]
+                [[[[[UV]]]]]
+                [[[[[ET]]]]]
+                    aggregate_interval = 7200  # 2 hours
+                [[[[[radiation]]]]]
+                [[[[[cloudbase]]]]]
+                [[[[[appTemp]]]]]

         [[[week]]]
             aggregate_interval = 7200  # 2 hours
-            [[[[ET]]]]
-                aggregate_interval = 86400  # 1 day
-            [[[[rain]]]]
-                aggregate_interval = 86400  # 1 day
+            [[[[observations]]]]
+                [[[[[tempdew]]]]]
+                [[[[[outHumidity]]]]]
+                [[[[[barometer]]]]]
+                [[[[[windchill_heatindex]]]]]
+                [[[[[wind]]]]]
+                [[[[[windDir]]]]]
+                [[[[[windRose]]]]]
+                [[[[[rain]]]]]
+                    aggregate_interval = 86400  # 1 day
+                [[[[[rainRate]]]]]
+                [[[[[UV]]]]]
+                [[[[[ET]]]]]
+                    aggregate_interval = 86400  # 1 day
+                [[[[[radiation]]]]]
+                [[[[[cloudbase]]]]]
+                [[[[[appTemp]]]]]

         [[[month]]]
             aggregate_interval = 21600  # 6 hours
-            [[[[ET]]]]
-                aggregate_interval = 172800  # 2 days
-            [[[[rain]]]]
-                aggregate_interval = 172800  # 2 days
+            [[[[observations]]]]
+                [[[[[temp_min_max_avg]]]]]
+                [[[[[tempdew]]]]]
+                [[[[[outHumidity]]]]]
+                [[[[[barometer]]]]]
+                [[[[[windchill_heatindex]]]]]
+                [[[[[wind]]]]]
+                [[[[[windDir]]]]]
+                [[[[[windRose]]]]]
+                [[[[[rain]]]]]
+                    aggregate_interval = 172800  # 2 days
+                [[[[[rainRate]]]]]
+                [[[[[UV]]]]]
+                [[[[[ET]]]]]
+                    aggregate_interval = 172800  # 2 days
+                [[[[[radiation]]]]]
+                [[[[[cloudbase]]]]]
+                [[[[[appTemp]]]]]

         [[[year]]]
             aggregate_interval = 172800  # 2 days
-            [[[[ET]]]]
-                aggregate_interval = 1555200  # 8 days
-            [[[[rain]]]]
-                aggregate_interval = 1555200  # 8 days
+            [[[[observations]]]]
+                [[[[[temp_min_max_avg]]]]]
+                [[[[[tempdew]]]]]
+                [[[[[outHumidity]]]]]
+                [[[[[barometer]]]]]
+                [[[[[windchill_heatindex]]]]]
+                [[[[[wind]]]]]
+                [[[[[windDir]]]]]
+                [[[[[windRose]]]]]
+                [[[[[rain]]]]]
+                    aggregate_interval = 1555200  # 8 days
+                [[[[[rainRate]]]]]
+                [[[[[UV]]]]]
+                [[[[[ET]]]]]
+                    aggregate_interval = 1555200  # 8 days
+                [[[[[radiation]]]]]
+                [[[[[cloudbase]]]]]
+                [[[[[appTemp]]]]]
+
+        [[[alltime]]]
+            [[[[observations]]]]
+                [[[[[temp_min_max_avg]]]]]
+                [[[[[tempdew]]]]]
+                [[[[[outHumidity]]]]]
+                [[[[[barometer]]]]]
+                [[[[[windchill_heatindex]]]]]
+                [[[[[wind]]]]]
+                [[[[[windDir]]]]]
+                [[[[[windRose]]]]]
+                [[[[[rain]]]]]
+                [[[[[rainRate]]]]]
+                [[[[[UV]]]]]
+                [[[[[ET]]]]]
+                [[[[[radiation]]]]]
+                [[[[[cloudbase]]]]]
+                [[[[[appTemp]]]]]
```

Line 6:

```diff
[Extras]
+   # If weewx is installed in some sub-folder of your web server,
+   # please specify the path here.
+   base_path = /
```

Line 246:

```diff
[CheetahGenerator]
    encoding = html_entities
-   search_list_extensions = user.weewx_wdc.WdcGeneralUtil, user.weewx_wdc.WdcStatsUtil, user.weewx_wdc.WdcDiagramUtil, user.weewx_wdc.WdcCelestialUtil, user.weewx_wdc.WdcArchiveUtil, user.weewx_wdc.WdcTableUtil
+   search_list_extensions = user.weewx_wdc.WdcGeneralUtil, user.weewx_wdc.WdcStatsUtil, user.weewx_wdc.WdcDiagramUtil, user.weewx_wdc.WdcCelestialUtil, user.weewx_wdc.WdcArchiveUtil, user.weewx_wdc.WdcTableUtil, user.weewx_wdc.WdcForecastUtil

+   #[[SummaryByDay]]
+   #    [[[summary_day]]]
+   #        template = day-archive/day-%Y-%m-%d.html.tmpl
```

Line 309:

```diff
[Units]
    [[TimeFormats]]
        # @see https://weewx.com/docs/customizing.htm#Units_TimeFormats
        day        = %X
        week       = %x
        month      = %x
        year       = %x
        rainyear   = %x
        current    = %x %X
        ephem_day  = %X
        ephem_year = %x
        stats      = %x %X
+       daily_archive = %Y-%m-%d
```
