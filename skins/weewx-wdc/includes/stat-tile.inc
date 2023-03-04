<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8
#set $label_sum = $get_labels('Sum', $context)
#set $label_min = $get_labels('Min', $context)
#set $label_max = $get_labels('Max', $context)
#set $label_avg = $get_labels('Avg', $context)
#set $show_wind_dir = 'windDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windSpeed" and not $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
#set $show_wind_dir_ordinal = 'windDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windSpeed" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
#set $show_gust_dir = 'windGustDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windGust" and not $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
#set $show_gust_dir_ordinal = 'windGustDir' in $DisplayOptions.get('stat_tile_observations', []) and $partial_obs == "windGust" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
#set $show_min_max_time = $context == 'year' or $context == 'alltime' or ($context == 'day' and $to_bool($DisplayOptions.get('show_min_max_time_day', False))) or ($context == 'yesterday' and $to_bool($DisplayOptions.get('show_min_max_time_yesterday', False))) or ($context == 'week' and $to_bool($DisplayOptions.get('show_min_max_time_week', False))) or ($context == 'month' and $to_bool($DisplayOptions.get('show_min_max_time_month', False)))
#set $min_max_time_format = $get_time_format_dict['day'] if $context == 'day' or $context == 'yesterday' else $get_time_format_dict['stats']

#set $skin_obs_binding = $get_data_binding($partial_obs)
#set $skin_obs_key = $get_custom_data_binding_obs_key($partial_obs)

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/tooltip.min.js"
></script>

<div class="bx--col-sm-4 bx--col-md-4 bx--col-lg-6 bx--col-xlg-3 bx--col-max-2">
  <!--prettier-ignore-->
  <div class="bx--tile stat-tile" data-test="$partial_obs">
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
          <span>
            #if $context == 'day' and not $daily_archive
              $getattr($current($data_binding=$skin_obs_binding), $skin_obs_key)

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
                $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).sum
              #else if $get_show_max($partial_obs)
                $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).max
              #else
                $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).avg

                #if $show_wind_dir and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windDir").has_data
                  <span class="stat-wind-dir">
                    #set global $windDir_deg = $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "wind").vecdir.degree_compass
                    #include "includes/icons/wind-direction.inc"
                    $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "wind").vecdir
                  </span>
                #else if $show_wind_dir_ordinal and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windDir").has_data
                  <span class="stat-wind-dir">
                    #set global $windDir_deg = $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "wind").vecdir.degree_compass
                    #include "includes/icons/wind-direction.inc"
                    $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "wind").vecdir.ordinal_compass
                  </span>
                #else if $show_gust_dir and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").has_data
                  <span class="stat-wind-dir">
                    #set global $windDir_deg = $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").avg.degree_compass
                    #include "includes/icons/wind-direction.inc"
                    $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").avg
                  </span>
                #else if $show_gust_dir_ordinal and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").has_data
                  <span class="stat-wind-dir">
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
    <!-- Main row -->
    <!--prettier-ignore-->
    #if $context == 'day' and $get_show_sum($partial_obs)
      <div class="bx--row" data-test="sum">
        <div class="bx--col">
          <p class="stat-label">$gettext($label_sum)</p>
          <p class="stat-value">
            <!--prettier-ignore-->
            $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).sum
          </p>
        </div>
      </div>
    #else if $context != 'day' and $get_show_sum($partial_obs)
      #if $partial_obs == 'rain'
        <div class="bx--row" data-test="rain-days">
          <div class="bx--col">
            <p class="stat-label">$gettext("Rain days")</p>
            <p class="stat-value">
              <!--prettier-ignore-->
              #set $time_span = $get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding))
              $get_climatological_day('rainDays', $time_span.start.raw, $time_span.end.raw)
            </p>
          </div>
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
                $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).avg
              #end if
            </p>
          </div>
        </div>
      <!--prettier-ignore-->
      #end if
    #else
    <div class="bx--row">
      #if $get_show_min($partial_obs)
      <div class="bx--col" data-test="min">
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
        <p class="stat-value">
          <!--prettier-ignore-->
          $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).min
        </p>
      </div>
      #end if
      <div class="bx--col" data-test="max">
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
        <p class="stat-value">
          <!--prettier-ignore-->
          $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).max

          #if $show_wind_dir and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windDir").has_data
            <span class="stat-wind-dir">, $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windDir").max</span>
          #else if $show_wind_dir_ordinal and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windDir").has_data
            <span class="stat-wind-dir">, $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windDir").max.ordinal_compass</span>
          #else if $show_gust_dir and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").has_data
            <span class="stat-wind-dir">, $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").max</span>
          #else if $show_gust_dir_ordinal and $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").has_data
            <span class="stat-wind-dir">, $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime($data_binding=$skin_obs_binding), $yesterday($data_binding=$skin_obs_binding)), "windGustDir").max.ordinal_compass</span>
          #end if
        </p>
      </div>
    </div>
    #end if
  </div>
</div>
