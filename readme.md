[![Tests](https://github.com/Daveiano/weewx-wdc/actions/workflows/test.yml/badge.svg)](https://github.com/Daveiano/weewx-wdc/actions/workflows/test.yml)

# Weewx Weather Data Center skin

- [Weewx Weather Data Center skin](#weewx-weather-data-center-skin)
  - [Key Features](#key-features)
  - [Demo](#demo)
  - [Screenshots](#screenshots)
  - [Installation](#installation)
  - [Updating the skin](#updating-the-skin)
  - [Wiki](#wiki)
  - [Free Software](#free-software)
  - [Credits](#credits)

Inspired by and build with the [Carbon Design System](https://carbondesignsystem.com/). This skin uses the same technologies as [Weather Data Center](https://github.com/Daveiano/weather-data-center), a cross-platform Desktop App to import and analyze weather data, I wrote.

If you need help installing the skin, please have a look at https://github.com/Daveiano/weewx-interceptor-docker, a configured Dockerfile
which I use as a base for my local PI installation.

If you like the look and feel of the skin please consider having a look at the original [Weather Data Center](https://daveiano.github.io/weather-data-center/). **If you like the skin, please consider giving it a star!**

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
- Climatological days
- Calendar charts for rain days and average day temperature
- Support for [weewx-forecast](https://github.com/chaunceygardiner/weewx-forecast)
- Support for [weewx-dwd](https://github.com/roe-dl/weewx-DWD)
- User-generated "About page"
- Classic and alternative layout
- Windrose chart
- Dark mode

## [Demo](https://www.weewx-hbt.de)

## Screenshots

<table>
    <thead>
        <tr>
            <th>Classic layout</th>
            <th>Alternative layout</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td valign="top">

![Screenshot](https://public-images-social.s3.eu-west-1.amazonaws.com/weewx-wdc-classic-01.png)</td>

<td valign="top">

![Screenshot](https://public-images-social.s3.eu-west-1.amazonaws.com/weewx-wdc-01.png)</td>

</tr>
</tbody>
</table>

## Installation

**Requires weewx >= 4.6**

1. Download the [latest version](https://github.com/Daveiano/weewx-wdc/releases)

```
wget -O "/tmp/weewx-wdc.zip" https://github.com/Daveiano/weewx-wdc/releases/download/v2.3.3/weewx-wdc-v2.3.3.zip
```

2. Create a new folder and unzip to that folder

```
mkdir /tmp/weewx-wdc/
unzip /tmp/weewx-wdc.zip -d /tmp/weewx-wdc/
```

3. Install the extension:

   `wee_extension --install /tmp/weewx-wdc/`

4. Restart weewx

For help, please have a look at the [official weewx documentation](https://weewx.com/docs/utilities.htm#wee_extension_utility).

**Please note:** For installation, please use the generated zip archive from a release, eg. https://github.com/Daveiano/weewx-wdc/releases/download/v2.3.3/weewx-wdc-v2.3.3.zip.
Don't download the repository directly and don't use the GitHub generated zip and tar.gz archives that come alongside the release. Always use the zip archive named **weewx-wdc-vX.X.X.zip**

Background: The files in the src/ directory are the source files (TypeScript, SCSS). When creating a release, these source files get transformed and optimized, and the output location of these transformed files is the location which matches the location in the install.py script. The weewx-wdc-vX.X.X.zip should contain all these transformed files (like service-worker.js or main.css), but if you download the current state of the repo, these files are not included and this will throw multiple `FileNotFoundError` errors while installing. For manual building of these files, see [Development](#development).

## Updating the skin

**Note:** Please have a look at the [wiki](https://github.com/Daveiano/weewx-wdc/wiki/Configuration#persisting-changes-to-the-skinconf-between-updates) for help on persisting changes made to the skin.conf between updates.

When updating the skin to the latest version:

1. Uninstall the skin

   `wee_extension --uninstall=weewx-wdc`

2. Remove all generated content from your weewx html directory

   `rm -rf /var/www/html/weewx` (or whatever your output directory may be)

3. Do all 4 steps from the [Installation guide](#installation)
4. Run the reports to re-generate the html files

   `wee_reports`

## [Wiki](https://github.com/Daveiano/weewx-wdc/wiki)

For detailed information on how to configure the skin.conf or how to add a page with its own generated content, please have a look at the [Projects Wiki](https://github.com/Daveiano/weewx-wdc/wiki). It also covers some other important things.

## Free Software

This skin uses only free software. You can read more about [Carbon IBM](https://github.com/carbon-design-system/carbon) (licensed under the Apache-2.0 license) here: https://carbondesignsystem.com/contributing/overview/#introduction. [nivo](https://github.com/plouc/nivo) is licensed under the MIT license.

## Credits

Thanks to [ngulden](https://github.com/ngulden) for the [niculskin](https://github.com/ngulden/niculskin) and
[neoground](https://github.com/neoground) for the [neowx-material skin](https://github.com/neoground/neowx-material). Both are amazing skins and gave me a basic understanding of creating a weewx skin.

The config, NOAA Reports and some templating ideas and concepts are based on the original Standard and Seasons
weewx skins by Tom Keffer and the weewx contributors.
