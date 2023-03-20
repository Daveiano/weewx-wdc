<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#set $forecast_source = $Extras.forecast_table_settings.get('source', None)
#set $forecast_zambretti_active = True if $varExists('forecast.zambretti') and $to_bool($Extras['forecast_zambretti']['enable']) else False
#set $forecat_table_active = True if $forecast_source and $varExists('forecast') and len($forecast.weather_periods($forecast_source)) > 0 else False
#set $dwd_forecast = True if 'weewx-DWD' in $Extras and $to_bool($Extras['weewx-DWD']['show_forecast']) and os.path.exists("dwd/forecast-" + $Extras['weewx-DWD']['mosmix_id'] + ".json") else False
#set $warn_region_front = $Extras['weewx-DWD']['show_warnings_on_front'] if 'weewx-DWD' in $Extras and 'show_warnings_on_front' in $Extras['weewx-DWD'] else False
#set $show_warn = True if $warn_region_front and $dwd_warning_has_warning($warn_region_front) else False

#set $radar_externals = 'radar_html' in $Extras or 'external_1' in $Extras or 'external_2' in $Extras or 'external_3' in $Extras or 'external_4' in $Extras

#set $radar_externals_list = []
#if 'radar_html' in $Extras
  #silent $radar_externals_list.append('radar')
#end if
#if 'external_1' in $Extras
  #silent $radar_externals_list.append('external_1')
#end if
#if 'external_2' in $Extras
  #silent $radar_externals_list.append('external_2')
#end if
#if 'external_3' in $Extras
  #silent $radar_externals_list.append('external_3')
#end if
#if 'external_4' in $Extras
  #silent $radar_externals_list.append('external_4')
#end if

#if ($varExists('forecast') and ($forecast_zambretti_active or $forecat_table_active)) or $radar_externals or $dwd_forecast
<!--prettier-ignore-->
<div class="bx--row">
  <header class="bx--col section-header">
    <h2>
      <!--prettier-ignore-->
      #if $varExists('forecast') or $dwd_forecast
        $gettext("Forecast")
      #end if
      #if ($varExists('forecast') or $dwd_forecast) and $radar_externals
       &
      #end if
      #if $radar_externals
        $gettext($Extras.get("radar_heading", "Recent radar"))
      #end if
    </h2>
  </header>
