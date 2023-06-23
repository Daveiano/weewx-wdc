<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#set $label_sum = $get_labels('Sum', $context)
#set $label_min = $get_labels('Min', $context)
#set $label_max = $get_labels('Max', $context)
#set $label_avg = $get_labels('Avg', $context)
#set $show_rain_rate = 'rainRate' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "rain"
#set $show_wind_dir = 'windDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windSpeed" and not $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
#set $show_wind_dir_ordinal = 'windDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windSpeed" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
#set $show_gust_dir = 'windGustDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windGust" and not $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
#set $show_gust_dir_ordinal = 'windGustDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windGust" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
#set $show_min_max_time = $context == 'year' or $context == 'alltime' or ($context == 'day' and $to_bool($DisplayOptions.get('show_min_max_time_day', False))) or ($context == 'yesterday' and $to_bool($DisplayOptions.get('show_min_max_time_yesterday', False))) or ($context == 'week' and $to_bool($DisplayOptions.get('show_min_max_time_week', False))) or ($context == 'month' and $to_bool($DisplayOptions.get('show_min_max_time_month', False)))
#set $min_max_time_format = $get_time_format_dict['day'] if $context == 'day' or $context == 'yesterday' else $get_time_format_dict['stats']

#set $skin_obs_binding = $get_data_binding($partial_obs)
#set $skin_obs_key = $get_custom_data_binding_obs_key($partial_obs)
#set $rounding = $str($get_rounding($partial_obs, $skin_obs_key))

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.27.0/tooltip.min.js"
></script>

