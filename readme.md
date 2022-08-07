[![Tests](https://github.com/Daveiano/weewx-wdc/actions/workflows/test.yml/badge.svg)](https://github.com/Daveiano/weewx-wdc/actions/workflows/test.yml)

# Weewx Weather Data Center skin

- [Weewx Weather Data Center skin](#weewx-weather-data-center-skin)
  - [Key Features](#key-features)
  - [Demo](#demo)
  - [Screenshots](#screenshots)
  - [Installation](#installation)
  - [Update from 1.x to 2.x](#update-from-1x-to-2x)
  - [Wiki](#wiki)
  - [Free Software](#free-software)
  - [Credits](#credits)

Inspired by and build with the [Carbon Design System](https://carbondesignsystem.com/). This skin uses the same technologies as [Weather Data Center](https://github.com/Daveiano/weather-data-center), a cross-platform Desktop App to import and analyze weather data, I wrote.

If you need help installing the skin, please have a look at https://github.com/Daveiano/weewx-interceptor-docker, a configured Dockerfile
which I use as a base for my local PI installation.

If you like the look and feel of the skin please consider having a look into the original [Weather Data Center](https://daveiano.github.io/weather-data-center/)

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
- User-generated "About page"
- Classic and alternative layout
- Windrose chart

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

**Requires weewx >= 4.5**

**Please note:** For installation, please use the generated zip archive from a release, eg. https://github.com/Daveiano/weewx-wdc/releases/download/v2.0.1/weewx-wdc-v2.0.1.zip.
Don't download the repository directly and don't use the GitHub generated zip and tar.gz archives that come alongside the release. Always use the zip archive named **weewx-wdc-vX.X.X.zip**

Background: The files in the src/ directory are the source files (TypeScript, SCSS). When creating a release, these source files get transformed and optimized, and the output location of these transformed files is the location which matches the location in the install.py script. The weewx-wdc-vX.X.X.zip should contain all these transformed files (like service-worker.js), but if you download the current state of the repo, these files are not included and this will throw multiple `FileNotFoundError` errors while installing. For manual building these files, see [Development](#development).

1. [Download](https://github.com/Daveiano/weewx-wdc/releases) the latest version
2. Create a new folder and unzip to that folder
3. Install the extension: wee_extension --install=path/to/weewx-wdc
4. Restart weewx: weewx restart

For help, please have a look at the [official weewx documentation](https://weewx.com/docs/utilities.htm#wee_extension_utility).

## Update from 1.x to 2.x

Please have a look at the guide from the release notes: https://github.com/Daveiano/weewx-wdc/releases/tag/v2.0.0

## [Wiki](https://github.com/Daveiano/weewx-wdc/wiki)

For detailed information on how to configure the skin.conf or how to add a page with its own generated content, please have a look at the [Projects Wiki](https://github.com/Daveiano/weewx-wdc/wiki). It also covers some other important things.

## Free Software

This skin uses only free software. You can read more about [Carbon IBM](https://github.com/carbon-design-system/carbon) (licensed under the Apache-2.0 license) here: https://carbondesignsystem.com/contributing/overview/#introduction. [nivo](https://github.com/plouc/nivo) is licensed under the MIT license.

## Credits

Thanks to [ngulden](https://github.com/ngulden) for the [niculskin](https://github.com/ngulden/niculskin) and
[neoground](https://github.com/neoground) for the [neowx-material skin](https://github.com/neoground/neowx-material). Both are amazing skins and gave me a basic understanding of creating a weewx skin.

The config, NOAA Reports and some templating ideas and concepts are based on the original Standard and Seasons
weewx skins by Tom Keffer and the weewx contributors.
