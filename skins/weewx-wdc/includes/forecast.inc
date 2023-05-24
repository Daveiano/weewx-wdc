<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#set $forecast_source = $Extras.forecast_table_settings.get('source', None)
#set $forecast_zambretti_active = True if $varExists('forecast.zambretti') and $to_bool($Extras['forecast_zambretti']['enable']) else False
#set $forecat_table_active = True if $forecast_source and $varExists('forecast') and len($forecast.weather_periods($forecast_source)) > 0 else False
#set $dwd_forecast = True if 'weewx-DWD' in $Extras and $to_bool($Extras['weewx-DWD']['show_forecast']) and os.path.exists("dwd/forecast-" + $Extras['weewx-DWD']['mosmix_id'] + ".json") else False
#set $warn_region_front = $Extras['weewx-DWD']['show_warnings_on_front'] if 'weewx-DWD' in $Extras and 'show_warnings_on_front' in $Extras['weewx-DWD'] else False
#set $show_warn = True if $warn_region_front and $dwd_warning_has_warning($warn_region_front) else False

#set $externals_list = []
#if 'externals' in $Extras and $len($Extras['externals']) > 0
  #for $external in $Extras['externals']
    #if $external == 'description'
      #continue
    #end if
    #if $to_bool($Extras['externals'][$external].show_on_front)
      #silent $externals_list.append($external)
    #end if
  #end for
#end if

#set $radar_externals = 'radar_html' in $Extras or $len($externals_list) > 0

#set $radar_externals_list = $externals_list
#if 'radar_html' in $Extras
  #set $radar_externals_list = ['radar'] + $externals_list
#end if

<!--prettier-ignore-->
#if ($varExists('forecast') and ($forecast_zambretti_active or $forecat_table_active)) or $radar_externals or $dwd_forecast
<!--prettier-ignore-->
<div class="bx--row">
  <header class="bx--col section-header">
    <h2>
      $gettext($Extras.get("forecast_radar_heading", "Forecast & Recent radar"))
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

      <!--prettier-ignore-->
      <div class="$radar_classes radar-container">
        #if $show_warn
          #set global $region = $get_dwd_warning_region_name($warn_region_front)
          #set global $region_key = $warn_region_front
          #include "includes/dwd-warning.inc"
        #end if

        #if $radar_externals
        <script type="module" src="https://1.www.s81c.com/common/carbon/web-components/version/v1.25.0/tabs.min.js"></script>

        <style>
          .radar-container .bx-ce-demo-devenv--tab-panels > div {
            padding-bottom: 1rem;
          }
          .radar-container .bx-ce-demo-devenv--tab-panels > div > .bx--tile {
            padding: 0;
          }
        </style>

        #if len($radar_externals_list) == 1
          <style>
            .radar-container .bx-ce-demo-devenv--tab-panels .bx--tile {
              padding: 0;
            }
          </style>
        #end if

        #if len($radar_externals_list) > 1
        <bx-tabs trigger-content="Select an item" value="$radar_externals_list[0]" type="container">
          #if 'radar_html' in $Extras
          <bx-tab id="tab-radar" target="panel-radar" value="radar">
            $gettext("Recent radar")
          </bx-tab>
          #end if

          #if len($externals_list) > 0
            #for $external in $externals_list
              <bx-tab id="tab-$external" target="panel-$external" value="$external">
                $Extras['externals'][$external].title
              </bx-tab>
            #end for
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

          #if len($externals_list) > 0
            #for $external in $externals_list
              <div id="panel-$external" role="tabpanel" aria-labelledby="tab-$external">
                <div class="bx--tile tile-radar-forecast">
                  $Extras['externals'][$external].source
                  <p class="bx--type-caption-01" style="margin-top: 0.25rem;">$Extras['externals'][$external].title_long</p>
                </div>
              </div>
            #end for
          #end if
        </div>


        #end if
      </div>
      #end if
    </div>
  </div>
</div>
#end if
