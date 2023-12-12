<!--prettier-ignore-->
## forecast table - Copyright 2012-2016 Matthew Wall
## $Id: forecast_table.inc 1745 2017-09-21 03:54:21Z mwall $
#errorCatcher Echo
#encoding UTF-8

#import time
#set $t0 = time.time()

## Which forecasts should be displayed?
#set $forecast_source = 'WU'

## How many forecast periods should be considered?
## Up to 40 for NWS, up to 240 for WU.  More periods take longer to generate.
#set $num_periods = 40

## If number of days is specified, then display up to that many days
#set $num_days = None

## Which columns should be displayed?
#set $show_legend = 1
#set $show_hourly = 0
#set $show_day = 1
#set $show_date = 1
#set $show_outlook = 1
#set $show_temp = 1
#set $show_dewpoint = 0
#set $show_humidity = 0
#set $show_wind = 1
#set $show_tides = 1
#set $show_sun = 0
#set $show_moon = 0
#set $show_pop = 1
#set $show_precip = 1
#set $show_precip_detail = 1
#set $show_obvis = 0

#set $local_settings = dict()

## First look for values from skin.conf or weewx.conf
#if $varExists('Extras') and $varExists('Extras.forecast_table_settings')
#for $sv in $Extras.forecast_table_settings.keys()
#set $local_settings[$sv] = $Extras.forecast_table_settings[$sv]
#end for
#end if

## Look for overrides defined by any template that includes this file
#if $varExists('forecast_table_settings')
#for $sv in $forecast_table_settings.keys()
#set $local_settings[$sv] = $forecast_table_settings[$sv]
#end for
#end if

## Now assign the values that will actually be used
#set $forecast_source = $local_settings.get('source', $forecast_source)
#set $num_periods = int($local_settings.get('num_periods', $num_periods))
#set $show_legend = int($local_settings.get('show_legend', $show_legend))
#set $show_hourly = int($local_settings.get('show_hourly', $show_hourly))
#set $show_day = int($local_settings.get('show_day', $show_day))
#set $show_date = int($local_settings.get('show_date', $show_date))
#set $show_outlook = int($local_settings.get('show_outlook', $show_outlook))
#set $show_temp = int($local_settings.get('show_temp', $show_temp))
#set $show_dewpoint = int($local_settings.get('show_dewpoint', $show_dewpoint))
#set $show_humidity = int($local_settings.get('show_humidity', $show_humidity))
#set $show_wind = int($local_settings.get('show_wind', $show_wind))
#set $show_tides = int($local_settings.get('show_tides', $show_tides))
#set $show_sun = int($local_settings.get('show_sun', $show_sun))
#set $show_moon = int($local_settings.get('show_moon', $show_moon))
#set $show_pop = int($local_settings.get('show_pop', $show_pop))
#set $show_precip = int($local_settings.get('show_precip', $show_precip))
#set $show_precip_detail = int($local_settings.get('show_precip_detail', $show_precip_detail))
#set $show_obvis = int($local_settings.get('show_obvis', $show_obvis))

#set $num_days = $local_settings.get('num_days', $num_days)
#if $num_days is not None
#set $num_days = int($num_days)
#end if

## Global variables for reporting the location and time.
#set $wloc = ''
#set $wts = ''

## Some forecasts return 16-points of the compass, but the icons support
## only 8-points.  This dictionary maps the 16 points to 8 points.
#set $wind_dir_dict = {'SSW':'SW','WSW':'SW','NNW':'NW','WNW':'NW','SSE':'SE','ESE':'SE','NNE':'NE','ENE':'NE'}

## Get any tide predictions
#set $tides = $forecast.xtides(startofday=True)

#set $lastday = None
## If the database has not yet been queried, do it here.
#if not $varExists('periods')
#set $all_periods = $forecast.weather_periods($forecast_source, max_events=$num_periods)
#set $periods = $all_periods
#end if

## If number of days was specified, then trim periods to that number of days.
#if $num_days is not None and $periods is not None and len($periods) > 0
  #set $filtered_periods = []
  #set $start_time = time.mktime(time.strptime($periods[0]['event_ts'].format("%Y.%m.%d 00:00"), '%Y.%m.%d %H:%M'))
  #set $end_time = $start_time + $num_days * 86400
  #for $p in $periods
    #if $p['event_ts'].raw < $end_time
      $filtered_periods.append($p)
    #end if
  #end for
  #set $periods = $filtered_periods
