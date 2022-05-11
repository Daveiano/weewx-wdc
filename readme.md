# Weewx Weather Data Center skin

Inspired by and build with the [Carbon Design System](https://carbondesignsystem.com/). This skin uses the same technologies as [Weather Data Center](https://github.com/Daveiano/weather-data-center), a cross-platform Desktop App to import and analyze weather data, I wrote.

## Key Features

- Clear and beatiful UI thanks to [IBM Carbon](https://carbondesignsystem.com/) and [nivo](https://nivo.rocks/)
- Configurable Statistic Tiles and Diagram tiles
- Combinable diagrams via skin.conf
- Responsive
- Day, week, month, year and all-time pages
- Almanac
- Translated for DE and EN

## Usage

### Installation

### Configuration

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

## Credits

### Todo

- Footer
- Add yearly archive accessible via Sidebar
- Add NOAA reports accessible via Sidebar
- Responsive
- Add Carbon Data Tables
