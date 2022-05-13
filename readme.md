# Weewx Weather Data Center skin

Inspired by and build with the [Carbon Design System](https://carbondesignsystem.com/). This skin uses the same technologies as [Weather Data Center](https://github.com/Daveiano/weather-data-center), a cross-platform Desktop App to import and analyze weather data, I wrote.

## Key Features

- Clear and beautiful UI thanks to [IBM Carbon](https://carbondesignsystem.com/) and [nivo](https://nivo.rocks/)
- Configurable Statistic Tiles and Diagram tiles
- Combinable diagrams via skin.conf
- Responsive
- Day, week, month, year and all-time pages
- Archive and NOAA Reports
- Almanac
- Translated for DE and EN
- Tabular representation with Carbon Data Tables

## [Demo](https://www.weewx-hbt.de)

## Screenshot

![Screenshot](https://public-images-social.s3.eu-west-1.amazonaws.com/weewx-wdc.png)

## Usage

### Installation

1. [Download](https://github.com/Daveiano/weewx-wdc/releases) the latest version
2. Install the extension: wee_extension --install=path/to/weewx-wdc-version-string.zip
3. Restart weewx: weewx restart

For help, please have a look at the [official weewx documentation](https://weewx.com/docs/utilities.htm#wee_extension_utility).

### Configuration

The default skin.conf looks like this:

```
# configuration file for the weewx-wdc skin
SKIN_NAME = Weather Data Center
SKIN_VERSION = 1.0.0-beta2

[Extras]


[DisplayOptions]
    table_tile_observations = outTemp, outHumidity, barometer, windSpeed, windGust, windDir, rain, rainRate, snowDepth, dewpoint, windchill, heatindex, UV, ET, radiation, appTemp, cloudbase, extraTemp1, extraHumid1, extraTemp2, extraHumid2, extraTemp3, extraHumid3, extraTemp4, extraHumid4, extraTemp5, extraHumid5, extraTemp6, extraHumid6, extraTemp7, extraHumid7, extraTemp8, extraHumid8
    stat_tile_observations = outTemp, outHumidity, barometer, windSpeed, windGust, windDir, rain, rainRate, snowDepth, dewpoint, windchill, heatindex, UV, ET, radiation, appTemp, cloudbase, extraTemp1, extraHumid1, extraTemp2, extraHumid2, extraTemp3, extraHumid3, extraTemp4, extraHumid4, extraTemp5, extraHumid5, extraTemp6, extraHumid6, extraTemp7, extraHumid7, extraTemp8, extraHumid8
    diagram_tile_observations = tempdew, outHumidity, barometer, windchill_heatindex, wind, windDir, rain, rainRate, snowDepth, UV, ET, radiation, cloudbase, appTemp
    [[diagram_tile_combined_obervations]]
        [[[tempdew]]]
            label = 'Temperature / Dewpoint'
            [[[[obs]]]]
                [[[[[outTemp]]]]]
                [[[[[dewpoint]]]]]

        [[[windchill_heatindex]]]
            label = 'Windchill / Heatindex'
            [[[[obs]]]]
                [[[[[windchill]]]]]
                    color = '#0099CC'
                [[[[[heatindex]]]]]
                    color = '#610000'

        [[[wind]]]
            label = 'Wind speed / Gust speed'
            [[[[obs]]]]
                [[[[[windSpeed]]]]]
                [[[[[windGust]]]]]

[CheetahGenerator]
    encoding = html_entities
    search_list_extensions = user.general_util.GeneralUtil, user.stats_util.StatsUtil, user.diagram_util.DiagramUtil, user.celestial_util.CelestialUtil, user.archive_util.ArchiveUtil, user.table_util.TableUtil

    [[SummaryByMonth]]
        # Reports that summarize "by month"
        [[[NOAA_month]]]
            encoding = normalized_ascii
            template = NOAA/NOAA-%Y-%m.txt.tmpl
        [[[summary_month]]]
            template = month-%Y-%m.html.tmpl

    [[SummaryByYear]]
        # Reports that summarize "by year"
        [[[NOAA_year]]]
            encoding = normalized_ascii
            template = NOAA/NOAA-%Y.txt.tmpl
        [[[summary_year]]]
            template = year-%Y.html.tmpl

    # Reports that show statistics "to date", such as day-to-date,
    # week-to-date, month-to-date, etc.
    [[ToDate]]
        [[[day]]]
            template = index.html.tmpl

        [[[week]]]
            template = week.html.tmpl

        [[[month]]]
            template = month.html.tmpl

        [[[year]]]
            template = year.html.tmpl

        [[[statistics]]]
            template = statistics.html.tmpl

        [[[celestial]]]
            template = celestial.html.tmpl

[CopyGenerator]
    copy_once = dist/js/index.js, dist/scss/index.css, favicon.ico
    # copy_always =

[Generators]
    generator_list = weewx.cheetahgenerator.CheetahGenerator, weewx.reportengine.CopyGenerator
```

`table_tile_observations` Defines which observations should be shown in the data table component.

`stat_tile_observations` Define which observations should be shown in the stat tiles (at the top of each page).

`diagram_tile_observations` Define which observations to show as diagrams. This can include definitions for combined diagrams. Combined diagrams (like Temperature and Dew point or Windchill and Heat index) need to be defined in the `[[diagram_tile_combined_obervations]]` section like this:

For a combined diagram of Temperature and Dew point:

```
[[[tempdew]]]                           # 1
    label = 'Temperature / Dewpoint'    # 2
    [[[[obs]]]]                         # 3
        [[[[[outTemp]]]]]
        [[[[[dewpoint]]]]]
            color = '#610000'           # 4
```

`# 1` Name of the combined diagram, needs to be the same as used in `diagram_tile_observations`.

`# 2` Label of the diagram.

`# 3` Under the key `obs` specify the observations to combine.

`# 4` Optionally define a color.

## Development

The skin uses the Cheetah templating engine provided by weewx in combination with carbon web components
and a react entry point to render the diagrams written in TypeScript via nivo. Bundling for Typescript and SCSS is done via parcel.

### Scripts

#### `yarn run dev`

Starts parcel in watch mode

#### `yarn run build`

Builds the assets

#### `yarn run deploy:local`

Only works if weewx is installed via package, see https://weewx.com/docs/setup.htm.
Copies all skin files in the corresponding weewx installation folders, restarts weewx and triggers a new generation of files via wee_reports:

`sudo cp -R ./skins/weewx-wdc /etc/weewx/skins && sudo cp -r ./bin/user/. /usr/share/weewx/user/ && sudo systemctl restart weewx && sudo /usr/share/weewx/wee_reports`

#### `yarn run serve:local`

Only works if weewx is installed via package, see https://weewx.com/docs/setup.htm.
Starts a nginx docker container to serve the generated files.

`docker run -it --rm -d -p 8080:80 --name web -v /var/www/html/weewx:/usr/share/nginx/html nginx`

### Ideas for further development

- Add Climatological stat tiles (for the archive?) for eg. Rain Days, Hot days, Tropical Nights, etc.

## Credits

-