<div class="bx--col-sm-4 bx--col-md-4 bx--col-lg-6 bx--col-xlg-3 bx--col-max-2">
  <!--prettier-ignore-->
  <div
  class="bx--tile stat-tile"
  data-test="$partial_obs"
  data-observation="$skin_obs_key"
  data-unit="$get_unit_label($get_unit_for_obs($partial_obs, $skin_obs_key, $context))"
  data-rounding="$rounding"
  #if $show_rain_rate
    data-unit-rain-rate="$get_unit_label($get_unit_for_obs('rainRate', 'rainRate', $context))"
  #end if
  >
    <!-- Main row -->
    <div class="bx--row">
      <div class="bx--col">
        <p class="label">$obs.label[$partial_obs]</p>
        <!--prettier-ignore-->
        <p class="value">
          #set $icon = $get_icon($skin_obs_key)
          #if $icon != 'none' and "includes/icons/" in $icon and '.svg' in $icon
            #include $icon
          #elif $icon != 'none' and "includes/icons/" not in $icon
            <img src="$icon" alt="$obs.label[$partial_obs]" />
          #end if

          <!--prettier-ignore-->
          <span class="stat-title-obs-value">
            #if $context == 'day' and not $daily_archive

              #if $get_show_sum($partial_obs)
              <span class="raw raw-sum">$getattr($day($data_binding=$skin_obs_binding), $skin_obs_key).sum.format("%." + $rounding + "f")</span>
              #else
              <span class="raw">
                $getattr($latest($data_binding=$skin_obs_binding), $skin_obs_key).format("%." + $rounding + "f")
              </span>
              #end if

              #if $get_show_sum($partial_obs)
                <span>$gettext("Total")</span>
              #end if

              #if $show_wind_dir and $current.windDir.has_data
                <span class="stat-wind-dir stat-detail">
                  #set global $windDir_deg = $current.windDir.degree_compass
                  #include "includes/icons/wind-direction.inc"
                  <span class="value-detail">$current.windDir</span>
                </span>
              #else if $show_wind_dir_ordinal and $current.windDir.has_data
                <span class="stat-wind-dir stat-detail">
                  #set global $windDir_deg = $current.windDir.degree_compass
                  #include "includes/icons/wind-direction.inc"
                  <span class="value-detail">$current.windDir.ordinal_compass</span>
                </span>
              #else if $show_gust_dir and $current.windGustDir.has_data
                <span class="stat-wind-dir stat-detail">
                  #set global $windDir_deg = $current.windGustDir.degree_compass
                  #include "includes/icons/wind-direction.inc"
                  <span class="value-detail">$current.windGustDir</span>
                </span>
              #else if $show_gust_dir_ordinal and $current.windGustDir.has_data
                <span class="stat-wind-dir stat-detail">
                  #set global $windDir_deg = $current.windGustDir.degree_compass
                  #include "includes/icons/wind-direction.inc"
                  <span class="value-detail">$current.windGustDir.ordinal_compass</span>
                </span>
              <!--Empty block for usage in MQTT-->
              #else if (($show_wind_dir or $show_wind_dir_ordinal) and not $current.windDir.has_data) or (($show_gust_dir or $show_gust_dir_ordinal) and not $current.windGustDir.has_data)
                <span class="stat-wind-dir stat-detail">
                  #set global $windDir_deg = 0
                  #include "includes/icons/wind-direction.inc"
                  <span class="value-detail"></span>
                </span>
              #end if
            #else
              #if $get_show_sum($partial_obs)
                $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).sum.format("%." + $rounding + "f")
              #else if $get_show_max($partial_obs)
                $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).max.format("%." + $rounding + "f")
              #else
                $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).avg.format("%." + $rounding + "f")

                #if $show_wind_dir and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windDir").has_data
                  <span class="stat-wind-dir stat-detail">
                    #set global $windDir_deg = $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "wind").vecdir.degree_compass
                    #include "includes/icons/wind-direction.inc"
                    $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "wind").vecdir
                  </span>
                #else if $show_wind_dir_ordinal and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windDir").has_data
                  <span class="stat-wind-dir stat-detail">
                    #set global $windDir_deg = $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "wind").vecdir.degree_compass
                    #include "includes/icons/wind-direction.inc"
                    $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "wind").vecdir.ordinal_compass
                  </span>
                #else if $show_gust_dir and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").has_data
                  <span class="stat-wind-dir stat-detail">
                    #set global $windDir_deg = $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").avg.degree_compass
                    #include "includes/icons/wind-direction.inc"
                    $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").avg
                  </span>
                #else if $show_gust_dir_ordinal and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").has_data
                  <span class="stat-wind-dir stat-detail">
                    #set global $windDir_deg = $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").avg.degree_compass
                    #include "includes/icons/wind-direction.inc"
                    $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").avg.ordinal_compass
                  </span>
                #end if
              #end if
            #end if
            <!--prettier-ignore-->
            #if ($context != 'day' or $daily_archive) and not $get_show_sum($partial_obs) and not $get_show_max($partial_obs)
            <span>$gettext("Avg")</span>
            #end if
            <!--prettier-ignore-->
            #if ($context != 'day' or $daily_archive) and $get_show_sum($partial_obs)
            <span>$gettext("Total")</span>
            #end if
            <!--prettier-ignore-->
            #if ($context != 'day' or $daily_archive) and $get_show_max($partial_obs)
            <span>$gettext("Max")</span>
            #end if
          </span>
        </p>
      </div>
    </div>
    <!-- /Main row -->

    <!--prettier-ignore-->
    #if $context != 'day' and $get_show_sum($partial_obs)
      #if $partial_obs == 'rain'
        #set $time_span = $get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding))
        <div class="bx--row">
          #if $context != 'yesterday'
            #if $context == 'alltime'
              <div class="bx--col" data-test="rain-days">
                <p class="stat-label">
                  <bx-tooltip-definition
                    alignment="center"
                    body-text="$gettext('Time since last rain:') $time_since_last_rain.long_form"
                    direction="top"
                  >
                  $gettext("Last rain")
                  </bx-tooltip-definition>
                </p>
                <p class="stat-value">
                  <!--prettier-ignore-->
                  $last_rain.format("%x")
                </p>
              </div>
            #else
              <div class="bx--col" data-test="rain-days">
                <p class="stat-label">$gettext("rainDays")</p>
                <p class="stat-value">
                  <!--prettier-ignore-->
                  $get_climatological_day('rainDays', $time_span.start.raw, $time_span.end.raw)
                </p>
              </div>
            #end if
          #end if
          #if $show_rain_rate
          <div class="bx--col value-rain-rate-max" data-test="rain-rate-max">
            <p class="stat-label">
              #if $show_min_max_time
              <bx-tooltip-definition
                alignment="center"
                body-text="$getattr($time_span, 'rainRate').maxtime.format($min_max_time_format)"
                direction="top"
              >
                $gettext("Max") $obs.label.rainRate
              </bx-tooltip-definition>
              <!--prettier-ignore-->
              #else
                $gettext("Max") $obs.label.rainRate
              #end if
            </p>
            <!--prettier-ignore-->
            <p class="stat-value">
              <span class="value" style="display: inline;">$getattr($time_span, 'rainRate').max.format("%." + $rounding + "f")</span>
            </p>
          </div>
        #end if
        </div>
      #else
        <div class="bx--row" data-test="avg">
          <div class="bx--col">
            <p class="stat-label">$gettext($label_avg)</p>
            <p class="stat-value">
              <!--prettier-ignore-->
              #if $partial_obs == 'windDir'
                $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "wind").vecdir
              #else
                $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).avg.format("%." + $rounding + "f")
              #end if
            </p>
          </div>
        </div>
      <!--prettier-ignore-->
      #end if
    #else
      <div class="bx--row">
        #if $get_show_min($partial_obs)
        <div class="bx--col value-min" data-test="min">
          <p class="stat-label">
            <!--prettier-ignore-->
            #if $show_min_max_time
            <bx-tooltip-definition
              alignment="center"
              body-text="$getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $partial_obs).mintime.format($min_max_time_format)"
              direction="top"
            >
              $gettext($label_min)
            </bx-tooltip-definition>
            <!--prettier-ignore-->
            #else
              $gettext($label_min)
            #end if
          </p>
          <!--prettier-ignore-->
          <p class="stat-value">
            <span class="value" style="display: inline;">$getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).min.format("%." + $rounding + "f")</span>
          </p>
        </div>
        #end if
        #if $get_show_sum($partial_obs)
          #if $partial_obs != 'rain'
            <div class="bx--col value-total-week" data-test="total-week">
              <p class="stat-label">
                $gettext("Total week short")
              </p>
              <!--prettier-ignore-->
              <p class="stat-value">
                <span class="value" style="display: inline;">$getattr($week, $skin_obs_key).sum.format("%." + $rounding + "f")</span>
              </p>
            </div>
          #end if
          #if $show_rain_rate and not $daily_archive
            <div class="bx--col value-rain-rate-current" data-test="rain-rate-current">
              <p class="stat-label">
                $obs.label.rainRate
              </p>
              <!--prettier-ignore-->
              <p class="stat-value">
                <span class="value" style="display: inline;">$getattr($current, 'rainRate')</span>
              </p>
            </div>
          #end if
          #if $show_rain_rate
            <div class="bx--col value-rain-rate-max" data-test="rain-rate-max">
              <p class="stat-label">
                #if $show_min_max_time
                <bx-tooltip-definition
                  alignment="center"
                  body-text="$getattr($day, 'rainRate').maxtime.format($min_max_time_format)"
                  direction="top"
                >
                  $gettext("Max") $obs.label.rainRate
                </bx-tooltip-definition>
                <!--prettier-ignore-->
                #else
                  $gettext("Max") $obs.label.rainRate
                #end if
              </p>
              <!--prettier-ignore-->
              <p class="stat-value">
                <span class="value" style="display: inline;">$getattr($day, 'rainRate').max.format("%." + $rounding + "f")</span>
              </p>
            </div>
          #end if
        #else
          <div class="bx--col value-max" data-test="max">
            <p class="stat-label">
              <!--prettier-ignore-->
              #if $show_min_max_time
              <bx-tooltip-definition
                alignment="center"
                body-text="$getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $partial_obs).maxtime.format($min_max_time_format)"
                direction="top"
              >
                $gettext($label_max)
              </bx-tooltip-definition>
              <!--prettier-ignore-->
              #else
                $gettext($label_max)
              #end if
            </p>
            <!--prettier-ignore-->
            <p class="stat-value">
              <span class="value" style="display: inline;">$getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).max.format("%." + $rounding + "f")</span>

              ## TODO: Add this refactoring to all windDir/gust blocks!
              #set $windDir_binded = $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windDir")
              #set $gustDir_binded = $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir")

              #if $show_wind_dir and $windDir_binded.has_data
                <span class="stat-wind-dir stat-detail">, $windDir_binded.max</span>
              #else if $show_wind_dir_ordinal and $windDir_binded.has_data
                <span class="stat-wind-dir stat-detail">, $windDir_binded.max.ordinal_compass</span>
              #else if $show_gust_dir and $gustDir_binded.has_data
                <span class="stat-wind-dir stat-detail">, $gustDir_binded.max</span>
              #else if $show_gust_dir_ordinal and $gustDir_binded.has_data
                <span class="stat-wind-dir stat-detail">, $gustDir_binded.max.ordinal_compass</span>
              <!--Empty block for usage in MQTT-->
              #else if (($show_wind_dir or $show_wind_dir_ordinal) and not $windDir_binded.has_data) or (($show_gust_dir or $show_gust_dir_ordinal) and not $gustDir_binded.has_data)
                <span class="stat-wind-dir stat-detail"></span>
              #end if
            </p>
          </div>
        #end if
      </div>
    #end if
  </div>
</div>