#end if

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/structured-list.min.js"
></script>

<!--prettier-ignore-->
#if len($periods) > 0

<div class="bx--row">
  <div
    class="bx--col-sm-4 bx--col-md-8 bx--col-lg-8 bx--col-xlg-8 bx--col-max-8"
  >
    <h3>$gettext($forecast_source)</h3>
  </div>
  #if $show_hourly
  <script
    type="module"
    src="https://1.www.s81c.com/common/carbon/web-components/version/v1.25.0/content-switcher.min.js"
  ></script>
  <div
    class="bx--col-sm-4 bx--col-md-8 bx--col-lg-4 bx--col-xlg-4 bx--col-max-4"
    style="margin-bottom: 1rem"
  >
    <bx-content-switcher size="sm" value="day">
      <bx-content-switcher-item value="day"
        >$gettext('Daily')</bx-content-switcher-item
      >
      <bx-content-switcher-item value="hour">
        $gettext('Hourly')
      </bx-content-switcher-item>
    </bx-content-switcher>
    <script>
      document.addEventListener(
        "bx-content-switcher-selected",
        function (event) {
          const value = event.target.__value;
          const forecastDaily = document.querySelector(".forecast-list.daily");
          const forecastHourly = document.querySelector(
            ".forecast-list.hourly"
          );

          if (value === "day") {
            forecastDaily.style.display = "block";
            forecastHourly.style.display = "none";
          } else {
            forecastDaily.style.display = "none";
            forecastHourly.style.display = "block";
          }
        }
      );
    </script>
  </div>
  #end if
</div>

