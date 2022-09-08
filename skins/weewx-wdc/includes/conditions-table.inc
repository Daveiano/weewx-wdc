<!--prettier-ignore-->
#errorCatcher Echo
#encoding UTF-8

<script
  type="module"
  src="https://1.www.s81c.com/common/carbon/web-components/version/v1.21.0/structured-list.min.js"
></script>

<!--prettier-ignore-->
#set $label_sum = $get_labels('Sum', $precision)
#set $label_min = $get_labels('Min', $precision)
#set $label_max = $get_labels('Max', $precision)
#set $label_avg = $get_labels('Avg', $precision)
#set $label_totals = $get_labels('Total', $precision)

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
              #if $precision != 'day'
                $gettext($label_avg)
              #end if
              <!--prettier-ignore-->
              #if $precision == 'day'
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
        #if $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).has_data and not $get_show_sum($skin_obs) and $skin_obs != 'windDir' and $skin_obs != 'windGustDir'
          #set $show_wind_dir = 'windDir' in $DisplayOptions.get('stat_tile_observations', []) and $skin_obs == "windSpeed" and not $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
          #set $show_wind_dir_ordinal = 'windDir' in $DisplayOptions.get('stat_tile_observations', []) and $skin_obs == "windSpeed" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
          #set $show_gust_dir = 'windGustDir' in $DisplayOptions.get('stat_tile_observations', []) and $skin_obs == "windGust" and not $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
          #set $show_gust_dir_ordinal = 'windGustDir' in $DisplayOptions.get('stat_tile_observations', []) and $skin_obs == "windGust" and $to_bool($DisplayOptions.get('stat_tile_winddir_ordinal', True))
          <div class="mobile-header">
            <div class="label">$obs.label[$skin_obs]</div>
          </div>
          <bx-structured-list-row data-test="$skin_obs">
            <bx-structured-list-cell>$obs.label[$skin_obs]</bx-structured-list-cell>
            <bx-structured-list-cell>
              <!--prettier-ignore-->
              #if $precision == 'day'
                $getattr($current, $skin_obs)

                #if $show_wind_dir and $current.windDir.has_data
                  <span class="stat-wind-dir">, $current.windDir</span>
                #else if $show_wind_dir_ordinal and $current.windDir.has_data
                  <span class="stat-wind-dir">, $current.windDir.ordinal_compass</span>
                #else if $show_gust_dir and $current.windGustDir.has_data
                  <span class="stat-wind-dir">, $current.windGustDir</span>
                #else if $show_gust_dir_ordinal and $current.windGustDir.has_data
                  <span class="stat-wind-dir">, $current.windGustDir.ordinal_compass</span>
                #end if
              #else
                #if $get_show_sum($skin_obs)
                  $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).sum
                #else if $get_show_max($skin_obs)
                  $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).max
                #else
                    $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).avg

                    #if $show_wind_dir and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").has_data
                      <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").avg</span>
                    #else if $show_wind_dir_ordinal and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").has_data
                      <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").avg.ordinal_compass</span>
                    #else if $show_gust_dir and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").has_data
                      <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").avg</span>
                    #else if $show_gust_dir_ordinal and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").has_data
                      <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").avg.ordinal_compass</span>
                    #end if
                #end if
              #end if
            </bx-structured-list-cell>
            <bx-structured-list-cell>
              <!--prettier-ignore-->
                $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).min
              <!--prettier-ignore-->
              #if $precision == 'year' or $precision == 'alltime'
                <span class="date">am $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).mintime.format($get_time_format_dict['stats'])</span>
              #end if
            </bx-structured-list-cell>
            <bx-structured-list-cell>
              <!--prettier-ignore-->
              $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).max

              #if $show_wind_dir and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").has_data
                <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").max</span>
              #else if $show_wind_dir_ordinal and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").has_data
                <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windDir").max.ordinal_compass</span>
              #else if $show_gust_dir and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").has_data
                <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").max</span>
              #else if $show_gust_dir_ordinal and $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").has_data
                <span class="stat-wind-dir">, $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), "windGustDir").max.ordinal_compass</span>
              #end if

              <!--prettier-ignore-->
              #if $precision == 'year' or $precision == 'alltime'
              <span class="date">am $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).maxtime.format($get_time_format_dict['stats'])</span>
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
            #if $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).has_data and $get_show_sum($skin_obs)
              <bx-structured-list-row data-test="$skin_obs">
                <bx-structured-list-cell class="keep-cell">$obs.label[$skin_obs]</bx-structured-list-cell>
                <bx-structured-list-cell>
                  <!--prettier-ignore-->
                  $getattr($get_time_span_from_attr($precision, $day, $week, $month, $year, $alltime), $skin_obs).sum
                </bx-structured-list-cell>
              </bx-structured-list-row>
            #end if
          #end for
        </bx-structured-list-body>
      </bx-structured-list>
    </div>
  </div>
</div>
