<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#set $label_sum = $get_labels('Sum', $precision)
#set $label_min = $get_labels('Min', $precision)
#set $label_max = $get_labels('Max', $precision)
#set $label_avg = $get_labels('Avg', $precision)
#set $show_wind_dir = 'windDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windSpeed" and not $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
#set $show_wind_dir_ordinal = 'windDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windSpeed" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
#set $show_gust_dir = 'windGustDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windGust" and not $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
#set $show_gust_dir_ordinal = 'windGustDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windGust" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/tooltip.min.js"
></script>

<div class="bx--col-sm-4 bx--col-md-4 bx--col-lg-6 bx--col-xlg-3 bx--col-max-2">
  <!--prettier-ignore-->
  <div class="bx--tile stat-tile">
    <!-- Main row -->
    <div class="bx--row">
      <div class="bx--col">
        <p class="label">$obs.label[$partial_obs]</p>
        <p class="value">
          <!--prettier-ignore-->
          #if $get_icon($partial_obs) is not None
          #include $get_icon($partial_obs)
          #end if

          <!--prettier-ignore-->
          <span>
            <!--prettier-ignore-->
            #if $precision == 'day'
              $getattr($current, $partial_obs)

              #if $show_wind_dir and $current.windDir.has_data
                <span class="stat-wind-dir">
                  #set global $windDir_deg = $current.windDir.degree_compass
                  #include "includes/icons/wind-direction.inc"
                  $current.windDir
                </span>
              #else if $show_wind_dir_ordinal and $current.windDir.has_data
                <span class="stat-wind-dir">
                  #set global $windDir_deg = $current.windDir.degree_compass
                  #include "includes/icons/wind-direction.inc"
                  $current.windDir.ordinal_compass
                </span>
              #else if $show_gust_dir and $current.windGustDir.has_data
                <span class="stat-wind-dir">
                  #set global $windDir_deg = $current.windGustDir.degree_compass
                  #include "includes/icons/wind-direction.inc"
                  $current.windGustDir
                </span>
              #else if $show_gust_dir_ordinal and $current.windGustDir.has_data
                <span class="stat-wind-dir">
                  #set global $windDir_deg = $current.windGustDir.degree_compass
                  #include "includes/icons/wind-direction.inc"
                  $current.windGustDir.ordinal_compass
                </span>
              #end if
            #else
              #if $get_show_sum($partial_obs)
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).sum
              #else if $get_show_max($partial_obs)
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).max
              #else
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).avg

                #if $show_wind_dir and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").has_data
                  <span class="stat-wind-dir">
                    #set global $windDir_deg = $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").avg.degree_compass
                    #include "includes/icons/wind-direction.inc"
                    $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").avg
                  </span>
                #else if $show_wind_dir_ordinal and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").has_data
                  <span class="stat-wind-dir">
                    #set global $windDir_deg = $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").avg.degree_compass
                    #include "includes/icons/wind-direction.inc"
                    $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").avg.ordinal_compass
                  </span>
                #else if $show_gust_dir and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").has_data
                  <span class="stat-wind-dir">
                    #set global $windDir_deg = $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").avg.degree_compass
                    #include "includes/icons/wind-direction.inc"
                    $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").avg
                  </span>
                #else if $show_gust_dir_ordinal and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").has_data
                  <span class="stat-wind-dir">
                    #set global $windDir_deg = $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").avg.degree_compass
                    #include "includes/icons/wind-direction.inc"
                    $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").avg.ordinal_compass
                  </span>
                #end if
              #end if
            #end if
            <!--prettier-ignore-->
            #if $precision != 'day' and not $get_show_sum($partial_obs) and not $get_show_max($partial_obs)
            <span>$gettext("Avg")</span>
            #end if
            <!--prettier-ignore-->
            #if $precision != 'day' and $get_show_sum($partial_obs)
            <span>$gettext("Total")</span>
            #end if
            <!--prettier-ignore-->
            #if $precision != 'day' and $get_show_max($partial_obs)
            <span>$gettext("Max")</span>
            #end if
          </span>
        </p>
      </div>
    </div>
    <!-- Main row -->
    <!--prettier-ignore-->
    #if $precision == 'day' and $get_show_sum($partial_obs)
      <div class="bx--row">
        <div class="bx--col">
          <p class="stat-label">$gettext($label_sum)</p>
          <p class="stat-value">
            <!--prettier-ignore-->
            $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).sum
          </p>
        </div>
      </div>
    #else if $precision != 'day' and $get_show_sum($partial_obs)
      #if $partial_obs == 'rain'
        <div class="bx--row">
          <div class="bx--col">
            <p class="stat-label">$gettext("Rain days")</p>
            <p class="stat-value">
              <!--prettier-ignore-->
              $get_climatological_day('rainDays', $get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $unit.unit_type)
            </p>
          </div>
        </div>
      #else
        <div class="bx--row">
          <div class="bx--col">
            <p class="stat-label">$gettext($label_avg)</p>
            <p class="stat-value">
              <!--prettier-ignore-->
              $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).avg
            </p>
          </div>
        </div>
      <!--prettier-ignore-->
      #end if
    #else
    <div class="bx--row">
      #if $get_show_min($partial_obs)
      <div class="bx--col">
        <p class="stat-label">
          <!--prettier-ignore-->
          #if $precision == 'year' or $precision == 'alltime'
          <bx-tooltip-definition
            alignment="center"
            body-text="$getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).mintime.format($get_time_format_dict['stats'])"
            direction="top"
          >
            $gettext($label_min)
          </bx-tooltip-definition>
          <!--prettier-ignore-->
          #else
            $gettext($label_min)
          #end if
        </p>
        <p class="stat-value">
          <!--prettier-ignore-->
          $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).min
        </p>
      </div>
      #end if
      <div class="bx--col">
        <p class="stat-label">
          <!--prettier-ignore-->
          #if $precision == 'year' or $precision == 'alltime'
          <bx-tooltip-definition
            alignment="center"
            body-text="$getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).maxtime.format($get_time_format_dict['stats'])"
            direction="top"
          >
            $gettext($label_max)
          </bx-tooltip-definition>
          <!--prettier-ignore-->
          #else
            $gettext($label_max)
          #end if
        </p>
        <p class="stat-value">
          <!--prettier-ignore-->
          $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $partial_obs).max

          #if $show_wind_dir and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").has_data
            <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").max</span>
          #else if $show_wind_dir_ordinal and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").has_data
            <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").max.ordinal_compass</span>
          #else if $show_gust_dir and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").has_data
            <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").max</span>
          #else if $show_gust_dir_ordinal and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").has_data
            <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").max.ordinal_compass</span>
          #end if
        </p>
      </div>
    </div>
    #end if
  </div>
</div>