<div style="display: block; white-space: nowrap; overflow-x: auto">
  <bx-structured-list class="forecast-list daily">
    <bx-structured-list-head>
      #if $show_day or $show_date
      <bx-structured-list-header-row>
        #if $show_legend
        <bx-structured-list-header-cell></bx-structured-list-header-cell>
        #end if
        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        #set $thisday = $period.event_ts.format('%d')
        #if $lastday != $thisday

        #set $wts = $period.issued_ts
        #set $lastday = $thisday
        #set $summary = $forecast.weather_summary($forecast_source, $period.event_ts.raw, periods=$periods)
        <bx-structured-list-header-cell class="index-$x">
          #if $show_day
          <span class="day">$summary.event_ts.format('%a')</span>
          <br />
          #end if
          <!--prettier-ignore-->
          #if $show_date
          <span class="date">$summary.event_ts.format('%d %b')</span>
          #end if
        </bx-structured-list-header-cell>
        <!--prettier-ignore-->
        #end if
      #end for
      </bx-structured-list-header-row>
      #end if
    </bx-structured-list-head>
    <bx-structured-list-body>
      #if $show_outlook and $summary.clouds is not None
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>$gettext("Outlook")</bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        #set $thisday = $period.event_ts.format('%d')
        #if $lastday != $thisday

        #set $lastday = $thisday
        #set $summary = $forecast.weather_summary($forecast_source, $period.event_ts.raw, periods=$periods)
        <bx-structured-list-cell class="index-$x">
          #include "includes/icons/forecast/" + $get_day_icon($summary)
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end if
      #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_temp
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $gettext("Temperature")<br />
          <span class="unit-label">in $unit.label.outTemp</span>
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        #set $thisday = $period.event_ts.format('%d')
        #if $lastday != $thisday

        #set $lastday = $thisday
        #set $summary = $forecast.weather_summary($forecast_source, $period.event_ts.raw, periods=$periods)
        <bx-structured-list-cell class="index-$x">
          <span class="temphi"> $summary.tempMax.nolabel('%.0f') </span>
          <br />
          <span class="templo"> $summary.tempMin.nolabel('%.0f') </span>
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end if
      #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_dewpoint and $summary.dewpointMax is not None
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $obs.label.dewpoint <br />
          <span class="unit-label">in $unit.label.dewpoint</span>
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        #set $thisday = $period.event_ts.format('%d')
        #if $lastday != $thisday

        #set $lastday = $thisday
        #set $summary = $forecast.weather_summary($forecast_source, $period.event_ts.raw, periods=$periods)
        <bx-structured-list-cell class="index-$x">
          <span class="temphi"> $summary.dewpointMax.nolabel('%.0f') </span>
          <br />
          <span class="templo"> $summary.dewpointMin.nolabel('%.0f') </span>
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end if
      #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_humidity and $summary.humidityMax is not None
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $obs.label.outHumidity <br />
          <span class="unit-label">in $unit.label.outHumidity</span>
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        #set $thisday = $period.event_ts.format('%d')
        #if $lastday != $thisday

        #set $lastday = $thisday
        #set $summary = $forecast.weather_summary($forecast_source, $period.event_ts.raw, periods=$periods)
        <bx-structured-list-cell class="index-$x">
          <span class="temphi"> $summary.humidityMax.nolabel('%.0f') </span>
          <br />
          <span class="templo"> $summary.humidityMin.nolabel('%.0f') </span>
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end if
      #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_wind and $summary.windSpeedMax is not None
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $obs.label.wind<br />
          <span class="unit-label">in $unit.label.wind</span>
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        #set $thisday = $period.event_ts.format('%d')
        #if $lastday != $thisday

        #set $lastday = $thisday
        #set $summary = $forecast.weather_summary($forecast_source, $period.event_ts.raw, periods=$periods)
        <bx-structured-list-cell class="index-$x">
          <!--prettier-ignore-->
          #if $summary.windSpeedMin == $summary.windSpeedMax or $summary.windSpeedMin.raw == $summary.windSpeedMax.raw
            $summary.windSpeedMin.nolabel('%.0f',' ')
          #else
            $summary.windSpeedMin.nolabel('%.0f','') - $summary.windSpeedMax.nolabel('%.0f',' ')
          #end if
          <span class="windgust">$summary.windGust.nolabel('%.0f',' ')</span>
          $summary.windChar
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end if
      #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_tides and len($tides) > 0
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $gettext("Tides")<br />
          in $unit.label.altitude
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        #set $thisday = $period.event_ts.format('%d')
        #if $lastday != $thisday

        #set $lastday = $thisday
        #set $summary = $forecast.weather_summary($forecast_source, $period.event_ts.raw, periods=$periods)
        <bx-structured-list-cell class="index-$x">
          <!--prettier-ignore-->
          <table cellspacing="0" cellpadding="0" width="100%" style="border-spacing: 5px; border-collapse: separate;">
            <!--prettier-ignore-->
            #for $tide in $tides
              #if $summary.event_ts.raw <= $tide.event_ts.raw < $summary.event_ts.raw + $summary.duration
              <tr>
                <td style="font-size: 100%">$tide.event_ts.format('%H:%M')</td>
                <td class="tide-hilo" style="font-size: 100%">$tide.hilo</td>
                <td style="font-size: 100%; text-align: right">
                  $tide.offset.nolabel('%.1f')
                </td>
              </tr>
              <!--prettier-ignore-->
              #end if
            #end for
          </table>
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end if
      #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_sun
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $gettext("Sunrise")<br />
          $gettext("Sunset")
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        #set $thisday = $period.event_ts.format('%d')
        #if $lastday != $thisday

        #set $alm = $forecast.almanac(ts=$period.event_ts.raw+10)
        #set $lastday = $thisday
        <!--prettier-ignore-->
        <bx-structured-list-cell class="index-$x">
        <!--prettier-ignore-->
        #if $alm.hasExtras
          $alm.sun.rise.format('%H:%M')<br />
          $alm.sun.set.format('%H:%M')
        #else
          $alm.sunrise<br />
          $alm.sunset
        #end if
      </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end if
      #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_moon
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $gettext("Moonrise")<br />
          $gettext("Moonset")
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        #set $thisday = $period.event_ts.format('%d')
        #if $lastday != $thisday

        #set $alm = $forecast.almanac(ts=$period.event_ts.raw+10)
        #set $lastday = $thisday
        <!--prettier-ignore-->
        <bx-structured-list-cell class="index-$x">
        <!--prettier-ignore-->
        #if $alm.hasExtras
          $alm.moon.rise.format('%H:%M')<br/>
          $alm.moon.set.format('%H:%M')
        #end if
        <br />
        $alm.moon_fullness% $gettext("full")
      </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end if
      #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_pop and $summary.pop.raw is not None
      <bx-structured-list-row class="rain">
        #if $show_legend
        <bx-structured-list-cell>
          $gettext('Probability of precipitation')
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        #set $thisday = $period.event_ts.format('%d')
        #if $lastday != $thisday

        #set $lastday = $thisday
        #set $summary = $forecast.weather_summary($forecast_source, $period.event_ts.raw, periods=$periods)
        <bx-structured-list-cell class="index-$x">
        #if $summary.pop.raw is not None and $summary.pop.raw > 0
          $summary.pop.format('%.0f','')
        #end if
      </bx-structured-list-cell>
        #end if
      #end for
      </bx-structured-list-row>
      #end if

      #if $show_precip
      #set $vertical_align =  "top" if $show_precip_detail else "bottom"
      <bx-structured-list-row class="rain">
        #if $show_legend
        <bx-structured-list-cell style="vertical-align: $vertical_align">
          $gettext('Precipitation') <br />
          <span class="unit-label">in $unit.label.rain</span>
        </bx-structured-list-cell>
        #end if

        #for $x, $period in enumerate($periods)
        #set $thisday = $period.event_ts.format('%d')
        #if $lastday != $thisday

        #set $lastday = $thisday
        #set $summary = $forecast.weather_summary($forecast_source, $period.event_ts.raw, periods=$periods)

        <bx-structured-list-cell class="index-$x" style="vertical-align: $vertical_align">
          #set $rain = $summary.qpf.raw is not None and $summary.qpf.raw > 0
          #set $snow = $summary.qsf.raw is not None and $summary.qsf.raw > 0
          #if $rain or $snow
            <div class="precip-main">
              #if $rain and not $snow
                $summary.qpf.nolabel('%.2f','')
              #end if

              #if $snow and not $rain
                $summary.qsf.nolabel('%.2f','')
              #end if

              #if $rain and $snow
                <!-- include 'includes/icons/forecast/sleet.svg' -->
                #set $q_pf_sf = '{:.2f}'.format($summary.qpf.raw + $summary.qsf.raw)
                $q_pf_sf
              #end if
            </div>

            #if $show_precip_detail
              #if $rain
                <div class="precip-detail">
                  #include 'includes/icons/forecast/rain-drop.svg'
                  $summary.qpf.nolabel('%.2f','')
                </div>
              #end if

              #if $snow
                <div class="precip-detail">
                  #include 'includes/icons/forecast/snowflake.svg'
                  $summary.qsf.nolabel('%.2f','')
                </div>
              #end if
            #end if

          #end if

          #if not $rain and not $snow
            -
          #end if
        </bx-structured-list-cell>
        #end if
        #end for
      </bx-structured-list-row>
      #end if

      <!--@todo Add obs-->
    </bx-structured-list-body>
  </bx-structured-list>

  #if $show_hourly
  #set $periods = $all_periods
  <bx-structured-list class="forecast-list hourly" style="display: none">
    <bx-structured-list-head>
      #if $show_day or $show_date
      <bx-structured-list-header-row>
        #if $show_legend
        <bx-structured-list-header-cell></bx-structured-list-header-cell>
        #end if
        #for $x, $period in enumerate($periods)

        #set $thisday = $period.event_ts.format('%d')
        #set $wts = $period.issued_ts
        <bx-structured-list-header-cell
          class="index-$x"
          style="vertical-align: bottom"
        >
          #if $show_day and $lastday != $thisday
          <span class="day">$period.event_ts.format('%a')</span>
          <br />
          #end if
          #if $show_date
          <span class="date">
            #if $lastday != $thisday
              $period.event_ts.format('%d %b')<br />
            #end if
            $period.event_ts.format('%H:%M')
          </span>
          #end if
        </bx-structured-list-header-cell>
        #if $lastday != $thisday
          #set $lastday = $thisday
        #end if
        #end for
      </bx-structured-list-header-row>
      #end if
    </bx-structured-list-head>
    <bx-structured-list-body>
      #if $show_outlook and $period.clouds is not None
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>$gettext("Outlook")</bx-structured-list-cell>
        #end if

        #for $x, $period in enumerate($periods)
        <bx-structured-list-cell class="index-$x">
          #include "includes/icons/forecast/" + $get_day_icon($period, hourly=True)
        </bx-structured-list-cell>
        #end for
      </bx-structured-list-row>
      #end if

      #if $show_temp
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $gettext("Temperature")<br />
          <span class="unit-label">in $unit.label.outTemp</span>
        </bx-structured-list-cell>
        #end if

        #for $x, $period in enumerate($periods)
        <bx-structured-list-cell class="index-$x">
          <span> $period.temp.nolabel('%.0f') </span>
        </bx-structured-list-cell>
        #end for
      </bx-structured-list-row>
      #end if

      #if $show_dewpoint and $period.dewpoint is not None
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $obs.label.dewpoint <br />
          <span class="unit-label">in $unit.label.dewpoint</span>
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        <bx-structured-list-cell class="index-$x">
          <span> $summary.dewpoint.nolabel('%.0f') </span>
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_humidity and $period.humidity is not None
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $obs.label.outHumidity <br />
          <span class="unit-label">in $unit.label.outHumidity</span>
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        <bx-structured-list-cell class="index-$x">
          <span> $summary.humidity.nolabel('%.0f') </span>
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_wind and $period.windSpeed is not None
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $obs.label.wind<br />
          <span class="unit-label">in $unit.label.wind</span>
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        <bx-structured-list-cell class="index-$x">
          <!--prettier-ignore-->
          $period.windSpeed.nolabel('%.0f',' ')
          <span class="windgust">$period.windGust.nolabel('%.0f',' ')</span>
          $period.windChar
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_tides and len($tides) > 0
      <bx-structured-list-row>
        #if $show_legend
        <bx-structured-list-cell>
          $gettext("Tides")<br />
          in $unit.label.altitude
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        <bx-structured-list-cell class="index-$x">
          <!--prettier-ignore-->
          <table cellspacing="0" cellpadding="0" width="100%" style="border-spacing: 5px; border-collapse: separate;">
            <!--prettier-ignore-->
            #for $tide in $tides
              #if $period.event_ts.raw <= $tide.event_ts.raw < $period.event_ts.raw + $period.duration
              <tr>
                <td style="font-size: 100%">$tide.event_ts.format('%H:%M')</td>
                <td class="tide-hilo" style="font-size: 100%">$tide.hilo</td>
                <td style="font-size: 100%; text-align: right">
                  $tide.offset.nolabel('%.1f')
                </td>
              </tr>
              <!--prettier-ignore-->
              #end if
            #end for
          </table>
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_pop and $period.pop.raw is not None
      <bx-structured-list-row class="rain">
        #if $show_legend
        <bx-structured-list-cell>
          $gettext('Probability of precipitation')
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        <bx-structured-list-cell class="index-$x">
          <!--prettier-ignore-->
          #if $period.pop.raw is not None and $period.pop.raw > 0
            $period.pop.format('%.0f','')
          #end if
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end for
      </bx-structured-list-row>
      #end if

      <!--prettier-ignore-->
      #if $show_precip
      <bx-structured-list-row class="rain">
        #if $show_legend
        <bx-structured-list-cell style="vertical-align: bottom">
          $obs.label.rain <br />
          <span class="unit-label">in $unit.label.rain</span>
        </bx-structured-list-cell>
        #end if

        <!--prettier-ignore-->
        #for $x, $period in enumerate($periods)
        <!--prettier-ignore-->
        <bx-structured-list-cell class="index-$x" style="vertical-align: bottom">
          #set $rain = $period.qpf.raw is not None and $period.qpf.raw > 0
          #set $snow = $period.qsf.raw is not None and $period.qsf.raw > 0
          #if $rain or $snow
            #if $rain and not $snow
              <!-- include 'includes/icons/forecast/rain.svg' -->
              $period.qpf.nolabel('%.2f','')
            #end if

            #if $snow and not $rain
              <!-- include 'includes/icons/forecast/snow.svg' -->
              $period.qsf.nolabel('%.2f','')
            #end if

            #if $rain and $snow
              <!-- include 'includes/icons/forecast/sleet.svg' -->
              #set $q_pf_sf = '{:.2f}'.format($period.qpf.raw + $period.qsf.raw)
              $q_pf_sf
            #end if
          #end if

          #if not $rain and not $snow
            -
          #end if
        </bx-structured-list-cell>
        <!--prettier-ignore-->
        #end for
      </bx-structured-list-row>
      #end if
    </bx-structured-list-body>
  </bx-structured-list>
  #end if
</div>

<!--prettier-ignore-->
#set $wloc = $summary.location
<!--prettier-ignore-->
<div class="issued">
  $gettext("Forecast")
  #if $wloc is not None and $wloc != ''
    #set $wloc_list = $wloc.replace("geocode=", "").split(',')
    #set $format_string = "{0:.3f}"
    for $format_string.format($float($wloc_list[0])), $format_string.format($float($wloc_list[1]))
  #end if
  #if $wts is not None and $wts != ''
    issued on $wts
  #end if
  #if $show_tides and len($tides) > 0
    <br/>tides for $tides[0].location issued on $tides[0].issued_ts
  #end if
</div>

#end if
