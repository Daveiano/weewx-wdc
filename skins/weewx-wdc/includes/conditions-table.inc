<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/structured-list.min.js"
></script>

<!--prettier-ignore-->
#set $label_sum = $get_labels('Sum', $context)
#set $label_min = $get_labels('Min', $context)
#set $label_max = $get_labels('Max', $context)
#set $label_avg = $get_labels('Avg', $context)
#set $label_totals = $get_labels('Total', $context)
#set $show_min_max_time = $context == 'year' or $context == 'alltime' or ($context == 'day' and $to_bool($DisplayOptions.get('show_min_max_time_day', False))) or ($context == 'yesterday' and $to_bool($DisplayOptions.get('show_min_max_time_yesterday', False))) or ($context == 'week' and $to_bool($DisplayOptions.get('show_min_max_time_week', False))) or ($context == 'month' and $to_bool($DisplayOptions.get('show_min_max_time_month', False)))
#set $min_max_time_format = $get_time_format_dict['day'] if $context == 'day' or $context == 'yesterday' else $get_time_format_dict['stats']

<div class="bx--tile obs-stat-tile">
  <div class="bx--row">
    <div class="bx--col">
      <!-- <h3>$gettext("Todays Min/Max")</h3> -->
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell></bx-structured-list-header-cell>
            <bx-structured-list-header-cell>
              <!--prettier-ignore-->
              #if $context != 'day'
                $gettext($label_avg)
              #end if
              <!--prettier-ignore-->
              #if $context == 'day'
                $gettext("Current")
              #end if
            </bx-structured-list-header-cell>
            <bx-structured-list-header-cell
              >$gettext($label_min)</bx-structured-list-header-cell
            >
            <bx-structured-list-header-cell
              >$gettext($label_max)</bx-structured-list-header-cell
            >
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <!--prettier-ignore-->
        <bx-structured-list-body>
          #for $skin_obs in $DisplayOptions.get('stat_tile_observations')
            #set $skin_obs_binding = $get_data_binding($skin_obs)
            #set $skin_obs_key = $get_custom_data_binding_obs_key($skin_obs)
            #set $alltime_tag = None if $use_parameter_year or $use_parameter_month else $alltime($data_binding=$skin_obs_binding)
            #if $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).has_data and not $get_show_sum($skin_obs) and $skin_obs != 'windDir' and $skin_obs != 'windGustDir'
              #set $show_wind_dir = 'windDir' in $DisplayOptions.get('stat_tile_observations', []) and $skin_obs == "windSpeed" and not $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
              #set $show_wind_dir_ordinal = 'windDir' in $DisplayOptions.get('stat_tile_observations', []) and $skin_obs == "windSpeed" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
              #set $show_gust_dir = 'windGustDir' in $DisplayOptions.get('stat_tile_observations', []) and $skin_obs == "windGust" and not $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
              #set $show_gust_dir_ordinal = 'windGustDir' in $DisplayOptions.get('stat_tile_observations', []) and $skin_obs == "windGust" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
              <div class="mobile-header">
                <div class="label">$obs.label[$skin_obs]</div>
              </div>
              <bx-structured-list-row data-test="$skin_obs" data-observation="$skin_obs_key" data-unit="$get_unit_label($get_unit_for_obs($skin_obs, $skin_obs_key, $context))" data-rounding="$get_rounding($skin_obs, $skin_obs_key)">
                <bx-structured-list-cell class="cell-label">$obs.label[$skin_obs]</bx-structured-list-cell>
                <bx-structured-list-cell class="cell-value">
                  <!--prettier-ignore-->
                  #if $context == 'day'
                    <span>$getattr($current($data_binding=$skin_obs_binding), $skin_obs_key)</span>

                    #if $show_wind_dir and $current.windDir.has_data
                      <span class="stat-wind-dir stat-detail">, $current.windDir</span>
                    #else if $show_wind_dir_ordinal and $current.windDir.has_data
                      <span class="stat-wind-dir stat-detail">, $current.windDir.ordinal_compass</span>
                    #else if $show_gust_dir and $current.windGustDir.has_data
                      <span class="stat-wind-dir stat-detail">, $current.windGustDir</span>
                    #else if $show_gust_dir_ordinal and $current.windGustDir.has_data
                      <span class="stat-wind-dir stat-detail">, $current.windGustDir.ordinal_compass</span>
                    #end if
                  #else
                    #if $get_show_sum($skin_obs)
                      $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).sum
                    #else if $get_show_max($skin_obs)
                      $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).max
                    #else
                        $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).avg

                        #if $show_wind_dir and $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windDir").has_data
                          <span class="stat-wind-dir stat-detail">, $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windDir").avg</span>
                        #else if $show_wind_dir_ordinal and $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windDir").has_data
                          <span class="stat-wind-dir stat-detail">, $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windDir").avg.ordinal_compass</span>
                        #else if $show_gust_dir and $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windGustDir").has_data
                          <span class="stat-wind-dir stat-detail">, $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windGustDir").avg</span>
                        #else if $show_gust_dir_ordinal and $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windGustDir").has_data
                          <span class="stat-wind-dir stat-detail">, $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windGustDir").avg.ordinal_compass</span>
                        #end if
                    #end if
                  #end if
                </bx-structured-list-cell>
                <!--prettier-ignore-->
                <bx-structured-list-cell class="cell-min">
                  <span>$getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).min</span>

                  #if show_min_max_time
                    <span class="date">$getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).mintime.format($min_max_time_format)</span>
                  #end if
                </bx-structured-list-cell>
                <!--prettier-ignore-->
                <bx-structured-list-cell class="cell-max">
                  <span>$getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).max</span>

                  #if $show_wind_dir and $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windDir").has_data
                    <span class="stat-wind-dir stat-detail">, $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windDir").max</span>
                  #else if $show_wind_dir_ordinal and $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windDir").has_data
                    <span class="stat-wind-dir stat-detail">, $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windDir").max.ordinal_compass</span>
                  #else if $show_gust_dir and $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windGustDir").has_data
                    <span class="stat-wind-dir stat-detail">, $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windGustDir").max</span>
                  #else if $show_gust_dir_ordinal and $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windGustDir").has_data
                    <span class="stat-wind-dir stat-detail">, $getattr($get_time_span_from_context($context, $day, $week, $month, $year, $alltime, $yesterday), "windGustDir").max.ordinal_compass</span>
                  #end if

                  #if $show_min_max_time
                  <span class="date">$getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).maxtime.format($min_max_time_format)</span>
                  #end if
                </bx-structured-list-cell>
              </bx-structured-list-row>
            #end if
          #end for
        </bx-structured-list-body>
      </bx-structured-list>
    </div>
  </div>

  <div class="bx--row">
    <div class="bx--col">
      <h3>$gettext($label_totals)</h3>
      <bx-structured-list>
        <bx-structured-list-head>
          <bx-structured-list-header-row>
            <bx-structured-list-header-cell></bx-structured-list-header-cell>
            <bx-structured-list-header-cell></bx-structured-list-header-cell>
          </bx-structured-list-header-row>
        </bx-structured-list-head>
        <!--prettier-ignore-->
        <bx-structured-list-body>
          #for $skin_obs in $DisplayOptions.get('stat_tile_observations')
            #set $skin_obs_binding = $get_data_binding($skin_obs)
            #set $skin_obs_key = $get_custom_data_binding_obs_key($skin_obs)
            #set $alltime_tag = None if $use_parameter_year or $use_parameter_month else $alltime($data_binding=$skin_obs_binding)
            #if $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), $alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).has_data and $get_show_sum($skin_obs)
              <bx-structured-list-row data-test="$skin_obs">
                <bx-structured-list-cell class="keep-cell">$obs.label[$skin_obs]</bx-structured-list-cell>
                <bx-structured-list-cell>
                  <!--prettier-ignore-->
                  $getattr($get_time_span_from_context($context, $day($data_binding=$skin_obs_binding), $week($data_binding=$skin_obs_binding), $month($data_binding=$skin_obs_binding), $year($data_binding=$skin_obs_binding), alltime_tag, $yesterday($data_binding=$skin_obs_binding)), $skin_obs_key).sum
                </bx-structured-list-cell>
              </bx-structured-list-row>
            #end if
          #end for
        </bx-structured-list-body>
      </bx-structured-list>
    </div>
  </div>
</div>