</div>
<div class="bx--row">
  <div class="bx--col">
    <div class="bx--row">
      <!--prettier-ignore-->
      #if $varExists('forecast') or $dwd_forecast
      #set forecast_tile_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-8"
      #if 'forecast_radar_equal_width' in $Extras and $to_bool($Extras.forecast_radar_equal_width) and $DisplayOptions.get('layout', 'alternative') == 'alternative'
        #set forecast_tile_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-6"
      #end if
      #if $DisplayOptions.get('layout', 'alternative') == 'classic'
        #set forecast_tile_classes = "bx--col-sm-4 bx--col-md-12 bx--col-lg-12 bx--col-xlg-12 bx--col-max-12"
      #end if
      <div class="$forecast_tile_classes">
        <div class="bx--tile forecast-tile">
          <!--prettier-ignore-->
          #if $varExists('forecast.zambretti') and $to_bool($Extras['forecast_zambretti']['enable'])
          <div class="forecast" data-test="forecast-zambretti">
            <h3>Zambretti</h3>
            <p>
              <!--prettier-ignore-->
              The forecast is $forecast.label('Zambretti', $forecast.zambretti.code)<br />
              <span class="issued"
                >Issued at $forecast.zambretti.issued_ts</span
              >
            </p>
          </div>
          #end if
          <!--prettier-ignore-->
          #if $varExists('forecast') and not $dwd_forecast
          <div class="forecast" data-test="forecast-table">
            <!--prettier-ignore-->
            #include "includes/forecast-table.inc"
          </div>
          #end if
          <!--prettier-ignore-->
          #if $dwd_forecast
          <div class="dwd-forecast forecast">
            <script>
              var dwdForecastData = #include raw "dwd/forecast-" + $Extras['weewx-DWD']['mosmix_id'] + ".json"
            </script>
          </div>
          #end if
        </div>
      </div>
      #end if
      <!--prettier-ignore-->
      #if $radar_externals or $show_warn
      #set radar_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-4"
      #if 'forecast_radar_equal_width' in $Extras and $to_bool($Extras.forecast_radar_equal_width) and $DisplayOptions.get('layout', 'alternative') == 'alternative'
        #set radar_classes = "bx--col-sm-4 bx--col-md-8 bx--col-lg-12 bx--col-xlg-6 bx--col-max-6"
      #end if
      #if $DisplayOptions.get('layout', 'alternative') == 'classic'
        #set radar_classes = "bx--col-sm-4 bx--col-md-12 bx--col-lg-12 bx--col-xlg-12 bx--col-max-12"
      #end if

      #if len($radar_externals_list) > 1
      <style>
        @media screen and (min-width: 1650px) {
          .radar-container {
            margin-top: -3rem;
          }
        }
      </style>
      #end if

      <!--prettier-ignore-->
      <div class="$radar_classes radar-container">
        #if $show_warn
          #set global $region = $get_dwd_warning_region_name($warn_region_front)
          #set global $region_key = $warn_region_front
          #include "includes/dwd-warning.inc"
        #end if

        #if $radar_externals
        <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/version/v1.25.0/tabs.min.js"></script>

        #if len($radar_externals_list) > 1
        <bx-tabs trigger-content="Select an item" value="$radar_externals_list[0]" type="container">
          #if 'radar_html' in $Extras
          <bx-tab id="tab-radar" target="panel-radar" value="radar">
            $gettext($Extras.get("radar_heading", "Recent radar"))
          </bx-tab>
          #end if
          #if 'external_1' in $Extras
          <bx-tab
            id="tab-external_1"
            target="panel-external_1"
            value="external_1"
            >$Extras.external_1.title</bx-tab
          >
          #end if
          #if 'external_2' in $Extras
          <bx-tab
            id="tab-external_2"
            target="panel-external_2"
            value="external_2"
            >$Extras.external_2.title</bx-tab
          >
          #end if
          #if 'external_3' in $Extras
          <bx-tab
            id="tab-external_3"
            target="panel-external_3"
            value="external_3"
            >$Extras.external_3.title</bx-tab
          >
          #end if
          #if 'external_4' in $Extras
          <bx-tab
            id="tab-external_4"
            target="panel-external_4"
            value="external_4"
            >$Extras.external_4.title</bx-tab
          >
          #end if
        </bx-tabs>
        #end if
        <div class="bx-ce-demo-devenv--tab-panels">
          #if 'radar_html' in $Extras
          <div id="panel-radar" role="tabpanel" aria-labelledby="tab-radar">
            <div class="bx--tile tile-radar-forecast">
              $Extras.radar_html
            </div>
          </div>
          #end if
          #if 'external_1' in $Extras
          <div
            id="panel-external_1"
            role="tabpanel"
            aria-labelledby="tab-external_1"
          >
            <div class="bx--tile tile-radar-forecast">
              $Extras.external_1.source
              <p class="bx--type-body-long-02" style="margin-top: 1rem;">$Extras.external_1.title_long</p>
            </div>
          </div>
          #end if
          #if 'external_2' in $Extras
          <div
            id="panel-external_2"
            role="tabpanel"
            aria-labelledby="tab-external_2"
          >
            <div class="bx--tile tile-radar-forecast">
              $Extras.external_2.source
              <p class="bx--type-body-long-02" style="margin-top: 1rem;">$Extras.external_2.title_long</p>
            </div>
          </div>
          #end if
          #if 'external_3' in $Extras
          <div
            id="panel-external_3"
            role="tabpanel"
            aria-labelledby="tab-external_3"
          >
            <div class="bx--tile tile-radar-forecast">
              $Extras.external_3.source
              <p class="bx--type-body-long-02" style="margin-top: 1rem;">$Extras.external_3.title_long</p>
            </div>
          </div>
          #end if
          #if 'external_4' in $Extras
          <div
            id="panel-external_4"
            role="tabpanel"
            aria-labelledby="tab-external_4"
          >
            <div class="bx--tile tile-radar-forecast">
              $Extras.external_4.source
              <p class="bx--type-body-long-02" style="margin-top: 1rem;">$Extras.external_4.title_long</p>
            </div>
          </div>
          #end if
        </div>


        #end if
      </div>
      #end if
    </div>
  </div>
</div>
#end if
